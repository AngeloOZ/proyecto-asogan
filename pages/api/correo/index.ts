import type { NextApiRequest, NextApiResponse } from 'next'

import { sendMail } from 'custom/components/Globales/sendEmail';
import { plantillaCredencial } from 'custom/components/Globales/plantillaCredenciales';
import prisma from 'database/prismaClient';
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {

        case 'POST':
            return enviarCredencial(req, res);

        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function enviarCredencial(req: NextApiRequest, res: NextApiResponse) {
    let codigo_paletaN 
    let estadoN 
    let id_compradorN
    try {

        const { nombres, identificacion, correo,usuarioid ,codigo_paleta, estado, id_comprador} = req.body
            codigo_paletaN = codigo_paleta
            estadoN = estado
            id_compradorN = id_comprador
        if (id_comprador === undefined) {

            const compradores = await prisma.compradores.findFirst({
                where: { usuarioid }
             
            });
            if (compradores){
                codigo_paletaN = compradores.codigo_paleta
                estadoN = compradores.estado
                id_compradorN = compradores.id_comprador
            }
            
        }
    
        if (codigo_paletaN === "" || codigo_paletaN === 0 || estadoN === false) {

            return res.status(500).json({ message: 'Verifique el número de paleta y/o el estado del usuario' });
        

        }
      
        const verificaCompradorPaleta = await prisma.compradores.findMany({ where: { codigo_paleta: codigo_paletaN, id_comprador: { not: id_compradorN } }, take: 1 });
     
        if (verificaCompradorPaleta.length > 0) {

            return res.status(500).json({ message: 'El codigo de la paleta ya existe' });
        }
        
        await sendMail([correo], plantillaCredencial(nombres, identificacion, new Date().getUTCFullYear().toString(), codigo_paletaN), 'Perseo')
        

        return res.status(200).json({ message: 'Se ha enviado correctamente el correo electrónico', status:200 });
    } catch (error) {
        
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
}