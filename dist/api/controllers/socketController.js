"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitEventWhats = exports.emitEvent = exports.setupSocketIo = void 0;

var _socket = _interopRequireDefault(require("socket.io"));

var _nodeColorLog = _interopRequireDefault(require("node-color-log"));

var _messenger = _interopRequireDefault(require("../../messenger"));

var _util = require("../util/util");

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
    _nodeColorLog["default"].color('yellow').log((0, _util.addTimedMessage)(null, 'socket.handshake.query: ' + JSON.stringify(socket.handshake.query) + ' socket.id:' + socket.id));

    socket.on('acknowledgment', function (originID) {
      _nodeColorLog["default"].color('magenta').log((0, _util.addTimedMessage)(null, 'socket.id:' + socket.id + ' ack: ' + JSON.stringify(originID)));

      if (originID.hasOwnProperty('origin')) {
        if (originID.origin === 'whatsapp') {
          clientsWhats[originID.user] = socket.id;

          _nodeColorLog["default"].color('green').log((0, _util.addTimedMessage)(null, 'socket.id:' + socket.id + ' joining from whatsapp: ' + originID.user));

          emitEventWhats(originID.user, 'notify', {
            user: originID.user,
            message: 'CONNECTED'
          });
        } else if (originID.origin === 'web') {
          var sockets = clientsWeb[originID.pageID];
          if (!sockets) sockets = {};
          sockets[originID.timeStamp] = socket.id;
          clientsWeb[originID.pageID] = sockets; // clientsWeb[originID.pageID] = socket.id;

          _nodeColorLog["default"].color('green').log((0, _util.addTimedMessage)(null, 'socket.id:' + socket.id + ' joining from web (new): ' + JSON.stringify(originID)));

          socket.emit('ack_ok');
        }
      } else {
        // this identifier is from a pageID
        clientsWeb[originID] = socket.id;

        _nodeColorLog["default"].color('green').log('joining from web: ' + originID);
      }
    });
    socket.on('disconnect', function () {
      var pages = Object.keys(clientsWeb);

      for (var _i = 0, _pages = pages; _i < _pages.length; _i++) {
        var pageID = _pages[_i];
        var socketsByTimeStamp = clientsWeb[pageID];
        var timeStamps = Object.keys(socketsByTimeStamp);

        for (var _i2 = 0, _timeStamps = timeStamps; _i2 < _timeStamps.length; _i2++) {
          var timeStamp = _timeStamps[_i2];
          var _id = socketsByTimeStamp[timeStamp];

          if (_id === socket.id) {
            delete socketsByTimeStamp[timeStamp];
            clientsWeb[pageID] = socketsByTimeStamp;

            _nodeColorLog["default"].color('red').log((0, _util.addTimedMessage)(null, 'socket.id:' + socket.id + ' disconnecting from web: socket ' + _id + ' page:' + pageID));

            console.dir(clientsWeb);
            break;
          }
        }
      }

      for (var id in clientsWhats) {
        if (clientsWhats[id] === socket.id) {
          delete clientsWhats[id];

          _nodeColorLog["default"].color('red').log((0, _util.addTimedMessage)(null, 'socket.id:' + socket.id + ' disconnecting from whatsapp ' + id));

          break;
        }
      }
    });
    socket.on('connect_error', function (error) {
      _nodeColorLog["default"].color('red').log((0, _util.addTimedMessage)(null, 'socket.id:' + socket.id + ' socket connect_error: ' + JSON.stringify(error)));
    });
  });
  io.on('connect_error', function (error) {
    _nodeColorLog["default"].color('red').log('io connect_error: ' + JSON.stringify(error));
  });

  _messenger["default"].consume('bot-to-webapp').subscribe(function (msg) {
    var msgJSON = JSON.parse(msg);
    var pageID = msgJSON.pageID,
        eventName = msgJSON.eventName,
        data = msgJSON.data;
    emitEvent(pageID, eventName, data);
  });

  _messenger["default"].consume('bot-to-whats').subscribe(function (msg) {
    var msgJSON = JSON.parse(msg);
    var whatsAppId = msgJSON.whatsAppId,
        userId = msgJSON.userId,
        message = msgJSON.message;
    emitEventWhats(whatsAppId, 'notify', {
      userId: userId,
      message: message
    });
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
/**
 * Bot to webapp
 * @param {*} pageID 
 * @param {*} event 
 * @param {*} data 
 */


exports.setupSocketIo = setupSocketIo;

var emitEvent = function emitEvent(pageID, event, data) {
  try {
    var sockets = clientsWeb[pageID];

    if (sockets) {
      for (var _i3 = 0, _Object$values = Object.values(sockets); _i3 < _Object$values.length; _i3++) {
        var socketID = _Object$values[_i3];

        // const socketID = clientsWeb[pageID];
        if (socketID) {
          var socket = io.sockets.connected[socketID];

          if (socket) {
            socket.emit(event, data);

            _nodeColorLog["default"].color('blue').log('From Whats to Web - to pageID:' + pageID + ' using socket:' + socket.id);
          } else {
            _nodeColorLog["default"].color('red').log('no socket for ' + pageID);
          }
        }
      }
    } else {
      _nodeColorLog["default"].color('red').log('no clientWeb for ' + pageID);
    }
  } catch (error) {
    console.error("emit event Error: ".concat(error.message));
    console.error(error);
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
    console.error("emitEventWhats Error: ".concat(error.message));
    console.error(error);
  }
};

exports.emitEventWhats = emitEventWhats;
//# sourceMappingURL=socketController.js.map