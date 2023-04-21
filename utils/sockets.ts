import io from 'socket.io-client';

const URL_SERVER = process.env.NEXT_PUBLIC_PORT_SOCKETS || 'http://localhost:4000';

const socket = io(URL_SERVER);

export default socket;
