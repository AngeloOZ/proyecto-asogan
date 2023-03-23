import { GetServerSideProps } from 'next'
import Head from 'next/head'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormLotes } from 'custom/components'

import prisma from 'database/prismaClient'



PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['admin', 'digitador']}>{page}</DashboardLayout>

type Props = {
    evento: {
        id_evento: number;
        descripcion: string;
        uuid: string;
    }
}

export default function PageAdminProveedores({ evento }: Props) {

    return (
        <>
            <Head>
                <title>Agregar de lotes</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Lotes"
                    links={[
                        { name: 'Lista de lotes', href: PATH_DASHBOARD.lotes.root },
                        { name: 'Agregar lote' },
                    ]}
                />

                <FormLotes evento={evento} />

            </Container>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { id_evento } = ctx.params as { id_evento: string };

    const evento = await prisma.eventos.findUnique({
        where: { id_evento: Number(id_evento) },
        select: { id_evento: true, descripcion: true, uuid: true }
    });

    if (!evento) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            evento
        }
    }
}