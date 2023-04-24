import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { MainMartillador } from 'custom/components'
import { eventos } from '@prisma/client';
import prisma from 'database/prismaClient'
import moment from 'moment-timezone'
import AuthGuard from 'src/auth/AuthGuard';
import { useObtenerLoteActivo, useObtenerUltimaPuja } from 'custom/hooks';

type Props = {
    uuid: string;
    evento: eventos;
}

export const PageMartillador = ({ evento }: Props) => {

    const { loteActual } = useObtenerLoteActivo(evento.id_evento);
    const { ultimaPuja } = useObtenerUltimaPuja(loteActual);

    return (
        <AuthGuard>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            <MainMartillador lote={loteActual} ultimaPuja={ultimaPuja} evento={evento} />
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