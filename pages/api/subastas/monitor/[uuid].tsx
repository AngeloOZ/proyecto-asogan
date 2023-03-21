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

    const evento = await prisma.eventos.findUnique({
        where: {
            uuid
        }
    });

    if (!evento) {
        res.status(404).json({ error: 'Evento no encontrado' })
        return;
    }

    const lote = await prisma.lotes.findFirst({
        where: {
            id_evento: evento.id_evento!,
            subastado: 1
        },
    });

    if (!lote) {
        res.status(200).json({ lote: null, ultimaPuja: null })
        return;
    }

    const ultimaPuja = await prisma.pujas.findMany({
        where: {
            id_lote: lote.id_lote!
        },
        orderBy: [
            { puja: 'desc' },
            { fecha_creado: 'asc' }
        ],
        include: {
            usuario: {
                select: { nombres: true, identificacion: true }
            }
        },
        take: 1
    })

    res.status(200).json({ lote, ultimaPuja: ultimaPuja[0] || null })
}