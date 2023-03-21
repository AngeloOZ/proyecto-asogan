import Head from 'next/head'
import Link from 'next/link'

import { Button, Container } from '@mui/material'

import DashboardLayout from 'src/layouts/dashboard/DashboardLayout'
import { PATH_DASHBOARD } from 'src/routes/paths'

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs'
import { ImagenList, useObtenerImagenes } from 'custom/components/Imagenes'


PageAdminProveedores.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function PageAdminProveedores() {
    const { imagenes, isLoading } = useObtenerImagenes();

    return (
        <>
            <Head>
                <title>Listado de Imagenes</title>
            </Head>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Imagenes"
                    links={[
                        { name: 'Lista de imagenes', href: PATH_DASHBOARD.banner.root },
                    ]}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-25px", marginBottom: "10px" }}>
                    <Link href={PATH_DASHBOARD.banner.agregar} passHref legacyBehavior>
                        <Button variant='contained'>Agregar imagen</Button>
                    </Link>
                </div>
                <ImagenList imagenes={imagenes} isLoading={isLoading} />
            </Container>
        </>
    )
}