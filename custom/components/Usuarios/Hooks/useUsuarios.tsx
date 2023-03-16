import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useUsuario = () => {

    const { mutate } = useSWRConfig();

    const agregarUsuario = async (comprador: any) => {
        const { data } = await subastaAPI.post('/user', comprador);
        mutate('/usuarios');
    }

    const actualizarUsuario= async (comprador: any) => {
        const { data } = await subastaAPI.put('/user', comprador);
        mutate('/usuarios');
    }

    const eliminarUsuario = async (comprador: any) => {
        
        const { data } = await subastaAPI.delete(`/user?id= ${comprador}`);
        mutate('/usuarios');
    }

   

    return { agregarUsuario, actualizarUsuario, eliminarUsuario }
}
