import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useUsuario = () => {

    const { mutate } = useSWRConfig();

    const agregarUsuario = async (usuario: any) => {
        const { data } = await subastaAPI.post('/user', usuario);
        mutate('/user');
    }

    const actualizarUsuario = async (usuario: any) => {

        const { data } = await subastaAPI.put('/user', usuario);
     
        mutate('/user');
    }

    const eliminarUsuario = async (usuario: any) => {

        const { data } = await subastaAPI.delete(`/user?id= ${usuario}`);
        mutate('/user');
    }

    const obtenerUsuariosClave = async(identificacionC: string, correoC:string) => {

    
        const { data } = await subastaAPI.get(`/user/clave?identificacion= ${identificacionC}&correo=${correoC}`);
       return data
        
    }


    return { agregarUsuario, actualizarUsuario, eliminarUsuario,obtenerUsuariosClave }
}
