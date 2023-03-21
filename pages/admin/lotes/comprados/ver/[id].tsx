import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'

import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormLotes, LinearProgressBar } from 'custom/components'
import { subastaAPI } from 'custom/api'
import { lotes } from '@prisma/client'
import { LoteEditar } from '@types'


PageAdmin.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdmin() {
    const { query } = useRouter();
    const [loteActual, setLoteActual] = useState<lotes>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query.id) {
            obtenerLotes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    const obtenerLotes = async () => {
        try {
            const { data } = await subastaAPI.get(`/lotes?id=${query.id}`);
            setLoteActual(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) return <LinearProgressBar />


    return (

        <>
            <Head>
                <title>Lotes Comprados</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Lotes"
                    links={[
                        { name: 'Lista de lotes comprados', href: PATH_DASHBOARD.lotes.comprados },
                        { name: 'Ver lote' },
                    ]}
                />

                <FormLotes esEditar loteEditar={loteActual as unknown as LoteEditar} soloVer />

            </Container>
        </>
    )
}