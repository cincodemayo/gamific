import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/utils/db';
import { validate, v4 as uuidv4 } from 'uuid';
import { OptionalMissionData } from '@/app/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const decrementHigherPositions = (columnId: string, position: number) => {
    return prisma.mission.updateMany({
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
    return prisma.mission.updateMany({
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
        return res.status(400).end('Invalid mission id');
    }
    switch (req.method) {
        case 'GET': {
            return await getMission(req, res, session);
        }
        case 'PUT': {
            return await updateMission(req, res, session);
        }
        case 'DELETE': {
            return await deleteMission(req, res, session);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const getMission = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const missionId = req.query.id?.toString();
    if (!missionId) {
        return res.status(400).end('Mission id is required');
    }
    try {
        const mission = await prisma.mission.findFirst({
            where: {
                id: missionId,
                account_id: session.user.account_id
            },
            include: {
                submissions: {
                    orderBy: {
                        id: 'asc',
                    },
                },
            },
        });
        if (!mission) {
            res.status(404).end('Mission not found');
        } else {
            res.status(200).json(mission);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const validateMissionUpdateData = (missionData: any) => {
    if (Object.keys(missionData).length === 0) {
        return 'No data to update';
    }
    if (missionData.name && typeof missionData.name !== 'string') {
        return 'Invalid name';
    }
    if (missionData.description && typeof missionData.description !== 'string') {
        return 'Invalid description';
    }
    if (missionData.position && typeof missionData.position !== 'number') {
        return 'Invalid position';
    }
    if (missionData.column_id && typeof missionData.column_id !== 'string') {
        return 'Invalid column id';
    }
    if (missionData.column && !validate(missionData.column)) {
        return 'Invalid column';
    }
    return;
};

const updateMissionData = (missionId: string, missionData: OptionalMissionData, usersToRemove: string[], usersToAdd: string[], session: Session) => {
    const data = missionData;
    return prisma.$transaction(async () => {
        for (const user of usersToAdd) {
            await prisma.mission.create({
                create: {
                    user: {
                        connect: {
                            id: user
                        }
                    }
                }
            });
        }
        for (const user of usersToRemove) {
            await prisma.mission.create({
                delete: {
                    user: {
                        connect: {
                            id: user
                        }
                    }
                }
            });
        }
        await prisma.mission.update({
            where: {
                id: missionId,
                account_id: session.user.account_id
            },
            data,
        });
    });
};

const validateColumns = async (columnIds: string[]) => {
    let columnsAreValid = true;
    for (const columnId of columnIds) {
        const missions = await prisma.mission.findMany({
            where: {
                column_id: columnId,
            },
            orderBy: {
                position: 'asc',
            },
        });
        let position = 0;
        for (const mission of missions) {
            if (mission.position !== position) {
                columnsAreValid = false;
                break;
            }
            position++;
        }
    }
    return columnsAreValid;
};

const updateMission = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const missionId = req.query.id?.toString();
    const missionData: OptionalMissionData = req.body;
    if (!missionId) {
        return res.status(400).end('Mission id is required');
    }
    const err = validateMissionUpdateData(req.body);
    if (err) {
        return res.status(400).end(err);
    }
    const currentMissionData = await prisma.mission.findFirst({
        where: {
            id: missionId,
            account_id: session.user.account_id
        },
        include: {
            submissions: true,
        },
    });
    if (!currentMissionData) {
        return res.status(404).end('Mission not found');
    }
    let { name, description, position, column_id, completed } = missionData;
    const columnChanged = !!(column_id && column_id !== currentMissionData.column_id);
    const positionChanged = !!(position !== undefined && (position !== currentMissionData.position || columnChanged));
    const column =
        columnChanged || positionChanged
            ? await prisma.missionColumn.findFirst({
                  where: { id: column_id || currentMissionData.column_id },
                  include: { missions: true },
              })
            : null;
    let movingToEndOfColumn = false; // No need to shift the position of other missions if true;

    // Check which users are being removed
    const usersToRemove: string[] = [];
    if (Array.isArray(missionData.users)) {
        for (const user of currentMissionData.users) {
            const found = missionData.users.find((s: string) => s === user.id);
            if (!found) {
                usersToRemove.push(user.id);
            }
        }
    }

    // Check which users are being added
    const usersToAdd: string[] = [];
    if (Array.isArray(missionData.users)) {
        for (const user of missionData.users) {
            const found = currentMissionData.users.find((s: any) => s.id === user);
            if (!found) {
                usersToAdd.push(user);
            }
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
        if (position > column.missions.length || (!columnChanged && position > column.missions.length - 1)) {
            position = columnChanged ? column.missions.length : column.missions.length - 1;
            movingToEndOfColumn = true;
        }
    }
    const newMissionData: OptionalMissionData = {
        name: name || currentMissionData.name,
        description: typeof description === undefined ? currentMissionData.description : description,
        position: position !== undefined ? position : currentMissionData.position,
        column_id: column_id || currentMissionData.column_id,
        completed: completed !== undefined ? completed : currentMissionData.completed,
    };

    await prisma.$transaction(async () => {
        if (!columnChanged && !positionChanged) {
            await updateMissionData(missionId, newMissionData, usersToRemove, usersToAdd, session);
            return res.status(200).end('Mission updated');
        }
        if (columnChanged && !column) {
            return res.status(404).end('Column not found');
        }
        if (columnChanged && !positionChanged) newMissionData.position = column!.missions.length; // If position is not set, move to end of column
        await decrementHigherPositions(currentMissionData.column_id, currentMissionData.position);
        if (positionChanged && !movingToEndOfColumn) {
            await incrementFromPosition(columnChanged ? column_id : currentMissionData.column_id, position!);
        }
        await updateMissionData(missionId, newMissionData, usersToRemove, usersToAdd, session);
        const dataAfterUpdateIsValid = await validateColumns(
            columnChanged ? [column_id, currentMissionData.column_id] : [currentMissionData.column_id]
        );
        if (!dataAfterUpdateIsValid) {
            throw new Error('Invalid mission after update');
        }
        return res.status(200).end('Mission updated');
    });
};

const deleteMission = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const missionId = req.query.id?.toString();
    if (!missionId) {
        return res.status(400).end('Mission id is required');
    }
    const missionData = await prisma.mission.findFirst({
        where: {
            id: missionId,
            account_id: session.user.account_id
        }
    });
    if (!missionData) {
        return res.status(404).end('Mission not found');
    }
    try {
        await prisma.$transaction([
            prisma.mission.delete({
                where: {
                    id: missionId,
                    account_id: session.user.account_id
                },
            }),
            decrementHigherPositions(missionData.column_id, missionData.position),
        ]);
        res.status(200).end('Mission deleted');
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};