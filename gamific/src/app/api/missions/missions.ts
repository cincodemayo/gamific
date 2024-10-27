import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { v4 as uuidv4, validate } from 'uuid';
import { Mission } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }

    switch (req.method) {
        case 'GET': {
            return await getMissions(res, session);
        }
        case 'POST': {
            return await createMission(req, res, session);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const validateMission = (data: unknown): data is Mission => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'column_id' in data && typeof data.column_id === 'string' &&
        'name' in data && typeof data.name === 'string' &&
        (!('description' in data) || typeof data.description === 'string') &&
        (!('account_id' in data) || typeof data.account_id === 'string')
    );
};

const getMissions = async (res: NextApiResponse, session: Session) => {
    try {
        const missions = await prisma.mission.findMany({
            where: {
                account_id: session.user.account_id,
            },
            orderBy: {
                position: 'asc',
            },
        });
        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createMission = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const missionData: unknown = req.body;
    if (!validateMission(missionData)) {
        return res.status(400).json({ error: 'Invalid mission details entered. Please try again.' });
    }
    if (missionData.name.length < 1 || missionData.name.length > 120) {
        return res.status(400).json({ error: 'Mission name must be between 1 and 120 characters' });
    }
    if (!validate(missionData.column_id)) {
        return res.status(400).json({ error: 'Invalid column id' });
    }

    const existingColumnMissions = await prisma.mission.findMany({
        where: {
            column_id: missionData.column_id,
            account_id: session.user.account_id
        },
        orderBy: {
            position: 'desc',
        },
    });

    const mission: Mission & { id: string } = {
        id: uuidv4(),
        name: missionData.name,
        description: missionData.description,
        position: existingColumnMissions.length ? existingColumnMissions[0].position + 1 : 0,
        column_id: missionData.column_id,
        account_id: session.user.account_id,
        completed: false,
        users: missionData.users ?? [session.user.id]
    };
    
    const columnData = await prisma.journeyColumn.findUnique({
        where: {
            id: mission.column_id,
            account_id: session.user.account_id
        },
    });
    if (!columnData) {
        return res.status(404).json({ error: 'Column not found' });
    }

    const payload = {
        data: {
            id: mission.id,
            name: mission.name,
            description: mission.description,
            position: mission.position,
            completed: mission.completed,
            users: {
                create: mission.users.forEach((user)=>{
                    user: {
                        connect: {
                            id: user
                        }
                    }
                })
            },
            journeyColumn: {
                connect: {
                    id: mission.column_id,
                },
            },
            account: {
                connect: {
                    id: mission.account_id,
                },
            }
        },
    };
    try {
        const newMission = await prisma.mission.create(payload);
        res.status(201).json(newMission);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};