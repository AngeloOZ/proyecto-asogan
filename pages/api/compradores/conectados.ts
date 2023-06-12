import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "database/prismaClient";
import { handleErrorsPrisma } from "utils";

// eslint-disable-next-line
export default function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return obtenerConectados(req, res);

    case "PUT":
      return actualizarConectados(req, res);

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function obtenerConectados(req: NextApiRequest, res: NextApiResponse) {
  try {
    const compradores = await prisma.usuario.findMany({
      where: { conectado: 1 },

      select: {
        usuarioid: true,
        nombres: true,
        identificacion: true
      },


    });
    return res.status(200).json(compradores);
  } catch (error) {

    return res.status(500).json({ message: handleErrorsPrisma(error) });
  } finally {
    prisma.$disconnect();
  }
}

async function actualizarConectados(req: NextApiRequest, res: NextApiResponse) {

  try {
    const { usuarioid, conectado, conexionid } = req.query;
    let comprador
    let buscarComprador

    if (Number(usuarioid) !== 0) {
      if (conexionid) {
        comprador = await prisma.usuario.update({
          where: { usuarioid: Number(usuarioid) },
          data: {
            conectado: Number(conectado),
            conexionid: String(conexionid)

          }
        });
        return res.status(200).json(comprador);
      }
    }

    if (conexionid) {
      buscarComprador = await prisma.usuario.findMany({
        select: { usuarioid: true },
        where: { conexionid: String(conexionid) }
      })

      if (buscarComprador[0].usuarioid) {
        comprador = await prisma.usuario.update({
          where: { usuarioid: Number(buscarComprador[0].usuarioid) },
          data: {
            conectado: Number(conectado),
            conexionid: ""
          }
        });

      }

    }
    return res.status(200).json(comprador);


  } catch (error) {
    return res.status(500).json({ message: handleErrorsPrisma(error) });
  } finally {
    prisma.$disconnect();
  }



}
