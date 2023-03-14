import { proveedores } from "@prisma/client";
import { subastaAPI } from "custom/api"
import useSWR from "swr";


type Data = {
  proveedores: proveedores[];
  isLoading: boolean;
  error: any;
}

export const useObtenerProveedores = (): Data => {


  const { data, isLoading, error } = useSWR('/proveedores');
  return {
    proveedores: data || [],
    isLoading,
    error
  }
}
