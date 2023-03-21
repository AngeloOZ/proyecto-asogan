import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Box } from '@mui/material'

import prisma from 'database/prismaClient'
import { imagenes } from '@prisma/client'

import { MainMonitor, useLoteMonitor } from 'custom/components'


const PageMonitor = ({ uuid, banners }: { uuid: string, banners: imagenes[] }) => {
    const { loteActual, isLoading } = useLoteMonitor(uuid);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>
            <Box component='main' width='100%' height='100vh'>
                {!isLoading && <MainMonitor datos={loteActual} banners={banners} />}
            </Box>
        </>
    )
}

export default PageMonitor

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let imagenes: imagenes[] = [];
    try {
        const img = await prisma.imagenes.findMany();
        imagenes = img;
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            uuid: ctx.query.evento,
            banners: imagenes
        }
    }
}