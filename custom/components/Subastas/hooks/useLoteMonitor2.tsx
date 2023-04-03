import { lotes } from '@prisma/client';

import { subastaAPI } from 'custom/api';

import useSWR from 'swr'

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Data = {
    loteActual: lotes,
    isLoading: boolean,
    error: any
}

export const useLoteMonitor2 = (id_evento: number): Data => {

    const { data, isLoading, error } = useSWR(`/subastas/monitor/id?uuid=${id_evento}`, fetcher, { refreshInterval: 1000 });

    return {
        loteActual: data,
        isLoading,
        error
    }
}


