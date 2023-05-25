import Head from "next/head";

import {Grid } from "@mui/material";

import {
  TransmisionSubasta,
} from "custom/components/Transmision";


export default function PageAdminTransmision() {
  return (
    <>
      <Head>
        <title>Transmisión</title>
      </Head>

      <Grid container spacing={1} padding="15px" >

       
        <Grid item xs={12}>
          <TransmisionSubasta />
        </Grid>
      </Grid>
    </>
  );
}