// socketClient.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const URL_SERVER = process.env.NEXT_PUBLIC_PORT_SOCKETS || 'http://localhost:9001';

export const getSocket = () => {
    if (!socket) {
        socket = io(URL_SERVER); // Reemplaza con la URL de tu servidor de Socket.io
    }
    return socket;
};
