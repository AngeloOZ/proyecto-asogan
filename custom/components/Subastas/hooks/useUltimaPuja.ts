import { UltimaPuja } from '@types';

import { subastaAPI } from 'custom/api';

import useSWR from 'swr'

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Data = {
    ultimaPuja: UltimaPuja,
    isLoading: boolean,
    error: any
}

export const useUltimaPuja = (id_lote: number): Data => {

    const { data, isLoading, error } = useSWR(`/subastas/ultima-puja?id=${id_lote}`, fetcher, { refreshInterval: 533 });

    return {
        ultimaPuja: data,
        isLoading,
        error
    }
}


