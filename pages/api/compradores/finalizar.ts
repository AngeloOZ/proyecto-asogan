import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "database/prismaClient";
import { handleErrorsPrisma } from "utils";

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {

        case "PUT":
            return finalizarConectados(req, res);

        default:
            return res.status(405).json({ message: "Method not allowed" });
    }
}


async function finalizarConectados(req: NextApiRequest, res: NextApiResponse) {

    try {

        const  comprador = await prisma.usuario.updateMany({
            data: {
                conectado: 0,
                conexionid: ""
            }
        });
        return res.status(200).json(comprador);
    } catch (error) {
        return res.status(500).json({ message: handleErrorsPrisma(error) });
    } finally {
        prisma.$disconnect();
    }



}