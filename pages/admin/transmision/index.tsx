import { GetServerSideProps } from "next";
import Link from "next/link";
import Head from "next/head";

import prisma from "database/prismaClient";

import { Box, Button, Typography, Stack } from '@mui/material';

import { useSnackbar } from "../../../src/components/snackbar";
import { LinearProgressBar } from '../../../custom/components';
import { TransmisionSubasta } from "custom/components";
import { PATH_DASHBOARD } from "src/routes/paths";


interface Props {
  eventos: {
    descripcion: string;
    uuid: string;
  }[];
  error: string;
}

export default function PageAdminTransmision({ eventos, error }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  if (error !== "") {
    enqueueSnackbar(error, { variant: "error" })
  }

  return (
    <>
      <Head>
        <title>Transmisión</title>
      </Head>
      <Box padding={3}>
        <Typography textAlign="center" variant="h3" component="h1" marginBottom={2} >
          Transmisión en vivo: {eventos[0]?.descripcion}
        </Typography>
        {
          error === "" ?
            <TransmisionSubasta {...eventos[0]} />
            : (
              <>
                <LinearProgressBar />
                <Stack>
                  <Link href={PATH_DASHBOARD.eventos.root} passHref legacyBehavior>
                    <Button variant="contained" style={{ margin: 'auto' }}>Ir a eventos</Button>
                  </Link>
                </Stack>
              </>
            )
        }
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const eventos = await prisma.eventos.findMany({
    where: {
      abierto: 2
    },
    select: {
      descripcion: true,
      uuid: true,
    }
  });

  let error = "";

  if (eventos.length === 0) {
    error = "No se encontraron eventos abiertos";
  }

  if (eventos.length > 1) {
    error = "Hay mas de un evento abierto";
  }

  return {
    props: {
      eventos,
      error
    }
  }
}