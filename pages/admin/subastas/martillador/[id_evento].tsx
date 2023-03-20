import { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { Card, Container, Grid } from '@mui/material'

import { lotes } from '@prisma/client'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { ChatPujas, LoteMartillador, VideoPlayer, useLotesSubasta, useSubastas } from 'custom/components'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {

    const router = useRouter()
    const [uuidEvento, setUuidEvento] = useState('');
    const [loteActual, setLoteActual] = useState<lotes>()
    const { evento } = useSubastas(uuidEvento);
    const { lotes } = useLotesSubasta(evento?.id_evento || -1);


    useEffect(() => {
        const { id_evento } = router.query as { id_evento: string };
        if (id_evento) {
            setUuidEvento(id_evento);
        }
    }, [router.query]);

    return (
        <>
            <Head>
                <title>Subasta Lote #{loteActual?.codigo_lote || ''}</title>
            </Head>
            <Container maxWidth={false}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoteMartillador loteActual={loteActual} setLoteActual={setLoteActual} listadoLotes={lotes} />
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                        <Card sx={{ padding: 2, height: 420 }}>
                            <VideoPlayer
                                playerProps={{
                                    url: evento?.url_video || '',
                                    height: '100%',
                                }}

                                minHeight={200}
                            />
                        </Card>
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