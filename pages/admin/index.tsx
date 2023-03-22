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
    if (router.pathname === PATH_ADMIN && rol.length > 0) {
      switch (rol[0]) {
        case 'admin':
          router.push(PATH_DASHBOARD.eventos.root);
          break;
        case 'martillador':
          router.push(PATH_DASHBOARD.subastas.root);
          break;
        case 'comprador':
          router.push(PATH_DASHBOARD_CLEINTE.root);
          break;
        default:
          router.push(PATH_DASHBOARD.eventos.root);
      }
    }
  });

  return <LoadingScreen />;
}
