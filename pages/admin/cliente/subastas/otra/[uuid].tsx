import { useEffect, useState, useContext } from 'react';
import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { eventos, imagenes } from '@prisma/client'
import prisma from 'database/prismaClient'
import moment from 'moment-timezone'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { useObtenerLoteActivo, useObtenerUltimaPuja } from 'custom/hooks'
import { VistaLoteCliente } from 'custom/components'
import { CambiarConectados } from 'custom/components/Transmision'

PageSubastaCliente.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

type Props = {
    evento: eventos;
    banners: imagenes[];
}

export default function PageSubastaCliente({ evento, banners }: Props) {

    const { loteActual } = useObtenerLoteActivo(evento.id_evento);
    const { ultimaPuja } = useObtenerUltimaPuja(loteActual);

    return (
        <>
            <Head>
                <title>Subasta Lote #{loteActual?.codigo_lote || 'SN'}</title>
            </Head>
            <VistaLoteCliente lote={loteActual} ultimaPuja={ultimaPuja} banners={banners} evento={evento} />
            <CambiarConectados />
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