import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';
import socket from 'utils/sockets';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'PUT') {
            registrarPujaMartillador(req, res);
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function registrarPujaMartillador(req: NextApiRequest, res: NextApiResponse) {
    const { id_lote, codigo_paleta, puja } = req.body;

    const ultimaPuja = await prisma.pujas.create({
        data: {
            id_lote,
            id_usuario: 1,
            codigo_paleta,
            puja
        }
    });

    const lote = await prisma.lotes.update({
        where: { id_lote },
        data: { puja_final: puja }
    });

    socket.emit('ultimaPuja', { lote, ultimaPuja });

    res.status(200).json({ message: 'Puja registrada' });
}