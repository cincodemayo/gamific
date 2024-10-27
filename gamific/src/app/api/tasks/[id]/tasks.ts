import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { validate, v4 as uuidv4 } from 'uuid';
import { Subtask, OptionalTaskData } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }
    if (!req.query.id || !validate(req.query.id.toString())) {
        return res.status(400).end('Invalid task id');
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

const getTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskId = req.query.id?.toString();
    if (!taskId) {
        return res.status(400).end('Task id is required');
    }
    try {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                account_id: session.user.account_id
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

const validateTaskUpdateData = (taskData: any) => {
    if (Object.keys(taskData).length === 0) {
        return 'No data to update';
    }
    if (taskData.name && typeof taskData.name !== 'string') {
        return 'Invalid name';
    }
    if (taskData.description && typeof taskData.description !== 'string') {
        return 'Invalid description';
    }
    if (taskData.position && typeof taskData.position !== 'number') {
        return 'Invalid position';
    }
    if (taskData.points && typeof taskData.points !== 'number') {
        return 'Invalid points';
    }
    if (taskData.column_id && typeof taskData.column_id !== 'string') {
        return 'Invalid column id';
    }
    if (taskData.user_id && typeof taskData.user_id !== 'string') {
        return 'Invalid user id';
    }
    if (taskData.column && !validate(taskData.column)) {
        return 'Invalid column';
    }
    return;
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
                        account_id: session.user.account_id
                    },
                    update: {
                        name: subtask.name,
                    },
                    create: {
                        id: subtask.id,
                        name: subtask.name,
                        account_id: session.user.account_id,
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
                account_id: session.user.account_id
            },
            data,
        });
    });
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

const updateTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskId = req.query.id?.toString();
    const taskData: OptionalTaskData = req.body;
    if (!taskId) {
        return res.status(400).end('Task id is required');
    }
    const err = validateTaskUpdateData(req.body);
    if (err) {
        return res.status(400).end(err);
    }
    const currentTaskData = await prisma.task.findFirst({
        where: {
            id: taskId,
            account_id: session.user.account_id
        },
        include: {
            subtasks: true,
        },
    });
    if (!currentTaskData) {
        return res.status(404).end('Task not found');
    }
    let { name, description, position, points, column_id, user_id, subtasks, related_tasks, completed } = taskData;
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
        position: position !== undefined ? position : currentTaskData.position,
        points: points !== undefined ? points : currentTaskData.points,
        user_id: user_id !== undefined ? user_id : currentTaskData.user_id,
        column_id: column_id || currentTaskData.column_id,
        subtasks: subtasks || currentTaskData.subtasks,
        related_tasks: related_tasks || currentTaskData.related_tasks,
        completed: completed !== undefined ? completed : currentTaskData.completed,
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
        await decrementHigherPositions(currentTaskData.column_id, currentTaskData.position);
        if (positionChanged && !movingToEndOfColumn) {
            await incrementFromPosition(columnChanged ? column_id : currentTaskData.column_id, position!);
        }
        await updateTaskData(taskId, newTaskData, subtasksToDelete, session);
        const dataAfterUpdateIsValid = await validateColumns(
            columnChanged ? [column_id, currentTaskData.column_id] : [currentTaskData.column_id]
        );
        if (!dataAfterUpdateIsValid) {
            throw new Error('Invalid task after update');
        }
        return res.status(200).end('Task updated');
    });
};

const deleteTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskId = req.query.id?.toString();
    if (!taskId) {
        return res.status(400).end('Task id is required');
    }
    const taskData = await prisma.task.findFirst({
        where: {
            id: taskId,
            account_id: session.user.account_id
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
                    account_id: session.user.account_id
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