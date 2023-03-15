import { compradores } from "@prisma/client";
import useSWR from "swr";

type Data = {
    compradores: compradores[];
    isLoading: boolean;
    error: any;
  }

  export const useObtenerCompradores = (): Data => {


    const { data, isLoading, error } = useSWR('/compradores');
    return {
      compradores: data || [],
      isLoading,
      error
    }
  }