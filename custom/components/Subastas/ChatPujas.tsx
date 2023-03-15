import { Box, BoxProps, Card, Grid, Stack, Typography } from "@mui/material"
import { lotes, pujas } from "@prisma/client";
import { subastaAPI } from "custom/api";

import useSWR from "swr";

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


interface ChatPujasProps {
    // other?: BoxProps
    lote: lotes | undefined
}
export const ChatPujas = ({ lote }: ChatPujasProps) => {

    const { data: pujas } = useSWR(`/subastas/pujas?lote=${lote?.id_lote}`, fetcher, { refreshInterval: 1500 }) as { data: pujas[] };
    console.log(pujas);

    return (
        <Card sx={{ p: 2.5 }} >
            <Grid container>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        {
                            pujas?.map(puja => (
                                <Box component="div" padding={1} key={puja.id_puja} style={{ backgroundColor: 'royalblue', borderRadius: 5, color: "#fff" }}>
                                    <Typography component="p" m={0}>Paleta Comprador: <strong>#{puja.codigo_paleta}</strong></Typography>
                                    <Typography component="p" >Oferta: <strong>#{Number(puja.puja).toFixed(2)}</strong></Typography>
                                </Box>))
                        }
                    </Stack>
                </Grid>
                <Grid item xs={6}>

                </Grid>
            </Grid>
        </Card>
    )
}
