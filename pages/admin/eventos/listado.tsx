import { Container } from '@mui/system'
import Head from 'next/head'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { EventoList } from "custom/components/Eventos";
import { useObtenerEventosHoy } from 'custom/components/Eventos/Hooks';

PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export interface LotesEventos {
    id_evento: number;
    descripcion: string;
    fecha: string;
    lugar: string;
    tipo: string;
    abierto: boolean;
    lotes: Lote[];
}

export interface Lote {
    id_lote: number;
    id_evento: number;
    id_proveedor: number;
    id_comprador: null;
    paleta_comprador: null;
    fecha_pesaje: string;
    codigo_lote: string;
    cantidad_animales: number;
    tipo_animales: string;
    calidad_animales: string;
    peso_total: string;
    sexo: string;
    crias_hembras: number;
    crias_machos: number;
    procedencia: string;
    observaciones: string;
    puja_inicial: string;
    puja_final: string;
    incremento: string;
    subastado: number;
}

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