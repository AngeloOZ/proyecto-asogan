import type { NextApiRequest, NextApiResponse } from 'next'

import { sendMail } from 'custom/components/Globales/sendEmail';
import { plantillaCredencial } from 'custom/components/Globales/plantillaCredenciales';



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

        const { nombres, identificacion, correo, codigo_paleta, estado } = req.body

        if (codigo_paleta === "" || codigo_paleta === 0 || estado === false) {

            return res.send("Verifique el número de paleta y/o el estado del usuario")
        } else {
            await sendMail([correo], plantillaCredencial(nombres, identificacion, new Date().getUTCFullYear().toString(), codigo_paleta), 'Perseo')
        }

        return res.send(true)
    } catch (error) {
        return res.send(false)
    }
}