import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'PUT') {
            return res.status(405).json({ message: 'Method not allowed' });
        }
        const query = await terminarSubasta(req, res);

        if (query === 'rechazado') {
            res.status(200).json({ message: 'el lote ha sido rechazado' });
        } else {
            res.status(200).json({ message: 'el lote ha sido subastado' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}

async function terminarSubasta(req: NextApiRequest, res: NextApiResponse) {
    const { accion, id_lote } = req.body;

    if (accion === 'rechazado') {
        await prisma.lotes.update({
            where: {
                id_lote: Number(id_lote),
            },
            data: {
                subastado: 2,
            }
        });
        return 'rechazado';
    }

    // 1. Obtener ultima puja más alta
    const ultimaPujaMasAlta = await prisma.pujas.findFirst({
        where: {
            id_lote: Number(id_lote),
        },
        include: {
            usuario: true,
        },
        orderBy: [
            {
                puja: 'desc',
            },
            {
                id_puja: 'desc',
            }
        ],
        take: 1,
    });
    if (!ultimaPujaMasAlta) throw new Error('No se encontró pujas registradas para este lote');

    // 2. obtener comprador de la ultima puja más alta
    const comprador = await prisma.compradores.findFirst({
        where: {
            usuarioid: ultimaPujaMasAlta.id_usuario,
        }
    });
    if (!comprador) throw new Error('No se encontró comprador para este lote');

    // 3. actualizar lote con comprador y paleta
    await prisma.lotes.update({
        where: {
            id_lote: Number(id_lote),
        },
        data: {
            id_comprador: comprador.id_comprador,
            paleta_comprador: ultimaPujaMasAlta.codigo_paleta,
            subastado: 3,
        }
    });
    return 'subastado';
}