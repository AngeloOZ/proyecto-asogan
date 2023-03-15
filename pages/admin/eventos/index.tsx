import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { TableCustom } from 'custom/components'
import { Button, Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { useRouter } from 'next/router'
import { eventos } from '@prisma/client'
import { useSnackbar } from 'notistack'
import { useEventos, useObtenerEventos } from 'custom/components/Eventos/Hooks';

PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminEventos() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { eventos, isLoading } = useObtenerEventos();
    const { eliminarEvento } = useEventos();

    const handleClickEditRow = (item: eventos) => {
        router.push(`${PATH_DASHBOARD.eventos.editar}/${item.id_evento}`);
    }

    const handleClickDeleteRow = (item: eventos) => {
        try {
            eliminarEvento(item);
            enqueueSnackbar('Evento eliminado correctamente', { variant: 'success' });
        }
        catch (err) {
            enqueueSnackbar("Oops... hubo un error " + err.message, { variant: 'error' });
        }
    }

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

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px", marginBottom: "10px" }}>
                    <Link href={PATH_DASHBOARD.eventos.agregar} passHref legacyBehavior>
                        <Button variant='contained'>Agregar evento</Button>
                    </Link>
                </div>

                <TableCustom
                    headers={[
                        { label: "ID", name: "id_evento", type: 'number', serchable: false },
                        { label: 'Descripcion', name: 'descripcion' },
                        { label: 'Fecha', name: 'fecha' },
                        { label: 'Lugar', name: 'lugar', },
                        { label: 'Tipo', name: 'tipo' },
                    ]}
                    isLoading={isLoading}
                    dataBody={eventos}
                    isActions={true}
                    handeEdit={handleClickEditRow}
                    handleDelete={handleClickDeleteRow}
                />
            </Container>
        </>
    )
}