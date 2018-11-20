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

_dotenv.default.config();

_mongoose.default.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true
});

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.Promise = Promise;
global.pagesKeyID = new Object();
var app = (0, _express.default)();
var bot = new _facebookMessengerBot.Bot(process.env.FB_VERIFY_TOKEN, true); // getAllPages().then(async (pageArray) => {
//   for (let i = 0; i < pageArray.length; i++) {
//     const page = pageArray[i];
//     const fields = ['greeting', 'get_started', 'persistent_menu'];
//     bot._token = page.accessToken;
//     const response = await bot.getFields(fields);
//     global.pagesKeyID[page.pageID] = page.accessToken;
//     console.info(`GET fields for ${page.pageID}-${page.name}:`)
//     console.info(response);
//   }
// });
// Beggining - That is all to log in the local timezone
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
app.use('/buckets/facebook',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var doNext, pageID, _ref2, accessToken, name, _time, messageTime;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            doNext = true;

            if (!(req.body && req.body.object === 'page')) {
              _context.next = 26;
              break;
            }

            if (!(req.body.entry.length > 0)) {
              _context.next = 24;
              break;
            }

            _context.prev = 3;
            // Iterates over each entry - there may be multiple if batched
            // for (let i = 0; i < req.body.entry.length; i++) {
            pageID = req.body.entry[0].id;

            if (!(global.pagesKeyID[pageID] && global.pagesKeyID[pageID] !== '')) {
              _context.next = 9;
              break;
            }

            req.token = global.pagesKeyID[pageID];
            _context.next = 16;
            break;

          case 9:
            _context.next = 11;
            return (0, _pagesController.getOnePageToken)(pageID);

          case 11:
            _ref2 = _context.sent;
            accessToken = _ref2.accessToken;
            name = _ref2.name;
            req.token = accessToken;
            global.pagesKeyID[pageID] = accessToken;

          case 16:
            _time = req.body.entry[0].time;
            messageTime = new Date(_time).toLocaleTimeString('pt-BR');
            console.info("".concat(messageTime, " From ").concat(pageID, " memory tokens:").concat(Object.keys(global.pagesKeyID).length));
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](3);
            console.error({
              expressAppUseGetTokenError: _context.t0
            });

          case 24:
            _context.next = 27;
            break;

          case 26:
            console.log('Something came, not a page...');

          case 27:
            if (doNext) next();

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 21]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
app.use('/buckets/facebook', bot.router());
app.listen(process.env.FB_WEBHOOK_PORT, function () {
  return console.log("Bot server listening on port ".concat(process.env.FB_WEBHOOK_PORT));
});
/**
 * Event triggered when the button "GET_STARTED" is pressed.
 */

bot.on('GET_STARTED',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(message) {
    var sender, out1, out2, outError;
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
            console.error('GET_STARTED error:', _context2.t0.message);
            _context2.next = 31;
            return (0, _botController.sendErrorMsg)(_context2.t0.message);

          case 31:
            outError = _context2.sent;
            _context2.next = 34;
            return bot.stopTyping(sender.id);

          case 34:
            _context2.next = 36;
            return bot.send(sender.id, outError);

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 26]]);
  }));

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}()); // all postbacks are emitted via 'postback'

bot.on('postback',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
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

  return function (_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}()); // all postbacks are emitted via 'postback'

