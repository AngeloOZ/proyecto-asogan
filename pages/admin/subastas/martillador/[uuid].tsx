import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { MainMartillador, useLoteMonitor2, useUltimaPuja } from 'custom/components'
import { eventos } from '@prisma/client';
import prisma from 'database/prismaClient'
import moment from 'moment-timezone'
import AuthGuard from 'src/auth/AuthGuard';

type Props = {
    uuid: string;
    evento: eventos;
}

export const PageMartillador = ({ uuid, evento }: Props) => {

    const { loteActual, isLoading } = useLoteMonitor2(evento.id_evento);
    const { ultimaPuja } = useUltimaPuja(loteActual?.id_lote || 0);

    return (
        <AuthGuard>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            {!isLoading && <MainMartillador lote={loteActual} ultimaPuja={ultimaPuja} evento={evento} />}
        </AuthGuard>
    )
}

export default PageMartillador

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
            notFound: true
        }
    }
}