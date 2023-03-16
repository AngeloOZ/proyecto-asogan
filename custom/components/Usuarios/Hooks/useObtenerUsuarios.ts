import { usuario } from "@prisma/client";
import useSWR from "swr";

type Data = {
    usuario: usuario[];
    isLoading: boolean;
    error: any;
}

export const useObtenerUsuarios = (): Data => {


    const { data, isLoading, error } = useSWR('/user');
    return {
        usuario: data || [],
        isLoading,
        error
    }
}