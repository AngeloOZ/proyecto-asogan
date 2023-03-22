import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { Button, Card, Container } from '@mui/material'
import prisma from 'database/prismaClient'
import { eventos } from '@prisma/client'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'

import { PATH_DASHBOARD } from 'src/routes/paths'

PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['digitador']}>{page}</DashboardLayout>

export default function PageAdminEventos() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Listado de eventos </title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Listado de eventos"
                    links={[
                        { name: 'Lista de eventos', href: PATH_DASHBOARD.eventos.root },
                    ]}
                />
                <Card>
                    sdfsdvsd
                </Card>
            </Container>
        </>
    )
}




export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const today = new Date();
    const eventos = await prisma.eventos.findMany({
        where: {
            fecha: {
                gt: today
            },
            abierto: {
                lte: 2
            }
        }
    });

    return {
        props: {
            eventos
        }
    }
}