import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'

import { FormNotificaciones } from 'custom/components'



PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    
    return (
        <>
            <Head>
                <title>Notificacion</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Enviar Notificacion"
                    links={[
                        { name: 'Notificacion' },
                    ]}
                />

                <FormNotificaciones />

            </Container>
        </>
    )
}