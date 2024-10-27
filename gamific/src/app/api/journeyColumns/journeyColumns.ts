import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { v4 as uuidv4, validate } from 'uuid';
import { JourneyColumn } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const isNewColumn = (column: unknown): column is JourneyColumn => {
    return (
        typeof column === 'object' && column !== null && 'journey_id' in column && 'name' in column && 'color' in column
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
        const tasks = await prisma.journeyColumn.findMany({
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
    if (!columnData.journey_id || !validate(columnData.journey_id)) {
        return res.status(400).json({ error: 'Invalid journey id' });
    }
    if (columnData.name.length < 1 || columnData.name.length > 20) {
        return res.status(400).json({ error: 'Column name must be between 1 and 20 characters' });
    }
    const journeyData = await prisma.journey.findFirst({
        where: {
            id: columnData.journey_id,
            account_id: session.user.account_id,
        },
        include: {
            journeyColumns: true,
        },
    });
    if (!journeyData) {
        return res.status(404).json({ error: 'journey not found' });
    }
    if (journeyData.columns.find((column: JourneyColumn) => column.name.toLowerCase() === columnData.name.toLowerCase())) {
        return res.status(400).json({ error: 'Column with this name already exists on this journey' });
    }
    const positionSet = columnData.position !== undefined;
    columnData.position = columnData.position ?? journeyData.columns.length;
    try {
        const response = await prisma.$transaction(async (tx: any) => {
            if (positionSet) {
                await tx.column.updateMany({
                    where: {
                        journey_id: columnData.journey_id,
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
                    journey: {
                        connect: {
                            id: columnData.journey_id,
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
        return res.status(500).json('Error creating journey column');
    }
};
