import { usuario } from "@prisma/client";
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerUsuarios(req, res);
        case 'POST':
            return crearUsuario(req, res);
        case 'PUT':
            return actualizarUsuario(req, res);
        case 'DELETE':
            return eliminarUsuario(req, res);
        default:
            break;
    }
}

async function obtenerUsuarios(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        if (id) {
            const usuario = await prisma.usuario.findUnique({
                where: { usuarioid: Number(id) },
            });

            return res.status(200).json(usuario);
        }

        const usuarios = await prisma.usuario.findMany({ where: { tipo: 1 } });
        const usuariosRol = usuarios.map((usuario) => ({ ...usuario, rol: (JSON.parse(usuario.rol)[0]).charAt(0).toUpperCase() + (JSON.parse(usuario.rol)[0]).slice(1) }));

        return res.status(200).json(usuariosRol);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}

async function crearUsuario(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { identificacion, nombres, rol, clave }: usuario = req.body
        const claveEncriptada = await bcrypt.hash(clave, 10);

        const usuarioBuscar = await prisma.usuario.findUnique({
            where: { identificacion },
        });
        if (usuarioBuscar) {
            return res.status(500).json({ message: "El usuario ya existe" });
        }


        const usuario = await prisma.usuario.create({
            data: {
                identificacion,
                nombres,
                clave: claveEncriptada,
                rol: `["${rol}"]`,

            }
        });

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}

async function actualizarUsuario(req: NextApiRequest, res: NextApiResponse) {
    try {

        const { usuarioid, identificacion, nombres, rol, clave }: usuario = req.body
        if (clave === "") {
            const usuario = await prisma.usuario.update({
                where: { usuarioid },
                data: {
                    identificacion,
                    nombres,
                    rol: `["${rol}"]`,
                }
            });
            return res.status(200).json(usuario);
        }

        const claveEncriptada = await bcrypt.hash(clave, 10);

        const usuario = await prisma.usuario.update({
            where: { usuarioid },
            data: {
                identificacion,
                nombres,
                clave: claveEncriptada,
                rol: `["${rol}"]`,
            }
        });


        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}

async function eliminarUsuario(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        const usuario = await prisma.usuario.delete({
            where: { usuarioid: Number(id) },
        });

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}