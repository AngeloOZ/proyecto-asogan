import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Box } from '@mui/material'

import { MainMonitor, useLoteMonitor } from 'custom/components'


const PageMonitor = ({ uuid }: { uuid: string }) => {
    const { loteActual, isLoading } = useLoteMonitor(uuid);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>
            <Box component='main' width='100%' height='100vh'>
                {!isLoading && <MainMonitor datos={loteActual} />}
            </Box>
        </>
    )
}

export default PageMonitor

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx) => {

    return {
        props: {
            uuid: ctx.query.evento,
        }
    }
}