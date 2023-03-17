import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button, Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { TableCustom, useObtenerLotes } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { lotes as ILote } from '@prisma/client'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const router = useRouter();
    const { lotes, isLoading } = useObtenerLotes();

    const handleClickEditRow = (item: ILote) => {
        router.push(`${PATH_DASHBOARD.lotes.editar}/${item.id_lote}`);
    }

    return (
        <>
            <Head>
                <title>Listado de lotes</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Lotes"
                    links={[
                        { name: 'Lista de lotes', href: PATH_DASHBOARD.lotes.root },
                    ]}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px", marginBottom: 10 }}>
                    <Link href={PATH_DASHBOARD.lotes.agregar} passHref legacyBehavior>
                        <Button variant='contained'>Agregar proveedor</Button>
                    </Link>
                </div>
                <TableCustom
                    headers={[
                        { label: "ID", name: "id_lote", type: 'number', serchable: false },
                        { label: 'Código de Lote', name: 'codigo_lote' },
                        { label: 'Cantidad de animales', name: 'cantidad_animales', },
                        { label: 'Tipo animales', name: 'tipo_animales' },
                        { label: 'Calidad de animales', name: 'calidad_animales' },
                        { label: 'Peso total', name: 'peso_total' },
                        { label: 'Procedencia', name: 'procedencia' },
                    ]}
                    isLoading={isLoading}
                    dataBody={lotes}
                    isActions
                    handeEdit={handleClickEditRow}

                />
            </Container>
        </>
    )
}