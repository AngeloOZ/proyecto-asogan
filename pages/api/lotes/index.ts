import { lotes } from '@prisma/client';
import { LoteForm } from '@types';
import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'


export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return listado(req, res);
        case 'POST':
            return crearLote(req, res);
        case 'PUT':
        // return actualizar(req, res);
        default:
            return res.status(405).end();
    }
}

const listado = async (req: NextApiRequest, res: NextApiResponse) => {
    const lotes = await prisma.lotes.findMany();
    return res.status(200).json(lotes);
}

async function crearLote(req: NextApiRequest, res: NextApiResponse){
    try {
        const { id_evento, id_proveedor, fecha_pesaje, codigo_lote, cantidad_animales, tipo_animales, calidad_animales, peso_total, sexo, crias_hembras, crias_machos, procedencia, observaciones, puja_inicial, incremento, subastado  } = req.body as LoteForm;

        const lote = await prisma.lotes.create({
            data: {
                id_evento: Number(id_evento),
                id_proveedor: Number(id_proveedor),
                fecha_pesaje: fecha_pesaje,
                codigo_lote,
                cantidad_animales: Number(cantidad_animales),
                tipo_animales,
                calidad_animales,
                peso_total: Number(peso_total),
                sexo,
                crias_hembras: Number(crias_hembras),
                crias_machos: Number(crias_machos),
                procedencia,
                observaciones,
                puja_inicial: Number(puja_inicial),
                puja_final: Number(puja_inicial),
                
                incremento: Number(incremento),
                subastado: Number(subastado)
            }
        });
        return res.status(200).json(lote);
    } catch (error) {
        console.log(error.code);
        console.dir(error, { depth: null });

        return res.status(500).json({ message: error.message });
    }
}


