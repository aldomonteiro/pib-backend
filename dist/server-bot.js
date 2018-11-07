"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _facebookMessengerBot = require("facebook-messenger-bot");

var _pagesController = require("./api/controllers/pagesController");

var _pricingsController = require("./api/controllers/pricingsController");

var _show_cardapio = _interopRequireDefault(require("./api/bot/show_cardapio"));

var _util = require("./api/util/util");

var _botController = require("./api/bot/botController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ORDER_STATE_QUANTITY = 1,
    ORDER_STATE_SIZE = 2,
    ORDER_STATE_FLAVOR = 3;

_dotenv.default.config();

_mongoose.default.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true
});

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.Promise = Promise;
var app = (0, _express.default)();
var bot = new _facebookMessengerBot.Bot('verify_my_bot', true);
(0, _pagesController.getAllPages)().then(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageArray) {
    var i, page, accessToken, fields, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = 0;

          case 1:
            if (!(i < pageArray.length)) {
              _context.next = 14;
              break;
            }

            page = pageArray[i];
            accessToken = page.accessToken;
            fields = ['greeting', 'get_started', 'persistent_menu'];
            _context.next = 7;
            return bot.getFields(fields);

          case 7:
            response = _context.sent;
            global.pagesKeyID[page.pageID] = accessToken;
            console.log("GET fields for ".concat(page.pageID, "-").concat(page.name, ":"));
            console.log(response);

          case 11:
            i++;
            _context.next = 1;
            break;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()); // Beggining - That is all to log in the local timezone
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan

_morgan.default.token('date', function (req, res, tz) {
  return (0, _momentTimezone.default)().tz(tz).format();
});

_morgan.default.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use((0, _morgan.default)("myformat")); // End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use('/buckets/facebook', function (req, res, next) {
  if (req.body.object === 'page') {
    if (req.body.entry.length > 0) {
      // Iterates over each entry - there may be multiple if batched
      // for (let i = 0; i < req.body.entry.length; i++) {
      var pageID = req.body.entry[0].id;
      console.log("Message from ".concat(pageID));

      if (global.pagesKeyID[pageID]) {
        req.token = global.pagesKeyID[pageID];
      } else {
        (0, _pagesController.getOnePage)(pageID).then(function (accessToken) {
          req.token = accessToken;
          global.pagesKeyID[pageID] = accessToken;
          console.log("Got token from ".concat(pageID));
        });
      }
    }
  }

  next();
});
app.use('/buckets/facebook', bot.router());
app.listen(process.env.FB_WEBHOOK_PORT, function () {
  return console.log("Bot server listening on port ".concat(process.env.FB_WEBHOOK_PORT));
});
global.pagesKeyID = new Array();
global.orderState = new Array();
bot.on('GET_STARTED',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(message) {
    var sender, out1, out2, out3;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sender = message.sender;
            _context2.prev = 1;
            _context2.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context2.next = 6;
            return (0, _botController.sendWelcomeMessage)(sender, message.recipient.id);

          case 6:
            out1 = _context2.sent;
            _context2.next = 9;
            return _facebookMessengerBot.Bot.wait(1000);

          case 9:
            _context2.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context2.next = 13;
            return bot.send(sender.id, out1);

          case 13:
            _context2.next = 15;
            return bot.startTyping(sender.id);

          case 15:
            _context2.next = 17;
            return (0, _botController.sendMainMenu)();

          case 17:
            out2 = _context2.sent;
            _context2.next = 20;
            return _facebookMessengerBot.Bot.wait(1000);

          case 20:
            _context2.next = 22;
            return bot.stopTyping(sender.id);

          case 22:
            _context2.next = 24;
            return bot.send(sender.id, out2);

          case 24:
            _context2.next = 36;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](1);
            console.log('GET_STARTED error:', _context2.t0.response);
            _context2.next = 31;
            return (0, _botController.sendErrorMsg)();

          case 31:
            out3 = _context2.sent;
            _context2.next = 34;
            return bot.stopTyping(sender.id);

          case 34:
            _context2.next = 36;
            return bot.send(sender.id, out3);

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 26]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()); // all postbacks are emitted via 'postback'

bot.on('postback',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(event, message, data) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.info("postback from ".concat(data, ", you need to take care of this thing!"));
            console.info(message);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}()); // all postbacks are emitted via 'postback'

