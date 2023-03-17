import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button, Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { TableCustom, useObtenerProveedores } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { proveedores as IProveedor } from '@prisma/client'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const router = useRouter();
    const { proveedores, isLoading } = useObtenerProveedores();

    const handleClickEditRow = (item: IProveedor) => {
        router.push(`${PATH_DASHBOARD.proveedores.editar}/${item.id_proveedor}`);
    }

    return (
        <>
            <Head>
                <title>Listado de proveedores</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Proveedores"
                    links={[
                        { name: 'Lista de proveedores', href: PATH_DASHBOARD.proveedores.root },
                    ]}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px" }}>
                    <Link href={PATH_DASHBOARD.proveedores.agregar} passHref legacyBehavior>
                        <Button variant='contained'>Agregar proveedor</Button>
                    </Link>
                </div>
                <TableCustom
                    headers={[
                        { label: "ID", name: "id_proveedor", type: 'number', serchable: false },
                        { label: 'Identificacion', name: 'identificacion' },
                        { label: 'Nombres', name: 'nombres', },
                        { label: 'WhatsApp', name: 'telefono' },
                        { label: 'Correo', name: 'correo' },
                        { label: 'Dirección', name: 'direccion', },
                    ]}
                    isLoading={isLoading}
                    dataBody={proveedores}
                    isActions
                    handeEdit={handleClickEditRow}
                />
            </Container>
        </>
    )
}