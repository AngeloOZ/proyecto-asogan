import { imagenes } from "@prisma/client";
import useSWR from "swr";


type Data = {
  imagenes: imagenes[];
  isLoading: boolean;
  error: any;
}

export const useObtenerImagenes = (): Data => {


  const { data, isLoading, error } = useSWR('/imagenes');
  return {
    imagenes: data || [],
    isLoading,
    error
  }
}
