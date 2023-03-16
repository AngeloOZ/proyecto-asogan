import useSWR from "swr";

type Data = {
  eventos: LotesEventos[];
  isLoading: boolean;
  error: any;
}

interface LotesEventos {
  id_evento: number;
  descripcion: string;
  fecha: string;
  lugar: string;
  tipo: string;
  abierto: boolean;
  lotes: Lote[];
}

interface Lote {
  id_lote: number;
  id_evento: number;
  id_proveedor: number;
  id_comprador: null;
  paleta_comprador: null;
  fecha_pesaje: string;
  codigo_lote: string;
  cantidad_animales: number;
  tipo_animales: string;
  calidad_animales: string;
  peso_total: string;
  sexo: string;
  crias_hembras: number;
  crias_machos: number;
  procedencia: string;
  observaciones: string;
  puja_inicial: string;
  puja_final: string;
  incremento: string;
  subastado: number;
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