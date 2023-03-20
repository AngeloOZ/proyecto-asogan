import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (id) {
        const lotes = await prisma.lotes.findMany({
            where: {
                id_evento: Number(id),
                subastado: {
                    lt: 2
                }
            },
            include: {
                proveedores: true
            }
        });

        return res.json(lotes)
    }
    return res.status(404).json({ error: 'Not found' })
}