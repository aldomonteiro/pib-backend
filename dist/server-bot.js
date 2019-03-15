"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _debug = _interopRequireDefault(require("debug"));

var _facebookMessengerBot = require("facebook-messenger-bot");

var _pagesController = require("./api/controllers/pagesController");

var _botController = require("./api/bot/botController");

var _actionsController = require("./api/bot/actionsController");

var _mkt_contact_controller = require("./api/controllers/mkt_contact_controller");

var _botMarkController = require("./api/bot/botMarkController");

var _whatController = require("./api/whatsapp/whatController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv.default.config();

var env = process.env.NODE_ENV || 'production';
var debug = (0, _debug.default)('server-bot'); // --- START MongoDB connection -----------------------------

var mongo_url = process.env.DEV_MONGODB_URL;
if (env === 'production') mongo_url = process.env.PRD_MONGODB_URL;
var RETRY_TIMEOUT = 3000;
var options = {
  useNewUrlParser: true,
  autoReconnect: true,
  keepAlive: 30000,
  reconnectInterval: RETRY_TIMEOUT,
  reconnectTries: 10000
};
var isConnectedBefore = false;

var connect = function connect() {
  return _mongoose.default.connect(mongo_url, options).catch(function (err) {
    return console.error('Mongoose connect(...) failed with err: ', err);
  });
};

connect();

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.set('useFindAndModify', false);

_mongoose.default.Promise = Promise;

_mongoose.default.connection.on('error', function () {
  console.error('Could not connect to MongoDB');
});

_mongoose.default.connection.on('disconnected', function () {
  console.error('Lost MongoDB connection...');

  if (!isConnectedBefore) {
    setTimeout(function () {
      return connect();
    }, RETRY_TIMEOUT);
  }
});

_mongoose.default.connection.on('connected', function () {
  isConnectedBefore = true;
  console.info('Connection established to MongoDB');
});

_mongoose.default.connection.on('reconnected', function () {
  console.info('Reconnected to MongoDB');
}); // Close the Mongoose connection, when receiving SIGINT


process.on('SIGINT', function () {
  _mongoose.default.connection.close(function () {
    console.warn('Force to close the MongoDB connection after SIGINT');
    process.exit(0);
  });
}); // --- END MongoDB connection -----------------------------

global.pagesKeyID = {};
global.pagesMarketing = {};
var app = (0, _express.default)();
var bot = new _facebookMessengerBot.Bot(process.env.FB_VERIFY_TOKEN, true); // Beggining - That is all to log in the local timezone
// eslint-disable-next-line max-len
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan

_morgan.default.token('date', function (req, res, tz) {
  return (0, _momentTimezone.default)().tz(tz).format();
}); // eslint-disable-next-line max-len


_morgan.default.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use((0, _morgan.default)('myformat')); // End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization,Origin,X-Requested-With,Content-Type,Accept,application/json,Content-Range');
  res.header('Access-Control-Expose-Headers', 'Content-Range');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use('/buckets/facebook',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var doNext, pageID, timerIdentifier, _ref2, accessToken, name, marketing;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            doNext = true;

            if (!(req.body && req.body.object === 'page')) {
              _context.next = 32;
              break;
            }

            if (!(req.body.entry.length > 0)) {
              _context.next = 30;
              break;
            }

            _context.prev = 3;
            // Iterates over each entry - there may be multiple if batched
            // for (let i = 0; i < req.body.entry.length; i++) {
            pageID = req.body.entry[0].id;

            if (!(global.pagesKeyID[pageID] && global.pagesKeyID[pageID] !== '')) {
              _context.next = 10;
              break;
            }

            req.token = global.pagesKeyID[pageID];
            req.marketing = global.pagesMarketing[pageID];
            _context.next = 25;
            break;

          case 10:
            timerIdentifier = 'getOnePageToken' + Math.random();
            console.time(timerIdentifier);
            _context.next = 14;
            return (0, _pagesController.getOnePageToken)(pageID);

          case 14:
            _ref2 = _context.sent;
            accessToken = _ref2.accessToken;
            name = _ref2.name;
            marketing = _ref2.marketing;
            console.timeEnd(timerIdentifier);
            req.token = accessToken;
            req.marketing = marketing;
            debug('server-bot use buckets req.marketing:', req.marketing);
            console.info("\x1B[45m /buckets/facebook \x1B[0m, pageID:\x1B[32m".concat(pageID, "\x1B[0m, page name:\x1B[32m").concat(name, "\x1B[0m, req.mkt:\x1B[32m").concat(req.marketing, "\x1B[0m"));
            global.pagesKeyID[pageID] = accessToken;
            global.pagesMarketing[pageID] = marketing;

          case 25:
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](3);
            console.error({
              expressAppUseGetTokenError: _context.t0
            });

          case 30:
            _context.next = 33;
            break;

          case 32:
            console.log('Something came, not a page...');

          case 33:
            if (doNext) next();

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 27]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
app.use('/buckets/whatsapp',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var message, sender, text, response, args, replyData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!req.body) {
              _context2.next = 33;
              break;
            }

            if (!(req.body.event === 'message')) {
              _context2.next = 25;
              break;
            }

            _context2.prev = 2;
            message = req.body;
            console.info('##### WHATSAPP req.body #####');
            console.info(message);
            console.info('#############################');
            sender = message.contact.uid;

            if (!(message.message.type === 'chat' && message.message.dir === 'i')) {
              _context2.next = 18;
              break;
            }

            _context2.next = 11;
            return (0, _whatController.w_sendMainMenu)();

          case 11:
            text = _context2.sent;
            _context2.next = 14;
            return (0, _whatController.waboxapp_sendMessage)(sender, text);

          case 14:
            response = _context2.sent;
            console.info('##### WHATSAPP response #####');
            console.info(response);
            console.info('#############################');

          case 18:
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](2);
            console.error({
              err: _context2.t0
            });

          case 23:
            _context2.next = 31;
            break;

          case 25:
            // ---------> Receiving data from Whatsapp Web <----------
            args = req.body.args;

            if (!args) {
              _context2.next = 31;
              break;
            }

            _context2.next = 29;
            return (0, _whatController.w_controller)(args);

          case 29:
            replyData = _context2.sent;
            res.json({
              message: replyData
            });

          case 31:
            _context2.next = 35;
            break;

          case 33:
            console.info('***** No Body?? ****');
            console.info(req);

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 20]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
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
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(message) {
    var sender, recipient, outError;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            console.info("\x1B[43mGET_STARTED\x1B[0m, event:\x1B[32m".concat(message.event, "\x1B[0m, sender.id:\x1B[32m").concat(sender.id, "\x1B[0m, recipient.id:\x1B[32m").concat(recipient.id, "\x1B[0m, bot.mkt:\x1B[32m").concat(bot.marketing, "\x1B[0m"));
            _context3.prev = 2;
            _context3.next = 5;
            return (0, _actionsController.sendActions)({
              action: 'SEND_WELCOME',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              last_answer: message.event
            });

          case 5:
            if (!bot.marketing) {
              _context3.next = 10;
              break;
            }

            _context3.next = 8;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              data: 'GET_STARTED'
            });

          case 8:
            _context3.next = 12;
            break;

          case 10:
            _context3.next = 12;
            return (0, _actionsController.sendActions)({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              last_answer: message.event
            });

          case 12:
            _context3.next = 24;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](2);
            console.error('GET_STARTED error:', _context3.t0.message);
            _context3.next = 19;
            return (0, _botController.sendErrorMsg)(_context3.t0.message);

          case 19:
            outError = _context3.sent;
            _context3.next = 22;
            return bot.stopTyping(sender.id);

          case 22:
            _context3.next = 24;
            return bot.send(sender.id, outError);

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 14]]);
  }));

  return function (_x7) {
    return _ref4.apply(this, arguments);
  };
}()); // all postbacks are emitted via 'postback'

