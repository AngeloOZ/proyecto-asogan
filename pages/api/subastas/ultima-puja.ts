import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            res.status(405).json({ message: 'Method not allowed' });
            return
        }
        await obtenerUltimaPujaMasAlta(req, res);
    }
    catch (error) {
        res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }

}

async function obtenerUltimaPujaMasAlta(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string };

    const puja = await prisma.pujas.findFirst({
        where: {
            id_lote: Number(id),
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

    

    res.json(puja);
}