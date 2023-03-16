import { useEffect, useRef, useState } from "react";

import { Card, Stack } from "@mui/material"
import { eventos, lotes, pujas } from "@prisma/client";

import { subastaAPI } from "custom/api";

import useSWR from "swr";
import { ChatInput, ChatList, ChatOfertas } from "./chat";
import { Puja, PujasRequest } from "@types";



const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)


interface ChatPujasProps {
    lote: lotes,
    evento: eventos | undefined
}


export const ChatPujas = ({ lote, evento }: ChatPujasProps) => {
    const [pujas, setPujas] = useState<Puja[]>([])
    const [mejoresPujas, setMejoresPujas] = useState<Puja[]>([])

    const { data } = useSWR(`/subastas/pujas?lote=${lote.id_lote}`, fetcher, { refreshInterval: 1500 }) as { data: PujasRequest };

    useEffect(() => {
        if (data) {
            setPujas(data.pujas)
            setMejoresPujas(data.mejoresPujas);
        }
    }, [data])

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
                        <ChatList pujas={pujas as unknown as pujas[]} />
                        <ChatInput lote={lote} />
                    </Stack>

                    <ChatOfertas ofetas={mejoresPujas} />
                </Stack>
            </Stack>
        </Card>
    )
}