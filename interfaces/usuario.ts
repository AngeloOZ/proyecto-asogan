export interface Usuario {
    id?: Number
    identificacion: string
    correo : string
    nombres : string
    clave : string
    rol: string[]
    celular : string
    fechacreado? : string | Date | null
}