import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { MainMartillador, useLoteMonitor2, useUltimaPuja } from 'custom/components'
import { eventos } from '@prisma/client';
import prisma from 'database/prismaClient'
import { PATH_DASHBOARD_CLEINTE } from 'src/routes/paths'
import moment from 'moment-timezone'

type Props = {
    uuid: string;
    evento: eventos;
}

export const PageMartillador = ({ uuid, evento }: Props) => {

    const { loteActual, isLoading } = useLoteMonitor2(evento.id_evento);
    const { ultimaPuja } = useUltimaPuja(loteActual?.id_lote || 0);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            {!isLoading && <MainMartillador lote={loteActual} ultimaPuja={ultimaPuja} evento={evento} />}

        </>
    )
}

export default PageMartillador

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