import Head from 'next/head'
import { useRouter } from 'next/router'

import { Box, Card, Container, Grid, Typography, useTheme } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { CardInfo, ChatPujas, LoteMartillador, TabVideos, VistaLoteCliente, useLoteMonitor, useSubastas } from 'custom/components'
import { eventos, imagenes, lotes } from '@prisma/client'
import { useContext, useEffect, useState } from 'react'

import useSWR from "swr";

import { subastaAPI } from 'custom/api'
import { AuthContext } from 'src/auth'
import { GetServerSideProps } from 'next'
import prisma from 'database/prismaClient'
import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from 'src/routes/paths'
import moment from 'moment-timezone'

import css from '../../../../../custom/styles/cliente.module.css'
import { calcularSubasta } from 'utils'
import LoadingScreen from 'src/components/loading-screen/LoadingScreen'

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

type Props = {
    uuid: string;
    evento: eventos;
    banners: imagenes[];
}

export default function PageAdminProveedores({ uuid, evento, banners }: Props) {
    const theme = useTheme();

    const { user } = useContext(AuthContext);

    const { loteActual, isLoading } = useLoteMonitor(uuid);

    if (isLoading) return <LoadingScreen />

    return (
        <>
            <Head>
                <title>Subasta Lote #{loteActual?.lote?.codigo_lote}</title>
            </Head>
            <VistaLoteCliente loteActual={loteActual} banners={banners} />
        </>
    )
}

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