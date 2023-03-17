import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'

import { FormCambiarClave, LinearProgressBar } from 'custom/components'
import { subastaAPI } from 'custom/api'
import { usuario } from '@prisma/client'



PageAdminCambiar.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminCambiar() {
    const { query } = useRouter();
    const [usuarioActual, setUsuarioActual] = useState<usuario>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query.id) {
            obtenerUsuario();
        }
    // eslint-disable-next-line
    }, [query])

    const obtenerUsuario= async () => {
        try {
            const { data } = await subastaAPI.get(`/user?id=${query.id}`);
            setUsuarioActual(data);
         
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) return <LinearProgressBar />


    return (

        <>
            <Head>
                <title>Editar Clave de Usuario</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Usuarios"
                    links={[
                       
                        { name: 'Editar Clave Usuario' },
                    ]}
                />

                <FormCambiarClave  usuariosEditar={usuarioActual} />

            </Container>
        </>
    )
}