import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button, Container, Grid } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { ChatPujas, LoteCliente, LoteMartillador, VideoPlayer, useLotesSubasta, useObtenerLotes, useSubastas } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { lotes as ILote, eventos, lotes } from '@prisma/client'
import { Box } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/auth'

import useSWR from "swr";
import { subastaAPI } from 'custom/api'
const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const router = useRouter()

    const [uuidEvento, setUuidEvento] = useState('');
    const { evento } = useSubastas(uuidEvento);

    const { data: loteActual } = useSWR(`/subastas/lotes?id=${evento?.id_evento}`, fetcher, { refreshInterval: 1500 }) as { data: lotes };

    useEffect(() => {

        const { id_evento } = router.query as { id_evento: string };
        if (id_evento) {
            setUuidEvento(id_evento);
        }

    }, [router.query]);

    return (
        <>
            <Head>
                <title>Subasta Lote #{loteActual?.codigo_lote}</title>
            </Head>
            <Container maxWidth={false}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoteCliente loteActual={loteActual} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <VideoPlayer minHeight={200} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {
                            loteActual && <ChatPujas evento={evento} lote={loteActual} />
                        }
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}