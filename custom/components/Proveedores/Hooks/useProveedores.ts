import { subastaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useProveedores = () => {

    const { mutate } = useSWRConfig();

    const agregarProveedor = async (proveedor: any) => {
        const { data } = await subastaAPI.post('/proveedores', proveedor);
        mutate('/proveedores');
    }

    const actualizarProveedor = async (proveedor: any) => {
        const { data } = await subastaAPI.put('/proveedores', proveedor);
        mutate('/proveedores');
    }

    const eliminarProveedor = async (proveedor: any) => {
        const { data } = await subastaAPI.delete('/proveedores', proveedor);
        mutate('/proveedores');
    }

    return { agregarProveedor, actualizarProveedor, eliminarProveedor }
}
