import { lotes } from "@prisma/client";
import { subastaAPI } from "custom/api";
import useSWR from "swr";

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Data = {
    lotes: lotes;
    isLoading: boolean;
    error: any;
    mutateLotesActivos: () => void;
}

export const useObtenerLotesActivos = (): Data => {
    const url = "/lotes/activos"

    const { data, isLoading, error, mutate } = useSWR(url, fetcher, {
        refreshInterval: 1000
    });

    return {
        lotes: data,
        isLoading,
        error,
        mutateLotesActivos: mutate
    }
}
