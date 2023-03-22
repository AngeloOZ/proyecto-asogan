import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { MainMartillador, useLoteMartillador } from 'custom/components'

const PageMonitor = ({ uuid }: { uuid: string }) => {

    const { loteActual, isLoading } = useLoteMartillador(uuid);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            {!isLoading && <MainMartillador datos={loteActual} />}

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