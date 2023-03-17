import { lotes } from "@prisma/client";
import useSWR from "swr";


type Data = {
  lotes: lotes[];
  isLoading: boolean;
  error: any;
}

export const useObtenerLotes = () => {
  const { data, isLoading, error } = useSWR('/lotes');
  return {
    lotes: data || [],
    isLoading,
    error
  }
}

export const useObtenerLotesComprados = (comprador: number) => {
  const { data, isLoading, error } = useSWR(`/lotes/comprados?comprador=${comprador}`);
  return {
    lotes: data || [],
    isLoading,
    error
  }
}

