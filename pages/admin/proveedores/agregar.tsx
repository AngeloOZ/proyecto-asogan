import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormProveedores } from 'custom/components'



PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['admin']}>{page}</DashboardLayout>

export default function PageAdminProveedores() {


    return (
        <>
            <Head>
                <title>Agregar de proveedores</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Proveedores"
                    links={[
                        { name: 'Lista de proveedores', href: PATH_DASHBOARD.proveedores.root },
                        { name: 'Agregar proveedor' },
                    ]}
                />

                <FormProveedores />

            </Container>
        </>
    )
}