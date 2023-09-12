import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment-timezone';
import { handleErrorsPrisma } from 'utils';

moment.tz.setDefault('America/Guayaquil');

export const config = {
    api: {
        responseLimit: "8mb",
        bodyParser: {
            sizeLimit: '10mb',
        },
    }
}

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return listarNotificaciones(req, res);
        case 'POST':
            return crearNotificacion(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function listarNotificaciones(req: NextApiRequest, res: NextApiResponse) {
    try {

        const fechaActual = moment().format('YYYY-MM-DD');
        const eventos = await prisma.notificaciones.findMany({
            where: {
                fecha: {
                    gte: new Date(`${fechaActual}T00:00:00.000Z`)
                }
            }
        });

        const eventosFormateados = eventos.map(evento => {
            const fechaFormateada = moment(evento.fecha).format('YYYY-MM-DD HH:mm');
            return {
                ...evento,
                fecha: fechaFormateada
            };
        });
        return res.status(200).json(eventosFormateados);
    } catch (error) {
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function crearNotificacion(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { titulo, descripcion } = req.body;
        const fechaActual = moment().toDate();
        const formattedDate = moment(fechaActual, 'YYYY/MM/DD HH:mm').toDate();

        const notificaciones = await prisma.notificaciones.create({
            data: {
                fecha: formattedDate,
                titulo,
                descripcion,
                estado: 0
            }
        });

        return res.status(200).json(notificaciones);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}
