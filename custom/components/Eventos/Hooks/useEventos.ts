import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useEventos = () => {

    const { mutate } = useSWRConfig();

    const agregarEvento = async (evento: any) => {
        const { data } = await subastaAPI.post('/eventos', evento);
        mutate('/eventos');
    }

    const actualizarEvento = async (evento: any) => {
        const { data } = await subastaAPI.put('/eventos', evento);
        mutate('/eventos');
    }

    const eliminarEvento = async (evento: any) => {
        const { data } = await subastaAPI.delete('/eventos', evento);
        mutate('/eventos');
    }

    return { agregarEvento, actualizarEvento, eliminarEvento }
}
