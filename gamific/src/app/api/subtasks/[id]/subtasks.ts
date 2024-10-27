import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { validate } from 'uuid';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }
    if (!req.query.uuid || !validate(req.query.uuid.toString())) {
        return res.status(400).end('Invalid subtask id');
    }
    switch (req.method) {
        case 'PUT': {
            return await updateSubtask(req, res);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const updateSubtask = async (req: NextApiRequest, res: NextApiResponse) => {
    const subtaskId = req.query.id!.toString();
    const currentSubtaskData = await prisma.subtask.findFirst({
        where: {
            id: subtaskId,
        },
    });
    const { name, completed } = req.body;
    if (typeof name === 'undefined' && typeof completed === 'undefined') {
        return res.status(400).end('No data to update');
    }

    if (!currentSubtaskData) {
        return res.status(404).end('Subtask not found');
    }

    const newSubtaskData = {
        name: typeof name === 'string' ? name : currentSubtaskData.name,
        completed: typeof completed === 'boolean' ? completed : currentSubtaskData.completed,
    };
    const response = await prisma.subtask.update({
        where: {
            id: subtaskId,
        },
        data: newSubtaskData,
    });
    return res.status(200).json(response);
};