bot.on('MAIN-MENU',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(message, data) {
    var sender, recipient, out, user, answer, _out, outError;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context4.prev = 1;
            _context4.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            if (!(data === 'CARDAPIO_PAYLOAD')) {
              _context4.next = 14;
              break;
            }

            _context4.next = 7;
            return (0, _botController.sendCardapio)(message.recipient.id);

          case 7:
            out = _context4.sent;
            _context4.next = 10;
            return bot.stopTyping(sender.id);

          case 10:
            _context4.next = 12;
            return bot.send(sender.id, out);

          case 12:
            _context4.next = 39;
            break;

          case 14:
            if (!(data === 'PEDIDO_PAYLOAD')) {
              _context4.next = 31;
              break;
            }

            _context4.next = 17;
            return bot.startTyping(sender.id);

          case 17:
            _context4.next = 19;
            return _facebookMessengerBot.Bot.wait(1000);

          case 19:
            _context4.next = 21;
            return bot.fetchUser(sender.id);

          case 21:
            user = _context4.sent;
            _context4.next = 24;
            return (0, _botController.confirmAddressOrAskLocation)(recipient.id, sender.id, user);

          case 24:
            answer = _context4.sent;
            _context4.next = 27;
            return bot.stopTyping(sender.id);

          case 27:
            _context4.next = 29;
            return bot.send(sender.id, answer);

          case 29:
            _context4.next = 39;
            break;

          case 31:
            if (!(data === 'HORARIO_PAYLOAD')) {
              _context4.next = 39;
              break;
            }

            _context4.next = 34;
            return (0, _botController.sendHorario)(message.recipient.id);

          case 34:
            _out = _context4.sent;
            _context4.next = 37;
            return bot.stopTyping(sender.id);

          case 37:
            _context4.next = 39;
            return bot.send(sender.id, _out);

          case 39:
            _context4.next = 51;
            break;

          case 41:
            _context4.prev = 41;
            _context4.t0 = _context4["catch"](1);
            console.error('MAIN_MENU error:', _context4.t0.message);
            _context4.next = 46;
            return (0, _botController.sendErrorMsg)(_context4.t0.message);

          case 46:
            outError = _context4.sent;
            _context4.next = 49;
            return bot.stopTyping(sender.id);

          case 49:
            _context4.next = 51;
            return bot.send(sender.id, outError);

          case 51:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 41]]);
  }));

  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}());
/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */

bot.on('message',
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(message) {
    var sender, recipient, location, user, answer, _answer, _answer2, outError;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            sender = message.sender, recipient = message.recipient, location = message.location;
            _context5.prev = 1;

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
            _context5.next = 45;
            break;

          case 20:
            if (!(message.text === 'hello' || message.text === 'hi')) {
              _context5.next = 34;
              break;
            }

            _context5.next = 23;
            return bot.startTyping(sender.id);

          case 23:
            _context5.next = 25;
            return _facebookMessengerBot.Bot.wait(1000);

          case 25:
            _context5.next = 27;
            return (0, _botController.basicReply)();

          case 27:
            _answer = _context5.sent;
            _context5.next = 30;
            return bot.stopTyping(sender.id);

          case 30:
            _context5.next = 32;
            return bot.send(sender.id, _answer);

          case 32:
            _context5.next = 45;
            break;

          case 34:
            _context5.next = 36;
            return bot.startTyping(sender.id);

          case 36:
            _context5.next = 38;
            return _facebookMessengerBot.Bot.wait(1000);

          case 38:
            _context5.next = 40;
            return (0, _botController.confirmTypedText)(recipient.id, sender.id, message);

          case 40:
            _answer2 = _context5.sent;
            _context5.next = 43;
            return bot.stopTyping(sender.id);

          case 43:
            _context5.next = 45;
            return bot.send(sender.id, _answer2);

          case 45:
            _context5.next = 57;
            break;

          case 47:
            _context5.prev = 47;
            _context5.t0 = _context5["catch"](1);
            console.error('on message error:', _context5.t0.message);
            _context5.next = 52;
            return (0, _botController.sendErrorMsg)(_context5.t0.message);

          case 52:
            outError = _context5.sent;
            _context5.next = 55;
            return bot.stopTyping(sender.id);

          case 55:
            _context5.next = 57;
            return bot.send(sender.id, outError);

          case 57:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 47]]);
  }));

  return function (_x10) {
    return _ref6.apply(this, arguments);
  };
}());
/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */

