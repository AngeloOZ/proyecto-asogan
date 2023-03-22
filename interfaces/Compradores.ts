import { usuario } from "@prisma/client";

export interface ICompradores {
    id_comprador            : number          
    codigo_paleta           : string | null
    antecedentes_penales    : boolean | null
    procesos_judiciales     : boolean | null
    calificacion_bancaria   : string | null
    estado                  : boolean | null
    usuarioid               : number
    correo                  : string  | null
    celular                 : string  | null       
    usuario                 ?: usuario ;
 
}