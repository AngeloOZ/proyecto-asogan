import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Box } from '@mui/material'

import { imagenes, eventos } from '@prisma/client'
import prisma from 'database/prismaClient'

import { MainMonitor, useLoteMonitor2, useUltimaPuja } from 'custom/components'
import moment from 'moment-timezone'
import AuthGuard from 'src/auth/AuthGuard'
// import { useMemo } from 'react'

type Props = {
    uuid: string;
    evento: eventos;
    banners: imagenes[];
}

const PageMonitor = ({ uuid, evento, banners }: Props) => {

    const { loteActual, isLoading } = useLoteMonitor2(evento.id_evento);
    const { ultimaPuja } = useUltimaPuja(loteActual?.id_lote || 0);

    // TODO: Mantener la ultima puja
    // const ultimaPujaActiva = useMemo(() => {
    //     if (loteActual) {
    //         return ultimaPuja;
    //     }
    // }, [loteActual])

    return (
        <AuthGuard>
            <Head>
                <title>Subasta Lote</title>
            </Head>
            <Box component='main' width='100%' height='100vh'>
                {!isLoading && <MainMonitor lote={loteActual} ultimaPuja={ultimaPuja} banners={banners} evento={evento} />}
            </Box>
        </AuthGuard>
    )
}

export default PageMonitor

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { uuid } = ctx.query as { uuid: string };

    try {
        const evento = await prisma.eventos.findUnique({ where: { uuid } });

        const banners = await prisma.imagenes.findMany();
        await prisma.$disconnect();

        if (!evento) {
            throw new Error('Evento no encontrado');
        }

        if (evento.abierto !== 2) {
            throw new Error('Evento no abierto');
        }

        return {
            props: {
                uuid,
                evento: {
                    ...evento,
                    fecha: moment(evento.fecha).format('dd/MM/yyyy')
                },
                banners
            }
        }
    } catch (error) {
        return {
            notFound: true,
        }
    }
}