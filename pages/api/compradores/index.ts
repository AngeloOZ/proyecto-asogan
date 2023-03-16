import { compradores, usuario } from "@prisma/client";
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerCompradores(req, res);
        case 'POST':
            return crearComprador(req, res);
        case 'PUT':
            return actualizarComprador(req, res);
        case 'DELETE':
            return eliminarComprador(req, res);
        default:
            break;
    }

}

async function obtenerCompradores(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        if (id) {
            const compradores = await prisma.compradores.findUnique({
                where: { id_comprador: Number(id) },
                include: { usuario: true }
            });
            return res.status(200).json(compradores);
        }

        const compradores = await prisma.compradores.findMany({ include: { usuario: true } });

        const compradoresConAntecedentes = compradores.map((comprador) => {
            return { ...comprador, identificacion: comprador.usuario.identificacion, nombres: comprador.usuario.nombres, antecedentes_penales: comprador.antecedentes_penales ? "Si" : "No", estado: comprador.estado ? "Activo" : "Inactivo" };
        });

        return res.status(200).json(compradoresConAntecedentes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}


async function crearComprador(req: NextApiRequest, res: NextApiResponse) {
    try {
        await prisma.$transaction(async (prisma) => {

            const { identificacion, nombres }: usuario = req.body
            const usuario = await prisma.usuario.create({
                data: {

                    identificacion,
                    nombres,
                    clave: identificacion,
                    rol: `["comprador"]`,
                    tipo: 2
                }
            });
            const { codigo_paleta, antecedentes_penales, procesos_judiciales, calificacion_bancaria, estado }: compradores = req.body;
            const comprador = await prisma.compradores.create({
                data: {

                    codigo_paleta,
                    antecedentes_penales: antecedentes_penales == false ? false : true,
                    procesos_judiciales: procesos_judiciales == false ? false : true,
                    calificacion_bancaria,
                    estado: estado == false ? false : true,
                    usuarioid: usuario.usuarioid
                }
            });
            return res.status(200).json(comprador);
        });
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }
}

async function actualizarComprador(req: NextApiRequest, res: NextApiResponse) {
    try {
        await prisma.$transaction(async (prisma) => {

            const { id_comprador, codigo_paleta, antecedentes_penales, procesos_judiciales, calificacion_bancaria, estado }: compradores = req.body;
            const comprador = await prisma.compradores.update({
                where: { id_comprador },
                data: {
                    codigo_paleta,
                    antecedentes_penales,
                    procesos_judiciales,
                    calificacion_bancaria,
                    estado

                }

            });

            const { nombres, identificacion }: usuario = req.body
            await prisma.usuario.update({
                where: { usuarioid: comprador.usuarioid },
                data: {
                    nombres,
                    identificacion
                }
            });

            return res.status(200).json(comprador);

        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    finally {
        prisma.$disconnect();
    }

}

async function eliminarComprador(req: NextApiRequest, res: NextApiResponse) {
    try {
        await prisma.$transaction(async (prisma) => {
            const { id } = req.query;

            const compradorBuscar = await prisma.compradores.findUnique({
                where: { id_comprador: Number(id) }
            });

            const comprador = await prisma.compradores.delete({
                where: { id_comprador: compradorBuscar?.id_comprador }
            });

            await prisma.usuario.delete({

                where: { usuarioid: compradorBuscar?.usuarioid }
            });

            return res.status(200).json(comprador);
        });

    } catch (error) {

        return res.status(200).json({ message: error.message });
    }
    finally {
        prisma.$disconnect();
    }

}