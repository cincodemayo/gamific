// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { Journey } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }

    switch (req.method) {
        case 'GET': {
            return await getJournies(res, session);
        }
        case 'POST': {
            return await createJourney(req, res, session);
        }
        default:
            return res.status(405).end('Method not allowed');
    }
}

const validatejourney = (journey: Journey) => {
    if (!journey.name) {
        throw new Error('Journey name is required');
    } else if (journey.name.trim().length < 1) {
        throw new Error('Journey name cannot be empty');
    } else if (journey.name.trim().length > 30) {
        throw new Error('Journey name cannot be longer than 30 characters');
    }
};

const getJournies = async (res: NextApiResponse, session: Session) => {
    try {
        const journies = await prisma.journey.findMany({
            where: {
                account_id: session.user.account_id,
            },
            include: {
                journeyColumns: true,
            },
        });
        res.status(200).json(journies);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createJourney = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const journeyData: { name: string; description: string; columns: { name: string; color: string }[] } = req.body;
    const journey_id = uuidv4();
    const journey: Journey = {
        id: journey_id,
        name: journeyData.name,
        description: journeyData.description,
        account_id: session.user.account_id,
        completed: false,
        columns: []
    };
    if (journeyData.columns) {
        const set = new Set();
        if (journeyData.columns.some((col) => set.size === (set.add(col.name), set.size))) {
            return res.status(400).json({ error: 'Column names must be unique' });
        }
        journey.columns = journeyData.columns.map((column, i) => {
            return {
                id: uuidv4(),
                name: column.name,
                position: i,
                journey_id: journey_id,
                color: column.color,
                account_id: session.user.account_id,
            };
        });
    }

    try {
        validatejourney(journey);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
    const payload = {
        data: {
            name: journey.name,
            uuid: journey.id,
            account: {
                connect: {
                    id: journey.account_id,
                },
            },
            columns: {},
        },
    };
    if (journey.columns) {
        payload.data.columns = {
            createMany: {
                data: journey.columns,
            },
        };
    }
    try {
        const newjourney = await prisma.journey.create(payload);
        res.status(201).json(newjourney);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
