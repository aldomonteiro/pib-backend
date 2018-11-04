"use strict";var _express = _interopRequireDefault(require("express"));
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
var _botController = require("./api/bot/botController");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}









var
ORDER_STATE_QUANTITY = 1,
ORDER_STATE_SIZE = 2,
ORDER_STATE_FLAVOR = 3;

var app = (0, _express.default)();

_dotenv.default.config();

_mongoose.default.connect(
process.env.MONGODB_URL,
{ useNewUrlParser: true });

_mongoose.default.set('useCreateIndex', true);
_mongoose.default.Promise = Promise;

global.pagesKeyID = new Array();
global.orderState = new Array();

var bot = new _facebookMessengerBot.Bot('verify_my_bot', true);


(0, _pagesController.getAllPages)().then( /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pageArray) {var i, page, accessToken, fields, response;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            i = 0;case 1:if (!(i < pageArray.length)) {_context.next = 13;break;}
            page = pageArray[i];
            accessToken = page.accessToken;
            fields = ['greeting', 'get_started', 'persistent_menu'];_context.next = 7;return (
              bot.getFields(fields));case 7:response = _context.sent;
            global.pagesKeyID[page.pageID] = accessToken;

            console.log("GET fields for ".concat(page.pageID, "-").concat(page.name, ":"), response);case 10:i++;_context.next = 1;break;case 13:case "end":return _context.stop();}}}, _callee, this);}));return function (_x) {return _ref.apply(this, arguments);};}());



bot.on('GET_STARTED', /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {var sender, out1, out2, out3;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            sender = message.sender;_context2.prev = 1;_context2.next = 4;return (


              bot.startTyping(sender.id));case 4:_context2.next = 6;return (
              (0, _botController.sendWelcomeMessage)(sender, message.recipient.id));case 6:out1 = _context2.sent;_context2.next = 9;return (
              bot.stopTyping(sender.id));case 9:_context2.next = 11;return (
              bot.send(sender.id, out1));case 11:_context2.next = 13;return (


              bot.startTyping(sender.id));case 13:_context2.next = 15;return (
              _facebookMessengerBot.Bot.wait(2000));case 15:_context2.next = 17;return (
              (0, _botController.sendMainMenu)());case 17:out2 = _context2.sent;_context2.next = 20;return (
              bot.stopTyping(sender.id));case 20:_context2.next = 22;return (
              bot.send(sender.id, out2));case 22:_context2.next = 34;break;case 24:_context2.prev = 24;_context2.t0 = _context2["catch"](1);


            console.log('GET_STARTED error:', _context2.t0.response);_context2.next = 29;return (

              (0, _botController.sendErrorMsg)());case 29:out3 = _context2.sent;_context2.next = 32;return (
              bot.stopTyping(sender.id));case 32:_context2.next = 34;return (
              bot.send(sender.id, out3));case 34:case "end":return _context2.stop();}}}, _callee2, this, [[1, 24]]);}));return function (_x2) {return _ref2.apply(this, arguments);};}());




bot.on('message', /*#__PURE__*/function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {var sender, recipient, keyState, orderState, replies, out, _out;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            console.log("on message", message);

            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;if (!

            global.orderState[keyState]) {_context3.next = 22;break;}
            orderState = global.orderState[keyState];if (!(
            orderState === ORDER_STATE_QUANTITY)) {_context3.next = 20;break;}if (!(
            Number(message.text) > 0)) {_context3.next = 20;break;}
            // TODO: Store the quantity
            global.orderState[keyState] = ORDER_STATE_SIZE;
            // ---- send quick reply for location
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({ text: 'Pequena', data: 'size_small', event: 'ORDER_SIZE' });
            replies.add({ text: 'Média', data: 'size_medium', event: 'ORDER_SIZE' });
            replies.add({ text: 'Grande', data: 'size_big', event: 'ORDER_SIZE' });
            replies.add({ text: 'Gigante', data: 'size_large', event: 'ORDER_SIZE' });

            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Qual o tamanho da pizza?' });
            out.setQuickReplies(replies);_context3.next = 18;return (
              bot.send(sender.id, out));case 18:_context3.next = 20;break;case 20:_context3.next = 28;break;case 22:_context3.next = 24;return (






              sender.fetch('first_name'));case 24:

            _out = new _facebookMessengerBot.Elements();
            _out.add({ text: "hey ".concat(sender.first_name, ", how are you!") });_context3.next = 28;return (

              bot.send(sender.id, _out));case 28:case "end":return _context3.stop();}}}, _callee3, this);}));return function (_x3) {return _ref3.apply(this, arguments);};}());



// all postbacks are emitted via 'postback'
bot.on('postback', /*#__PURE__*/function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(event, message, data) {return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
            console.log("postback from ".concat(data, ", you need to take care of this thing!"));
            console.log(message);case 2:case "end":return _context4.stop();}}}, _callee4, this);}));return function (_x4, _x5, _x6) {return _ref4.apply(this, arguments);};}());


