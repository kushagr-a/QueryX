import { Server } from 'socket.io';

let io: any;
export function initSocket(httpsServer: any) {
    io = new Server(httpsServer, {
        cors: {
            origin: '*',
            credentials: true,
        },
    });

    console.log('Socket.IO server is running');

    io.on('connection', (socket: any) => {
        console.log('a user connected ' + socket.id);
    })
}

export function getIo() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}