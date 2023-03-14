import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { TableCustom, useObtenerProveedores } from 'custom/components'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {

    const { proveedores, isLoading } = useObtenerProveedores();

    return (
        <>
            <Head>
                <title>Listado de proveedores</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Listado de proveedores"
                    links={[
                        { name: 'Lista de proveedores', href: PATH_DASHBOARD.proveedores.root },
                    ]}
                />
                {
                    isLoading && <p>Cargando...</p>
                }
                <TableCustom
                    headers={[
                        { label: "ID", name: "id_proveedor", type: 'number', serchable: false },
                        { label: 'Identificacion', name: 'identificacion' },
                        { label: 'Nombres', name: 'nombres', },
                        { label: 'WhatsApp', name: 'telefono' },
                    ]}
                    isLoading={isLoading}
                    dataBody={proveedores}
                    isActions={true}
                />
            </Container>
        </>
    )
}