import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useCompradores = () => {

    const { mutate } = useSWRConfig();

    const agregarComprador = async (proveedor: any) => {
        const { data } = await subastaAPI.post('/compradores', proveedor);
        mutate('/compradores');
    }

    const actualizarComprador= async (proveedor: any) => {
        const { data } = await subastaAPI.put('/compradores', proveedor);
        mutate('/compradores');
    }

    const eliminarComprador = async (proveedor: any) => {
        const { data } = await subastaAPI.delete('/compradores', proveedor);
        mutate('/compradores');
    }

    return { agregarComprador, actualizarComprador, eliminarComprador }
}
