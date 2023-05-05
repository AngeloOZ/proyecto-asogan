import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { AdminMartillador } from 'custom/components'
import prisma from 'database/prismaClient';
import moment from 'moment-timezone';
import { eventos } from '@prisma/client';
import AuthGuard from 'src/auth/AuthGuard';
import { useObtenerLoteActivo, useObtenerUltimaPuja } from 'custom/hooks';

type Props = {
    evento: eventos;
}

const PageMonitor = ({ evento }: Props) => {

    const { loteActual } = useObtenerLoteActivo(evento.id_evento);
    const { ultimaPuja } = useObtenerUltimaPuja(loteActual);

    return (
        <AuthGuard>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            <AdminMartillador evento={evento} lote={loteActual} ultimaPuja={ultimaPuja} />
        </AuthGuard>
    )
}

export default PageMonitor

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { evento } = ctx.query as { evento: string };

    try {
        const eventos = await prisma.eventos.findUnique({ where: { uuid: evento } });
        await prisma.$disconnect();

        if (!eventos) {
            throw new Error('Evento no encontrado');
        }

        if (eventos.abierto !== 2) {
            throw new Error('Evento no abierto');
        }

        return {
            props: {
                evento: {
                    ...eventos,
                    fecha: moment(eventos.fecha).format('dd/MM/yyyy')
                },
            }
        }
    } catch (error) {
        await prisma.$disconnect();
        return {
            notFound: true
        }
    }
}