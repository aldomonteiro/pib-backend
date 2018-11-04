"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.askForSize = exports.askForQuantityMore = exports.askForQuantity = exports.sendCardapio = exports.sendMainMenu = exports.sendWelcomeMessage = exports.sendErrorMsg = void 0;var _util = _interopRequireDefault(require("util"));
var _fs = _interopRequireDefault(require("fs"));
var _facebookMessengerBot = require("facebook-messenger-bot");
var _pagesController = require("../controllers/pagesController");
var _pricingsController = require("../controllers/pricingsController");
var _show_cardapio = _interopRequireDefault(require("./show_cardapio"));
var _actionsController = require("./actionsController");






var _sizesController = require("../controllers/sizesController");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

// TODO: create a debugger with json format
var log_file = _fs.default.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

console.log = function (d) {//
  log_file.write(_util.default.format(d) + '\n');
  log_stdout.write(_util.default.format(d) + '\n');
};

var MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico';

// create a custom timestamp format for log statements
var SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath: 'logs/bot.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS' },

log = SimpleNodeLogger.createSimpleLogger(opts);

var sendErrorMsg = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var out;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
              sender.fetch('first_name'));case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Ops, tivemos um probleminha técnico.' });return _context.abrupt("return",
            out);case 5:case "end":return _context.stop();}}}, _callee, this);}));return function sendErrorMsg() {return _ref.apply(this, arguments);};}();



/**
                                                                                                                                                             * 
                                                                                                                                                             * @param {*} sender 
                                                                                                                                                             * @param {*} pageID 
                                                                                                                                                             */exports.sendErrorMsg = sendErrorMsg;
var sendWelcomeMessage = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sender, pageID) {var page, replyMsg, out;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
              sender.fetch('first_name'));case 2:_context2.next = 4;return (
              (0, _pagesController.getOnePageData)(pageID));case 4:page = _context2.sent;
            replyMsg = new String(page.firstResponseText).replace('$NAME', sender.first_name);
            out = new _facebookMessengerBot.Elements();
            out.add({ text: replyMsg });return _context2.abrupt("return",
            out);case 9:case "end":return _context2.stop();}}}, _callee2, this);}));return function sendWelcomeMessage(_x, _x2) {return _ref2.apply(this, arguments);};}();exports.sendWelcomeMessage = sendWelcomeMessage;


var sendMainMenu = /*#__PURE__*/function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var buttons, out;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            buttons = new _facebookMessengerBot.Buttons();
            buttons.add({ text: 'Cardápio', data: 'CARDAPIO_PAYLOAD', event: 'MAIN-MENU' });
            buttons.add({ text: 'Horários', data: 'HORARIO_PAYLOAD', event: 'MAIN-MENU' });
            buttons.add({ text: 'Fazer Pedido', data: 'PEDIDO_PAYLOAD', event: 'MAIN-MENU' });

            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Por favor escolha uma das opções', buttons: buttons });return _context3.abrupt("return",

            out);case 7:case "end":return _context3.stop();}}}, _callee3, this);}));return function sendMainMenu() {return _ref3.apply(this, arguments);};}();exports.sendMainMenu = sendMainMenu;


var sendCardapio = /*#__PURE__*/function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(pageID) {var replyMsg, out;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
              (0, _show_cardapio.default)(pageID));case 2:replyMsg = _context4.sent;
            out = new _facebookMessengerBot.Elements();
            out.add({ text: replyMsg });return _context4.abrupt("return",

            out);case 6:case "end":return _context4.stop();}}}, _callee4, this);}));return function sendCardapio(_x3) {return _ref4.apply(this, arguments);};}();exports.sendCardapio = sendCardapio;


var askForQuantity = /*#__PURE__*/function () {var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {var out, replies;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Quantas pizzas você quer?' });

            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({ text: '1', data: 'qty_1', event: 'ORDER_QTY' });
            replies.add({ text: '2', data: 'qty_2', event: 'ORDER_QTY' });
            replies.add({ text: '3', data: 'qty_3', event: 'ORDER_QTY' });
            replies.add({ text: '+ de 3', data: 'qty_more', event: 'ORDER_QTY_MORE' });
            out.setQuickReplies(replies);return _context5.abrupt("return",
            out);case 9:case "end":return _context5.stop();}}}, _callee5, this);}));return function askForQuantity() {return _ref5.apply(this, arguments);};}();exports.askForQuantity = askForQuantity;


var askForQuantityMore = /*#__PURE__*/function () {var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {var out, replies;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Por favor informe a quantidade de pizzas:' });

            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({ text: '4', data: 'qty_4', event: 'ORDER_QTY' });
            replies.add({ text: '5', data: 'qty_5', event: 'ORDER_QTY' });
            replies.add({ text: '6', data: 'qty_6', event: 'ORDER_QTY' });
            replies.add({ text: '+ de 6', data: 'qty_more_more', event: 'ORDER_QTY_MORE' });
            out.setQuickReplies(replies);return _context6.abrupt("return",
            out);case 9:case "end":return _context6.stop();}}}, _callee6, this);}));return function askForQuantityMore() {return _ref6.apply(this, arguments);};}();exports.askForQuantityMore = askForQuantityMore;


var askForSize = /*#__PURE__*/function () {var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(pageID) {var out, replies, sizesWithPricing, sizes, i;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({ text: 'Qual o tamanho da pizza?' });

            replies = new _facebookMessengerBot.QuickReplies();_context7.next = 5;return (
              (0, _pricingsController.getPricingSizing)(pageID));case 5:sizesWithPricing = _context7.sent;_context7.next = 8;return (
              (0, _sizesController.getSizes)(pageID, sizesWithPricing));case 8:sizes = _context7.sent;
            for (i = 0; i < sizes.length; i++) {
              replies.add({ text: sizes[i].size, data: sizes[i].id, event: 'ORDER_SIZE' });
            }
            out.setQuickReplies(replies);return _context7.abrupt("return",
            out);case 12:case "end":return _context7.stop();}}}, _callee7, this);}));return function askForSize(_x4) {return _ref7.apply(this, arguments);};}();exports.askForSize = askForSize;
//# sourceMappingURL=botController.js.map