bot.on('quick-reply',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(message, quick_reply) {
    var sender, recipient, payload, answer, out, outError;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            payload = quick_reply.payload;
            _context6.prev = 2;

            if (!payload) {
              _context6.next = 26;
              break;
            }

            _context6.next = 6;
            return bot.startTyping(sender.id);

          case 6:
            _context6.next = 8;
            return _facebookMessengerBot.Bot.wait(1000);

          case 8:
            _context6.next = 10;
            return (0, _botController.showPhone)(recipient.id, sender.id, payload);

          case 10:
            answer = _context6.sent;
            _context6.next = 13;
            return bot.stopTyping(sender.id);

          case 13:
            _context6.next = 15;
            return bot.send(sender.id, answer);

          case 15:
            _context6.next = 17;
            return bot.startTyping(sender.id);

          case 17:
            _context6.next = 19;
            return _facebookMessengerBot.Bot.wait(1000);

          case 19:
            _context6.next = 21;
            return (0, _botController.askForQuantity)(recipient.id, sender.id);

          case 21:
            out = _context6.sent;
            _context6.next = 24;
            return bot.stopTyping(sender.id);

          case 24:
            _context6.next = 26;
            return bot.send(sender.id, out);

          case 26:
            _context6.next = 38;
            break;

          case 28:
            _context6.prev = 28;
            _context6.t0 = _context6["catch"](2);
            console.error('quick-reply error:', _context6.t0.message);
            _context6.next = 33;
            return (0, _botController.sendErrorMsg)(_context6.t0.message);

          case 33:
            outError = _context6.sent;
            _context6.next = 36;
            return bot.stopTyping(sender.id);

          case 36:
            _context6.next = 38;
            return bot.send(sender.id, outError);

          case 38:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[2, 28]]);
  }));

  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}());
/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */

bot.on('CORRECT_SAVED_ADDRESS',
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(message, data) {
    var sender, recipient, answer, out, outError;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context7.prev = 1;
            _context7.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context7.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            _context7.next = 8;
            return (0, _botController.showAddress)(recipient.id, sender.id, data);

          case 8:
            answer = _context7.sent;
            _context7.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context7.next = 13;
            return bot.send(sender.id, answer);

          case 13:
            _context7.next = 15;
            return (0, _botController.askForPhone)(recipient.id, sender.id);

          case 15:
            out = _context7.sent;
            _context7.next = 18;
            return _facebookMessengerBot.Bot.wait(1000);

          case 18:
            _context7.next = 20;
            return bot.stopTyping(sender.id);

          case 20:
            _context7.next = 22;
            return bot.send(sender.id, out);

          case 22:
            _context7.next = 34;
            break;

          case 24:
            _context7.prev = 24;
            _context7.t0 = _context7["catch"](1);
            console.error('CORRECT_SAVED_ADDRESS:', _context7.t0.message);
            _context7.next = 29;
            return (0, _botController.sendErrorMsg)(_context7.t0.message);

          case 29:
            outError = _context7.sent;
            _context7.next = 32;
            return bot.stopTyping(sender.id);

          case 32:
            _context7.next = 34;
            return bot.send(sender.id, outError);

          case 34:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this, [[1, 24]]);
  }));

  return function (_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}());
/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */

bot.on('LOCATION_ADDRESS',
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(message, data) {
    var sender, recipient, answer, _answer3, out, outError;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context8.prev = 1;

            if (!(data === 'incorrect_address')) {
              _context8.next = 16;
              break;
            }

            _context8.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context8.next = 7;
            return _facebookMessengerBot.Bot.wait(1000);

          case 7:
            _context8.next = 9;
            return (0, _botController.askToTypeAddress)(recipient.id, sender.id);

          case 9:
            answer = _context8.sent;
            _context8.next = 12;
            return bot.stopTyping(sender.id);

          case 12:
            _context8.next = 14;
            return bot.send(sender.id, answer);

          case 14:
            _context8.next = 38;
            break;

          case 16:
            _context8.next = 18;
            return bot.startTyping(sender.id);

          case 18:
            _context8.next = 20;
            return _facebookMessengerBot.Bot.wait(1000);

          case 20:
            _context8.next = 22;
            return (0, _botController.showAddress)(recipient.id, sender.id, data);

          case 22:
            _answer3 = _context8.sent;
            _context8.next = 25;
            return bot.stopTyping(sender.id);

          case 25:
            _context8.next = 27;
            return bot.send(sender.id, _answer3);

          case 27:
            _context8.next = 29;
            return bot.startTyping(sender.id);

          case 29:
            _context8.next = 31;
            return _facebookMessengerBot.Bot.wait(1000);

          case 31:
            _context8.next = 33;
            return (0, _botController.showOrderOrAskForPhone)(recipient.id, sender.id);

          case 33:
            out = _context8.sent;
            _context8.next = 36;
            return bot.stopTyping(sender.id);

          case 36:
            _context8.next = 38;
            return bot.send(sender.id, out);

          case 38:
            _context8.next = 50;
            break;

          case 40:
            _context8.prev = 40;
            _context8.t0 = _context8["catch"](1);
            console.error('LOCATION_ADDRESS:', _context8.t0.message);
            _context8.next = 45;
            return (0, _botController.sendErrorMsg)(_context8.t0.message);

          case 45:
            outError = _context8.sent;
            _context8.next = 48;
            return bot.stopTyping(sender.id);

          case 48:
            _context8.next = 50;
            return bot.send(sender.id, outError);

          case 50:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this, [[1, 40]]);
  }));

  return function (_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}());
