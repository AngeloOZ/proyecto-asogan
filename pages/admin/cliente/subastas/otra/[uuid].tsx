import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { VistaLoteCliente, useLoteMonitor2, useUltimaPuja } from 'custom/components'
import { eventos, imagenes, lotes } from '@prisma/client'

import { GetServerSideProps } from 'next'
import prisma from 'database/prismaClient'
import moment from 'moment-timezone'

import LoadingScreen from 'src/components/loading-screen/LoadingScreen'
import socket from 'utils/sockets'
import { useEffect, useState, useContext } from 'react';
import { subastaAPI } from 'custom/api';
import { AuthContext } from "src/auth";
import { CambiarConectados } from 'custom/components/Transmision'

PageSubastaCliente.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

type Props = {
    evento: eventos;
    banners: imagenes[];
}

export default function PageSubastaCliente({ evento, banners }: Props) {

    const { loteActual, isLoading } = useLoteMonitor2(evento.id_evento);

    const { ultimaPuja } = useUltimaPuja(loteActual?.id_lote || 0);
    const { user } = useContext(AuthContext);
    const procesoEnCurso = true;
    useEffect(() => {

        try {
            const validarConectado = async () => {
                if (loteActual){

                    await subastaAPI.put(`/compradores/conectados?usuarioid=${user?.usuarioid}&conectado=1`);
                }
            }
            validarConectado()
        } catch (error) {
            console.log(error)
        }

        const handleBeforeUnload = async (event:any) => {
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
        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleUnload);
        };
    }, [procesoEnCurso,user?.usuarioid,loteActual])


    // useEffect(() => {
    //     socket.on('activarLote', (lote: lotes) => {
    //         console.log(lote);

    //         setLoteActual(lote)
    //     });

    //     return () => {
    //         socket.off('activarLote');
    //     };
    // }, [])

    // useEffect(() => {
    //     socket.emit('obtenerLoteActivo', evento.id_evento);

    //     return () => {
    //         socket.off('obtenerLoteActivo');
    //     };
    // }, [])


    /*   if (!isLoading) return <LoadingScreen /> */

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