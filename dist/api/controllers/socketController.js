"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitEvent = exports.setupSocketIo = void 0;

var _socket = _interopRequireDefault(require("socket.io"));

var _nodeColorLog = _interopRequireDefault(require("node-color-log"));

var _messenger = _interopRequireDefault(require("../../messenger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var io;
var clients = {};

var setupSocketIo = function setupSocketIo(server, allowedOrigins) {
  io = (0, _socket["default"])(server);
  io.origins(function (origin, callback) {
    if (allowedOrigins.indexOf(origin) > -1) callback(null, true);else return callback('Socket.io: origin not allowed', false);
  });
  io.on('connection', function (socket) {
    socket.on('acknowledgment', function (pageID) {
      _nodeColorLog["default"].color('green').log('joining: ' + pageID);

      clients[pageID] = socket.id;
      console.info(io);
    });
    socket.on('disconnect', function () {
      for (var id in clients) {
        if (clients[id] === socket.id) {
          delete clients[id];

          _nodeColorLog["default"].color('red').log('disconnecting ' + id);

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
  });

  setInterval(function () {
    var pages = ['278383016327989'];
    pages.forEach(function (page) {
      return emitEvent(page, 'talk-to-human', {
        id: page + Math.round(Math.random() * 100),
        first_name: 'Try '
      });
    });
  }, 10000);
  setInterval(function () {
    var pages = ['938611509676235'];
    pages.forEach(function (page) {
      return emitEvent(page, 'talk-to-human', {
        id: page + Math.round(Math.random() * 100),
        first_name: 'Try '
      });
    });
  }, 9000);
  setInterval(function () {
    var pages = ['307519123184673'];
    pages.forEach(function (page) {
      return emitEvent(page, 'talk-to-human', {
        id: page + Math.round(Math.random() * 100),
        first_name: 'Try '
      });
    });
  }, 11000);
  setInterval(function () {
    var pages = ['2174806159435043'];
    pages.forEach(function (page) {
      return emitEvent(page, 'talk-to-human', {
        id: page + Math.round(Math.random() * 100),
        first_name: 'Try '
      });
    });
  }, 12000);
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
    var socketID = clients[pageID];

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
//# sourceMappingURL=socketController.js.map