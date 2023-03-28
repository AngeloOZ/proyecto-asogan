import type { NextApiRequest, NextApiResponse } from 'next'

import { eventos } from '@prisma/client';

import prisma from 'database/prismaClient';


import moment from 'moment-timezone';
import { handleErrorsPrisma } from 'utils';

moment.tz.setDefault('America/Guayaquil');

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerEventos(req, res);
        case 'POST':
            return crearEvento(req, res);
        case 'PUT':
            return actualizarEvento(req, res);
        case 'DELETE':
            return eliminarEvento(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function obtenerEventos(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        if (id) {
            const evento = await prisma.eventos.findUnique({
                where: { id_evento: Number(id) },
                include: {
                    lotes: true
                }
            });
            if (evento) {
                const fechaString = moment(evento.fecha).format('YYYY-MM-DD HH:mm') as unknown as Date;
                evento.fecha = fechaString;
            }
            return res.status(200).json(evento);
        }

        const eventos = await prisma.eventos.findMany({
            orderBy: {
                id_evento: 'desc'
            }
        });

        const eventosFormateados = eventos.map(evento => {
            const fechaFormateada = moment(evento.fecha).format('DD-MM-YYYY HH:mm');
            return {
                ...evento,
                fecha: fechaFormateada
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

async function crearEvento(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { descripcion, fecha, lugar, tipo, abierto, url_video } = req.body as eventos;
        const formattedDate = moment(fecha, 'YYYY/MM/DD HH:mm').toDate();

        const evento = await prisma.eventos.create({
            data: {
                descripcion,
                fecha: formattedDate,
                lugar,
                tipo,
                abierto: Number(abierto),
                url_video
            }
        });
        return res.status(200).json(evento);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function actualizarEvento(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_evento, descripcion, fecha, lugar, tipo, abierto, url_video } = req.body as eventos;
        const formattedDate = moment(fecha, 'YYYY/MM/DD HH:mm').toDate();

        const evento = await prisma.eventos.update({
            where: { id_evento },
            data: {
                descripcion,
                fecha: formattedDate,
                lugar,
                tipo,
                abierto: Number(abierto),
                url_video
            }
        });

        if (evento.abierto === 3) {
            await prisma.lotes.updateMany({
                where: {
                    id_evento: evento.id_evento
                },
                data: {
                    subastado: 2,
                }
            });
        }

        return res.status(200).json(evento);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function eliminarEvento(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        const evento = await prisma.eventos.delete({
            where: { id_evento: Number(id) }
        });

        return res.status(200).json(evento);
    } catch (error) {
        const errorMessage = handleErrorsPrisma(error);
        return res.status(500).json({ message: errorMessage });
    }
    finally {
        await prisma.$disconnect();
    }
}