bot.on('MAIN-MENU',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(message, data) {
    var sender, recipient, keyState, out, user, answer;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;
            _context4.prev = 2;
            _context4.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            if (!(data === 'CARDAPIO_PAYLOAD')) {
              _context4.next = 15;
              break;
            }

            _context4.next = 8;
            return (0, _botController.sendCardapio)(message.recipient.id);

          case 8:
            out = _context4.sent;
            _context4.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context4.next = 13;
            return bot.send(sender.id, out);

          case 13:
            _context4.next = 31;
            break;

          case 15:
            if (!(data === 'PEDIDO_PAYLOAD')) {
              _context4.next = 31;
              break;
            }

            global.orderState[keyState] = ORDER_STATE_QUANTITY; // Show saved address or ask for location

            _context4.next = 19;
            return bot.startTyping(sender.id);

          case 19:
            _context4.next = 21;
            return _facebookMessengerBot.Bot.wait(1000);

          case 21:
            _context4.next = 23;
            return bot.fetchUser(sender.id);

          case 23:
            user = _context4.sent;
            _context4.next = 26;
            return (0, _botController.confirmAddressOrAskLocation)(recipient.id, sender.id, user);

          case 26:
            answer = _context4.sent;
            _context4.next = 29;
            return bot.stopTyping(sender.id);

          case 29:
            _context4.next = 31;
            return bot.send(sender.id, answer);

          case 31:
            _context4.next = 38;
            break;

          case 33:
            _context4.prev = 33;
            _context4.t0 = _context4["catch"](2);
            _context4.next = 37;
            return bot.stopTyping(sender.id);

          case 37:
            if (_context4.t0.response) console.log(_context4.t0.response);else console.log(_context4.t0);

          case 38:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 33]]);
  }));

  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}());
/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */

bot.on('message',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(message) {
    var sender, recipient, location, user, answer, _answer;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.info({
              message: message
            });
            sender = message.sender, recipient = message.recipient, location = message.location;

            if (!location) {
              _context5.next = 20;
              break;
            }

            console.info({
              location: location
            });
            _context5.next = 6;
            return bot.startTyping(sender.id);

          case 6:
            _context5.next = 8;
            return _facebookMessengerBot.Bot.wait(1000);

          case 8:
            _context5.next = 10;
            return bot.fetchUser(sender.id);

          case 10:
            user = _context5.sent;
            _context5.next = 13;
            return (0, _botController.confirmLocationAddress)(recipient.id, sender.id, location, user);

          case 13:
            answer = _context5.sent;
            _context5.next = 16;
            return bot.stopTyping(sender.id);

          case 16:
            _context5.next = 18;
            return bot.send(sender.id, answer);

          case 18:
            _context5.next = 31;
            break;

          case 20:
            _context5.next = 22;
            return bot.startTyping(sender.id);

          case 22:
            _context5.next = 24;
            return _facebookMessengerBot.Bot.wait(1000);

          case 24:
            _context5.next = 26;
            return (0, _botController.confirmTypedAddress)(recipient.id, sender.id, message);

          case 26:
            _answer = _context5.sent;
            _context5.next = 29;
            return bot.stopTyping(sender.id);

          case 29:
            _context5.next = 31;
            return bot.send(sender.id, _answer);

          case 31:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x8) {
    return _ref5.apply(this, arguments);
  };
}());
/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */

