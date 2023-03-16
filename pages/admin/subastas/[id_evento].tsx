import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PATH_ADMIN, PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from 'src/routes/paths';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { AuthContext } from 'src/auth';

// ----------------------------------------------------------------------

export default function Index() {
    const { rol } = useContext(AuthContext)
    const router = useRouter();

    useEffect(() => {
        const { id_evento } = router.query as { id_evento: string };
        if (id_evento) {
            switch (rol[0]) {
                case 'comprador':
                    router.push(`${PATH_DASHBOARD_CLEINTE.subastas}/${id_evento}`);
                    break;
                default:
                    router.push(`${PATH_DASHBOARD.subastas.root}/martillador/${id_evento}`);
            }
        }
    }, [router.query]);

    return <LoadingScreen />;
}
