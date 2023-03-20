import Head from 'next/head'
import { useRouter } from 'next/router'

import { Container, Grid, Typography } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { ChatPujas, LoteMartillador, TabVideos, useSubastas } from 'custom/components'
import { lotes } from '@prisma/client'
import { useContext, useEffect, useState } from 'react'

import useSWR from "swr";

import { subastaAPI } from 'custom/api'
import { AuthContext } from 'src/auth'

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const router = useRouter()
    const { user } = useContext(AuthContext)
    const [uuidEvento, setUuidEvento] = useState('');
    const { evento } = useSubastas(uuidEvento);

    const { data: loteActual } = useSWR(`/subastas/lotes?id=${evento?.id_evento}`, fetcher, { refreshInterval: 1500 }) as { data: lotes };

    useEffect(() => {
        const { id_evento } = router.query as { id_evento: string };
        if (id_evento) {
            setUuidEvento(id_evento);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    return (
        <>
            <Head>
                <title>Subasta Lote #{loteActual?.codigo_lote}</title>
            </Head>
            <Container maxWidth={false}>
                <Typography component='h1' variant='h4' mb={2}>Su número de paleta es: #{user?.comprador?.codigo_paleta || 0}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoteMartillador loteActual={loteActual} />
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                        <TabVideos
                            minHeight={200}
                            height={420}
                            urlVideoDemostracion={loteActual?.url_video || ''}
                            urlTransmisionEnVivo={evento?.url_video || ''}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                        {
                            loteActual && <ChatPujas evento={evento} lote={loteActual} />
                        }
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}