import { Box, BoxProps, Skeleton } from "@mui/material"
import { EventoItem } from "."

interface Props extends BoxProps {
    eventos: LotesEventos[],
    isLoading: boolean
}

export interface LotesEventos {
    id_evento: number;
    descripcion: string;
    fecha: string;
    lugar: string;
    tipo: string;
    abierto: boolean;
    lotes: Lote[];
}

export interface Lote {
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

export const EventoList = ({ eventos, isLoading }: Props) => {
    return (
        <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
            }}
        >
            {isLoading ?
                // Mostrar el skeleton si isLoading es verdadero
                <Skeleton variant="rectangular" width="100%" height={118} animation="wave" />
                :
                // Mostrar la lista de eventos si isLoading es falso
                eventos.map((evento) => <EventoItem key={evento.id_evento} eventos={evento} />)
            }
        </Box>
    )
}
