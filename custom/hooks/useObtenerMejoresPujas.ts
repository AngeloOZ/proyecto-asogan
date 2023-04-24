import { lotes } from "@prisma/client";
import { UltimaPuja } from "@types";
import { useEffect, useRef, useState } from "react";
import socket from "utils/sockets";


export const useObtenerMejoresPujas = (lote: lotes | undefined) => {
    const primeraConsultaPujas = useRef(false);
    const [mejoresPujas, setMejoresPujas] = useState<UltimaPuja[]>();


    // Efecto para obtener ultima puja
    useEffect(() => {
        socket.on('mejoresPujas', (pujas: UltimaPuja[]) => {
            if (!primeraConsultaPujas.current && mejoresPujas?.length !== 0) {
                primeraConsultaPujas.current = true;
            }
            
            setMejoresPujas(pujas);
        });


        return () => {
            socket.off('mejoresPujas');
        };
    }, []);

    // Traer la primera puja
    useEffect(() => {
        if (primeraConsultaPujas.current) {
            return;
        }

        socket.emit('mejoresPujas', lote?.id_lote || 0);

        return () => {
            socket.off('mejoresPujas');
        }

    }, [lote]);

    return { mejoresPujas }
}
