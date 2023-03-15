import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormCompradores } from 'custom/components'



PageAdminCompradores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminCompradores() {


    return (
        <>
            <Head>
                <title>Agregar de Compradores</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Compradores"
                    links={[
                        { name: 'Lista de Compradores', href: PATH_DASHBOARD.compradores.root },
                        { name: 'Agregar Comprador' },
                    ]}
                />

              <FormCompradores/> 

            </Container>
        </>
    )
}