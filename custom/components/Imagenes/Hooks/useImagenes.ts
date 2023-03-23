import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";
import { useConverterb64Files } from "custom/hooks"
import axios from "axios";
import { ImagenBaner } from "@types";
import { imagenes } from "@prisma/client";

export const useImagenes = () => {

    const { mutate } = useSWRConfig();

    const agregarImagen = async (imagen: ImagenBaner) => {
        const { getImageBase64 } = useConverterb64Files();

        const icono = await getImageBase64(imagen.imagen!);

        const body = {
            ...imagen,
            imagen: icono
        };

        const { data } = await subastaAPI.post("/imagenes", body);

        mutate('/imagenes');
    }

    const eliminarImagen = async (imagen: imagenes) => {
        const { data } = await subastaAPI.delete('/imagenes', {
            data: {
                id_imagen: imagen.id_imagen,
            }
        });
        mutate('/imagenes');
    }

    return { agregarImagen, eliminarImagen }
}
