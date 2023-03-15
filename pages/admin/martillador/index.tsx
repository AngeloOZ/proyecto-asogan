import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button, Container, Grid } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { ChatPujas, LoteMartillador, TableCustom, VideoPlayer, useObtenerLotes } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { lotes as ILote } from '@prisma/client'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const [loteActual, setLoteActual] = useState<ILote>()



    return (
        <>
            <Head>
                <title>Subasta FFFFFFF</title>
            </Head>
            <Container maxWidth={false}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <LoteMartillador setLoteActualRoot={setLoteActual} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <VideoPlayer minHeight={200} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {
                            loteActual && <ChatPujas lote={loteActual} />
                        }
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}