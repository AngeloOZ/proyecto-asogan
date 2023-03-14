import { compradores } from "@prisma/client";
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerCompradores(req, res);
        case 'POST':
            return crearComprador(req, res);
        case 'PUT' :
            return actualizarComprador(req, res);    
        case 'DELETE':
            return eliminarComprador(req, res);  
        default:
            break;
    }


}

async function obtenerCompradores(req: NextApiRequest, res: NextApiResponse) {
    try {
        const compradores = await prisma.compradores.findMany();
        return res.status(200).json(compradores);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    finally{
        prisma.$disconnect();
    }
}


async function crearComprador(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { codigo_paleta,antecedentes_penales,procesos_judiciales,calificacion_bancaria, estado, usuarioid } = req.body as compradores;
        const comprador = await prisma.compradores.create({
            data: {
                codigo_paleta,
                antecedentes_penales,
                procesos_judiciales,
                calificacion_bancaria,
                estado,
                usuarioid
            }
        });
        return res.status(200).json(comprador);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    finally{
        prisma.$disconnect();
    }
}

async function actualizarComprador(req: NextApiRequest, res: NextApiResponse) {
    try{
        const { id_comprador,codigo_paleta,antecedentes_penales,procesos_judiciales,calificacion_bancaria, estado, usuarioid } = req.body as compradores;
        const comprador = await prisma.compradores.update({
            where: { id_comprador },
            data: {
                codigo_paleta,
                antecedentes_penales,
                procesos_judiciales,
                calificacion_bancaria,
                estado,
                usuarioid  
            }

        });
        return res.status(200).json(comprador);

    }catch(error){
        return res.status(500).json({message: error.message});
    }

    finally{
        prisma.$disconnect();
    }

}

async function eliminarComprador(req: NextApiRequest , res: NextApiResponse) {
    try {
        const { id_comprador } = req.body as compradores;
        const comprador = await prisma.compradores.delete({
            where: { id_comprador }
        });

        return res.status(200).json(comprador);

    } catch (error) {

        return res.status(200).json({message: error.message});
    }
    finally{
        prisma.$disconnect();
    }
    
}