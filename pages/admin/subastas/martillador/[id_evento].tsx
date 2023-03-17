import { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { Container, Grid } from '@mui/material'

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
                <title>Subasta Lote #123</title>
            </Head>
            <Container maxWidth={false}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoteMartillador loteActual={loteActual} setLoteActual={setLoteActual} listadoLotes={lotes} />
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