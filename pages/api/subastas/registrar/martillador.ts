import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'PUT') {
            registrarPujaMartillador(req, res);
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json(handleErrorsPrisma(error?.code));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function registrarPujaMartillador(req: NextApiRequest, res: NextApiResponse) {
    const { id_lote, codigo_paleta, puja } = req.body;

    // await prisma.$transaction(async (prisma) => {

    await prisma.pujas.create({
        data: {
            id_lote,
            id_usuario: 1,
            codigo_paleta,
            puja
        }
    });

    await prisma.lotes.update({
        where: { id_lote },
        data: { puja_final: puja }
    });

    // });

    res.status(200).json({ message: 'Puja registrada' });
}