import { eventos } from "@prisma/client";
import { subastaAPI } from "custom/api"
import useSWR from "swr";


type Data = {
  eventos: eventos[];
  isLoading: boolean;
  error: any;
}

export const useObtenerEventos = (): Data => {

  const { data, isLoading, error } = useSWR('/eventos');
  return {
    eventos: data || [],
    isLoading,
    error
  }
}

export const useObtenerEventosHoy = (): Data => {

  const { data, isLoading, error } = useSWR('/eventos/hoy');
  return {
    eventos: data || [],
    isLoading,
    error
  }
}