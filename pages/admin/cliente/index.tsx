import { Container } from '@mui/system'
import Head from 'next/head'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { EventoList } from "custom/components/Eventos";
import { useObtenerEventosHoy } from 'custom/components/Eventos/Hooks';


PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['comprador']}>{page}</DashboardLayout>


export default function PageAdminEventos() {
    const { eventos, isLoading } = useObtenerEventosHoy();
 
    return (
        <>
            <Head>
                <title>Listado de eventos</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Listado de Subastas de Hoy"
                    links={[
                        { name: 'Subastas', href: PATH_DASHBOARD.eventos.listado },
                    ]}
                />
                <EventoList eventos={eventos} isLoading={isLoading} />
            </Container>
        </>
    )
}