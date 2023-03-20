import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";
import { writeFileSync } from 'fs';
import axios from "axios";

export const useImagenes = () => {

    const { mutate } = useSWRConfig();

    const agregarImagen = async (imagen: any) => {
        //Guardar imagen en el servidor
        const formData = new FormData();
        formData.append("myImage", imagen.ruta);
        const { data } = await axios.post("/api/imagenes/uploadImagen", formData);
        //Crear registro en la base de datos
        const fileName = { fileName: data.newFilename }
        await subastaAPI.post('/imagenes', fileName);

        mutate('/imagenes');
    }

    const actualizarImagen = async (imagen: any) => {
        const { data } = await subastaAPI.put('/imagenes', imagen);
        mutate('/imagenes');
    }

    const eliminarImagen = async (imagen: any) => {
        const { data } = await subastaAPI.delete('/imagenes', {
            data: {
                id_imagen: imagen.id_imagen,
                ruta: imagen.ruta
            }
        });
        mutate('/imagenes');
    }

    return { agregarImagen, actualizarImagen, eliminarImagen }
}
