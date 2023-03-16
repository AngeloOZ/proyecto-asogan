import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'

import moment from 'moment-timezone';
moment.tz.setDefault('America/Guayaquil');

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

        const eventosFormateados = eventos.map((evento) => {
            const lotes = evento.lotes.map(lote => {
                return {
                    ...lote,
                    fecha_pesaje: moment(lote.fecha_pesaje).format('DD-MM-YYYY')
                };
            });

            return {
                ...evento,
                fecha: moment(evento.fecha).format('DD-MM-YYYY HH:mm'),
                lotes,
            };
        });

        return res.status(200).json(eventosFormateados);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}
