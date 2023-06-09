import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from 'src/routes/paths';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { AuthContext } from 'src/auth';

// ----------------------------------------------------------------------

export default function Index() {
    const { rol: [rolLogged] } = useContext(AuthContext)
    const router = useRouter();

    useEffect(() => {
        const { id_evento } = router.query as { id_evento: string };
        if (id_evento && rolLogged?.length > 0) {
            switch (rolLogged) {
                case 'comprador':
                    router.push(`${PATH_DASHBOARD_CLEINTE.subastas}/otra/${id_evento}`);
                    break;
                default:
                    router.push(`${PATH_DASHBOARD.subastas.root}/martillador/${id_evento}`);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query, rolLogged]);

    return <LoadingScreen />;
}
