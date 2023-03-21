import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return obtenerLoteActivo(req, res);
        case 'POST':
            return activarLote(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' })

    }
}

async function obtenerLoteActivo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query as { id: string };
        const idEvento = Number(id);


        if (Number.isNaN(idEvento)) {
            return res.status(202).json({ message: 'no content' });
        }        

        const lote = await prisma.lotes.findFirst({
            where: {
                id_evento: Number(id),
                subastado: 1
            },
        });

        return res.status(200).json(lote);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(handleErrorsPrisma(error?.code));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function activarLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_evento, id_lote } = req.body;

        await prisma.lotes.updateMany({
            where: {
                id_evento: Number(id_evento),
                subastado: {
                    lt: 2 
                }
            },
            data: {
                subastado: 0
            }
        });

        const lote = await prisma.lotes.update({
            where: {
                id_lote: Number(id_lote)
            },
            data: {
                subastado: 1
            }
        });
        return res.status(200).json(lote);
    }
    catch (error) {
        return res.status(500).json(handleErrorsPrisma(error?.code));
    }
    finally {
        await prisma.$disconnect();
    }
}