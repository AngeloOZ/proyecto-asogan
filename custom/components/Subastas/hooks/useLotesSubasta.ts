import { lotes } from '@prisma/client';
import useSWR from 'swr'


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

    const { data, isLoading, error } = useSWR(`/lotes/${id}`);

    return {
        lotes: data || [],
        isLoading,
        error
    }
}


