import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';
import socket from 'utils/sockets';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return obtenerLoteActivo(req, res);
        case 'POST':
            return modificarLote(req, res);
        case 'PUT':
            return modificarPaleta(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' })

    }
}

async function obtenerLoteActivo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query as { id: string };
        const id_lote = Number(id);

        if (Number.isNaN(id_lote)) {
            return res.status(202).json({ message: 'no content' });
        }

        const lote = await prisma.lotes.findFirst({
            where: {
                id_lote: Number(id),
            },
        });

        return res.status(200).json(lote);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function modificarLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_lote, subastado, incremento, puja_inicial } = req.body;

        const lotePrev = await prisma.lotes.findUnique({ where: { id_lote: Number(id_lote) } });

        let puja_inicialBase = Number(lotePrev!.puja_inicial);
        let puja_final = Number(lotePrev!.puja_final);

        if (Number(puja_inicial) !== puja_inicialBase) {
            puja_final = puja_inicial;
            puja_inicialBase = puja_inicial;
        }

        const lote = await prisma.lotes.update({
            where: {
                id_lote
            },
            data: {
                subastado: Number(subastado),
                incremento: Number(incremento),
                puja_inicial: puja_inicialBase,
                puja_final
            }
        });
        // socket.emit('activarLote', lote);
        return res.status(200).json(lote);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
    finally {
        await prisma.$disconnect();
    }
}

async function modificarPaleta(req: NextApiRequest, res: NextApiResponse) {
    const { id_lote, codigo_paleta } = req.body;

    const usuario = await prisma.compradores.findFirst({
        where: { codigo_paleta },
    });

    if (!usuario) {
        res.status(404).json({ message: `La paleta: ${codigo_paleta} no existe` });
        return;
    }

    const puja = await prisma.pujas.findFirst({
        where: {
            id_lote: Number(id_lote),
        },
        include: {
            usuario: {
                select: { nombres: true, identificacion: true }
            }
        },
        orderBy: [
            {
                puja: 'desc',
            },
            {
                id_puja: 'asc',
            }
        ],
        take: 1,
    });

    await prisma.pujas.update({
        where: { id_puja: puja?.id_puja },
        data: { codigo_paleta: usuario.codigo_paleta as string }
    });


    res.status(200).json({ message: 'Paleta Actualizada' });
}