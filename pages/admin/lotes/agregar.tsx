import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormLotes } from 'custom/components'



PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['admin']}>{page}</DashboardLayout>

export default function PageAdminProveedores() {


    return (
        <>
            <Head>
                <title>Agregar de lotes</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Lotes"
                    links={[
                        { name: 'Lista de lotes', href: PATH_DASHBOARD.lotes.root },
                        { name: 'Agregar lote' },
                    ]}
                />

                <FormLotes />

            </Container>
        </>
    )
}