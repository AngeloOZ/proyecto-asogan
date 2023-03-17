import { AxiosError } from "axios";

export function handleErrorsAxios(error: AxiosError) {
    let mensaje: any;
    if (error.response) {
        const { data } = error.response as { status: number, data: any };
        mensaje = data.message || "No se pudo realizar la petición";
    } else if (error.request) {
        mensaje = error.request || "No hubo respuesta por parte del servidor";
    } else {
        mensaje = error.message || "Hubo una interrupción en la petición";
    }
    console.log(mensaje);
    return mensaje;
}