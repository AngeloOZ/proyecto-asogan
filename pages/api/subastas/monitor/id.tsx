import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient'
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            res.status(405).json({ error: 'Method not allowed' })
        }

        await obtenerLoteMonitor(req, res);

    } catch (error) {
        res.status(500).json(handleErrorsPrisma(error?.code));
    }
    finally {
        await prisma.$disconnect()
    }
}

async function obtenerLoteMonitor(req: NextApiRequest, res: NextApiResponse) {
    const { uuid } = req.query as { uuid: string };

    const lote = await prisma.lotes.findFirst({
        where: {
            id_evento: Number(uuid),
            subastado: 1
        },
    });

    res.status(200).json(lote);
}