import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { eventos, imagenes } from '@prisma/client'
import prisma from 'database/prismaClient'
import moment from 'moment-timezone'
import { useEffect, useContext} from 'react';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { useObtenerLoteActivo, useObtenerUltimaPuja } from 'custom/hooks'
import { VistaLoteCliente } from 'custom/components'
import { subastaAPI } from 'custom/api';
import { AuthContext } from "src/auth";



PageSubastaCliente.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

type Props = {
    evento: eventos;
    banners: imagenes[];
}

export default function PageSubastaCliente({ evento, banners }: Props) {

    const { loteActual } = useObtenerLoteActivo(evento.id_evento);
    const { ultimaPuja } = useObtenerUltimaPuja(loteActual);
    const { user } = useContext(AuthContext);
    const procesoEnCurso = true;
    useEffect(() => {

    /*     try {
            const validarConectado = async () => {
                if (loteActual){

                    await subastaAPI.put(`/compradores/conectados?usuarioid=${user?.usuarioid}&conectado=1`);
                }
            }
            validarConectado()
        } catch (error) {
            console.log(error)
        } */

   /*      const handleBeforeUnload = async (event:any) => {
            if (procesoEnCurso) {
                event.preventDefault();
                await fetch(
                    `/api/compradores/conectados?usuarioid=${user?.usuarioid}&conectado=0`,
                    { keepalive: true, method: "PUT" }
                );
            }
        };

        const handleUnload = async () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleUnload); */

       /*  return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleUnload);
        }; */
    }, [procesoEnCurso,user?.usuarioid,loteActual])

    return (
        <>
       
            <Head>
                <title>Subasta Lote #{loteActual?.codigo_lote || 'SN'}</title>
            </Head>
            <VistaLoteCliente lote={loteActual} ultimaPuja={ultimaPuja} banners={banners} evento={evento} />

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