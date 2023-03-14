import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { TableCustom,useObtenerCompradores} from 'custom/components'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'



PageAdminCompradores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminCompradores() {

    const { compradores, isLoading } = useObtenerCompradores() ;


    return (<>
        <Head>
            Listado de Compradores
        </Head>
        <Container maxWidth={false}>
            <CustomBreadcrumbs
                heading="Listado de compradores"
                links={[
                    { name: 'Lista de Compradores', href: PATH_DASHBOARD.compradores.root },
                ]}
            />
            {
                isLoading && <p>Cargando...</p>
            }
            <TableCustom
                headers={[
                    { label: "ID", name: "id_comprador", type: 'number', serchable: false },
                    { label: '# Paleta', name: 'codigo_paleta' },
                    { label: 'Antecedentes Penales', name: 'antecedentes_penales', },
                    { label: 'Procesos Judiciales', name: 'procesos_judiciales' },
                    { label: 'Calificación Bancaria', name: 'calificacion_bancaria' },
                    { label: 'Estado', name: 'estado' },
                    { label: 'Usuario', name: 'usuarioid' }
                ]}
                isLoading={isLoading}
                dataBody={compradores}
                isActions={true}
            />

        </Container>



    </>)

}