bot.on('postback',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(event, message, data) {
    var sender, recipient;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            console.info("\x1B[43mPostback\x1B[0m, event:\x1B[32m".concat(event, "\x1B[0m, data:\x1B[32m").concat(data, "\x1B[0m, sender.id:\x1B[32m").concat(sender.id, "\x1B[0m, recipient.id:\x1B[32m").concat(recipient.id, "\x1B[0m, bot.mkt:\x1B[32m").concat(bot.marketing, "\x1B[0m"));

            if (!(event === 'PIZZAIBOT_MARKETING')) {
              _context4.next = 12;
              break;
            }

            if (!(data === 'testtypecustomer_begin')) {
              _context4.next = 8;
              break;
            }

            _context4.next = 6;
            return (0, _actionsController.sendActions)({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              last_answer: message.event
            });

          case 6:
            _context4.next = 10;
            break;

          case 8:
            _context4.next = 10;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              data: data
            });

          case 10:
            _context4.next = 14;
            break;

          case 12:
            _context4.next = 14;
            return (0, _actionsController.mapEventsActions)({
              event: event,
              data: data,
              bot: bot,
              sender: sender,
              pageID: recipient.id
            });

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
/**
 * Question No.02 (location)
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */

bot.on('message',
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(message) {
    var sender, recipient, location, text, _orderFlow, mktContact, _data, eAgradecimento, agradecimentosFinais, i, outError;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            sender = message.sender, recipient = message.recipient, location = message.location, text = message.text;
            console.info("\x1B[43m on message \x1B[0m, sender.id:\x1B[32m".concat(sender.id, "\x1B[0m, recipient.id:\x1B[32m").concat(recipient.id, "\x1B[0m, message.text:\x1B[32m").concat(text && text.substr(0, 15), "\x1B[0m, bot.mkt:\x1B[32m").concat(bot.marketing, "\x1B[0m"));
            _context5.prev = 2;

            if (!location) {
              _context5.next = 8;
              break;
            }

            _context5.next = 6;
            return (0, _actionsController.sendActions)({
              action: 'LOCATION_CONFIRM_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              location: location
            });

          case 6:
            _context5.next = 63;
            break;

          case 8:
            if (!(text === 'hello' || text === 'hi')) {
              _context5.next = 13;
              break;
            }

            _context5.next = 11;
            return (0, _actionsController.sendActions)({
              action: 'BASIC_REPLY',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              data: 'Hello, how are you doing? Currently, I am working only in Portuguese, but, soon enough, your favorite restaurant will be with me.'
            });

          case 11:
            _context5.next = 63;
            break;

          case 13:
            _orderFlow = true;

            if (!bot.marketing) {
              _context5.next = 60;
              break;
            }

            _orderFlow = false; // if it is an action from the marketing, so, this assures the order flow isn't called.

            _context5.next = 18;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: recipient.id,
              userID: sender.id
            });

          case 18:
            mktContact = _context5.sent;

            if (!(mktContact.last_answer === 'testtype_customer')) {
              _context5.next = 23;
              break;
            }

            _orderFlow = true; // this assures the order flow will continue and marketing won't be called.

            _context5.next = 60;
            break;

          case 23:
            _data = 'open_question';
            eAgradecimento = false;

            if (!(mktContact.final === true)) {
              _context5.next = 38;
              break;
            }

            agradecimentosFinais = ['obrigad', 'brigadu', 'thanks', 'tks', 'valeu', 'muito obrigado', 'show', 'muito bom', 'legal', 'ok'];
            i = 0;

          case 28:
            if (!(i < agradecimentosFinais.length)) {
              _context5.next = 35;
              break;
            }

            if (!text.includes(agradecimentosFinais[i])) {
              _context5.next = 32;
              break;
            }

            eAgradecimento = true;
            return _context5.abrupt("break", 35);

          case 32:
            i++;
            _context5.next = 28;
            break;

          case 35:
            if (!eAgradecimento) _data = 'returned_customer';
            _context5.next = 57;
            break;

          case 38:
            if (!(mktContact.last_answer === 'finalquestion_mail')) {
              _context5.next = 42;
              break;
            }

            _data = 'contact_mail';
            _context5.next = 57;
            break;

          case 42:
            if (!(mktContact.last_answer === 'finalquestion_phone')) {
              _context5.next = 46;
              break;
            }

            _data = 'contact_phone';
            _context5.next = 57;
            break;

          case 46:
            if (!(mktContact.last_answer === 'type_phone' || mktContact.last_answer === 'retype_phone')) {
              _context5.next = 50;
              break;
            }

            _data = 'contact_phone';
            _context5.next = 57;
            break;

          case 50:
            if (!(mktContact.last_answer === 'orderConfirmation_question')) {
              _context5.next = 54;
              break;
            }

            _data = 'open_question';
            _context5.next = 57;
            break;

          case 54:
            _context5.next = 56;
            return (0, _botMarkController.m_checkLastQuestion)(recipient.id, sender.id);

          case 56:
            _data = _context5.sent;

          case 57:
            if (eAgradecimento) {
              _context5.next = 60;
              break;
            }

            _context5.next = 60;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: message.recipient.id,
              data: _data,
              text: text
            });

          case 60:
            if (!_orderFlow) {
              _context5.next = 63;
              break;
            }

            _context5.next = 63;
            return (0, _actionsController.checkTypedText)({
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              text: text
            });

          case 63:
            _context5.next = 75;
            break;

          case 65:
            _context5.prev = 65;
            _context5.t0 = _context5["catch"](2);
            console.error({
              onMessageError: _context5.t0
            });
            _context5.next = 70;
            return (0, _botController.sendErrorMsg)(_context5.t0.message);

          case 70:
            outError = _context5.sent;
            _context5.next = 73;
            return bot.stopTyping(sender.id);

          case 73:
            _context5.next = 75;
            return bot.send(sender.id, outError);

          case 75:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 65]]);
  }));

  return function (_x11) {
    return _ref6.apply(this, arguments);
  };
}());
/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 * Dealing with marketing.
 */

