import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

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
