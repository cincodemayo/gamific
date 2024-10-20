import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { validate, v4 as uuidv4 } from 'uuid';
import { Subtask, OptionalTaskData } from '../../../types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }
    if (!req.query.id || !validate(req.query.id.toString())) {
        return res.status(400).end('Invalid task ID');
    }
    switch (req.method) {
        case 'GET': {
            return await getTask(req, res, session);
        }
        case 'PUT': {
            return await updateTask(req, res, session);
        }
        case 'DELETE': {
            return await deleteTask(req, res, session);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const decrementHigherPositions = (columnId: string, position: number) => {
    return prisma.task.updateMany({
        where: {
            column_id: columnId,
            position: {
                gt: position,
            },
        },
        data: {
            position: { decrement: 1 },
        },
    });
};

const incrementFromPosition = (columnId: string, position: number) => {
    return prisma.task.updateMany({
        where: {
            column_id: columnId,
            position: {
                gte: position,
            },
        },
        data: {
            position: { increment: 1 },
        },
    });
};

const updateTaskData = (taskId: string, taskData: OptionalTaskData, subtasksToDelete: string[], session: Session) => {
    const { subtasks, ...data } = taskData;
    return prisma.$transaction(async () => {
        if (subtasksToDelete.length > 0) {
            await prisma.subtask.deleteMany({
                where: {
                    id: {
                        in: subtasksToDelete,
                    },
                },
            });
        }
        if (subtasks) {
            for (const subtask of subtasks) {
                await prisma.subtask.upsert({
                    where: {
                        id: subtask.id,
                    },
                    update: {
                        name: subtask.name,
                    },
                    create: {
                        id: subtask.id,
                        name: subtask.name,
                        task: {
                            connect: {
                                id: taskId,
                            },
                        },
                    },
                });
            }
        }
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data,
        });
    });
};

const validateTaskUpdateData = (taskData: any) => {
    if (Object.keys(taskData).length === 0) {
        return 'No data to update';
    }
    if (taskData.column && !validate(taskData.column)) {
        return 'Invalid column ID';
    }
    if (taskData.position && typeof taskData.position !== 'number') {
        return 'Invalid position';
    }
    if (taskData.name && typeof taskData.name !== 'string') {
        return 'Invalid name';
    }
    if (taskData.description && typeof taskData.description !== 'string') {
        return 'Invalid description';
    }
    return;
};

const validateColumns = async (columnIds: string[]) => {
    let columnsAreValid = true;
    for (const columnId of columnIds) {
        const tasks = await prisma.task.findMany({
            where: {
                column_id: columnId,
            },
            orderBy: {
                position: 'asc',
            },
        });
        let position = 0;
        for (const task of tasks) {
            if (task.position !== position) {
                columnsAreValid = false;
                break;
            }
            position++;
        }
    }
    return columnsAreValid;
};

const getTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskId = req.query.id?.toString();
    if (!taskId) {
        return res.status(400).end('Task id is required');
    }
    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
            },
            include: {
                subtasks: {
                    orderBy: {
                        id: 'asc',
                    },
                },
            },
        });
        if (!task) {
            res.status(404).end('Task not found');
        } else {
            res.status(200).json(task);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskId = req.query.uuid?.toString();
    if (!taskId) {
        return res.status(400).end('Task id is required');
    }
    const taskData = await prisma.task.findFirst({
        where: {
            id: taskId,
        }
    });
    if (!taskData) {
        return res.status(404).end('Task not found');
    }
    try {
        await prisma.$transaction([
            prisma.task.delete({
                where: {
                    id: taskId,
                },
            }),
            decrementHigherPositions(taskData.column_id, taskData.position),
        ]);
        res.status(200).end('Task deleted');
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskId = req.query.id?.toString();
    if (!taskId) {
        return res.status(400).end('Task uuid is required');
    }
    const err = validateTaskUpdateData(req.body);
    if (err) {
        return res.status(400).end(err);
    }
    const currentTaskData = await prisma.task.findFirst({
        where: {
            id: taskId,
        },
        include: {
            subtasks: true,
        },
    });
    if (!currentTaskData) {
        return res.status(404).end('Task not found');
    }
    let { name, description, column_uuid: column_id, subtasks, position } = req.body;
    const columnChanged = !!(column_id && column_id !== currentTaskData.column_id);
    const positionChanged = !!(position !== undefined && (position !== currentTaskData.position || columnChanged));
    const column =
        columnChanged || positionChanged
            ? await prisma.column.findFirst({
                  where: { id: column_id || currentTaskData.column_id },
                  include: { tasks: true },
              })
            : null;
    let movingToEndOfColumn = false; // No need to shift the position of other tasks if true;

    // Check which subtasks are being deleted
    const subtasksToDelete: string[] = [];
    if (Array.isArray(subtasks)) {
        for (const subtask of currentTaskData.subtasks) {
            const found = subtasks.find((s: Subtask) => s.id === subtask.id);
            if (!found) {
                subtasksToDelete.push(subtask.id);
            }
        }
    }
    // Create a new array of columns
    for (const subtask of subtasks ?? []) {
        if (!subtask.id) {
            subtask.id = uuidv4();
        }
    }

    if (position) {
        if (!(typeof position === 'number' && Number.isInteger(position) && !isNaN(position))) {
            return res.status(400).end('Position must be an integer');
        }
        // Check if position is valid and within accepted range
        if (!column) {
            return res.status(404).end('Column not found');
        }
        if (position < 0) {
            return res.status(400).end('Position cannot be less than 0');
        }
        if (position > column.tasks.length || (!columnChanged && position > column.tasks.length - 1)) {
            position = columnChanged ? column.tasks.length : column.tasks.length - 1;
            movingToEndOfColumn = true;
        }
    }
    const newTaskData: OptionalTaskData = {
        name: name || currentTaskData.name,
        description: typeof description === undefined ? currentTaskData.description : description,
        column_id: column_id || currentTaskData.column_id,
        subtasks: subtasks || currentTaskData.subtasks,
        position: position !== undefined ? position : currentTaskData.position,
    };

    await prisma.$transaction(async () => {
        if (!columnChanged && !positionChanged) {
            await updateTaskData(taskId, newTaskData, subtasksToDelete, session);
            return res.status(200).end('Task updated');
        }
        if (columnChanged && !column) {
            return res.status(404).end('Column not found');
        }
        if (columnChanged && !positionChanged) newTaskData.position = column!.tasks.length; // If position is not set, move to end of column
        await decrementHigherPositions(currentTaskData.column_uuid, currentTaskData.position);
        if (positionChanged && !movingToEndOfColumn) {
            await incrementFromPosition(columnChanged ? column_id : currentTaskData.column_uuid, position);
        }
        await updateTaskData(taskId, newTaskData, subtasksToDelete, session);
        const dataAfterUpdateIsValid = await validateColumns(
            columnChanged ? [column_id, currentTaskData.column_uuid] : [currentTaskData.column_uuid]
        );
        if (!dataAfterUpdateIsValid) {
            throw new Error('Invalid position of tasks after update');
        }
        return res.status(200).end('Task updated');
    });
};
