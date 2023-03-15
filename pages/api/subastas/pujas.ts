import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';



export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { lote } = req.query;
        console.log(lote);

        if (lote) {
            const pujas = await prisma.pujas.findMany({
                where: {
                    id_lote: Number(lote)
                },
            });
            return res.status(200).json(pujas);
        }

        return res.status(404).json({ message: 'Not found' })
    }
    return res.status(405).json({ message: 'Method not allowed' })
}