bot.on('quick-reply',
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(message, quick_reply) {
    var sender, recipient, payload, answer, out;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.info({
              message: message
            });
            sender = message.sender, recipient = message.recipient;
            payload = quick_reply.payload;

            if (!payload) {
              _context6.next = 25;
              break;
            }

            console.info({
              payload: payload
            });
            _context6.next = 7;
            return bot.startTyping(sender.id);

          case 7:
            _context6.next = 9;
            return _facebookMessengerBot.Bot.wait(1000);

          case 9:
            _context6.next = 11;
            return (0, _botController.showPhone)(recipient.id, sender.id, payload);

          case 11:
            answer = _context6.sent;
            _context6.next = 14;
            return bot.stopTyping(sender.id);

          case 14:
            _context6.next = 16;
            return bot.send(sender.id, answer);

          case 16:
            _context6.next = 18;
            return (0, _botController.askForQuantity)();

          case 18:
            out = _context6.sent;
            _context6.next = 21;
            return _facebookMessengerBot.Bot.wait(1000);

          case 21:
            _context6.next = 23;
            return bot.stopTyping(sender.id);

          case 23:
            _context6.next = 25;
            return bot.send(sender.id, out);

          case 25:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function (_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}());
/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */

bot.on('CORRECT_SAVED_ADDRESS',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(message, data) {
    var sender, recipient, answer, out;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            sender = message.sender, recipient = message.recipient; // show what the user chose

            _context7.next = 3;
            return bot.startTyping(sender.id);

          case 3:
            _context7.next = 5;
            return _facebookMessengerBot.Bot.wait(1000);

          case 5:
            _context7.next = 7;
            return (0, _botController.showAddress)(recipient.id, sender.id, data);

          case 7:
            answer = _context7.sent;
            _context7.next = 10;
            return bot.stopTyping(sender.id);

          case 10:
            _context7.next = 12;
            return bot.send(sender.id, answer);

          case 12:
            _context7.next = 14;
            return (0, _botController.askForPhone)();

          case 14:
            out = _context7.sent;
            _context7.next = 17;
            return _facebookMessengerBot.Bot.wait(1000);

          case 17:
            _context7.next = 19;
            return bot.stopTyping(sender.id);

          case 19:
            _context7.next = 21;
            return bot.send(sender.id, out);

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}());
/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */

bot.on('LOCATION_ADDRESS',
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(message, data) {
    var sender, recipient, answer, _answer2, out;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;

            if (!(data === 'incorrect_address')) {
              _context8.next = 15;
              break;
            }

            _context8.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context8.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            _context8.next = 8;
            return (0, _botController.askToTypeAddress)(recipient.id, sender.id);

          case 8:
            answer = _context8.sent;
            _context8.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context8.next = 13;
            return bot.send(sender.id, answer);

          case 13:
            _context8.next = 35;
            break;

          case 15:
            _context8.next = 17;
            return bot.startTyping(sender.id);

          case 17:
            _context8.next = 19;
            return _facebookMessengerBot.Bot.wait(1000);

          case 19:
            _context8.next = 21;
            return (0, _botController.showAddress)(recipient.id, sender.id, data);

          case 21:
            _answer2 = _context8.sent;
            _context8.next = 24;
            return bot.stopTyping(sender.id);

          case 24:
            _context8.next = 26;
            return bot.send(sender.id, _answer2);

          case 26:
            _context8.next = 28;
            return (0, _botController.askForPhone)();

          case 28:
            out = _context8.sent;
            _context8.next = 31;
            return _facebookMessengerBot.Bot.wait(1000);

          case 31:
            _context8.next = 33;
            return bot.stopTyping(sender.id);

          case 33:
            _context8.next = 35;
            return bot.send(sender.id, out);

          case 35:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function (_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}());
/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */

bot.on('WRONG_SAVED_ADDRESS',
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(message, data) {
    var sender, recipient, out;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context9.next = 3;
            return (0, _botController.askForLocation)();

          case 3:
            out = _context9.sent;
            _context9.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            _context9.next = 8;
            return bot.stopTyping(sender.id);

          case 8:
            _context9.next = 10;
            return bot.send(sender.id, out);

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function (_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}());
/**
 * answered ORDER_QTY
 * gonna ask for SIZE
 */

bot.on('ORDER_QTY',
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(message, data) {
    var sender, recipient, keyState, out, answer, _out;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;
            global.orderState[keyState] = ORDER_STATE_FLAVOR;

            if (!(data && data === 'qty_more')) {
              _context10.next = 18;
              break;
            }

            global.orderState[keyState] = ORDER_STATE_QUANTITY;
            _context10.next = 7;
            return bot.startTyping(sender.id);

          case 7:
            _context10.next = 9;
            return _facebookMessengerBot.Bot.wait(1000);

          case 9:
            _context10.next = 11;
            return (0, _botController.askForQuantityMore)();

          case 11:
            out = _context10.sent;
            _context10.next = 14;
            return bot.stopTyping(sender.id);

          case 14:
            _context10.next = 16;
            return bot.send(sender.id, out);

          case 16:
            _context10.next = 40;
            break;

          case 18:
            _context10.next = 20;
            return bot.startTyping(sender.id);

          case 20:
            _context10.next = 22;
            return _facebookMessengerBot.Bot.wait(1000);

          case 22:
            _context10.next = 24;
            return (0, _botController.showQuantity)(recipient.id, sender.id, data);

          case 24:
            answer = _context10.sent;
            _context10.next = 27;
            return bot.stopTyping(sender.id);

          case 27:
            _context10.next = 29;
            return bot.send(sender.id, answer);

          case 29:
            _context10.next = 31;
            return bot.startTyping(sender.id);

          case 31:
            _context10.next = 33;
            return _facebookMessengerBot.Bot.wait(1000);

          case 33:
            _context10.next = 35;
            return (0, _botController.askForSize)(recipient.id, sender.id);

          case 35:
            _out = _context10.sent;
            _context10.next = 38;
            return bot.stopTyping(sender.id);

          case 38:
            _context10.next = 40;
            return bot.send(sender.id, _out);

          case 40:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function (_x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}());
/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */

bot.on('ORDER_SIZE',
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(message, data) {
    var sender, recipient, keyState, answer, out;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;
            global.orderState[keyState] = ORDER_STATE_SIZE; // show what the user chose

            _context11.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context11.next = 7;
            return _facebookMessengerBot.Bot.wait(2000);

          case 7:
            _context11.next = 9;
            return (0, _botController.showSize)(recipient.id, sender.id, data);

          case 9:
            answer = _context11.sent;
            _context11.next = 12;
            return bot.stopTyping(sender.id);

          case 12:
            _context11.next = 14;
            return bot.send(sender.id, answer);

          case 14:
            _context11.next = 16;
            return bot.startTyping(sender.id);

          case 16:
            _context11.next = 18;
            return _facebookMessengerBot.Bot.wait(2000);

          case 18:
            _context11.next = 20;
            return (0, _botController.askForFlavor)(message.recipient.id);

          case 20:
            out = _context11.sent;
            _context11.next = 23;
            return bot.stopTyping(sender.id);

          case 23:
            _context11.next = 25;
            return bot.send(sender.id, out);

          case 25:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function (_x19, _x20) {
    return _ref11.apply(this, arguments);
  };
}());
/**
 * answered ORDER_FLAVOR
 * gonna ask for confirmation
 */

bot.on('ORDER_FLAVOR',
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(message, data) {
    var sender, recipient, keyState, answer, summary;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;
            global.orderState[keyState] = ORDER_STATE_FLAVOR;

            if (!(data === 'flavor_more')) {
              _context12.next = 6;
              break;
            }

            _context12.next = 28;
            break;

          case 6:
            _context12.next = 8;
            return bot.startTyping(sender.id);

          case 8:
            _context12.next = 10;
            return _facebookMessengerBot.Bot.wait(2000);

          case 10:
            _context12.next = 12;
            return (0, _botController.showFlavor)(recipient.id, sender.id, data);

          case 12:
            answer = _context12.sent;
            _context12.next = 15;
            return bot.stopTyping(sender.id);

          case 15:
            _context12.next = 17;
            return bot.send(sender.id, answer);

          case 17:
            _context12.next = 19;
            return bot.startTyping(sender.id);

          case 19:
            _context12.next = 21;
            return _facebookMessengerBot.Bot.wait(1000);

          case 21:
            _context12.next = 23;
            return (0, _botController.showOrderOrNextItem)(recipient.id, sender.id);

          case 23:
            summary = _context12.sent;
            _context12.next = 26;
            return bot.stopTyping(sender.id);

          case 26:
            _context12.next = 28;
            return bot.send(sender.id, summary);

          case 28:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function (_x21, _x22) {
    return _ref12.apply(this, arguments);
  };
}());
/**
 * answered ORDER_CONFIRMATION
 */

bot.on('ORDER_CONFIRMATION',
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(message, data) {
    var sender, recipient, keyState, out, answer;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;
            global.orderState[keyState] = ORDER_STATE_FLAVOR;

            if (!(data === 'confirmation_yes')) {
              _context13.next = 17;
              break;
            }

            _context13.next = 6;
            return bot.startTyping(sender.id);

          case 6:
            _context13.next = 8;
            return _facebookMessengerBot.Bot.wait(1000);

          case 8:
            _context13.next = 10;
            return (0, _botController.confirmOrder)(recipient.id, sender.id);

          case 10:
            out = _context13.sent;
            _context13.next = 13;
            return bot.stopTyping(sender.id);

          case 13:
            _context13.next = 15;
            return bot.send(sender.id, out);

          case 15:
            _context13.next = 27;
            break;

          case 17:
            _context13.next = 19;
            return bot.startTyping(sender.id);

          case 19:
            _context13.next = 21;
            return _facebookMessengerBot.Bot.wait(1000);

          case 21:
            answer = new _facebookMessengerBot.Elements();
            answer.add({
              text: "Perguntar se precisa corrigir algo..."
            });
            _context13.next = 25;
            return bot.stopTyping(sender.id);

          case 25:
            _context13.next = 27;
            return bot.send(sender.id, answer);

          case 27:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function (_x23, _x24) {
    return _ref13.apply(this, arguments);
  };
}());
//# sourceMappingURL=server-bot.js.map