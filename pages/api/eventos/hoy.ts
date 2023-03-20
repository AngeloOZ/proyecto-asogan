import type { NextApiRequest, NextApiResponse } from 'next'

import moment from 'moment-timezone';

import prisma from 'database/prismaClient';

moment.tz.setDefault('America/Guayaquil');

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerEventosHoy(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function obtenerEventosHoy(req: NextApiRequest, res: NextApiResponse) {
    try {

        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        const eventos = await prisma.eventos.findMany({
            where: {
                fecha: {
                    gte: fechaActual,
                    lt: new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000),
                },
            },
            include: {
                lotes: true,
            },
        });

        return res.status(200).json(eventos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}
