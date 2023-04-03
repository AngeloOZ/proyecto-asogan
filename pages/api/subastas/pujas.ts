import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {

        switch (req.method) {
            case 'GET':
                await obtenerMejoresPujas(req, res);
                break;
            case 'DELETE':
                await eliminarPuja(req, res);
                break;
            default:
                res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json(handleErrorsPrisma(error));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function obtenerMejoresPujas(req: NextApiRequest, res: NextApiResponse) {

    const { lote } = req.query;

    if (!lote || Number.isNaN(Number(lote))) {
        return res.status(202).json([]);
    }

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
        take: 3,
        include: {
            usuario: { select: { nombres: true, identificacion: true } },
        },
    });
    return res.status(200).json({ pujas, mejoresPujas });
}

async function eliminarPuja(req: NextApiRequest, res: NextApiResponse) {

    const { id_lote } = req.query as { id_lote: string };

    if (!id_lote || Number.isNaN(Number(id_lote))) {
        return res.status(405).json({ message: 'id no valido' });
    }
    
    // obtener la ultima puja
    const ultimaPuja = await prisma.pujas.findMany({
        where: {
            id_lote: Number(id_lote),
        },
        orderBy: [
            {
                puja: 'desc',
            },
            {
                id_puja: 'asc',
            }
        ],
        take: 2,
    });

    if (ultimaPuja.length > 0) {

        const [ultima, penultima] = ultimaPuja;

        const lote = await prisma.lotes.findUnique({ where: { id_lote: ultima.id_lote } });

        // Eliminar la ultima puja
        await prisma.pujas.delete({ where: { id_puja: ultima.id_puja } });

        const nuevaPujaFinal = penultima ? penultima.puja : lote!.puja_inicial;

        // Actualizar el lote con la nueva puja final
        await prisma.lotes.update({
            where: { id_lote: ultima.id_lote },
            data: { puja_final: nuevaPujaFinal },
        });
    }

    return res.status(200).json({ message: 'ok' });
}   
