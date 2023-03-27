import { consultaAPI, subastaAPI } from "custom/api"
import { mutate } from "swr";



export const useGlobales = () => {



    const validarIdentificacion = (identificacion: string) => {
        var i;
        var cad = identificacion.trim();
        var total = 0;
        var longitud = cad.length;
        var longcheck = longitud - 1;
        var digitos = cad.split('').map(Number);
        var codigo_provincia = digitos[0] * 10 + digitos[1];
        if (cad !== "" && longitud === 10) {

            if (cad != '2222222222' && codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30)) {
                for (i = 0; i < longcheck; i++) {
                    if (i % 2 === 0) {

                        var aux = parseInt(cad.charAt(i)) * 2;
                        if (aux > 9) aux -= 9;
                        total += aux;
                    } else {
                        total += parseInt(cad.charAt(i));
                    }
                }
                total = total % 10 ? 10 - total % 10 : 0;

                if (parseInt(cad.charAt(longitud - 1)) == total) {
                    return true
                } else {
                    return false
                }
            } else {

                return false
            }
        } else
            if (longitud == 13 && cad !== "") {
                var extraer = cad.substr(10, 3);
                if (extraer == "001") {
                    return true
                } else {
                    return false
                }


            } else
                if (cad !== "") {

                    return false
                }
    }

    const consultarIdentificacion = async (identificacion: any) => {
        try {
            const identificacionEnviar = { identificacion: identificacion }
            const { data } = await consultaAPI.post('/datos_consulta', identificacionEnviar, {
                headers: {
                    usuario: 'perseo',
                    clave: 'Perseo1232*'
                }
            });
            return data
        } catch (error) {
            return ''
        }

    }

    const enviarCorreoClave = async (datos: any) => {
        
            
            const { data } = await subastaAPI.post('/correo', datos);
            
            return data
           
        
      

    }

    return { validarIdentificacion, consultarIdentificacion, enviarCorreoClave }
}