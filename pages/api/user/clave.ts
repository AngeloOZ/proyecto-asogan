
import prisma from 'database/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next';
import { handleErrorsPrisma } from 'utils';
// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return obtenerUsuariosClave(req, res);
      
        default:
            break;
    }
}
async function obtenerUsuariosClave(req: NextApiRequest, res: NextApiResponse) {
    try {
       
        const {identificacion, correo} = req.query;
     
        const identificacionStr = Array.isArray(identificacion) ? identificacion.find(el => typeof el === 'string') : identificacion;
        const correoStr = Array.isArray(correo) ? correo.find(el => typeof el === 'string') : correo;

            const usuario = await prisma.usuario.findFirst({
                where: { identificacion: identificacionStr!.trim(), correo: correoStr!.trim()},
            });
            
            if (!usuario) {
                return res.status(500).json({ message: "No se encontró un usuario con la información proporcionada" });
            }

            return res.status(200).json(usuario);

    } catch (error) {
        
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        prisma.$disconnect();
    }
}