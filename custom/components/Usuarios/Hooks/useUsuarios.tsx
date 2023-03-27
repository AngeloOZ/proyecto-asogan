import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useUsuario = () => {

    const { mutate } = useSWRConfig();

    const agregarUsuario = async (usuario: any) => {
        const { data } = await subastaAPI.post('/user', usuario);
        mutate('/usuarios');
    }

    const actualizarUsuario = async (usuario: any) => {

        const { data } = await subastaAPI.put('/user', usuario);
     
        mutate('/usuarios');
    }

    const eliminarUsuario = async (usuario: any) => {

        const { data } = await subastaAPI.delete(`/user?id= ${usuario}`);
        mutate('/usuarios');
    }

    const obtenerUsuariosClave = async(identificacionC: string, correoC:string) => {

    
        const { data } = await subastaAPI.get(`/user/clave?identificacion= ${identificacionC}&correo=${correoC}`);
       return data
        
    }


    return { agregarUsuario, actualizarUsuario, eliminarUsuario,obtenerUsuariosClave }
}
