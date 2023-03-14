import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { TableCustom, useObtenerEventos } from 'custom/components'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'


PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminEventos() {

    const { eventos, isLoading } = useObtenerEventos();

    return (
        <>
            <Head>
                <title>Listado de eventos</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Listado de eventos"
                    links={[
                        { name: 'Lista de eventos', href: PATH_DASHBOARD.eventos.root },
                    ]}
                />
                {
                    isLoading && <p>Cargando...</p>
                }
                <TableCustom
                    headers={[
                        { label: "ID", name: "id_vento", type: 'number', serchable: false },
                        { label: 'Fecha', name: 'fecha' },
                        { label: 'Lugar', name: 'lugar', },
                        { label: 'Tipo', name: 'tipo' },
                    ]}
                    isLoading={isLoading}
                    dataBody={eventos}
                    isActions={true}
                />
            </Container>
        </>
    )
}