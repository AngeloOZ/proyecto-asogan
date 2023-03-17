import Head from 'next/head'
import { useRouter } from 'next/router'

import { Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { TableCustom, useObtenerLotesComprados } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { lotes as ILote } from '@prisma/client'
import { useContext } from 'react'
import { AuthContext } from 'src/auth'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const router = useRouter();
    const { user } = useContext(AuthContext)
    const { lotes, isLoading } = useObtenerLotesComprados(user?.comprador?.id_comprador!);

    const handleClickEditRow = (item: ILote) => {
        router.push(`${PATH_DASHBOARD.lotes.ver}/${item.id_lote}`);
    }

    return (
        <>
            <Head>
                <title>Listado de lotes comprados</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Lotes Comprados"
                    links={[
                        { name: 'Lista de lotes', href: PATH_DASHBOARD.lotes.root },
                    ]}
                />
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