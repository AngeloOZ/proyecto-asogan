import { lotes } from "@prisma/client";
import { Lote, LoteA } from "@types";
import moment from "moment-timezone";

export function calcularSubasta(lote: lotes | Lote | LoteA | null) {
    const horaPesaje = moment(lote?.fecha_pesaje || '').format('H:mm - DD-MM-YYYY');
    console.log(lote?.fecha_pesaje);
    
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