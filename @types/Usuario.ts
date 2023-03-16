import { compradores } from "@prisma/client";

export interface UserLogged {
    usuarioid: number;
    nombres: string;
    identificacion: string;
    rol: string[];
    tipo: number | null;
    comprador?: compradores | null
}