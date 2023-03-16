import { usuario } from "@prisma/client";

export interface ICompradores {
    id_comprador?        : number;          
    codigo_paleta ?      : string;      
    antecedentes_penales?: boolean;  
    procesos_judiciales ?: boolean; 
    calificacion_bancaria?: string; 
    estado                ? : boolean;
    usuarioid            ? : number;
    usuario              ? : usuario;

}