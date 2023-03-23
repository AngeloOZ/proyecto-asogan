import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'


export const config = {
    api: {
        responseLimit: "8mb",
        bodyParser: {
            sizeLimit: '10mb',
        },
    }
}

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerImagenes(req, res);
        case 'POST':
            return crearImagen(req, res);
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
        const { descripcion, imagen } = req.body as { descripcion: string, imagen: string }

        const imagens = await prisma.imagenes.create({
            data: {
                imagen,
                descripcion
            }
        });

        return res.status(200).json(imagens);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}


async function eliminarImagen(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_imagen } = req.body as { id_imagen: number };

        const imagen = await prisma.imagenes.delete({
            where: { id_imagen }
        });

        return res.status(200).json(imagen);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        await prisma.$disconnect();
    }
}