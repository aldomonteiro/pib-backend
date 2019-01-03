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

var _pricingsController = require("./api/controllers/pricingsController");

var _show_cardapio = _interopRequireDefault(require("./api/bot/show_cardapio"));

var _util = require("./api/util/util");

var _botController = require("./api/bot/botController");

var _actionsController = require("./api/bot/actionsController");

var _mkt_contact_controller = require("./api/controllers/mkt_contact_controller");

var _botMarkController = require("./api/bot/botMarkController");

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

global.pagesKeyID = new Object();
global.pagesMarketing = new Object();
var app = (0, _express.default)();
var bot = new _facebookMessengerBot.Bot(process.env.FB_VERIFY_TOKEN, true); // Beggining - That is all to log in the local timezone
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
    var doNext, pageID, timerIdentifier, _ref2, accessToken, name, marketing;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            doNext = true;

            if (!(req.body && req.body.object === 'page')) {
              _context.next = 31;
              break;
            }

            if (!(req.body.entry.length > 0)) {
              _context.next = 29;
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
            _context.next = 24;
            break;

          case 10:
            timerIdentifier = "getOnePageToken" + Math.random();
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
            global.pagesKeyID[pageID] = accessToken;
            global.pagesMarketing[pageID] = marketing;

          case 24:
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](3);
            console.error({
              expressAppUseGetTokenError: _context.t0
            });

          case 29:
            _context.next = 32;
            break;

          case 31:
            console.log('Something came, not a page...');

          case 32:
            if (doNext) next();

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 26]]);
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
    var sender, recipient, outError;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            console.info("\x1B[43mGET_STARTED\x1B[0m, event:\x1B[32m".concat(message.event, "\x1B[0m, sender.id:\x1B[32m").concat(sender.id, "\x1B[0m, recipient.id:\x1B[32m").concat(recipient.id, "\x1B[0m, bot.mkt:\x1B[32m").concat(bot.marketing, "\x1B[0m"));
            _context2.prev = 2;
            _context2.next = 5;
            return (0, _actionsController.sendActions)({
              action: 'SEND_WELCOME',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              last_answer: message.event
            });

          case 5:
            if (!bot.marketing) {
              _context2.next = 10;
              break;
            }

            _context2.next = 8;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              data: 'GET_STARTED'
            });

          case 8:
            _context2.next = 12;
            break;

          case 10:
            _context2.next = 12;
            return (0, _actionsController.sendActions)({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              last_answer: message.event
            });

          case 12:
            _context2.next = 24;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](2);
            console.error('GET_STARTED error:', _context2.t0.message);
            _context2.next = 19;
            return (0, _botController.sendErrorMsg)(_context2.t0.message);

          case 19:
            outError = _context2.sent;
            _context2.next = 22;
            return bot.stopTyping(sender.id);

          case 22:
            _context2.next = 24;
            return bot.send(sender.id, outError);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 14]]);
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
    var sender, recipient;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            console.info("\x1B[43mPostback\x1B[0m, event:\x1B[32m".concat(event, "\x1B[0m, data:\x1B[32m").concat(data, "\x1B[0m, sender.id:\x1B[32m").concat(sender.id, "\x1B[0m, recipient.id:\x1B[32m").concat(recipient.id, "\x1B[0m, bot.mkt:\x1B[32m").concat(bot.marketing, "\x1B[0m"));

            if (!(event === 'PIZZAIBOT_MARKETING')) {
              _context3.next = 12;
              break;
            }

            if (!(data === 'testtypecustomer_begin')) {
              _context3.next = 8;
              break;
            }

            _context3.next = 6;
            return (0, _actionsController.sendActions)({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sendr: sendr,
              pageID: recipient.id,
              last_answer: message.event
            });

          case 6:
            _context3.next = 10;
            break;

          case 8:
            _context3.next = 10;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              data: data
            });

          case 10:
            _context3.next = 14;
            break;

          case 12:
            _context3.next = 14;
            return (0, _actionsController.mapEventsActions)({
              event: event,
              data: data,
              bot: bot,
              sender: sender,
              pageID: recipient.id
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
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
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(message) {
    var sender, recipient, location, _orderFlow, mktContact, _data, answer, outError;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sender = message.sender, recipient = message.recipient, location = message.location;
            console.info('on message:', message);
            _context4.prev = 2;

            if (!location) {
              _context4.next = 8;
              break;
            }

            _context4.next = 6;
            return (0, _actionsController.sendActions)({
              action: 'LOCATION_CONFIRM_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              location: location
            });

          case 6:
            _context4.next = 61;
            break;

          case 8:
            if (!(message.text === 'hello' || message.text === 'hi')) {
              _context4.next = 13;
              break;
            }

            _context4.next = 11;
            return (0, _actionsController.sendActions)({
              action: 'BASIC_REPLY',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              data: 'Hello, how are you doing? Currently, I am working only in Portuguese, but, soon enough, your favorite restaurant will be with me.'
            });

          case 11:
            _context4.next = 61;
            break;

          case 13:
            _orderFlow = true;

            if (!bot.marketing) {
              _context4.next = 49;
              break;
            }

            _orderFlow = false; // if it is an action from the marketing, so, this assures the order flow isn't called.

            _context4.next = 18;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: recipient.id,
              userID: sender.id
            });

          case 18:
            mktContact = _context4.sent;

            if (!(mktContact.last_answer === 'testtype_customer')) {
              _context4.next = 23;
              break;
            }

            _orderFlow = true; // this assures the order flow will continue and marketing won't be called.

            _context4.next = 49;
            break;

          case 23:
            _data = 'open_question';

            if (!(mktContact.final === true)) {
              _context4.next = 28;
              break;
            }

            _data = 'returned_customer';
            _context4.next = 47;
            break;

          case 28:
            if (!(mktContact.last_answer === 'finalquestion_mail')) {
              _context4.next = 32;
              break;
            }

            _data = 'contact_mail';
            _context4.next = 47;
            break;

          case 32:
            if (!(mktContact.last_answer === 'finalquestion_phone')) {
              _context4.next = 36;
              break;
            }

            _data = 'contact_phone';
            _context4.next = 47;
            break;

          case 36:
            if (!(mktContact.last_answer === 'type_phone' || mktContact.last_answer === 'retype_phone')) {
              _context4.next = 40;
              break;
            }

            _data = 'contact_phone';
            _context4.next = 47;
            break;

          case 40:
            if (!(mktContact.last_answer === 'orderConfirmation_question')) {
              _context4.next = 44;
              break;
            }

            _data = 'open_question';
            _context4.next = 47;
            break;

          case 44:
            _context4.next = 46;
            return (0, _botMarkController.m_checkLastQuestion)(recipient.id, sender.id);

          case 46:
            _data = _context4.sent;

          case 47:
            _context4.next = 49;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: message.recipient.id,
              data: _data,
              text: message.text
            });

          case 49:
            if (!_orderFlow) {
              _context4.next = 61;
              break;
            }

            _context4.next = 52;
            return bot.startTyping(sender.id);

          case 52:
            _context4.next = 54;
            return _facebookMessengerBot.Bot.wait(1000);

          case 54:
            _context4.next = 56;
            return (0, _botController.confirmTypedText)(recipient.id, sender.id, message);

          case 56:
            answer = _context4.sent;
            _context4.next = 59;
            return bot.stopTyping(sender.id);

          case 59:
            _context4.next = 61;
            return bot.send(sender.id, answer);

          case 61:
            _context4.next = 73;
            break;

          case 63:
            _context4.prev = 63;
            _context4.t0 = _context4["catch"](2);
            console.error({
              onMessageError: _context4.t0
            });
            _context4.next = 68;
            return (0, _botController.sendErrorMsg)(_context4.t0.message);

          case 68:
            outError = _context4.sent;
            _context4.next = 71;
            return bot.stopTyping(sender.id);

          case 71:
            _context4.next = 73;
            return bot.send(sender.id, outError);

          case 73:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 63]]);
  }));

  return function (_x8) {
    return _ref5.apply(this, arguments);
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
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(message, quick_reply) {
    var sender, recipient, payload, _orderFlow, mktContact, outError;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            sender = message.sender, recipient = message.recipient;
            payload = quick_reply.payload;
            _context5.prev = 2;

            if (!payload) {
              _context5.next = 21;
              break;
            }

            /**
             * Both marketing and Order flow use this quick_reply answer, so, I am
             * checking if marketing is in a state where an test order has been placed and, if so,
             * I redirect the flow to the order.
             */
            _orderFlow = true;

            if (!bot.marketing) {
              _context5.next = 16;
              break;
            }

            _orderFlow = false; // if it is an action from the marketing, so, this assures the order flow isn't called.

            _context5.next = 9;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: recipient.id,
              userID: sender.id
            });

          case 9:
            mktContact = _context5.sent;

            if (!(mktContact.last_answer === 'testtype_customer')) {
              _context5.next = 14;
              break;
            }

            _orderFlow = true; // this assures the order flow will continue and marketing won't be called.

            _context5.next = 16;
            break;

          case 14:
            _context5.next = 16;
            return (0, _actionsController.sendActions)({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              payload: payload,
              data: 'contact_phone'
            });

          case 16:
            if (!_orderFlow) {
              _context5.next = 21;
              break;
            }

            _context5.next = 19;
            return (0, _actionsController.sendActions)({
              action: 'SHOW_PHONE',
              bot: bot,
              sender: sender,
              pageID: recipient.id,
              payload: payload
            });

          case 19:
            _context5.next = 21;
            return (0, _actionsController.sendActions)({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: recipient.id
            });

          case 21:
            _context5.next = 33;
            break;

          case 23:
            _context5.prev = 23;
            _context5.t0 = _context5["catch"](2);
            console.error({
              quickReplyError: _context5.t0
            });
            _context5.next = 28;
            return (0, _botController.sendErrorMsg)(_context5.t0.message);

          case 28:
            outError = _context5.sent;
            _context5.next = 31;
            return bot.stopTyping(sender.id);

          case 31:
            _context5.next = 33;
            return bot.send(sender.id, outError);

          case 33:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[2, 23]]);
  }));

  return function (_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}()); // TESTAR

