import { LoteForm } from "@types";
import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useLotes = () => {

    const { mutate } = useSWRConfig();

    const agregarLote = async (lote: LoteForm) => {
        const { data } = await subastaAPI.post('/lotes', lote);
        mutate('/lotes');
    }

    const actualizarLote = async (lote: LoteForm) => {
        const { data } = await subastaAPI.put('/lotes', lote);
        mutate('/lotes');
    }

    const eliminarLote = async (lote: LoteForm) => {
        const { data } = await subastaAPI.delete(`/lotes?id=${lote.id_lote!}`);
        mutate('/lotes');
    }

    return { agregarLote, actualizarLote, eliminarLote }

}
