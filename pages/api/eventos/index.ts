import { eventos } from '@prisma/client';
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'


export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerEventos(req, res);
        case 'POST':
            return crearEvento(req, res);
        case 'PUT':
            return actualizarEvento(req, res);
        case 'DELETE':
            return eliminarEvento(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function obtenerEventos(req: NextApiRequest, res: NextApiResponse) {
    try {
        const eventos = await prisma.eventos.findMany();
        return res.status(200).json(eventos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function crearEvento(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { fecha, lugar, tipo, abierto } = req.body as eventos;

        const proveedor = await prisma.eventos.create({
            data: {
                fecha,
                lugar,
                tipo,
                abierto
            }
        });
        return res.status(200).json(proveedor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function actualizarEvento(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_evento, fecha, lugar, tipo, abierto } = req.body as eventos;

        const proveedor = await prisma.eventos.update({
            where: { id_evento },
            data: {
                fecha,
                lugar,
                tipo,
                abierto
            }
        });
        return res.status(200).json(proveedor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function eliminarEvento(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_evento } = req.body;

        const proveedor = await prisma.eventos.delete({
            where: { id_evento: Number(id_evento) }
        });

        return res.status(204).json(proveedor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}