import socketIo from 'socket.io';
import logger from 'node-color-log';

import messenger from '../../messenger';
import { addTimedMessage } from '../util/util';

var io;
var clientsWeb = {};
var clientsWhats = {};

export const setupSocketIo = (server, allowedOrigins) => {
    io = socketIo(server);

    io.origins((origin, callback) => {
        if (allowedOrigins.indexOf(origin) > -1)
            callback(null, true);
        else {
            console.log('>>> SOCKETCONTROLLER trying connect from ', origin);
            return callback('Socket.io: origin not allowed', false);
        }

    });

    io.on('connection', socket => {

        logger.color('yellow').log(addTimedMessage(null, 'socket.handshake.query: ' + JSON.stringify(socket.handshake.query) + ' socket.id:' + socket.id));

        socket.on('acknowledgment', originID => {
            logger.color('magenta').log(addTimedMessage(null, 'ack: ' + JSON.stringify(originID)));
            if (originID.hasOwnProperty('origin')) {
                if (originID.origin === 'whatsapp') {
                    clientsWhats[originID.user] = socket.id;
                    logger.color('green').log('joining from whatsapp: ' + originID.user);
                    emitEventWhats(originID.user, 'notify', { user: originID.user, message: 'CONNECTED' })
                } else if (originID.origin === 'web') {
                    let sockets = clientsWeb[originID.pageID];
                    if (!sockets)
                        sockets = {};
                    sockets[originID.timeStamp] = socket.id;
                    clientsWeb[originID.pageID] = sockets;
                    // clientsWeb[originID.pageID] = socket.id;
                    logger.color('green').log(addTimedMessage(null, 'joining from web (new): ' + JSON.stringify(originID)));
                    socket.emit('ack_ok');
                }
            } else {
                // this identifier is from a pageID
                clientsWeb[originID] = socket.id;
                logger.color('green').log('joining from web: ' + originID);
            }
        });

        socket.on('disconnect', () => {
            const pages = Object.keys(clientsWeb);
            for (const pageID of pages) {
                const socketsByTimeStamp = clientsWeb[pageID];
                const timeStamps = Object.keys(socketsByTimeStamp);
                for (const timeStamp of timeStamps) {
                    const id = socketsByTimeStamp[timeStamp];
                    if (id === socket.id) {
                        delete socketsByTimeStamp[timeStamp];
                        clientsWeb[pageID] = socketsByTimeStamp;
                        logger.color('red').log('disconnecting from web: socket ' + id + ' page:' + pageID);
                        console.dir(clientsWeb);
                        break;
                    }
                }
            }
            for (const id in clientsWhats) {
                if (clientsWhats[id] === socket.id) {
                    delete clientsWhats[id];
                    logger.color('red').log('disconnecting from whatsapp ' + id);
                    break;
                }
            }
        });

        socket.on('connect_error', error => {
            logger.color('red').log('socket connect_error: ' + JSON.stringify(error));
        })

    });

    io.on('connect_error', error => {
        logger.color('red').log('io connect_error: ' + JSON.stringify(error));
    })


    messenger.consume('bot-to-webapp')
        .subscribe(msg => {
            const msgJSON = JSON.parse(msg);
            const { pageID, eventName, data } = msgJSON;
            emitEvent(pageID, eventName, data);
        });

    messenger.consume('bot-to-whats')
        .subscribe(msg => {
            const msgJSON = JSON.parse(msg);
            const { whatsAppId, userId, message } = msgJSON;
            emitEventWhats(whatsAppId, 'notify', { userId: userId, message: message });
        });

    // setInterval(() => {
    //     const pages = ['278383016327989']
    //     pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    // }, 10000);

    // setInterval(() => {
    //     const pages = ['938611509676235']
    //     pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    // }, 9000);

    // setInterval(() => {
    //     const pages = ['307519123184673']
    //     pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    // }, 11000);

    // setInterval(() => {
    //     const pages = ['2174806159435043']
    //     pages.forEach(page => emitEvent(page, 'talk-to-human', { id: page + Math.round(Math.random() * 100), first_name: 'Try ' }))

    // }, 12000);

}

/**
 * Bot to webapp
 * @param {*} pageID 
 * @param {*} event 
 * @param {*} data 
 */
export const emitEvent = (pageID, event, data) => {
    try {
        const sockets = clientsWeb[pageID];
        if (sockets) {
            for (const socketID of Object.values(sockets)) {
                // const socketID = clientsWeb[pageID];
                if (socketID) {
                    const socket = io.sockets.connected[socketID];
                    if (socket) {
                        socket.emit(event, data);
                        logger.color('blue').log('From Whats to Web - to pageID:' + pageID + ' using socket:' + socket.id)
                    } else {
                        logger.color('red').log('no socket for ' + pageID)
                    }
                }
            }
        } else {
            logger.color('red').log('no clientWeb for ' + pageID)
        }
    } catch (error) {
        console.error(`emit event Error: ${error.message}`);
        console.error(error);
    }
};

export const emitEventWhats = (userID, event, data) => {
    try {
        // Here I am storing the socketId for each pageID, but, it seems
        // the connected socket used on connect is not working to emit events
        // after awhile.
        const socketID = clientsWhats[userID];
        if (socketID) {
            const socket = io.sockets.connected[socketID];
            if (socket) {
                socket.emit(event, data);
                logger.color('blue').log('emitted for ' + userID + ' with data:' + data.userId + ' ' + data.message)
            } else {
                logger.color('red').log('no socket for ' + userID)
            }
        } else {
            logger.color('red').log('no socket for ' + userID)
        }
    } catch (error) {
        console.error(`emitEventWhats Error: ${error.message}`);
        console.error(error);
    }
};

