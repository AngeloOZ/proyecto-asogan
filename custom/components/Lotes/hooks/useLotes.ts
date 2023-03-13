import { subastaAPI } from "custom/api"
import { useObtenerLotes, useObtenerLotesActivos } from ".";

export const useLotes = () => {
    const { mutateLotes } = useObtenerLotes();
    const { mutateLotesActivos } = useObtenerLotesActivos();

    const activarEstado = async (id: number) => {
        const { data } = await subastaAPI.put('/lotes', {
            id
        });

        mutateLotes();
        mutateLotesActivos();

    }



    return { activarEstado }
}
