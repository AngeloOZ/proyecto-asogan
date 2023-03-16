import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Button, Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import { TableCustom, useObtenerUsuarios, useUsuario } from 'custom/components'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { usuario as IUsuario } from '@prisma/client'
import { useSnackbar } from '../../../src/components/snackbar';

PageAdminUsuarios.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
export default function PageAdminUsuarios() {

    const router = useRouter();
    const { usuario, isLoading } = useObtenerUsuarios();
    const { eliminarUsuario } = useUsuario();
    const { enqueueSnackbar } = useSnackbar();


    const handleClickEditRow = (item: IUsuario) => {
        router.push(`${PATH_DASHBOARD.usuarios.editar}/${item.usuarioid}`);
    }

    const handleClickDeleteRow = async (item: IUsuario) => {
        try {

            await eliminarUsuario(item.usuarioid)
            enqueueSnackbar('Usuario eliminado correctamente', { variant: 'success' });
            router.push(PATH_DASHBOARD.usuarios.root);

        } catch (error) {
            enqueueSnackbar("Oops... hubo un error " + error.message, { variant: 'error' });
        }
    }

    return (<>

        <Head>
            Listado de Usuarios
        </Head>
        <Container maxWidth={false}>
            <CustomBreadcrumbs
                heading="Listado de Usuarios"
                links={[
                    { name: 'Lista de Usuarios', href: PATH_DASHBOARD.usuarios.root },
                ]}
            />
            {
                isLoading && <p>Cargando...</p>
            }
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px" }}>
                <Link href={PATH_DASHBOARD.usuarios.agregar} passHref legacyBehavior>
                    <Button variant='contained'>Agregar Usuario</Button>
                </Link>
            </div>
            <TableCustom
                headers={[
                    { label: "ID", name: "usuarioid", type: 'number', serchable: false },
                    { label: 'Identificacion', name: 'identificacion' },
                    { label: 'Nombres', name: 'nombres' },
                    { label: 'Rol', name: 'rol', align: 'center' },
                ]}
                isLoading={isLoading}
                dataBody={usuario}
                isActions={true}
                handeEdit={handleClickEditRow}
                handleDelete={handleClickDeleteRow}
            />

        </Container>


    </>



    )

}