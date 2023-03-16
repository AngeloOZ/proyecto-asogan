import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';



export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { lote } = req.query;

            if (isNaN(Number(lote))) return res.status(202).json([]);

            if (lote) {

                const pujas = await prisma.pujas.findMany({
                    where: {
                        id_lote: Number(lote)
                    },
                });

                const mejoresPujas = await prisma.pujas.findMany({
                    where: {
                        id_lote: Number(lote)
                    },
                    orderBy: {
                        puja: 'desc'
                    },
                    take: 4,
                    include: {
                        usuario: { select: { nombres: true, identificacion: true } }
                    }

                });
                await prisma.$disconnect();
                return res.status(200).json({ pujas, mejoresPujas });
            }
        } catch (error) {
            console.error(error);
            await prisma.$disconnect();
            return res.status(200).json({ pujas: [], mejoresPujas: [] })
        }
        await prisma.$disconnect();
        return res.status(404).json({ message: 'Not found' })
    }
    await prisma.$disconnect();
    return res.status(405).json({ message: 'Method not allowed' })
}