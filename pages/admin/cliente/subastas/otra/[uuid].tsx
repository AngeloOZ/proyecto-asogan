import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { VistaLoteCliente, useLoteMonitor } from 'custom/components'
import { eventos, imagenes } from '@prisma/client'

import { GetServerSideProps } from 'next'
import prisma from 'database/prismaClient'
import { PATH_DASHBOARD_CLEINTE } from 'src/routes/paths'
import moment from 'moment-timezone'

import LoadingScreen from 'src/components/loading-screen/LoadingScreen'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

type Props = {
    uuid: string;
    evento: eventos;
    banners: imagenes[];
}

export default function PageAdminProveedores({ uuid, evento, banners }: Props) {

    const { loteActual, isLoading } = useLoteMonitor(uuid);

    if (isLoading) return <LoadingScreen />

    return (
        <>
            <Head>
                <title>Subasta Lote #{loteActual?.lote?.codigo_lote}</title>
            </Head>
            <VistaLoteCliente loteActual={loteActual} banners={banners} evento={evento} />
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