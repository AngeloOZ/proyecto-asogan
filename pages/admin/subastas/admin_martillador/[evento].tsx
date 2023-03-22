import Head from 'next/head'

import { GetServerSideProps } from 'next';
import { MainAdminMartillador, useLoteAdminMartillador } from 'custom/components'

const PageMonitor = ({ uuid }: { uuid: string }) => {

    const { loteActual, isLoading } = useLoteAdminMartillador(uuid);

    return (
        <>
            <Head>
                <title>Subasta Lote</title>
            </Head>

            {!isLoading && <MainAdminMartillador datos={loteActual} uuid={uuid} />}

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