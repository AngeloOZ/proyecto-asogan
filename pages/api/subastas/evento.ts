import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'database/prismaClient';



export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { evento } = req.query as { evento: string };
    
        if (evento) {
            const reqEvento = await prisma.eventos.findFirst({
                where: {
                    uuid: evento
                },
            });
            await prisma.$disconnect();
            return res.status(200).json(reqEvento);
        }
        await prisma.$disconnect();
        return res.status(404).json({ message: 'Not found' })
    }
    await prisma.$disconnect();
    return res.status(405).json({ message: 'Method not allowed' })
}