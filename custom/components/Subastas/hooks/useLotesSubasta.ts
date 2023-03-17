import { lotes } from '@prisma/client';
import { subastaAPI } from 'custom/api';
import useSWR from 'swr'

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Data = {
    lotes: lotes[],
    isLoading: boolean,
    error: any
}

export const useLotesSubasta = (id: number): Data => {

    if (!id) return {
        lotes: [],
        isLoading: false,
        error: null
    }

    const { data, isLoading, error } = useSWR(`/lotes/${id}`, fetcher, { refreshInterval : 1000 });

    return {
        lotes: data || [],
        isLoading,
        error
    }
}


