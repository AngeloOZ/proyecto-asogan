import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import prisma from 'database/prismaClient'
import { eventos } from '@prisma/client'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'

import { PATH_DASHBOARD } from 'src/routes/paths'
import moment from 'moment-timezone'
import { EstadoLote } from 'custom/components'

PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['digitador']}>{page}</DashboardLayout>

export default function PageAdminEventos({ eventos }: { eventos: eventos[] }) {

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
                <Box
                    component='div'
                    display='grid'
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    }}
                    gap={3}
                >
                    {eventos.map((evento) => (
                        <Card key={evento.id_evento} sx={{ p: 2 }}>
                            <Stack spacing={1.5}>
                                <Box component='div'>
                                    <Typography component='span' variant='subtitle1'>Evento: </Typography>
                                    <Typography component='span'>{evento.descripcion}</Typography>
                                </Box>
                                <Box component='div'>
                                    <Typography component='span' variant='subtitle1'>Fecha: </Typography>
                                    <Typography component='span'>{evento.fecha as unknown as string}</Typography>
                                </Box>
                                <Box component='div'>
                                    <Typography component='span' variant='subtitle1'>Estado: </Typography>
                                    <EstadoLote estado={evento.abierto!} />
                                </Box>
                                <Box component='div' display='flex' justifyContent='flex-end'>
                                    <Link href={`${PATH_DASHBOARD.lotes.agregar}/${evento.id_evento}`} passHref legacyBehavior>
                                        <Button variant='contained' color='primary'>agregar lotes</Button>
                                    </Link>
                                </Box>
                            </Stack>
                        </Card>
                    ))}
                </Box>
            </Container>
        </>
    )
}




export const getServerSideProps: GetServerSideProps = async (ctx) => {
    moment.locale('es');
    const eventos = await prisma.eventos.findMany({
        where: {
            abierto: {
                lte: 2
            }
        }
    });

    const eventos2 = eventos.map((evento) => {
        evento.fecha = moment(evento.fecha, 'DD/MM/YYYY HH:mm').toDate();
        return {
            ...evento,
            fecha: moment(evento.fecha).format('LLLL'),
        };
    })

    return {
        props: {
            eventos: eventos2
        }
    }
}