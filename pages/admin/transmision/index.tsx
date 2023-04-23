import Head from "next/head";

import {Grid } from "@mui/material";

import DashboardLayout from "src/layouts/dashboard/DashboardLayout";
import {
  TransmisionSubasta,
  UsuariosConectados,
} from "custom/components/Transmision";

PageAdminTransmision.getLayout = (page: React.ReactElement) => (
  <DashboardLayout roles={["admin"]}>{page}</DashboardLayout>
);

export default function PageAdminTransmision() {
  return (
    <>
      <Head>
        <title>Transmisión</title>
      </Head>

      <Grid container spacing={1}>

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
