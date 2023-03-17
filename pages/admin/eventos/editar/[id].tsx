import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormEventos, LinearProgressBar } from 'custom/components'
import { subastaAPI } from 'custom/api'
import { eventos } from '@prisma/client'


PageAdmin.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdmin() {
    const { query } = useRouter();
    const [eventoActual, eventodorActual] = useState<eventos>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query.id) {
            obtenerEvento();
        }
        // eslint-disable-next-line
    }, [query])

    const obtenerEvento = async () => {
        try {
            const { data } = await subastaAPI.get(`/eventos?id=${query.id}`);
            eventodorActual(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) return <LinearProgressBar />

    return (
        <>
            <Head>
                <title>Editar evento</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Eventos"
                    links={[
                        { name: 'Lista de eventos', href: PATH_DASHBOARD.eventos.root },
                        { name: 'Editar evento' },
                    ]}
                />

                <FormEventos esEditar eventoEditar={eventoActual} />

            </Container>
        </>
    )
}