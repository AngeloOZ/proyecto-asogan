import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormEventos } from 'custom/components'



PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminEventos() {


    return (
        <>
            <Head>
                <title>Agregar de eventos</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Eventos"
                    links={[
                        { name: 'Lista de eventos', href: PATH_DASHBOARD.eventos.root },
                        { name: 'Agregar evento' },
                    ]}
                />

                <FormEventos />

            </Container>
        </>
    )
}