import { eventos, lotes } from '@prisma/client'
import { subastaAPI } from 'custom/api'
import { useEffect, useState } from 'react'
import useSWR from 'swr'


export const useSubastas = (uuid: string) => {
    const [evento, setEvento] = useState<eventos>();

    useEffect(() => {
        if (uuid) {
            obtenerEnventoUUID();
        }
    }, [uuid])


    const obtenerEnventoUUID = async () => {
        if (!uuid) return null;
        const { data: evento } = await subastaAPI.get(`/subastas/evento?evento=${uuid}`);
        setEvento(evento);
    }

    return { evento }
}
