import prisma from 'database/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleErrorsPrisma } from 'utils';
import socket from 'utils/sockets';

// eslint-disable-next-line
export default async function (req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { id } = req.query;

        if (Number.isNaN(Number(id))) {
            throw new Error('El id del lote no es un número');
        }

        const loteActivo = await prisma.lotes.findFirst({
            where: { subastado: 1 }
        });

        if (loteActivo) {      
            if (loteActivo.paleta_comprador || loteActivo.id_comprador) {
                await prisma.lotes.update({
                    where: { id_lote: loteActivo.id_lote },
                    data: {
                        subastado: 3
                    }
                });
            } else {
                // await prisma.lotes.update({
                //     where: { id_lote: loteActivo.id_lote },
                //     data: {
                //         subastado: 0
                //     }
                // });
                throw new Error('Hay un lote activo que no ha sido vendido');
            }
        }

        const lote = await prisma.lotes.update({
            where: {
                id_lote: Number(id),
            },
            data: {
                subastado: 1
            }
        });

        res.status(200).json(lote);
        socket.emit('activarLote', lote);
        socket.emit('mejoresPujas', lote.id_lote);
        socket.emit('listadoPujas', lote.id_lote);
    }
    catch (error) {
        res.status(500).json({ message: handleErrorsPrisma(error) });
    }
    finally {
        await prisma.$disconnect();
    }
}