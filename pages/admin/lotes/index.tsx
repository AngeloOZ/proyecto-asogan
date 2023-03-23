import Head from 'next/head'
import { useRouter } from 'next/router'

import { Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { TableCustom, useObtenerLotes } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { lotes as ILote } from '@prisma/client'
import { useSnackbar } from 'notistack'
import { useLotes } from 'custom/components/Lotes/hooks';

PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['admin','digitador']}>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const router = useRouter();
    const { lotes, isLoading } = useObtenerLotes();
    const { enqueueSnackbar } = useSnackbar();
    const { eliminarLote } = useLotes();

    const handleClickEditRow = (item: ILote) => {
        router.push(`${PATH_DASHBOARD.lotes.editar}/${item.id_lote}`);
    }
    const handleClickDeleteRow = (item: ILote) => {
        try {
            eliminarLote(item);
            enqueueSnackbar('Lote eliminado correctamente', { variant: 'success' });
        }
        catch (err) {
            enqueueSnackbar(`Oops... hubo un error ${err.message}`, { variant: 'error' });
        }
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
                    buttonsActions={{
                        edit: true,
                        delete: true,
                    }}
                    handeEdit={handleClickEditRow}
                    handleDelete={handleClickDeleteRow}

                />
            </Container>
        </>
    )
}