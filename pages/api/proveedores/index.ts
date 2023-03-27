import { proveedores } from '@prisma/client';
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerProveedores(req, res);
        case 'POST':
            return crearProveedor(req, res);
        case 'PUT':
            return actualizarProveedor(req, res);
        case 'DELETE':
            return eliminarProveedor(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function obtenerProveedores(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        if (id) {
            const proveedor = await prisma.proveedores.findUnique({
                where: { id_proveedor: Number(id) }
            });
            return res.status(200).json(proveedor);
        }

        const proveedores = await prisma.proveedores.findMany({
            orderBy: {
                nombres: 'asc'
            }
        });
        return res.status(200).json(proveedores);
    } catch (error) {
        return res.status(500).json(handleErrorsPrisma(error));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function crearProveedor(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { nombres, identificacion, telefono, correo, direccion } = req.body as proveedores;

        const proveedor = await prisma.proveedores.create({
            data: {
                nombres,
                identificacion,
                telefono,
                correo,
                direccion
            }
        });
        return res.status(200).json(proveedor);
    } catch (error) {
        return res.status(500).json(handleErrorsPrisma(error));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function actualizarProveedor(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id_proveedor, nombres, identificacion, telefono, correo, direccion } = req.body as proveedores;

        const proveedor = await prisma.proveedores.update({
            where: { id_proveedor },
            data: {
                nombres,
                identificacion,
                telefono,
                correo,
                direccion
            }
        });
        return res.status(200).json(proveedor);
    } catch (error) {
        return res.status(500).json(handleErrorsPrisma(error));
    }
    finally {
        await prisma.$disconnect();
    }
}

async function eliminarProveedor(req: NextApiRequest, res: NextApiResponse) {
    try {

        const { id } = req.query;

        const proveedor = await prisma.proveedores.delete({
            where: { id_proveedor: Number(id) }
        });

        return res.status(204).json(proveedor);
    } catch (error) {
        return res.status(500).json(handleErrorsPrisma(error));
    }
    finally {
        await prisma.$disconnect();
    }
}