/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */

bot.on('WRONG_SAVED_ADDRESS',
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(message, data) {
    var sender, recipient, out, outError;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context9.prev = 1;
            _context9.next = 4;
            return (0, _botController.askForLocation)();

          case 4:
            out = _context9.sent;
            _context9.next = 7;
            return _facebookMessengerBot.Bot.wait(1000);

          case 7:
            _context9.next = 9;
            return bot.stopTyping(sender.id);

          case 9:
            _context9.next = 11;
            return bot.send(sender.id, out);

          case 11:
            _context9.next = 23;
            break;

          case 13:
            _context9.prev = 13;
            _context9.t0 = _context9["catch"](1);
            console.error('WRONG_SAVED_ADDRESS:', _context9.t0.message);
            _context9.next = 18;
            return (0, _botController.sendErrorMsg)(_context9.t0.message);

          case 18:
            outError = _context9.sent;
            _context9.next = 21;
            return bot.stopTyping(sender.id);

          case 21:
            _context9.next = 23;
            return bot.send(sender.id, outError);

          case 23:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this, [[1, 13]]);
  }));

  return function (_x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}());
bot.on('PHONE_CONFIRMED',
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(message, data) {
    var sender, recipient, out, answer, _out2, outError;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context10.prev = 1;

            if (!(data === 'change_phone')) {
              _context10.next = 14;
              break;
            }

            _context10.next = 5;
            return (0, _botController.askToTypePhone)(recipient.id, sender.id);

          case 5:
            out = _context10.sent;
            _context10.next = 8;
            return _facebookMessengerBot.Bot.wait(1000);

          case 8:
            _context10.next = 10;
            return bot.stopTyping(sender.id);

          case 10:
            _context10.next = 12;
            return bot.send(sender.id, out);

          case 12:
            _context10.next = 36;
            break;

          case 14:
            _context10.next = 16;
            return bot.startTyping(sender.id);

          case 16:
            _context10.next = 18;
            return _facebookMessengerBot.Bot.wait(1000);

          case 18:
            _context10.next = 20;
            return (0, _botController.showPhone)(recipient.id, sender.id, data);

          case 20:
            answer = _context10.sent;
            _context10.next = 23;
            return bot.stopTyping(sender.id);

          case 23:
            _context10.next = 25;
            return bot.send(sender.id, answer);

          case 25:
            _context10.next = 27;
            return bot.startTyping(sender.id);

          case 27:
            _context10.next = 29;
            return _facebookMessengerBot.Bot.wait(1000);

          case 29:
            _context10.next = 31;
            return (0, _botController.askForQuantity)(recipient.id, sender.id);

          case 31:
            _out2 = _context10.sent;
            _context10.next = 34;
            return bot.stopTyping(sender.id);

          case 34:
            _context10.next = 36;
            return bot.send(sender.id, _out2);

          case 36:
            _context10.next = 48;
            break;

          case 38:
            _context10.prev = 38;
            _context10.t0 = _context10["catch"](1);
            console.error('PHONE_CONFIRMED:', _context10.t0.message);
            _context10.next = 43;
            return (0, _botController.sendErrorMsg)(_context10.t0.message);

          case 43:
            outError = _context10.sent;
            _context10.next = 46;
            return bot.stopTyping(sender.id);

          case 46:
            _context10.next = 48;
            return bot.send(sender.id, outError);

          case 48:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this, [[1, 38]]);
  }));

  return function (_x19, _x20) {
    return _ref11.apply(this, arguments);
  };
}());
/**
 * answered ORDER_QTY
 * gonna ask for SIZE
 */

