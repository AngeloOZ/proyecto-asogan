import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'


export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            prisma.lote.findFirst({ where: { estado: 1 } })
                .then((lote) => {
                    if(!lote){
                        return res.status(404).json({message: 'No hay lotes activos'});
                    }
                    return res.status(200).json(lote);
                });
        }
    }
}