/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
// bot.on('LOCATION_ADDRESS', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data === 'incorrect_address') {
//       await sendActions({ action: 'ASK_TO_TYPE_ADDRESS', bot, sender, pageID: recipient.id });
//     }
//     else {
//       await sendActions({ action: 'SHOW_ADDRESS', bot, sender, pageID: recipient.id, data: data });
//       await sendActions({ action: 'SHOW_ORDER_OR_ASK_FOR_PHONE', bot, sender, pageID: recipient.id });
//     }
//   } catch (error) {
//     console.error('LOCATION_ADDRESS:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });
// TESTAR

/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
// bot.on('WRONG_SAVED_ADDRESS', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     await sendActions({ action: 'ASK_FOR_LOCATION', bot, sender, pageID: recipient.id });
//   } catch (error) {
//     console.error('WRONG_SAVED_ADDRESS:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });
// bot.on('PHONE_CONFIRMED', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data === 'change_phone') {
//       await sendActions({ action: 'ASK_TO_TYPE_PHONE', bot, sender, pageID: recipient.id });
//     }
//     else {
//       await sendActions({ action: 'SHOW_PHONE', bot, sender, pageID: recipient.id, data: data });
//       await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID: recipient.id });
//     }
//   } catch (error) {
//     console.error('PHONE_CONFIRMED:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered ORDER_QTY
 * gonna ask for SIZE
 */
