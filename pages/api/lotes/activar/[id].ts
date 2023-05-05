import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    
    try {
        const { id } = req.query;

        if (id) {
            const lotes = await prisma.lotes.updateMany({
                where: {
                    id_evento: Number(id),
                    subastado: {
                        lt: 2
                    }
                },
                data: {
                    subastado: 1
                }
            });

            return res.json(lotes)
        }
        return res.status(404).json({ error: 'Not found' })
    }
    catch (error) {

    }

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