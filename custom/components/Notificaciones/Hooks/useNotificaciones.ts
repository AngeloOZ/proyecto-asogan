import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";
import { Notificaciones } from "@types";

export const useNotificaciones = () => {

    const { mutate } = useSWRConfig();

    const agregarNotificacion = async (notificacion: Notificaciones) => {

        const { data } = await subastaAPI.post("/notificaciones", notificacion);

        mutate('/notificaciones');
    }

    return { agregarNotificacion }
}
