import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormProveedores, LinearProgressBar } from 'custom/components'
import { subastaAPI } from 'custom/api'
import { proveedores } from '@prisma/client'


PageAdmin.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdmin() {
    const { query } = useRouter();
    const [proveedorActual, setProveedorActual] = useState<proveedores>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query.id) {
            obtenerProducto();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    const obtenerProducto = async () => {
        try {
            const { data } = await subastaAPI.get(`/proveedores?id=${query.id}`);
            setProveedorActual(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) return <LinearProgressBar />


    return (

        <>
            <Head>
                <title>Editar de proveedor</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Proveedores"
                    links={[
                        { name: 'Lista de proveedores', href: PATH_DASHBOARD.proveedores.root },
                        { name: 'Editar proveedor' },
                    ]}
                />

                <FormProveedores esEditar proveedoraEditar={proveedorActual} />

            </Container>
        </>
    )
}