import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { eventos, imagenes } from '@prisma/client'
import prisma from 'database/prismaClient'
import moment from 'moment-timezone'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { useObtenerLoteActivo, useObtenerUltimaPuja } from 'custom/hooks'
import { ModalActivarAudio, TransmisionUsuarios, VistaLoteCliente } from 'custom/components'
import { useViewer } from 'custom/hooks/live'
import { useRef } from 'react'
import { getSocket } from 'utils/socketClient'



PageSubastaCliente.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

type Props = {
    evento: eventos;
    banners: imagenes[];
}

export default function PageSubastaCliente({ evento, banners }: Props) {

    const { loteActual } = useObtenerLoteActivo(evento.id_evento);
    const { ultimaPuja } = useObtenerUltimaPuja(loteActual);

    const videoRef = useRef<HTMLVideoElement>(null);
    const socket = getSocket();


    const { showDialogAudio, toggleAudio, isMuted } = useViewer({
        videoRef,
        broadcastID: 'e1f36dc0-d632-4ab3-9e00-4f8fa13c047e',
        username: 'Angello_Beta_MIDEV',
        socket,
    });


    return (
        <>

            <Head>
                <title>Subasta Lote #{loteActual?.codigo_lote || 'SN'}</title>
            </Head>
            <VistaLoteCliente lote={loteActual} ultimaPuja={ultimaPuja} banners={banners} evento={evento} />

            <div style={{
                width: 300,
                height: 300,
                backgroundColor: '#191919',
            }}>
                <video
                    ref={videoRef}
                    poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`}
                    style={{ height: '100%', width: '100%' }}
                    muted
                />
            </div>
            {
                showDialogAudio && <ModalActivarAudio toggle={toggleAudio} />
            }

        </>
    )
}

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
                evento: {
                    ...evento,
                    fecha: moment(evento.fecha).format('dd/MM/yyyy')
                },
                banners
            }
        }
    } catch (error) {
        return {
            notFound: true
        }
    }
}