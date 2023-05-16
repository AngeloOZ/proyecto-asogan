import Head from "next/head";

import {Grid } from "@mui/material";

import {
  TransmisionSubasta,
  UsuariosConectados,
} from "custom/components/Transmision";


export default function PageAdminTransmision() {
  return (
    <>
      <Head>
        <title>Transmisión</title>
      </Head>

      <Grid container spacing={1} padding="60px" >

        <Grid item xs={12} sm={5}>
          <UsuariosConectados />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TransmisionSubasta />
        </Grid>
      </Grid>
    </>
  );
}
