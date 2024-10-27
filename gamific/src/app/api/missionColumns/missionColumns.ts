import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { v4 as uuidv4, validate } from 'uuid';
import { MissionColumn } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const isNewColumn = (column: unknown): column is MissionColumn => {
    return (
        typeof column === 'object' && column !== null && 'mission_id' in column && 'name' in column && 'color' in column
    );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }

    switch (req.method) {
        case 'GET': {
            return await getColumns(res, session);
        }
        case 'POST': {
            return await createColumn(req, res, session);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const getColumns = async (res: NextApiResponse, session: Session) => {
    try {
        const tasks = await prisma.column.findMany({
            where: {
                account_id: session.user.account_id,
            },
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const columnData: unknown = req.body;
    if (!isNewColumn(columnData)) {
        return res.status(400).json({ error: 'Invalid column data' });
    }
    if (!columnData.mission_id || !validate(columnData.mission_id)) {
        return res.status(400).json({ error: 'Invalid mission id' });
    }
    if (columnData.name.length < 1 || columnData.name.length > 20) {
        return res.status(400).json({ error: 'Column name must be between 1 and 20 characters' });
    }
    const missionData = await prisma.mission.findFirst({
        where: {
            id: columnData.mission_id,
            account_id: session.user.account_id,
        },
        include: {
            columns: true,
        },
    });
    if (!missionData) {
        return res.status(404).json({ error: 'Mission not found' });
    }
    if (missionData.columns.find((column: MissionColumn) => column.name.toLowerCase() === columnData.name.toLowerCase())) {
        return res.status(400).json({ error: 'Column with this name already exists on this mission' });
    }
    const positionSet = columnData.position !== undefined;
    columnData.position = columnData.position ?? missionData.columns.length;
    try {
        const response = await prisma.$transaction(async (tx: any) => {
            if (positionSet) {
                await tx.column.updateMany({
                    where: {
                        mission_id: columnData.mission_id,
                        position: {
                            gte: columnData.position,
                        },
                    },
                    data: {
                        position: {
                            increment: 1,
                        },
                    },
                });
            }
            return await tx.column.create({
                data: {
                    id: uuidv4(),
                    name: columnData.name,
                    position: columnData.position as number,
                    color: columnData.color,
                    mission: {
                        connect: {
                            id: columnData.mission_id,
                        },
                    },
                    account: {
                        connect: {
                            id: columnData.account_id,
                        },
                    },
                },
            });
        });
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json('Error creating mission column');
    }
};
