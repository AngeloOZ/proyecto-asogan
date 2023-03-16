import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // establece el encabezado necesario para SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // envía eventos al cliente cada 5 segundos
    const intervalId = setInterval(() => {
        console.log('Sending event to client');
        res.write(`data: ${new Date().toISOString()}\n\n`);
    }, 5000);

    // maneja el cierre de la conexión por parte del cliente
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
}
