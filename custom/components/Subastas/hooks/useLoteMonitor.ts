import { lotes } from '@prisma/client';
import { LoteMonitor } from '@types';

import { subastaAPI } from 'custom/api';

import useSWR from 'swr'

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Data = {
    loteActual: LoteMonitor,
    isLoading: boolean,
    error: any
}

export const useLoteMonitor = (id_evento?: string): Data => {

    const { data, isLoading, error } = useSWR(`/subastas/monitor/${id_evento}`, fetcher, { refreshInterval: 5000 });

    return {
        loteActual: data,
        isLoading,
        error
    }
}


