import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'PUT') {
            await registrarPuja(req, res);
            await prisma.$disconnect();
            res.status(200).json({ message: 'Puja registrada' });
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(handleErrorsPrisma(error));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function registrarPuja(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_lote, id_usuario, codigo_paleta, puja } = req.body;
        // return await prisma.$transaction(async (prisma) => {

        await prisma.pujas.create({
            data: {
                id_lote,
                id_usuario,
                codigo_paleta,
                puja
            }
        });

        await prisma.lotes.update({
            where: { id_lote },
            data: { puja_final: puja }
        });

        // });
    } catch (error) {
        throw new Error(error);
    }
}