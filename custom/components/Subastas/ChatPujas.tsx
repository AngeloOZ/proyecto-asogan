import { useEffect, useRef, useState } from "react";

import { Card, Stack } from "@mui/material"
import { lotes, pujas } from "@prisma/client";

import { subastaAPI } from "custom/api";

import useSWR from "swr";
import { ChatInput, ChatList, ChatOfertas } from "./chat";



const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


interface ChatPujasProps {
    // other?: BoxProps
    lote: lotes | undefined
}
export const ChatPujas = ({ lote }: ChatPujasProps) => {

    const { data: pujas } = useSWR(`/subastas/pujas?lote=${lote?.id_lote}`, fetcher, { refreshInterval: 1500 }) as { data: pujas[] };


    const scrollRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const scrollMessagesToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        };
        scrollMessagesToBottom();
    }, [pujas]);

    return (

        <Card sx={{ height: '400px', display: 'flex' }}>
            <Stack flexGrow={1}>
                <Stack
                    direction="row"
                    flexGrow={1}
                    sx={{
                        overflow: 'hidden',
                        borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                >
                    <Stack flexGrow={1}>
                        <ChatList pujas={pujas || []} />
                        <ChatInput />
                    </Stack>

                    <ChatOfertas />
                </Stack>
            </Stack>
        </Card>
    )
}