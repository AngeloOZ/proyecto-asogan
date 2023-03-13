import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'


export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return listado(req, res);
        case 'PUT':
            return actualizar(req, res);
        default:
            return res.status(405).end();
    }
}

const listado = async (req: NextApiRequest, res: NextApiResponse) => {
    const lotes = await prisma.lote.findMany();
    return res.status(200).json(lotes);
}

const actualizar = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.body;

    await prisma.lote.updateMany({
        data: {
            estado: 0
        }
    });

    const lote = await prisma.lote.update({
        data: {
            estado: 1,
        },
        where: {
            loteid: Number.parseInt(id)
        }
    });

    return res.status(200).json(lote);
}
