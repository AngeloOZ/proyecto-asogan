import { lotes } from "@prisma/client";
import { UltimaPuja } from "@types";
import { useEffect, useRef, useState } from "react";
import socket from "utils/sockets";


export const useObtenerUltimaPuja = (lote: lotes | undefined) => {
    const primeraConsultaPuja = useRef(false);
    const [ultimaPuja, setUltimaPuja] = useState<UltimaPuja>();


    // Efecto para obtener ultima puja
    useEffect(() => {
        socket.on('ultimaPuja', (puja: UltimaPuja) => {
            if (!primeraConsultaPuja.current && ultimaPuja) {
                primeraConsultaPuja.current = true;
            }

            setUltimaPuja(puja);
        });


        return () => {
            socket.off('ultimaPuja');
        };
    }, []);

    // Traer la primera puja
    useEffect(() => {
        if (primeraConsultaPuja.current) {
            return;
        }

        socket.emit('obtenerUltimaPuja', lote?.id_lote || 0);

        return () => {
            socket.off('obtenerUltimaPuja');
        }

    }, [lote]);

    return { ultimaPuja }
}
