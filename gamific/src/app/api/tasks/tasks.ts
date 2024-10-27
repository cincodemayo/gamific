import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { v4 as uuidv4, validate } from 'uuid';
import { Task } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }

    switch (req.method) {
        case 'GET': {
            return await getTasks(res, session);
        }
        case 'POST': {
            return await createTask(req, res, session);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const validateTask = (data: unknown): data is Task => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'column_id' in data && typeof data.column_id === 'string' &&
        'name' in data && typeof data.name === 'string' &&
        'points' in data && typeof data.points === 'number' &&
        (!('description' in data) || typeof data.description === 'string') &&
        (!('user_id' in data) || typeof data.user_id === 'string') &&
        (!('account_id' in data) || typeof data.account_id === 'string') &&
        (!('related_tasks' in data) || data.related_tasks instanceof Array) &&
        (!('subtasks' in data) || data.subtasks instanceof Array)
    );
};

const getTasks = async (res: NextApiResponse, session: Session) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                account_id: session.user.account_id,
            },
            orderBy: {
                position: 'asc',
            },
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskData: unknown = req.body;
    if (!validateTask(taskData)) {
        return res.status(400).json({ error: 'Invalid task details entered. Please try again.' });
    }
    if (taskData.name.length < 1 || taskData.name.length > 120) {
        return res.status(400).json({ error: 'Task name must be between 1 and 120 characters' });
    }
    if (!validate(taskData.column_id)) {
        return res.status(400).json({ error: 'Invalid column ID' });
    }
    for (const subtask of taskData.subtasks ?? []) {
        if (typeof subtask.name !== 'string' || (subtask.completed && typeof subtask.completed !== 'boolean')) {
            return res.status(400).json({ error: 'Invalid subtask' });
        }
    }

    const existingColumnTasks = await prisma.task.findMany({
        where: {
            column_id: taskData.column_id,
            account_id: session.user.account_id
        },
        orderBy: {
            position: 'desc',
        },
    });

    const task: Task & { id: string } = {
        id: uuidv4(),
        name: taskData.name,
        description: taskData.description,
        position: existingColumnTasks.length ? existingColumnTasks[0].position + 1 : 0,
        points: taskData.points,
        column_id: taskData.column_id,
        user_id: taskData.user_id ?? session.user.id,
        account_id: session.user.account_id,
        subtasks: taskData.subtasks ?? [],
        related_tasks: taskData.related_tasks ?? [],
        completed: false
    };
    const columnData = await prisma.column.findUnique({
        where: {
            id: task.column_id,
            account_id: session.user.account_id
        },
    });
    if (!columnData) {
        return res.status(404).json({ error: 'Column not found' });
    }

    const payload = {
        data: {
            id: task.id,
            name: task.name,
            description: task.description,
            position: task.position,
            points: task.points,
            subtasks: {},
            related_tasks: task.related_tasks,
            completed: task.completed,
            column: {
                connect: {
                    id: task.column_id,
                },
            },
            user: {
                connect: {
                    id: task.user_id,
                },
            },
            account: {
                connect: {
                    id: task.account_id,
                },
            }
        },
    };
    if (task.subtasks) {
        payload.data.subtasks = {
            createMany: {
                data: task.subtasks.map((subtask) => {
                    return {
                        id: uuidv4(),
                        name: subtask.name,
                        completed: false,
                    };
                }),
            },
        };
    }
    try {
        const newTask = await prisma.task.create(payload);
        res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};