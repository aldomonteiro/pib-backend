import socketIo from 'socket.io';
import logger from 'node-color-log';

import messenger from '../../messenger';

var io;
var clients = {};

export const setupSocketIo = (server, allowedOrigins) => {
    io = socketIo(server);

    io.origins((origin, callback) => {
        if (allowedOrigins.indexOf(origin) > -1)
            callback(null, true);
        else
            return callback('Socket.io: origin not allowed', false);

    });

    io.on('connection', socket => {
        socket.on('acknowledgment', pageID => {
            logger.color('green').log('joining: ' + pageID);
            clients[pageID] = socket.id;
            console.info(io);
        });

        socket.on('disconnect', () => {
            for (const id in clients) {
                if (clients[id] === socket.id) {
                    delete clients[id];
                    logger.color('red').log('disconnecting ' + id);
                    break;
                }
            }
        });
    });

    messenger.consume('redis')
        .subscribe(msg => {
            const msgJSON = JSON.parse(msg);
            const { pageID, eventName, data } = msgJSON;
            emitEvent(pageID, eventName, data);
        });

    setInterval(() => {
        const pages = ['278383016327989']
        pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    }, 10000);

    setInterval(() => {
        const pages = ['938611509676235']
        pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    }, 9000);

    setInterval(() => {
        const pages = ['307519123184673']
        pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    }, 11000);

    setInterval(() => {
        const pages = ['2174806159435043']
        pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    }, 12000);

}

export const emitEvent = (pageID, event, data) => {
    try {
        // emiting the event to all sockets created by the pageID query.
        // I am facing some issue that there are a lot of connected sockets
        // and it seems that some of then doesn't work.
        // for (const socketID in io.sockets.connected) {
        //     const socket = io.sockets.connected[socketID];
        //     if (socket.handshake.query.pageID === pageID) {
        //         // sending to all clients in pageID room, except sender
        //         socket.to(pageID).emit(event, data);
        //         break;
        //     }
        // }

        // This line works, but duplicates the messages.
        // io.in(pageID).emit(event, data);

        // Here I am storing the socketId for each pageID, but, it seems
        // the connected socket used on connect is not working to emit events
        // after awhile.
        const socketID = clients[pageID];
        if (socketID) {
            const socket = io.sockets.connected[socketID];
            if (socket) {
                socket.emit(event, data);
                logger.color('blue').log('emitted for ' + pageID)
            }
            else {
                logger.color('red').log('no socket for ' + pageID)
            }
        } else {
            logger.color('red').log('no socket for ' + pageID)
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};
