import { Box, BoxProps, Card, Grid, Stack, Typography } from "@mui/material"
import { lotes, pujas } from "@prisma/client";
import { subastaAPI } from "custom/api";

import useSWR from "swr";
import { ChatItem } from "./ChatItem";

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


interface ChatPujasProps {
    // other?: BoxProps
    lote: lotes | undefined
}
export const ChatPujas = ({ lote }: ChatPujasProps) => {

    const { data: pujas } = useSWR(`/subastas/pujas?lote=${lote?.id_lote}`, fetcher, { refreshInterval: 1500 }) as { data: pujas[] };
    console.log(pujas);

    return (
        <Card >
            <Grid container>
                <Grid item xs={7} borderRight="1px #ccc dashed">
                    <Stack spacing={1} p={1}>
                        {
                            pujas?.map(puja => <ChatItem key={puja.id_puja} puja={puja} />)
                        }
                    </Stack>
                </Grid>
                <Grid item xs={5}>

                </Grid>
            </Grid>
        </Card>
    )
}