bot.on('ORDER_QTY',
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(message, data) {
    var sender, recipient, out, answer, _out3, outError;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context11.prev = 1;

            if (!(data && data === 'qty_more')) {
              _context11.next = 16;
              break;
            }

            _context11.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context11.next = 7;
            return _facebookMessengerBot.Bot.wait(1000);

          case 7:
            _context11.next = 9;
            return (0, _botController.askForQuantityMore)();

          case 9:
            out = _context11.sent;
            _context11.next = 12;
            return bot.stopTyping(sender.id);

          case 12:
            _context11.next = 14;
            return bot.send(sender.id, out);

          case 14:
            _context11.next = 38;
            break;

          case 16:
            _context11.next = 18;
            return bot.startTyping(sender.id);

          case 18:
            _context11.next = 20;
            return _facebookMessengerBot.Bot.wait(1000);

          case 20:
            _context11.next = 22;
            return (0, _botController.showQuantity)(recipient.id, sender.id, data);

          case 22:
            answer = _context11.sent;
            _context11.next = 25;
            return bot.stopTyping(sender.id);

          case 25:
            _context11.next = 27;
            return bot.send(sender.id, answer);

          case 27:
            _context11.next = 29;
            return bot.startTyping(sender.id);

          case 29:
            _context11.next = 31;
            return _facebookMessengerBot.Bot.wait(1000);

          case 31:
            _context11.next = 33;
            return (0, _botController.askForSize)(recipient.id, sender.id);

          case 33:
            _out3 = _context11.sent;
            _context11.next = 36;
            return bot.stopTyping(sender.id);

          case 36:
            _context11.next = 38;
            return bot.send(sender.id, _out3);

          case 38:
            _context11.next = 50;
            break;

          case 40:
            _context11.prev = 40;
            _context11.t0 = _context11["catch"](1);
            console.error('ORDER_QTY:', _context11.t0.message);
            _context11.next = 45;
            return (0, _botController.sendErrorMsg)(_context11.t0.message);

          case 45:
            outError = _context11.sent;
            _context11.next = 48;
            return bot.stopTyping(sender.id);

          case 48:
            _context11.next = 50;
            return bot.send(sender.id, outError);

          case 50:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this, [[1, 40]]);
  }));

  return function (_x21, _x22) {
    return _ref12.apply(this, arguments);
  };
}());
/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */

bot.on('ORDER_SIZE',
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(message, data) {
    var sender, recipient, answer, out, outError;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context12.prev = 1;
            _context12.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context12.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            _context12.next = 8;
            return (0, _botController.showSize)(recipient.id, sender.id, data);

          case 8:
            answer = _context12.sent;
            _context12.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context12.next = 13;
            return bot.send(sender.id, answer);

          case 13:
            _context12.next = 15;
            return bot.startTyping(sender.id);

          case 15:
            _context12.next = 17;
            return _facebookMessengerBot.Bot.wait(1000);

          case 17:
            _context12.next = 19;
            return (0, _botController.askForFlavorOrConfirm)(message.recipient.id, sender.id, 1);

          case 19:
            out = _context12.sent;
            _context12.next = 22;
            return bot.stopTyping(sender.id);

          case 22:
            _context12.next = 24;
            return bot.send(sender.id, out);

          case 24:
            _context12.next = 36;
            break;

          case 26:
            _context12.prev = 26;
            _context12.t0 = _context12["catch"](1);
            console.error('ORDER_SIZE:', _context12.t0.message);
            _context12.next = 31;
            return (0, _botController.sendErrorMsg)(_context12.t0.message);

          case 31:
            outError = _context12.sent;
            _context12.next = 34;
            return bot.stopTyping(sender.id);

          case 34:
            _context12.next = 36;
            return bot.send(sender.id, outError);

          case 36:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this, [[1, 26]]);
  }));

  return function (_x23, _x24) {
    return _ref13.apply(this, arguments);
  };
}());
/**
 * answered ORDER_FLAVOR
 * gonna ask for confirmation
 */

