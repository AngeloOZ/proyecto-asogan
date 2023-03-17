import { consultaAPI } from "custom/api"
import { useSWRConfig } from "swr";


export const useGlobales = () => {



    const consultarIdentificacion = async (identificacion: any) => {
        try {
            const identificacionEnviar = { identificacion: identificacion }
            const { data } = await consultaAPI.post('/datos_consulta', identificacionEnviar, {
                headers: {
                    usuario: 'perseo',
                    clave: 'Perseo1232*'
                }
            });
            return data.razon_social
        } catch (error) {
            return ''
        }

    }


    return { consultarIdentificacion }
}