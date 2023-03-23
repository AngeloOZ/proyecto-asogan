import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleErrorsPrisma } from 'utils';

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':

            return listado(req, res);

        default:
            return res.status(405).end();
    }


}

async function listado(req: NextApiRequest, res: NextApiResponse) {
    try {

        const tipo = await prisma.tipo_animales.findMany();
        return res.status(200).json(tipo);
    } catch (error) {
        return res.status(500).json(handleErrorsPrisma(error));
    }

}