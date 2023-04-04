import type { NextApiRequest, NextApiResponse } from 'next'
import { compradores, usuario } from "@prisma/client";
import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';
import bcrypt from 'bcrypt';

import { sendMail } from 'custom/components/Globales/sendEmail';
import { plantilla } from 'custom/components/Globales/plantillaEmail';


// eslint-disable-next-line
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
            return res.status(405).json({ message: 'Method not allowed' });
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

        const compradores = await prisma.compradores.findMany({ include: { usuario: true },   orderBy: {
            id_comprador: 'desc'
          }, where: { id_comprador: {not: 1}  }});

        const compradoresConAntecedentes = compradores.map(comprador => (
            {
                ...comprador,
                identificacion: comprador.usuario.identificacion,
                nombres: comprador.usuario.nombres,
                antecedentes_penales: comprador.antecedentes_penales ? "Si" : "No",
                estado: comprador.estado ? "Activo" : "Inactivo"
            }
        ));

        return res.status(200).json(compradoresConAntecedentes);
    } catch (error) {
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }
}



async function crearComprador(req: NextApiRequest, res: NextApiResponse) {


    let identificacionC = ""
    let nombresC = ""
    let correoC = ""
    let celularC = ""
    let registroC = 0
    let idUsuario = 0
    let idComprador = 0
    try {


        const { registro } = req.body;
        const { codigo_paleta, antecedentes_penales, procesos_judiciales, calificacion_bancaria, estado, correo, celular }: compradores = req.body;
        const { identificacion, nombres }: usuario = req.body

        const verificarUsuario = await prisma.usuario.findUnique({ where: { identificacion } });


        if (verificarUsuario) {
            return res.status(500).json({ message: 'el usuario ya existe' });
        }
        const claveEncriptada = await bcrypt.hash(identificacion, 10);

        const usuario = await prisma.usuario.create({
            data: {
                identificacion,
                nombres,
                clave: claveEncriptada,
                rol: `["comprador"]`,
                tipo: 2,
                correo: correo!,
                celular: celular!
            }
        });


        if (codigo_paleta !== "") {

            const verificaCompradorPaleta = await prisma.compradores.findFirst({ where: { codigo_paleta } });
            if (verificaCompradorPaleta) {
                return res.status(500).json({ message: 'el codigo de la paleta ya existe' });
            }
        }

        idUsuario = usuario.usuarioid

        const comprador = await prisma.compradores.create({
            data: {
                codigo_paleta,
                antecedentes_penales,
                procesos_judiciales,
                calificacion_bancaria,
                estado,
                correo,
                celular,
                usuarioid: usuario.usuarioid
            }
        });

        idComprador = comprador.id_comprador

        if (registro === 1) {
            identificacionC = identificacion
            nombresC = nombres
            correoC = correo!
            celularC = celular!
            registroC = 1
        }

        return res.status(200).json(comprador);


    } catch (error) {

        if (idComprador !== 0) {
            await prisma.compradores.delete({
                where: { id_comprador: idComprador },
            });
        }

        if (idUsuario !== 0) {
            await prisma.usuario.delete({
                where: { usuarioid: idUsuario },
            });

        }

        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {

        if (registroC === 1){

            await sendMail([correoC], plantilla(identificacionC, nombresC, correoC, celularC, new Date().getUTCFullYear().toString()), 'Perseo');
            await sendMail([process.env.SMTP_CORREO!], plantilla(identificacionC, nombresC, correoC, celularC, new Date().getUTCFullYear().toString()), 'Perseo');
        }

        prisma.$disconnect();
    }
}

// eslint-disable-next-line
async function actualizarComprador(req: NextApiRequest, res: NextApiResponse) {
    try {
        await prisma.$transaction(async (prisma) => {

            const { id_comprador, codigo_paleta, antecedentes_penales, procesos_judiciales, calificacion_bancaria, estado, correo, celular }: compradores = req.body;
            const { nombres, identificacion }: usuario = req.body
          
            if (codigo_paleta !== "") {
                const verificaCompradorPaleta = await prisma.compradores.findMany({ where: { codigo_paleta, id_comprador: { not: id_comprador } }, take: 1 });

                if (verificaCompradorPaleta.length > 0) {

                    return res.status(500).json({ message: 'el codigo de la paleta ya existe' });
                }
            }

            const comprador = await prisma.compradores.update({
                where: { id_comprador },
                data: {
                    codigo_paleta,
                    antecedentes_penales,
                    procesos_judiciales,
                    calificacion_bancaria,
                    estado,
                    correo,
                    celular

                }

            });


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
        
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }

    finally {
        prisma.$disconnect();
    }

}

// eslint-disable-next-line
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

        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }

}