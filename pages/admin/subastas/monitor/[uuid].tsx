import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Box } from '@mui/material'

import { imagenes, eventos } from '@prisma/client'
import prisma from 'database/prismaClient'

import { MainMonitor, useLoteMonitor2, useUltimaPuja } from 'custom/components'
import moment from 'moment-timezone'
import { PATH_DASHBOARD_CLEINTE } from 'src/routes/paths'

type Props = {
    uuid: string;
    evento: eventos;
    banners: imagenes[];
}

const PageMonitor = ({ uuid, evento, banners }: Props) => {

    const { loteActual, isLoading } = useLoteMonitor2(evento.id_evento);
    const { ultimaPuja } = useUltimaPuja(loteActual?.id_lote || 0);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>
            <Box component='main' width='100%' height='100vh'>
                {!isLoading && <MainMonitor lote={loteActual} ultimaPuja={ultimaPuja} banners={banners} evento={evento} />}
            </Box>
        </>
    )
}

export default PageMonitor

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { uuid } = ctx.query as { uuid: string };

    try {
        const evento = await prisma.eventos.findUnique({ where: { uuid } });

        const banners = await prisma.imagenes.findMany();

        if (!evento) {
            throw new Error('Evento no encontrado');
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
            redirect: {
                destination: PATH_DASHBOARD_CLEINTE.root,
                permanent: false
            }
        }
    }
}