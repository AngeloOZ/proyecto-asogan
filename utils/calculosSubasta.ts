import { lotes } from "@prisma/client";
import { Lote, LoteA, UltimaPuja } from "@types";
import moment from "moment-timezone";


interface CalculosSubasta {
    horaPesaje: string;
    cantidadAnimales: number;
    pesoTotal: number;
    pesoPromedio: number;
    tipoAnimales: string;
    cantidadAnimalesText: string;
    valorBase: number;
    valorPuja: number;
    valorFinal: number;
    valorFinal2: number;
    valorFinalTotal: number;
    pujaActualText: string;
    pujaProximaText: string;
}

export function calcularSubasta(lote: lotes | Lote | null, ultimaPuja: UltimaPuja | null = null): CalculosSubasta {

    let PujaFinalCal = Number(lote?.puja_final || 0);

    if (ultimaPuja) {
        PujaFinalCal = Number(ultimaPuja?.puja || 0);
    }

    let horaPesaje = moment(lote?.fecha_pesaje || '').format('H:mm');

    if (horaPesaje === 'Invalid date') {
        horaPesaje = '-';
    }

    const cantidadAnimales = lote?.cantidad_animales || 0;
    const pesoTotal = Number(lote?.peso_total || 0);
    const pesoPromedio = pesoTotal / cantidadAnimales || 0;
    const tipoAnimales = lote?.tipo_animales || '';
    const cantidadAnimalesText = `${cantidadAnimales} ${tipoAnimales.toUpperCase()}`

    const valorBase = Number(lote?.puja_inicial || 0);
    const valorPuja = Number(lote?.incremento || 0);
    const valorFinal = PujaFinalCal;
    const valorFinal2 = valorFinal + valorPuja;
    const valorFinalTotal = valorFinal * pesoTotal;

    const pujaActualText = formatNumber(valorFinal);
    const pujaProximaText = formatNumber(valorFinal2);

    return {
        horaPesaje,
        cantidadAnimales,
        pesoTotal,
        pesoPromedio,
        tipoAnimales,
        cantidadAnimalesText,
        valorBase,
        valorPuja,
        valorFinal,
        valorFinal2,
        valorFinalTotal,
        pujaActualText,
        pujaProximaText,
    }
}

function formatNumber(number: number): string {
    if (number % 1 === 0) {
      // Si el número es entero, se muestra sin decimales
      return number.toString();
    } else if (number.toFixed(3).endsWith("0")) {
      // Si el número tiene tres decimales y termina en 0, se muestran dos decimales
      return number.toFixed(2);
    } else {
      // En cualquier otro caso, se muestran tres decimales
      return number.toFixed(3);
    }
  }
  