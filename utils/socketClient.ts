// socketClient.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io("http://localhost:3016"); // Reemplaza con la URL de tu servidor de Socket.io
    }
    return socket;
};
