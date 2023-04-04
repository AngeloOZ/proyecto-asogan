import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const { comprador } = req.query;

        if (comprador) {
            const lote = await prisma.lotes.findMany({
                where: {
                    id_comprador: Number(comprador)
                }
            });
            return res.status(200).json(lote);
        }

        const lotes = await prisma.lotes.findMany();
        return res.status(200).json(lotes);
    } catch (error) {
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    } finally {
        await prisma.$disconnect();
    }
}

