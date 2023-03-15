import { lotes } from '@prisma/client';
import { LoteForm } from '@types';
import prisma from 'database/prismaClient'
import moment from 'moment-timezone';
import type { NextApiRequest, NextApiResponse } from 'next'


export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return listado(req, res);
        case 'POST':
            return crearLote(req, res);
        case 'PUT':
            return actualizarLote(req, res);
        default:
            return res.status(405).end();
    }
}

const listado = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        if (id) {
            const lote = await prisma.lotes.findUnique({
                where: {
                    id_lote: Number(id)
                }
            });
            return res.status(200).json(lote);
        }

        const lotes = await prisma.lotes.findMany();
        return res.status(200).json(lotes);
    } catch (error) {

    } finally {
        await prisma.$disconnect();
    }
}

async function crearLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_evento, id_proveedor, fecha_pesaje, codigo_lote, cantidad_animales, tipo_animales, calidad_animales, peso_total, sexo, crias_hembras, crias_machos, procedencia, observaciones, puja_inicial, incremento } = req.body as LoteForm;

        // return res.status(200).json(req.body);

        const formattedDate = moment(fecha_pesaje, 'YYYY/MM/DD').toDate();

        const lote = await prisma.lotes.create({
            data: {
                id_evento: Number(id_evento),
                id_proveedor: Number(id_proveedor),
                fecha_pesaje: formattedDate,
                codigo_lote,
                cantidad_animales: cantidad_animales,
                tipo_animales,
                calidad_animales,
                peso_total: peso_total,
                sexo,
                crias_hembras: crias_hembras,
                crias_machos: crias_machos,
                procedencia,
                observaciones,
                puja_inicial: puja_inicial,
                puja_final: puja_inicial,
                incremento: incremento,
                subastado: 0,
            }
        });
        return res.status(200).json(lote);
    } catch (error) {
        console.log(error.code);
        console.dir(error, { depth: null });

        return res.status(500).json({ message: error.message });
    }
}

async function actualizarLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_lote, id_evento, id_proveedor, fecha_pesaje, codigo_lote, cantidad_animales, tipo_animales, calidad_animales, peso_total, sexo, crias_hembras, crias_machos, procedencia, observaciones, puja_inicial, incremento } = req.body as LoteForm;

        const formattedDate = moment(fecha_pesaje, 'YYYY/MM/DD').toDate();

        const lote = await prisma.lotes.update({
            where: {
                id_lote: id_lote
            },
            data: { id_evento: Number(id_evento), id_proveedor: Number(id_proveedor), fecha_pesaje: formattedDate, codigo_lote, cantidad_animales: cantidad_animales, tipo_animales, calidad_animales, peso_total: peso_total, sexo, crias_hembras: crias_hembras, crias_machos: crias_machos, procedencia, observaciones, puja_inicial: puja_inicial, incremento: incremento }
        });

        return res.status(200).json(lote);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

