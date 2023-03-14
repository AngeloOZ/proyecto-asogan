import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { LoteItem, useObtenerLotes } from 'custom/components'
import { Container } from '@mui/material'


PageAdminCategorias.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminCategorias() {
    const { lotes, isLoading } = useObtenerLotes();

    return (
        <>
            <Head>
                <title>Listado de Lotes</title>
            </Head>
            <Container maxWidth={false}>
              
            </Container>
        </>
    )
}