bot.on('ORDER_FLAVOR',
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(message, data) {
    var sender, recipient, out, answer, summary, outError;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context13.prev = 1;

            if (!(data && data.option && data.option === 'flavors_more')) {
              _context13.next = 16;
              break;
            }

            _context13.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context13.next = 7;
            return _facebookMessengerBot.Bot.wait(1000);

          case 7:
            _context13.next = 9;
            return (0, _botController.askForFlavor)(message.recipient.id, sender.id, data.multiple);

          case 9:
            out = _context13.sent;
            _context13.next = 12;
            return bot.stopTyping(sender.id);

          case 12:
            _context13.next = 14;
            return bot.send(sender.id, out);

          case 14:
            _context13.next = 38;
            break;

          case 16:
            _context13.next = 18;
            return bot.startTyping(sender.id);

          case 18:
            _context13.next = 20;
            return _facebookMessengerBot.Bot.wait(1000);

          case 20:
            _context13.next = 22;
            return (0, _botController.showFlavor)(recipient.id, sender.id, data);

          case 22:
            answer = _context13.sent;
            _context13.next = 25;
            return bot.stopTyping(sender.id);

          case 25:
            _context13.next = 27;
            return bot.send(sender.id, answer);

          case 27:
            _context13.next = 29;
            return bot.startTyping(sender.id);

          case 29:
            _context13.next = 31;
            return _facebookMessengerBot.Bot.wait(1000);

          case 31:
            _context13.next = 33;
            return (0, _botController.showOrderOrNextItem)(recipient.id, sender.id);

          case 33:
            summary = _context13.sent;
            _context13.next = 36;
            return bot.stopTyping(sender.id);

          case 36:
            _context13.next = 38;
            return bot.send(sender.id, summary);

          case 38:
            _context13.next = 50;
            break;

          case 40:
            _context13.prev = 40;
            _context13.t0 = _context13["catch"](1);
            console.error('ORDER_FLAVOR:', _context13.t0.message);
            _context13.next = 45;
            return (0, _botController.sendErrorMsg)(_context13.t0.message);

          case 45:
            outError = _context13.sent;
            _context13.next = 48;
            return bot.stopTyping(sender.id);

          case 48:
            _context13.next = 50;
            return bot.send(sender.id, outError);

          case 50:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this, [[1, 40]]);
  }));

  return function (_x25, _x26) {
    return _ref14.apply(this, arguments);
  };
}());
/**
 * answered ORDER_CONFIRMATION
 */

bot.on('ORDER_CONFIRMATION',
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(message, data) {
    var sender, recipient, out, _out4, outError;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context14.prev = 1;

            if (!(data === 'confirmation_yes')) {
              _context14.next = 17;
              break;
            }

            _context14.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context14.next = 7;
            return _facebookMessengerBot.Bot.wait(1000);

          case 7:
            _context14.next = 9;
            return (0, _botController.confirmOrder)(recipient.id, sender.id);

          case 9:
            out = _context14.sent;
            _context14.next = 12;
            return bot.stopTyping(sender.id);

          case 12:
            _context14.next = 14;
            return bot.send(sender.id, out);

          case 14:
            delete global.pagesKeyID[recipient.id];
            _context14.next = 29;
            break;

          case 17:
            if (!(data === 'confirmation_no')) {
              _context14.next = 29;
              break;
            }

            _context14.next = 20;
            return bot.startTyping(sender.id);

          case 20:
            _context14.next = 22;
            return _facebookMessengerBot.Bot.wait(1000);

          case 22:
            _context14.next = 24;
            return (0, _botController.askForChangeOrder)(recipient.id, sender.id);

          case 24:
            _out4 = _context14.sent;
            _context14.next = 27;
            return bot.stopTyping(sender.id);

          case 27:
            _context14.next = 29;
            return bot.send(sender.id, _out4);

          case 29:
            _context14.next = 41;
            break;

          case 31:
            _context14.prev = 31;
            _context14.t0 = _context14["catch"](1);
            console.error('ORDER_CONFIRMATION:', _context14.t0.message);
            _context14.next = 36;
            return (0, _botController.sendErrorMsg)(_context14.t0.message);

          case 36:
            outError = _context14.sent;
            _context14.next = 39;
            return bot.stopTyping(sender.id);

          case 39:
            _context14.next = 41;
            return bot.send(sender.id, outError);

          case 41:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, this, [[1, 31]]);
  }));

  return function (_x27, _x28) {
    return _ref15.apply(this, arguments);
  };
}());
/**
 * answered wants change something in the order
 */

