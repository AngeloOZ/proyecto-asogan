import { LoteForm } from '@types';
import prisma from 'database/prismaClient'
import moment from 'moment-timezone';
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return listado(req, res);
        case 'POST':
            return crearLote(req, res);
        case 'PUT':
            return actualizarLote(req, res);
        case 'DELETE':
            return eliminarLote(req, res);
        default:
            return res.status(405).end();
    }
}

async function listado(req: NextApiRequest, res: NextApiResponse) {
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
        return res.status(500).json({ message: error.message });
    } finally {
        await prisma.$disconnect();
    }
}

async function crearLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_evento, id_proveedor, fecha_pesaje, codigo_lote, cantidad_animales, tipo_animales, calidad_animales, peso_total, sexo, crias_hembras, crias_machos, procedencia, observaciones, puja_inicial, incremento, url_video } = req.body as LoteForm;

        const formattedDate = moment(fecha_pesaje, 'YYYY/MM/DD H:mm:ss').toDate();

        const lote = await prisma.lotes.create({
            data: {
                id_evento: Number(id_evento),
                id_proveedor: Number(id_proveedor),
                fecha_pesaje: formattedDate,
                codigo_lote,
                cantidad_animales,
                tipo_animales,
                calidad_animales,
                peso_total,
                sexo,
                crias_hembras,
                crias_machos,
                procedencia,
                observaciones,
                puja_inicial,
                puja_final: puja_inicial,
                incremento,
                url_video,
                subastado: 0,
            }
        });
        return res.status(200).json(lote);
    } catch (error) {
        console.log(error.code);
        console.dir(error, { depth: null });
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function actualizarLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_lote, id_evento, id_proveedor, fecha_pesaje, codigo_lote, cantidad_animales, tipo_animales, calidad_animales, peso_total, sexo, crias_hembras, crias_machos, procedencia, observaciones, puja_inicial, incremento, url_video, subastado } = req.body as LoteForm;

        const formattedDate = moment(fecha_pesaje, 'YYYY/MM/DD H:mm:ss').toDate();
        
        const lotePrev = await prisma.lotes.findUnique({ where: { id_lote: Number(id_lote) } });
        
        let puja_inicialBase = Number(lotePrev!.puja_inicial);
        let puja_final = Number(lotePrev!.puja_final); 

        if(puja_inicial !== puja_inicialBase) {
            puja_final = puja_inicial;
            puja_inicialBase = puja_inicial;
        }



        const lote = await prisma.lotes.update({
            where: {
                id_lote
            },
            data: {
                id_evento: Number(id_evento),
                id_proveedor: Number(id_proveedor),
                fecha_pesaje: formattedDate,
                codigo_lote,
                cantidad_animales,
                tipo_animales,
                calidad_animales,
                peso_total,
                sexo,
                crias_hembras,
                crias_machos,
                procedencia,
                observaciones,
                puja_inicial: puja_inicialBase,
                puja_final,
                incremento,
                url_video,
                subastado: Number(subastado),
            }
        });

        return res.status(200).json(lote);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function eliminarLote(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        const evento = await prisma.lotes.delete({
            where: { id_lote: Number(id) }
        });

        return res.status(204).json(evento);
    } catch (error) {
        return res.status(500).json(handleErrorsPrisma(error.code));
    }
    finally {
        await prisma.$disconnect();
    }
}