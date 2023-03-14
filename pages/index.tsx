import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DEFAULT_VENDEDOR } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      router.push('/login');
    }
  });

  return <Head><title>Subastas Asogan</title></Head>;
}
