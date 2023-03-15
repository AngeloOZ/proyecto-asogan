export interface LoteForm {
    id_lote?: number;
    id_evento: number | string | null | undefined;
    id_proveedor: number | string | null | undefined;
    id_comprador?: number | null | undefined;
    paleta_comprador?: string | null;
    fecha_pesaje: string;
    codigo_lote: string;
    cantidad_animales: number;
    tipo_animales: string;
    calidad_animales: string;
    peso_total: number;
    sexo: string;
    crias_hembras: number;
    crias_machos: number;
    procedencia: string;
    observaciones: string;
    puja_inicial: number;
    puja_final?: number;
    subastado?: number;
    incremento: number;
}