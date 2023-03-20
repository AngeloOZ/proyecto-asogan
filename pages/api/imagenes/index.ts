import { imagenes } from '@prisma/client';
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs/promises";
import path from "path";

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerImagenes(req, res);
        case 'POST':
            return crearImagen(req, res);
        case 'PUT':
            return actualizarImagen(req, res);
        case 'DELETE':
            return eliminarImagen(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function obtenerImagenes(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        if (id) {
            const imagen = await prisma.imagenes.findUnique({
                where: { id_imagen: Number(id) }
            });
            return res.status(200).json(imagen);
        }

        const imagenes = await prisma.imagenes.findMany();
        return res.status(200).json(imagenes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function crearImagen(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { fileName } = req.body;

        const imagen = await prisma.imagenes.create({
            data: {
                ruta: `/img/${fileName}`
            }
        });
        return res.status(200).json(imagen);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function actualizarImagen(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_imagen, ruta } = req.body as imagenes;

        const imagen = await prisma.imagenes.update({
            where: { id_imagen },
            data: {
                ruta
            }
        });
        return res.status(200).json(imagen);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}

async function eliminarImagen(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_imagen } = req.body;

        const imagen = await prisma.imagenes.delete({
            where: { id_imagen }
        });

        fs.unlink(path.join(process.cwd(), "/public") + imagen.ruta);

        return res.status(200).json(imagen);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}