// bot.on('ORDER_QTY', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data && data === 'qty_more') {
//       await bot.startTyping(sender.id);
//       await Bot.wait(1000);
//       const out = await askForQuantityMore(recipient.id, sender.id);
//       await bot.stopTyping(sender.id);
//       await bot.send(sender.id, out);
//     }
//     else {
//       // show what the user chose
//       await bot.startTyping(sender.id);
//       await Bot.wait(1000);
//       const answer = await showQuantity(recipient.id, sender.id, data);
//       await bot.stopTyping(sender.id);
//       await bot.send(sender.id, answer);
//       // next question
//       await bot.startTyping(sender.id);
//       await Bot.wait(1000);
//       const out = await askForSize(recipient.id, sender.id);
//       await bot.stopTyping(sender.id);
//       await bot.send(sender.id, out);
//     }
//   } catch (error) {
//     console.error('ORDER_QTY:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */
// bot.on('ORDER_SIZE', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     // show what the user chose
//     await bot.startTyping(sender.id);
//     await Bot.wait(900);
//     const answer = await showSize(recipient.id, sender.id, data);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, answer);
//     // check if the size is splitable.
//     await bot.startTyping(sender.id);
//     await Bot.wait(900);
//     const out = await askForSplitFlavorOrConfirm(message.recipient.id, sender.id, 1);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, out);
//   } catch (error) {
//     console.error('ORDER_SIZE:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });
// bot.on('ORDER_SPLIT', async (message, data) => {
//   const { sender, recipient } = message;
//   await bot.startTyping(sender.id);
//   await Bot.wait(900);
//   const answer = await showSplit(recipient.id, sender.id, data);
//   await bot.stopTyping(sender.id);
//   await bot.send(sender.id, answer);
//   const split = Number(data);
//   // next question
//   await bot.startTyping(sender.id);
//   await Bot.wait(250);
//   const out = await askForFlavorOrConfirm(message.recipient.id, sender.id, 1, split);
//   await bot.stopTyping(sender.id);
//   await bot.send(sender.id, out);
// });

/**
 * answered ORDER_FLAVOR
 * gonna ask for confirmation
 */