// all postbacks are emitted via 'postback'
bot.on('MAIN-MENU', /*#__PURE__*/function () {var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(message, data) {var sender, recipient, keyState, out, _out2;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;_context5.prev = 2;_context5.next = 5;return (


              bot.startTyping(sender.id));case 5:if (!(
            data === 'CARDAPIO_PAYLOAD')) {_context5.next = 15;break;}_context5.next = 8;return (
              (0, _botController.sendCardapio)(message.recipient.id));case 8:out = _context5.sent;_context5.next = 11;return (
              bot.stopTyping(sender.id));case 11:_context5.next = 13;return (
              bot.send(sender.id, out));case 13:_context5.next = 24;break;case 15:if (!(

            data === 'PEDIDO_PAYLOAD')) {_context5.next = 24;break;}
            global.orderState[keyState] = ORDER_STATE_QUANTITY;_context5.next = 19;return (

              (0, _botController.askForQuantity)());case 19:_out2 = _context5.sent;_context5.next = 22;return (
              bot.stopTyping(sender.id));case 22:_context5.next = 24;return (
              bot.send(sender.id, _out2));case 24:_context5.next = 31;break;case 26:_context5.prev = 26;_context5.t0 = _context5["catch"](2);_context5.next = 30;return (


              bot.stopTyping(sender.id));case 30:

            if (_context5.t0.response) console.log(_context5.t0.response);else
            console.log(_context5.t0);case 31:case "end":return _context5.stop();}}}, _callee5, this, [[2, 26]]);}));return function (_x7, _x8) {return _ref5.apply(this, arguments);};}());



/**
                                                                                                                                                                                              * answered ORDER_QTY
                                                                                                                                                                                              * gonna ask for SIZE
                                                                                                                                                                                              */
bot.on('ORDER_QTY', /*#__PURE__*/function () {var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(message, data) {var sender, recipient, keyState, out, _out3;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;

            global.orderState[keyState] = ORDER_STATE_FLAVOR;if (!(

            data && data === 'qty_more')) {_context6.next = 18;break;}
            global.orderState[keyState] = ORDER_STATE_QUANTITY;_context6.next = 7;return (

              bot.startTyping(sender.id));case 7:_context6.next = 9;return (
              _facebookMessengerBot.Bot.wait(2000));case 9:_context6.next = 11;return (
              (0, _botController.askForQuantityMore)());case 11:out = _context6.sent;_context6.next = 14;return (
              bot.stopTyping(sender.id));case 14:_context6.next = 16;return (
              bot.send(sender.id, out));case 16:_context6.next = 27;break;case 18:_context6.next = 20;return (


              bot.startTyping(sender.id));case 20:_context6.next = 22;return (
              (0, _botController.askForSize)(message.recipient.id));case 22:_out3 = _context6.sent;_context6.next = 25;return (
              bot.stopTyping(sender.id));case 25:_context6.next = 27;return (
              bot.send(sender.id, _out3));case 27:case "end":return _context6.stop();}}}, _callee6, this);}));return function (_x9, _x10) {return _ref6.apply(this, arguments);};}());



/**
                                                                                                                                                                                        * answered ORDER_SIZE
                                                                                                                                                                                        * gonna ask for FLAVOR
                                                                                                                                                                                        */
bot.on('ORDER_SIZE', /*#__PURE__*/function () {var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(message, data) {var sender, recipient, keyState, out;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
            sender = message.sender, recipient = message.recipient;
            keyState = sender.id + recipient.id;

            global.orderState[keyState] = ORDER_STATE_SIZE;

            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Qual o sabor da pizza?' });_context7.next = 7;return (
              bot.send(sender.id, out));case 7:case "end":return _context7.stop();}}}, _callee7, this);}));return function (_x11, _x12) {return _ref7.apply(this, arguments);};}());



// Beggining - That is all to log in the local timezone
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan
// logger.token('date', (req, res, tz) => moment().tz(tz).format());
// logger.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');
// app.use(logger("myformat"));
// End - That is all to log in the right timezone
app.use(_bodyParser.default.urlencoded({ extended: false }));
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
      } else
      {
        (0, _pagesController.getOnePage)(pageID).then(function (accessToken) {
          req.token = accessToken;
          global.pagesKeyID[pageID] = accessToken;
          console.log("Got token from ".concat(pageID));
        });
      }

      next();
    }
  }
});
app.use('/buckets/facebook', bot.router());
app.listen(process.env.FB_WEBHOOK_PORT, function () {return console.log("Bot server listening on port ".concat(process.env.FB_WEBHOOK_PORT));});
//# sourceMappingURL=server-bot.js.map