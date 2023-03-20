import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormImagenes } from 'custom/components'



PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {


    return (
        <>
            <Head>
                <title>Agregar Imagen</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Proveedores"
                    links={[
                        { name: 'Lista de Imagenes', href: PATH_DASHBOARD.banner.root },
                        { name: 'Agregar Imagen' },
                    ]}
                />

                <FormImagenes />

            </Container>
        </>
    )
}