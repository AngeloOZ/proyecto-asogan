import { lotes, pujas } from "@prisma/client";
import { UltimaPuja } from "@types";
import { useEffect, useRef, useState } from "react";
import socket from "utils/sockets";


export const useObtenerTodasPujas = (lote: lotes) => {

    const primeraConsultaPuja = useRef(false);

    const [listadoPujas, setListadoPujas] = useState<pujas[]>([]);


    // Efecto para obtener ultima puja
    useEffect(() => {
        socket.on('listadoPujas', (pujas: pujas[]) => {
            // console.log('listadoPujas', pujas.length);
            setListadoPujas(pujas);
        });


        return () => {
            socket.off('listadoPujas');
        };
    }, []);

    // Traer la primera puja
    useEffect(() => {
        if (primeraConsultaPuja.current) {
            return;
        }

        socket.emit('listadoPujas', lote.id_lote);
        primeraConsultaPuja.current = true;

        return () => {
            socket.off('listadoPujas');
        }

    }, []);

    return { listadoPujas }
}