bot.on('quick-reply',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(message, quick_reply) {
    var sender, recipient, payload, _orderFlow, mktContact, outError;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            payload = quick_reply.payload;
            console.info("\x1B[43m quick-reply \x1B[0m, sender.id:\x1B[32m".concat(sender.id, "\x1B[0m, recipient.id:\x1B[32m").concat(recipient.id, "\x1B[0m, payload:\x1B[32m").concat(payload, "\x1B[0m, bot.mkt:\x1B[32m").concat(bot.marketing, "\x1B[0m"));
            _context6.prev = 3;

            if (!payload) {
              _context6.next = 22;
              break;
            }

            /**
            * Both marketing and Order flow use this quick_reply answer, so, I am
            * checking if marketing is in a state where an test order has been placed and, if so,
            * I redirect the flow to the order.
            */
            _orderFlow = true;

            if (!bot.marketing) {
              _context6.next = 17;
              break;
            }

            _orderFlow = false; // if it is an action from the marketing, so, this assures the order flow isn't called.

            _context6.next = 10;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: recipient.id,
              userID: sender.id
            });

          case 10:
            mktContact = _context6.sent;

            if (!(mktContact.last_answer === 'testtype_customer')) {
              _context6.next = 15;
              break;
            }

            _orderFlow = true; // this assures the order flow will continue and marketing won't be called.

            _context6.next = 17;
            break;

          case 15:
            _context6.next = 17;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              payload: payload,
              data: 'contact_phone'
            });

          case 17:
            if (!_orderFlow) {
              _context6.next = 22;
              break;
            }

            _context6.next = 20;
            return (0, _actionsController.sendActions)({
              action: 'SHOW_PHONE',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              payload: payload
            });

          case 20:
            _context6.next = 22;
            return (0, _actionsController.sendActions)({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: recipient.id
            });

          case 22:
            _context6.next = 34;
            break;

          case 24:
            _context6.prev = 24;
            _context6.t0 = _context6["catch"](3);
            console.error({
              quickReplyError: _context6.t0
            });
            _context6.next = 29;
            return (0, _botController.sendErrorMsg)(_context6.t0.message);

          case 29:
            outError = _context6.sent;
            _context6.next = 32;
            return bot.stopTyping(sender.id);

          case 32:
            _context6.next = 34;
            return bot.send(sender.id, outError);

          case 34:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 24]]);
  }));

  return function (_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}());
bot.on('read',
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(message) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x14) {
    return _ref8.apply(this, arguments);
  };
}());
bot.on('delivery',
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(message) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15) {
    return _ref9.apply(this, arguments);
  };
}());
//# sourceMappingURL=server-bot.js.map