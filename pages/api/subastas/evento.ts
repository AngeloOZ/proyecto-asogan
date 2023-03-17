import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { evento } = req.query as { evento: string };

    if (!evento) {
        return res.status(400).json({ message: 'Missing query parameter: evento' });
    }

    const eventoObj = await prisma.eventos.findUnique({
        where: { uuid: evento }
    });

    return res.status(200).json(eventoObj);


}