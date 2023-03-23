import { lotes } from "@prisma/client";
import { Lote, LoteA } from "@types";
import moment from "moment-timezone";


interface CalculosSubasta {
    horaPesaje: string;
    cantidadAnimales: number;
    pesoTotal: number;
    pesoPromedio: number;
    tipoAniilaes: string;
    cantidadAnimalesText: string;
    valorBase: number;
    valorPuja: number;
    valorFinal: number;
    valorFinal2: number;
    valorFinalTotal: number;
}

export function calcularSubasta(lote: lotes | Lote | LoteA | null) : CalculosSubasta {
    let horaPesaje = moment(lote?.fecha_pesaje || '').format('H:mm');
    
    if (horaPesaje === 'Invalid date') {
        horaPesaje = '-';
    }

    const cantidadAnimales = lote?.cantidad_animales || 0;
    const pesoTotal = Number(lote?.peso_total || 0);
    const pesoPromedio = pesoTotal / cantidadAnimales || 0;
    const tipoAniilaes = lote?.tipo_animales || '';
    const cantidadAnimalesText = `${cantidadAnimales} ${tipoAniilaes.toUpperCase()}`

    const valorBase = Number(lote?.puja_inicial) || 0;
    const valorPuja = Number(lote?.incremento) || 0;
    const valorFinal = Number(lote?.puja_final) || 0;
    const valorFinal2 = valorFinal + valorPuja;
    const valorFinalTotal = valorFinal * pesoTotal;

    return {
        horaPesaje,
        cantidadAnimales,
        pesoTotal,
        pesoPromedio,
        tipoAniilaes,
        cantidadAnimalesText,
        valorBase,
        valorPuja,
        valorFinal,
        valorFinal2,
        valorFinalTotal
    }
}