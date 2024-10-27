import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { validate } from 'uuid';
import { UpdatedColumnData } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const decrementHigherPositions = (missionId: string, position: number) => {
    return prisma.column.updateMany({
        where: {
            mission_id: missionId,
            position: {
                gt: position,
            },
        },
        data: {
            position: { decrement: 1 },
        },
    });
};

const incrementFromPosition = (missionId: string, position: number) => {
    return prisma.column.updateMany({
        where: {
            mission_id: missionId,
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
        return res.status(400).end('Invalid column id');
    }
    switch (req.method) {
        case 'GET': {
            return await getColumn(req, res, session);
        }
        case 'PUT': {
            return await updateColumn(req, res, session);
        }
        case 'DELETE': {
            return await deleteColumn(req, res, session);
        }
        default:
            return res.status(405).end('Method not allowed');
    }
}

const getColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const column_id = req.query.id?.toString();
    try {
        const column = await prisma.column.findFirst({
            where: {
                id: column_id,
                account_id: session.user.account_id,
            },
            include: {
                tasks: true,
            },
        });
        if (!column) {
            return res.status(404).end('Column not found');
        }
        res.status(200).json(column);
    } catch (error: any) {
        console.error(error);
        return res.status(500).end('Something went wrong');
    }
};

const updateColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const column_id = req.query.id?.toString();
    const columnData: UpdatedColumnData = req.body;
    const currentColumnData = await prisma.column.findFirst({
        where: {
            id: column_id,
            account_id: session.user.account_id
        },
    });
    if (!currentColumnData) {
        return res.status(404).end('Column not found');
    }
    const { name, color, position } = columnData;
    const payload = {
        name: name ?? currentColumnData.name,
        position: position ?? currentColumnData.position,
        color: color ?? currentColumnData.color,
    };

    try {
        const response = await prisma.$transaction(async (tx: any) => {
            if (position !== undefined && position !== currentColumnData.position) {
                await decrementHigherPositions(currentColumnData.mission_id, currentColumnData.position);
                await incrementFromPosition(currentColumnData.mission_id, position);
            }
            return await tx.column.update({
                where: {
                    id: column_id,
                    account_id: session.user.account_id
                },
                data: payload,
            });
        });
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        return res.status(500).end('Something went wrong');
    }
};

const deleteColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const columnId = req.query.id?.toString();
    const columnData = await prisma.column.findFirst({
        where: {
            id: columnId,
            account_id: session.user.account_id,
        },
    });
    if (!columnData) {
        return res.status(404).end('Column not found');
    }
    try {
        await prisma.$transaction([
            prisma.column.delete({
                where: {
                    id: columnId,
                },
            }),
            decrementHigherPositions(columnData.mission_id, columnData.position),
        ]);
        res.status(200).end();
    } catch (error: any) {
        console.error(error);
        return res.status(500).end('Something went wrong');
    }
};