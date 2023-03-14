import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { TableCustom, useObtenerEventos } from 'custom/components'
import { Button, Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { useRouter } from 'next/router'
import { eventos } from '@prisma/client'

PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminEventos() {
    const router = useRouter();
    const { eventos, isLoading } = useObtenerEventos();

    const handleClickEditRow = (item: eventos) => {
        router.push(`${PATH_DASHBOARD.eventos.editar}/${item.id_evento}`);
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

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px" }}>
                    <Link href={PATH_DASHBOARD.eventos.agregar} passHref legacyBehavior>
                        <Button variant='contained'>Agregar evento</Button>
                    </Link>
                </div>

                <TableCustom
                    headers={[
                        { label: "ID", name: "id_evento", type: 'number', serchable: false },
                        { label: 'Fecha', name: 'fecha' },
                        { label: 'Lugar', name: 'lugar', },
                        { label: 'Tipo', name: 'tipo' },
                    ]}
                    isLoading={isLoading}
                    dataBody={eventos}
                    isActions={true}
                    handeEdit={handleClickEditRow}
                />
            </Container>
        </>
    )
}