bot.on('ORDER_WANT_CHANGE',
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(message, data) {
    var sender, recipient, out, outError;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context15.prev = 1;
            _context15.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context15.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            _context15.next = 8;
            return (0, _botController.askForSpecificItem)(recipient.id, sender.id);

          case 8:
            out = _context15.sent;
            _context15.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context15.next = 13;
            return bot.send(sender.id, out);

          case 13:
            _context15.next = 25;
            break;

          case 15:
            _context15.prev = 15;
            _context15.t0 = _context15["catch"](1);
            console.error('ORDER_WANT_CHANGE:', _context15.t0.message);
            _context15.next = 20;
            return (0, _botController.sendErrorMsg)(_context15.t0.message);

          case 20:
            outError = _context15.sent;
            _context15.next = 23;
            return bot.stopTyping(sender.id);

          case 23:
            _context15.next = 25;
            return bot.send(sender.id, outError);

          case 25:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, this, [[1, 15]]);
  }));

  return function (_x29, _x30) {
    return _ref16.apply(this, arguments);
  };
}());
bot.on('ORDER_CHANGE',
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(message, data) {
    var sender, recipient, out, outError;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context16.prev = 1;
            _context16.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context16.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            if (!(data === 'change_quantity')) {
              _context16.next = 12;
              break;
            }

            _context16.next = 9;
            return (0, _botController.askForQuantity)(recipient.id, sender.id);

          case 9:
            out = _context16.sent;
            _context16.next = 28;
            break;

          case 12:
            if (!(data === 'change_size')) {
              _context16.next = 18;
              break;
            }

            _context16.next = 15;
            return (0, _botController.askForSize)(recipient.id, sender.id);

          case 15:
            out = _context16.sent;
            _context16.next = 28;
            break;

          case 18:
            if (!(data === 'change_flavor')) {
              _context16.next = 24;
              break;
            }

            _context16.next = 21;
            return (0, _botController.askForFlavor)(message.recipient.id, sender.id, 1);

          case 21:
            out = _context16.sent;
            _context16.next = 28;
            break;

          case 24:
            if (!(data === 'change_address')) {
              _context16.next = 28;
              break;
            }

            _context16.next = 27;
            return (0, _botController.askForLocation)();

          case 27:
            out = _context16.sent;

          case 28:
            _context16.next = 30;
            return bot.stopTyping(sender.id);

          case 30:
            _context16.next = 32;
            return bot.send(sender.id, out);

          case 32:
            _context16.next = 44;
            break;

          case 34:
            _context16.prev = 34;
            _context16.t0 = _context16["catch"](1);
            console.error('ORDER_CHANGE:', _context16.t0.message);
            _context16.next = 39;
            return (0, _botController.sendErrorMsg)(_context16.t0.message);

          case 39:
            outError = _context16.sent;
            _context16.next = 42;
            return bot.stopTyping(sender.id);

          case 42:
            _context16.next = 44;
            return bot.send(sender.id, outError);

          case 44:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, this, [[1, 34]]);
  }));

  return function (_x31, _x32) {
    return _ref17.apply(this, arguments);
  };
}());
bot.on('ORDER_CHANGE_SELECT_ITEM',
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(message, data) {
    var sender, recipient, out, outError;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            _context17.prev = 1;
            _context17.next = 4;
            return bot.startTyping(sender.id);

          case 4:
            _context17.next = 6;
            return _facebookMessengerBot.Bot.wait(1000);

          case 6:
            _context17.next = 8;
            return (0, _botController.updateItemAskOptions)(recipient.id, sender.id, data);

          case 8:
            out = _context17.sent;
            _context17.next = 11;
            return bot.stopTyping(sender.id);

          case 11:
            _context17.next = 13;
            return bot.send(sender.id, out);

          case 13:
            _context17.next = 25;
            break;

          case 15:
            _context17.prev = 15;
            _context17.t0 = _context17["catch"](1);
            console.error('ORDER_CHANGE_SELECT_ITEM:', _context17.t0.message);
            _context17.next = 20;
            return (0, _botController.sendErrorMsg)(_context17.t0.message);

          case 20:
            outError = _context17.sent;
            _context17.next = 23;
            return bot.stopTyping(sender.id);

          case 23:
            _context17.next = 25;
            return bot.send(sender.id, outError);

          case 25:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, this, [[1, 15]]);
  }));

  return function (_x33, _x34) {
    return _ref18.apply(this, arguments);
  };
}());
//# sourceMappingURL=server-bot.js.map