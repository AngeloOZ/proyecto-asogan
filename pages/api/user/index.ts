import { usuario } from "@prisma/client";
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { handleErrorsPrisma } from 'utils';
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

        const usuarios = await prisma.usuario.findMany({ where: { tipo: 1 ,  usuarioid: {not: Number(1)} } , orderBy: {
            usuarioid: 'desc'
          } });
       
        const usuariosRol = usuarios.map((usuario) => ({ ...usuario, rol: (JSON.parse(usuario.rol)[0]).charAt(0).toUpperCase() + (JSON.parse(usuario.rol)[0]).slice(1) }));

        return res.status(200).json(usuariosRol);

    } catch (error) {
        
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }
}

async function crearUsuario(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { identificacion, nombres, rol, clave, correo, celular }: usuario = req.body
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
                correo,
                celular
            }
        });

        return res.status(200).json(usuario);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }
}

async function actualizarUsuario(req: NextApiRequest, res: NextApiResponse) {
    try {
      
        const { usuarioid, identificacion, nombres, rol, clave,celular,correo, conexionid }: usuario = req.body
        if (clave === "") {
            const usuario = await prisma.usuario.update({
                where: { usuarioid },
                data: {
                    identificacion,
                    nombres,
                    celular,
                    correo,
                    rol: `["${rol}"]`,
                    conexionid

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
                celular,
                correo,
                clave: claveEncriptada,
                rol: `["${rol}"]`,
                conexionid
            }
        });
      

        return res.status(200).json(usuario);
    } catch (error) {
  
        return res.status(500).json({ message: handleErrorsPrisma(error) });
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
       
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }
}