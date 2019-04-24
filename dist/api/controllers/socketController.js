"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitEventWhats = exports.emitEvent = exports.setupSocketIo = void 0;

var _socket = _interopRequireDefault(require("socket.io"));

var _nodeColorLog = _interopRequireDefault(require("node-color-log"));

var _messenger = _interopRequireDefault(require("../../messenger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var io;
var clientsWeb = {};
var clientsWhats = {};

var setupSocketIo = function setupSocketIo(server, allowedOrigins) {
  io = (0, _socket["default"])(server);
  io.origins(function (origin, callback) {
    if (allowedOrigins.indexOf(origin) > -1) callback(null, true);else {
      console.log('>>> SOCKETCONTROLLER trying connect from ', origin);
      return callback('Socket.io: origin not allowed', false);
    }
  });
  io.on('connection', function (socket) {
    socket.on('acknowledgment', function (originID) {
      _nodeColorLog["default"].color('green').log('aknowledment: ' + (originID.user || originID));

      if (originID.hasOwnProperty('origin') && originID.origin === 'whatsapp') {
        clientsWhats[originID.user] = socket.id;

        _nodeColorLog["default"].color('green').log('joining from whatsapp: ' + originID.user);

        emitEventWhats(originID.user, 'notify', {
          user: originID.user,
          message: 'sadkasl'
        });
      } else {
        // this identifier is from a pageID
        clientsWeb[originID] = socket.id;

        _nodeColorLog["default"].color('green').log('joining from web: ' + originID);
      }
    });
    socket.on('disconnect', function () {
      for (var id in clientsWeb) {
        if (clientsWeb[id] === socket.id) {
          delete clientsWeb[id];

          _nodeColorLog["default"].color('red').log('disconnecting from web ' + id);

          break;
        }
      }

      for (var _id in clientsWhats) {
        if (clientsWhats[_id] === socket.id) {
          delete clientsWhats[_id];

          _nodeColorLog["default"].color('red').log('disconnecting from whatsapp ' + _id);

          break;
        }
      }
    });
  });

  _messenger["default"].consume('redis').subscribe(function (msg) {
    var msgJSON = JSON.parse(msg);
    var pageID = msgJSON.pageID,
        eventName = msgJSON.eventName,
        data = msgJSON.data;
    emitEvent(pageID, eventName, data);
  }); // setInterval(() => {
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

};

exports.setupSocketIo = setupSocketIo;

var emitEvent = function emitEvent(pageID, event, data) {
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
    var socketID = clientsWeb[pageID];

    if (socketID) {
      var socket = io.sockets.connected[socketID];

      if (socket) {
        socket.emit(event, data);

        _nodeColorLog["default"].color('blue').log('emitted for ' + pageID);
      } else {
        _nodeColorLog["default"].color('red').log('no socket for ' + pageID);
      }
    } else {
      _nodeColorLog["default"].color('red').log('no socket for ' + pageID);
    }
  } catch (error) {
    console.error("Error: ".concat(error.message));
  }
};

exports.emitEvent = emitEvent;

var emitEventWhats = function emitEventWhats(userID, event, data) {
  try {
    // Here I am storing the socketId for each pageID, but, it seems
    // the connected socket used on connect is not working to emit events
    // after awhile.
    var socketID = clientsWhats[userID];

    if (socketID) {
      var socket = io.sockets.connected[socketID];

      if (socket) {
        socket.emit(event, data);

        _nodeColorLog["default"].color('blue').log('emitted for ' + userID + ' with data:' + data.userId + ' ' + data.message);
      } else {
        _nodeColorLog["default"].color('red').log('no socket for ' + userID);
      }
    } else {
      _nodeColorLog["default"].color('red').log('no socket for ' + userID);
    }
  } catch (error) {
    console.error("Error: ".concat(error.message));
  }
};

exports.emitEventWhats = emitEventWhats;
//# sourceMappingURL=socketController.js.map