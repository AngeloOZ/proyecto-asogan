import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { MainAdminMartillador, useLoteMonitor2, useUltimaPuja } from 'custom/components'
import prisma from 'database/prismaClient';
import moment from 'moment-timezone';
import { eventos } from '@prisma/client';

type Props = {
    uuid: string;
    evento: eventos;
}

const PageMonitor = ({ uuid, evento }: Props) => {

    const { loteActual, isLoading } = useLoteMonitor2(evento.id_evento);
    const { ultimaPuja } = useUltimaPuja(loteActual?.id_lote || 0);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            {!isLoading && <MainAdminMartillador evento={evento} lote={loteActual} ultimaPuja={ultimaPuja} />}

        </>
    )
}

export default PageMonitor

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { evento } = ctx.query as { evento: string };

    try {
        const eventos = await prisma.eventos.findUnique({ where: { uuid: evento } });
        
        if (!eventos) {
            throw new Error('Evento no encontrado');
        }

        await prisma.$disconnect();

        return {
            props: {
                uuid: evento,
                evento: {
                    ...eventos,
                    fecha: moment(eventos.fecha).format('dd/MM/yyyy')
                },
            }
        }
    } catch (error) {
        console.log(error);
        await prisma.$disconnect();
        return {
            notFound: true
        }
    }
}