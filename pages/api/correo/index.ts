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
    try {

        const { nombres, identificacion, correo, codigo_paleta, estado, id_comprador } = req.body

        if (codigo_paleta === "" || codigo_paleta === 0 || estado === false) {

            return res.status(500).json({ message: 'Verifique el número de paleta y/o el estado del usuario' });
        

        }

        const verificaCompradorPaleta = await prisma.compradores.findMany({ where: { codigo_paleta, id_comprador: { not: id_comprador } }, take: 1 });
     
        if (verificaCompradorPaleta.length > 0) {

            return res.status(500).json({ message: 'El codigo de la paleta ya existe' });
        }
        
        await sendMail([correo], plantillaCredencial(nombres, identificacion, new Date().getUTCFullYear().toString(), codigo_paleta), 'Perseo')
        

        return res.status(200).json({ message: 'Se ha enviado correctamente el correo electrónico' });
    } catch (error) {
        
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    }
}