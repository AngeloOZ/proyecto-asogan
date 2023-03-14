import { lotes } from "@prisma/client";
import { subastaAPI } from "custom/api";
import useSWR from "swr";

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Data = {
    lotes: lotes[];
    isLoading: boolean;
    error: any;
    mutateLotes: () => void;
}

export const useObtenerLotes = (activos = false): Data => {
    const url = (activos) ? "/lotes/activos" : "/lotes"

    const { data, isLoading, error, mutate } = useSWR(url);

    return {
        lotes: data,
        isLoading,
        error,
        mutateLotes: mutate
    }
}
