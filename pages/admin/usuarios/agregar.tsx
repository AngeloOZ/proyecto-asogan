import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormUsuarios } from 'custom/components'



PageAdminUsuarios.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminUsuarios() {


    return (
        <>
            <Head>
                <title>Agregar Usuarios</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Usuarios"
                    links={[
                        { name: 'Lista de Usuarios', href: PATH_DASHBOARD.usuarios.root },
                        { name: 'Agregar Usuarios' },
                    ]}
                />

                <FormUsuarios />

            </Container>
        </>
    )
}