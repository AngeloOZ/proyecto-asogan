import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import prisma from 'database/prismaClient'
import { eventos } from '@prisma/client'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'

import { PATH_DASHBOARD } from 'src/routes/paths'
import moment from 'moment-timezone'
import Label from 'src/components/label/Label'

PageAdminEventos.getLayout = (page: React.ReactElement) => <DashboardLayout roles={['digitador']}>{page}</DashboardLayout>

export default function PageAdminEventos({ eventos }: { eventos: eventos[] }) {
    const router = useRouter();

    const EstadoLote = ({ estado }: { estado: number }) => {
        switch (estado) {
            case 1:
                return <Label color="info" variant="filled">
                    Cerrado
                </Label>
            case 2:
                return <Label color="success" variant="filled">
                    Abierto
                </Label>
            case 3:
                return <Label color="error" variant="filled">
                    Finalizado
                </Label>
            default:
                return null
        }
    }

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
                                    <EstadoLote estado={evento.abierto} />
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
    let today = new Date();

    today = moment(today, 'YYYY/MM/DD HH:mm').toDate();


    let eventos = await prisma.eventos.findMany({
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
            fecha: moment(evento.fecha).format('DD/MM/YYYY HH:mm'),
        };
    })

    return {
        props: {
            eventos: eventos2
        }
    }
}