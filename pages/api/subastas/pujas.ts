import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        await prisma.$disconnect();
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { lote } = req.query;

    if (!lote || Number.isNaN(Number(lote))) {
        await prisma.$disconnect();
        return res.status(202).json([]);
    }

    try {
        const pujas = await prisma.pujas.findMany({
            where: {
                id_lote: Number(lote),
            },
        });

        const mejoresPujas = await prisma.pujas.findMany({
            where: {
                id_lote: Number(lote),
            },
            orderBy: {
                puja: 'desc',
            },
            take: 4,
            include: {
                usuario: { select: { nombres: true, identificacion: true } },
            },
        });

        await prisma.$disconnect();
        return res.status(200).json({ pujas, mejoresPujas });
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        return res.status(500).json({ message: 'Internal server error' });
    }
}