import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button, Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { TableCustom, useObtenerCompradores, useCompradores } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { compradores as IComprador } from '@prisma/client'
import { useSnackbar } from '../../../src/components/snackbar';




PageAdminCompradores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminCompradores() {

    const router = useRouter();
    const { compradores, isLoading } = useObtenerCompradores();
    const { eliminarComprador } = useCompradores();
    const { enqueueSnackbar } = useSnackbar();

    const handleClickEditRow = (item: IComprador) => {
        router.push(`${PATH_DASHBOARD.compradores.editar}/${item.id_comprador}`);
    }

    const handleClickDeleteRow = async (item: IComprador) => {
        try {
          
            await eliminarComprador(item.id_comprador)
            enqueueSnackbar('Comprador eliminado correctamente', { variant: 'success' });
            router.push(PATH_DASHBOARD.compradores.root);

        } catch (error) {
             enqueueSnackbar("Oops... hubo un error " + error.message, { variant: 'error' });
        }
    }
    return (<>
        <Head>
            Listado de Compradores
        </Head>
        <Container maxWidth={false}>
            <CustomBreadcrumbs
                heading="Listado de Compradores"
                links={[
                    { name: 'Lista de Compradores', href: PATH_DASHBOARD.compradores.root },
                ]}
            />
            {
                isLoading && <p>Cargando...</p>
            }
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px" }}>
                <Link href={PATH_DASHBOARD.compradores.agregar} passHref legacyBehavior>
                    <Button variant='contained'>Agregar Comprador</Button>
                </Link>
            </div>
            <TableCustom
                headers={[
                    { label: "ID", name: "id_comprador", type: 'number', serchable: false },
                    { label: 'Identificacion', name: 'identificacion'},
                    { label: 'Nombres', name: 'nombres' },
                    { label: '#Paleta', name: 'codigo_paleta' },
                    { label: 'Antecedentes Penales', name: 'antecedentes_penales', align: 'center' },
                    { label: 'Estado', name: 'estado' },

                ]}
                isLoading={isLoading}
                dataBody={compradores}
                isActions={true}
                handeEdit={handleClickEditRow}
                handleDelete={handleClickDeleteRow}
            />

        </Container>



    </>)

}