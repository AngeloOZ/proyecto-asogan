import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useCompradores = () => {

    const { mutate } = useSWRConfig();

    const agregarComprador = async (comprador: any) => {
   
       if (comprador.codigo_paleta=="")
       comprador.codigo_paleta =   (Math.floor(Math.random() * (99999 - 10000 + 1) + 10000)).toString();
      
        const { data } = await subastaAPI.post('/compradores', comprador);
        mutate('/compradores');
    }

    const actualizarComprador = async (comprador: any) => {
        const { data } = await subastaAPI.put('/compradores', comprador);
        mutate('/compradores');
    }

    const eliminarComprador = async (comprador: any) => {

        const { data } = await subastaAPI.delete(`/compradores?id= ${comprador}`);
        mutate('/compradores');
    }


    return { agregarComprador, actualizarComprador, eliminarComprador }
}
