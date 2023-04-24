import { useEffect, useState } from "react";
import { lotes } from "@prisma/client";
import socket from "utils/sockets";


export const useObtenerLoteActivo = (idEvento: number) => {
    const [loteActual, setLoteActual] = useState<lotes>();

    useEffect(() => {
        socket.on('activarLote', (lote: lotes) => {
            setLoteActual(lote)
        });

        socket.emit('obtenerLoteActivo', idEvento);

        return () => {
            socket.off('activarLote');
            socket.off('obtenerLoteActivo');
        };
    }, []);

    return { loteActual }
}