// bot.on('ORDER_FLAVOR', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data && data.option && data.option === 'flavors_more') {
//       await sendActions({ action: 'ASK_FOR_FLAVOR', bot, sender, pageID: recipient.id, multiple: data.multiple })
//     }
//     else {
//       await sendActions({ action: 'SHOW_FLAVOR', bot, sender, pageID: recipient.id, data })
//       // show summary
//       await bot.startTyping(sender.id);
//       await Bot.wait(1000);
//       const summary = await showOrderOrNextItem(recipient.id, sender.id);
//       await bot.stopTyping(sender.id);
//       await bot.send(sender.id, summary);
//     }
//   } catch (error) {
//     console.error('ORDER_FLAVOR:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */
// bot.on('ORDER_CONFIRM_BEVERAGE', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data === 'beverage_yes')
//       await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID: recipient.id, multiple: 1 })
//     else {
//       await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID: recipient.id })
//       await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID: recipient.id })
//     }
//   } catch (orderConfirmBeverageErr) {
//     console.error({ orderConfirmBeverageErr });
//     const outError = await sendErrorMsg(orderConfirmBeverageErr.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered ORDER_BEVERAGE
 * gonna ask for confirmation
 */
// bot.on('ORDER_BEVERAGE', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data && data.option && data.option === 'beverages_more') {
//       // more beverages
//       await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID: recipient.id, multiple: data.multiple })
//     }
//     else if (data && data.option && data.option === 'beverages_cancel') {
//       await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID: recipient.id })
//       await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID: recipient.id })
//     }
//     else {
//       await sendActions({ action: 'SHOW_BEVERAGE', bot, sender, pageID: recipient.id, data: data })
//       await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID: recipient.id })
//     }
//   } catch (orderBeverageErr) {
//     console.error({ orderBeverageErr });
//     const outError = await sendErrorMsg(orderBeverageErr.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered ORDER_PIZZA_CONFIRMATION
 */
// bot.on('ORDER_PIZZA_CONFIRMATION', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data === 'confirmation_yes') {
//       await sendActions({ action: 'ASK_FOR_WANT_BEVERAGE', bot, sender, pageID: recipient.id });
//     }
//     else if (data === 'confirmation_no') {
//       await bot.startTyping(sender.id);
//       await Bot.wait(1000);
//       const out = await askForChangeOrder(recipient.id, sender.id);
//       await bot.stopTyping(sender.id);
//       await bot.send(sender.id, out);
//     }
//   } catch (orderConfirmationError) {
//     console.error({ orderConfirmationError });
//     const outError = await sendErrorMsg(orderConfirmationError.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered ORDER_CONFIRMATION
 */
// bot.on('ORDER_CONFIRMATION', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     if (data === 'confirmation_yes') {
//       await sendActions({ action: 'CONFIRM_ORDER', bot, sender, pageID: recipient.id });
//       if (bot.marketing) { // marketing. if the order is confirmed, go on in the conversation
//         await sendActions({ action: 'PIZZAIBOT_MARKETING', bot, sender, pageID: message.recipient.id, data: 'confirmation_yes' });
//       }
//     }
//     else if (data === 'confirmation_no') {
//       await bot.startTyping(sender.id);
//       await Bot.wait(1000);
//       const out = await askForChangeOrder(recipient.id, sender.id);
//       await bot.stopTyping(sender.id);
//       await bot.send(sender.id, out);
//     }
//   } catch (orderConfirmationErr) {
//     console.error({ orderConfirmationErr });
//     const outError = await sendErrorMsg(orderConfirmationErr.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });

/**
 * answered wants change something in the order
 */
// bot.on('ORDER_WANT_CHANGE', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     await bot.startTyping(sender.id);
//     await Bot.wait(1000);
//     const out = await askForSpecificItem(recipient.id, sender.id);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, out);
//   } catch (error) {
//     console.error('ORDER_WANT_CHANGE:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });
// bot.on('ORDER_CHANGE', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     await bot.startTyping(sender.id);
//     await Bot.wait(500);
//     let out;
//     if (data === 'change_quantity') {
//       out = await askForQuantity(recipient.id, sender.id);
//     }
//     else if (data === 'change_size') {
//       out = await askForSize(recipient.id, sender.id);
//     }
//     else if (data === 'change_flavor') {
//       out = await askForFlavor(message.recipient.id, sender.id, 1);
//     }
//     else if (data === 'change_address') {
//       out = await askForLocation();
//     }
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, out);
//   } catch (error) {
//     console.error('ORDER_CHANGE:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });
// bot.on('ORDER_CHANGE_SELECT_ITEM', async (message, data) => {
//   const { sender, recipient } = message;
//   try {
//     await bot.startTyping(sender.id);
//     await Bot.wait(1000);
//     const out = await updateItemAskOptions(recipient.id, sender.id, data);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, out);
//   } catch (error) {
//     console.error('ORDER_CHANGE_SELECT_ITEM:', error.message);
//     const outError = await sendErrorMsg(error.message);
//     await bot.stopTyping(sender.id);
//     await bot.send(sender.id, outError);
//   }
// });
//# sourceMappingURL=server-bot.js.map