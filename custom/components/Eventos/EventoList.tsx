import { Box, BoxProps } from "@mui/material"
import { EventoItem } from "."

interface Props extends BoxProps {
    eventos: LotesEventos[]
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

export const EventoList = ({ eventos }: Props) => {
    return (
        <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
            }}
        >
            {eventos.map((evento) => <EventoItem key={evento.id_evento} eventos={evento} />)}
        </Box>
    )
}
