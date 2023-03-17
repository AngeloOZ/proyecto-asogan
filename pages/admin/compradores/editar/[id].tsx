import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormCompradores, LinearProgressBar } from 'custom/components'
import { subastaAPI } from 'custom/api'
import { compradores } from '@prisma/client'
import { ICompradores } from 'interfaces'


PageAdmin.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdmin() {
    const { query } = useRouter();
    const [compradorActual, setCompradorActual] = useState<compradores>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query.id) {
            obtenerCompradores();
        }
    // eslint-disable-next-line
    }, [query])

    const obtenerCompradores= async () => {
        try {
            const { data } = await subastaAPI.get(`/compradores?id=${query.id}`);
            setCompradorActual(data);
         
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) return <LinearProgressBar />


    return (

        <>
            <Head>
                <title>Editar de Comprador</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Compradores"
                    links={[
                        { name: 'Lista de Compradores', href: PATH_DASHBOARD.compradores.root },
                        { name: 'Editar comprador' },
                    ]}
                />

                <FormCompradores esEditar compradorEditar={compradorActual as unknown as ICompradores} />

            </Container>
        </>
    )
}