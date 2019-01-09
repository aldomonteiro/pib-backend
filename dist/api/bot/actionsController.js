"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputHorarioReplyMsg = exports.getOpenAndClose = exports.inputCardapioReplyMsg = exports.getFlavorsAndToppings = exports.marketing_flow = exports.sendActions = exports.mapEventsActions = exports.checkTypedText = void 0;

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _storesController = require("../controllers/storesController");

var _pricingsController = require("../controllers/pricingsController");

var _facebookMessengerBot = require("facebook-messenger-bot");

var _botController = require("./botController");

var _botMarkController = require("./botMarkController");

var _ordersController = require("../controllers/ordersController");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var QTY_1 = [1, "um", "uma"];

var checkTypedText =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var bot, sender, pageID, text, pendingOrder, addrData, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bot = _ref.bot, sender = _ref.sender, pageID = _ref.pageID, text = _ref.text;
            _context.prev = 1;
            _context.next = 4;
            return (0, _ordersController.getOrderPending)({
              pageId: pageID,
              userId: sender.id
            });

          case 4:
            pendingOrder = _context.sent;

            if (!(pendingOrder && pendingOrder.order)) {
              _context.next = 27;
              break;
            }

            if (!(pendingOrder.order.waitingFor === 'typed_address')) {
              _context.next = 12;
              break;
            }

            addrData = {
              manual_addres: true,
              formattedAddress: text
            };
            _context.next = 10;
            return sendActions({
              action: 'CONFIRM_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              addrData: addrData
            });

          case 10:
            _context.next = 25;
            break;

          case 12:
            if (!(pendingOrder.order.waitingFor === 'phone')) {
              _context.next = 17;
              break;
            }

            _context.next = 15;
            return sendActions({
              action: 'CONFIRM_TYPED_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              text: text
            });

          case 15:
            _context.next = 25;
            break;

          case 17:
            if (!(pendingOrder.order.waitingFor === 'quantity' && !isNaN(text) && +text <= 6)) {
              _context.next = 23;
              break;
            }

            data = 'qty_' + text;
            _context.next = 21;
            return mapEventsActions({
              event: 'ORDER_QTY',
              data: data,
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 21:
            _context.next = 25;
            break;

          case 23:
            _context.next = 25;
            return sendActions({
              action: 'ASK_FOR_CONTINUE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 25:
            _context.next = 29;
            break;

          case 27:
            _context.next = 29;
            return sendActions({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 29:
            _context.next = 35;
            break;

          case 31:
            _context.prev = 31;
            _context.t0 = _context["catch"](1);
            console.error({
              confirmTypedTextError: _context.t0
            });
            throw _context.t0;

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 31]]);
  }));

  return function checkTypedText(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Receive events, dispatch actions
 * @param {*} param0 
 */


exports.checkTypedText = checkTypedText;

var mapEventsActions =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref3) {
    var event, data, bot, sender, pageID;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            event = _ref3.event, data = _ref3.data, bot = _ref3.bot, sender = _ref3.sender, pageID = _ref3.pageID;
            _context2.prev = 1;
            _context2.t0 = event;
            _context2.next = _context2.t0 === 'ORDER_CONTINUE_ORDER' ? 5 : _context2.t0 === 'STOP_ORDER_OPTIONS' ? 15 : _context2.t0 === 'MAIN-MENU' ? 25 : _context2.t0 === 'ORDER_WANT_ORDER' ? 42 : _context2.t0 === 'CORRECT_SAVED_ADDRESS' ? 54 : _context2.t0 === 'WRONG_SAVED_ADDRESS' ? 59 : _context2.t0 === 'LOCATION_ADDRESS' ? 62 : _context2.t0 === 'PHONE_CONFIRMED' ? 74 : _context2.t0 === 'ORDER_QTY' ? 86 : _context2.t0 === 'ORDER_SIZE' ? 101 : _context2.t0 === 'ORDER_SPLIT' ? 106 : _context2.t0 === 'ORDER_FLAVOR' ? 111 : _context2.t0 === 'ORDER_PIZZA_CONFIRMATION' ? 123 : _context2.t0 === 'ORDER_WANT_CHANGE' ? 133 : _context2.t0 === 'ORDER_CHANGE' ? 136 : _context2.t0 === 'ORDER_CONFIRM_BEVERAGE' ? 153 : _context2.t0 === 'ORDER_BEVERAGE' ? 165 : _context2.t0 === 'ORDER_PAYMENT_TYPE' ? 182 : _context2.t0 === 'ORDER_PAYMENT_CHANGE' ? 194 : _context2.t0 === 'ORDER_CONFIRMATION' ? 199 : _context2.t0 === 'ORDER_CHANGE_SELECT_ITEM' ? 212 : 215;
            break;

          case 5:
            _context2.t1 = data;
            _context2.next = _context2.t1 === 'continueorder_yes' ? 8 : _context2.t1 === 'continueorder_no' ? 11 : 14;
            break;

          case 8:
            _context2.next = 10;
            return sendActions({
              action: 'CHECK_LAST_ACTION',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 10:
            return _context2.abrupt("break", 14);

          case 11:
            _context2.next = 13;
            return sendActions({
              action: 'CONTINUE_ORDER_NO',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 13:
            return _context2.abrupt("break", 14);

          case 14:
            return _context2.abrupt("break", 215);

          case 15:
            _context2.t2 = data;
            _context2.next = _context2.t2 === 'stoporder_init' ? 18 : _context2.t2 === 'stoporder_human' ? 21 : 24;
            break;

          case 18:
            _context2.next = 20;
            return sendActions({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 20:
            return _context2.abrupt("break", 24);

          case 21:
            _context2.next = 23;
            return sendActions({
              action: 'PASS_THREAD_CONTROL',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 23:
            return _context2.abrupt("break", 24);

          case 24:
            return _context2.abrupt("break", 215);

          case 25:
            _context2.t3 = data;
            _context2.next = _context2.t3 === 'CARDAPIO_PAYLOAD' ? 28 : _context2.t3 === 'PEDIDO_PAYLOAD' ? 35 : _context2.t3 === 'HORARIO_PAYLOAD' ? 38 : 41;
            break;

          case 28:
            _context2.next = 30;
            return sendActions({
              action: 'SEND_CARDAPIO',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 30:
            _context2.next = 32;
            return _facebookMessengerBot.Bot.wait(3000);

          case 32:
            _context2.next = 34;
            return sendActions({
              action: 'ASK_FOR_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 34:
            return _context2.abrupt("break", 41);

          case 35:
            _context2.next = 37;
            return sendActions({
              action: 'CHECK_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 37:
            return _context2.abrupt("break", 41);

          case 38:
            _context2.next = 40;
            return sendActions({
              action: 'SEND_HORARIO',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 40:
            return _context2.abrupt("break", 41);

          case 41:
            return _context2.abrupt("break", 215);

          case 42:
            _context2.t4 = data;
            _context2.next = _context2.t4 === 'wantorder_yes' ? 45 : _context2.t4 === 'wantorder_no' ? 48 : 53;
            break;

          case 45:
            _context2.next = 47;
            return sendActions({
              action: 'CHECK_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 47:
            return _context2.abrupt("break", 53);

          case 48:
            _context2.next = 50;
            return sendActions({
              action: 'BASIC_REPLY',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: 'Ok, vou enviar as opções então. Para continuar é só clicar em uma delas'
            });

          case 50:
            _context2.next = 52;
            return sendActions({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 52:
            return _context2.abrupt("break", 53);

          case 53:
            return _context2.abrupt("break", 215);

          case 54:
            _context2.next = 56;
            return sendActions({
              action: 'SHOW_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 56:
            _context2.next = 58;
            return sendActions({
              action: 'ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 58:
            return _context2.abrupt("break", 215);

          case 59:
            _context2.next = 61;
            return sendActions({
              action: 'ASK_FOR_LOCATION',
              bot: bot,
              sender: sender,
              pageID: pageID,
              event: event
            });

          case 61:
            return _context2.abrupt("break", 215);

          case 62:
            _context2.t5 = data;
            _context2.next = _context2.t5 === 'incorrect_address' ? 65 : 68;
            break;

          case 65:
            _context2.next = 67;
            return sendActions({
              action: 'ASK_TO_TYPE_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 67:
            return _context2.abrupt("break", 73);

          case 68:
            _context2.next = 70;
            return sendActions({
              action: 'SHOW_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 70:
            _context2.next = 72;
            return sendActions({
              action: 'SHOW_ORDER_OR_ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 72:
            return _context2.abrupt("break", 73);

          case 73:
            return _context2.abrupt("break", 215);

          case 74:
            _context2.t6 = data;
            _context2.next = _context2.t6 === 'change_phone' ? 77 : 80;
            break;

          case 77:
            _context2.next = 79;
            return sendActions({
              action: 'ASK_TO_TYPE_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 79:
            return _context2.abrupt("break", 85);

          case 80:
            _context2.next = 82;
            return sendActions({
              action: 'SHOW_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 82:
            _context2.next = 84;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 84:
            return _context2.abrupt("break", 85);

          case 85:
            return _context2.abrupt("break", 215);

          case 86:
            _context2.t7 = data;
            _context2.next = _context2.t7 === 'qty_more' ? 89 : _context2.t7 === 'qty_less' ? 92 : 95;
            break;

          case 89:
            _context2.next = 91;
            return sendActions({
              action: 'ASK_FOR_QUANTITY_MORE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 91:
            return _context2.abrupt("break", 100);

          case 92:
            _context2.next = 94;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 94:
            return _context2.abrupt("break", 100);

          case 95:
            _context2.next = 97;
            return sendActions({
              action: 'SHOW_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 97:
            _context2.next = 99;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 99:
            return _context2.abrupt("break", 100);

          case 100:
            return _context2.abrupt("break", 215);

          case 101:
            _context2.next = 103;
            return sendActions({
              action: 'SHOW_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 103:
            _context2.next = 105;
            return sendActions({
              action: 'CHECK_SPLIT',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 105:
            return _context2.abrupt("break", 215);

          case 106:
            _context2.next = 108;
            return sendActions({
              action: 'SHOW_SPLIT',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 108:
            _context2.next = 110;
            return sendActions({
              action: 'CHECK_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 110:
            return _context2.abrupt("break", 215);

          case 111:
            _context2.t8 = data.option;
            _context2.next = _context2.t8 === 'flavors_more' ? 114 : 117;
            break;

          case 114:
            _context2.next = 116;
            return sendActions({
              action: 'ASK_FOR_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: data.multiple
            });

          case 116:
            return _context2.abrupt("break", 122);

          case 117:
            _context2.next = 119;
            return sendActions({
              action: 'SHOW_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 119:
            _context2.next = 121;
            return sendActions({
              action: 'CHECK_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 121:
            return _context2.abrupt("break", 122);

          case 122:
            return _context2.abrupt("break", 215);

          case 123:
            _context2.t9 = data;
            _context2.next = _context2.t9 === 'confirmation_yes' ? 126 : 129;
            break;

          case 126:
            _context2.next = 128;
            return sendActions({
              action: 'ASK_FOR_WANT_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 128:
            return _context2.abrupt("break", 132);

          case 129:
            _context2.next = 131;
            return sendActions({
              action: 'ASK_FOR_CHANGE_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 131:
            return _context2.abrupt("break", 132);

          case 132:
            return _context2.abrupt("break", 215);

          case 133:
            _context2.next = 135;
            return sendActions({
              action: 'ASK_FOR_SPECIFIC_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 135:
            return _context2.abrupt("break", 215);

          case 136:
            _context2.t10 = data;
            _context2.next = _context2.t10 === 'change_quantity' ? 139 : _context2.t10 === 'change_size' ? 142 : _context2.t10 === 'change_flavor' ? 145 : _context2.t10 === 'change_address' ? 148 : 151;
            break;

          case 139:
            _context2.next = 141;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 141:
            return _context2.abrupt("break", 152);

          case 142:
            _context2.next = 144;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 144:
            return _context2.abrupt("break", 152);

          case 145:
            _context2.next = 147;
            return sendActions({
              action: 'ASK_FOR_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: 1
            });

          case 147:
            return _context2.abrupt("break", 152);

          case 148:
            _context2.next = 150;
            return sendActions({
              action: 'ASK_FOR_LOCATION',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 150:
            return _context2.abrupt("break", 152);

          case 151:
            return _context2.abrupt("break", 152);

          case 152:
            return _context2.abrupt("break", 215);

          case 153:
            _context2.t11 = data;
            _context2.next = _context2.t11 === 'beverage_yes' ? 156 : 159;
            break;

          case 156:
            _context2.next = 158;
            return sendActions({
              action: 'ASK_FOR_BEVERAGE_OPTIONS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: 1
            });

          case 158:
            return _context2.abrupt("break", 164);

          case 159:
            _context2.next = 161;
            return sendActions({
              action: 'SHOW_NO_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 161:
            _context2.next = 163;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 163:
            return _context2.abrupt("break", 164);

          case 164:
            return _context2.abrupt("break", 215);

          case 165:
            _context2.t12 = data.option;
            _context2.next = _context2.t12 === 'beverages_more' ? 168 : _context2.t12 === 'beverages_cancel' ? 171 : 176;
            break;

          case 168:
            _context2.next = 170;
            return sendActions({
              action: 'ASK_FOR_BEVERAGE_OPTIONS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: data.multiple
            });

          case 170:
            return _context2.abrupt("break", 181);

          case 171:
            _context2.next = 173;
            return sendActions({
              action: 'SHOW_NO_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 173:
            _context2.next = 175;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 175:
            return _context2.abrupt("break", 181);

          case 176:
            _context2.next = 178;
            return sendActions({
              action: 'SHOW_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 178:
            _context2.next = 180;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 180:
            return _context2.abrupt("break", 181);

          case 181:
            return _context2.abrupt("break", 215);

          case 182:
            _context2.next = 184;
            return sendActions({
              action: 'SHOW_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 184:
            _context2.t13 = data;
            _context2.next = _context2.t13 === 'payment_money' ? 187 : _context2.t13 === 'payment_card' ? 190 : 193;
            break;

          case 187:
            _context2.next = 189;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_CHANGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 189:
            return _context2.abrupt("break", 193);

          case 190:
            _context2.next = 192;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 192:
            return _context2.abrupt("break", 193);

          case 193:
            return _context2.abrupt("break", 215);

          case 194:
            _context2.next = 196;
            return sendActions({
              action: 'SHOW_PAYMENT_CHANGE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 196:
            _context2.next = 198;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 198:
            return _context2.abrupt("break", 215);

          case 199:
            _context2.t14 = data;
            _context2.next = _context2.t14 === 'confirmation_yes' ? 202 : 208;
            break;

          case 202:
            _context2.next = 204;
            return sendActions({
              action: 'CONFIRM_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 204:
            if (!bot.marketing) {
              _context2.next = 207;
              break;
            }

            _context2.next = 207;
            return sendActions({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: 'confirmation_yes'
            });

          case 207:
            return _context2.abrupt("break", 211);

          case 208:
            _context2.next = 210;
            return sendActions({
              action: 'ASK_FOR_CHANGE_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 210:
            return _context2.abrupt("break", 211);

          case 211:
            return _context2.abrupt("break", 215);

          case 212:
            _context2.next = 214;
            return sendActions({
              action: 'UPDATE_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 214:
            return _context2.abrupt("break", 215);

          case 215:
            _context2.next = 220;
            break;

          case 217:
            _context2.prev = 217;
            _context2.t15 = _context2["catch"](1);
            console.error({
              event: event
            }, {
              mapEventsActionsErr: _context2.t15
            }, {
              data: data
            });

          case 220:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 217]]);
  }));

  return function mapEventsActions(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.mapEventsActions = mapEventsActions;

var sendActions =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref5) {
    var action, bot, sender, pageID, multiple, split, data, payload, location, text, addrData, out, user1, user2, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            action = _ref5.action, bot = _ref5.bot, sender = _ref5.sender, pageID = _ref5.pageID, multiple = _ref5.multiple, split = _ref5.split, data = _ref5.data, payload = _ref5.payload, location = _ref5.location, text = _ref5.text, addrData = _ref5.addrData;
            _context3.prev = 1;
            out = new _facebookMessengerBot.Elements();
            _context3.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context3.next = 7;
            return _facebookMessengerBot.Bot.wait(500);

          case 7:
            _context3.t0 = action;
            _context3.next = _context3.t0 === 'BASIC_REPLY' ? 10 : _context3.t0 === 'CHECK_TYPED_TEXT' ? 14 : _context3.t0 === 'ASK_FOR_CONTINUE' ? 18 : _context3.t0 === 'CHECK_LAST_ACTION' ? 22 : _context3.t0 === 'CONTINUE_ORDER_NO' ? 26 : _context3.t0 === 'PASS_THREAD_CONTROL' ? 30 : _context3.t0 === 'SEND_WELCOME' ? 34 : _context3.t0 === 'SEND_MAIN_MENU' ? 38 : _context3.t0 === 'SEND_CARDAPIO' ? 42 : _context3.t0 === 'SEND_HORARIO' ? 46 : _context3.t0 === 'CHECK_ADDRESS' ? 50 : _context3.t0 === 'CONFIRM_ADDRESS' ? 57 : _context3.t0 === 'ASK_FOR_ORDER' ? 61 : _context3.t0 === 'LOCATION_CONFIRM_ADDRESS' ? 65 : _context3.t0 === 'ASK_FOR_PHONE' ? 72 : _context3.t0 === 'SHOW_PHONE' ? 76 : _context3.t0 === 'SHOW_ADDRESS' ? 80 : _context3.t0 === 'SHOW_ORDER_OR_ASK_FOR_PHONE' ? 84 : _context3.t0 === 'ASK_TO_TYPE_PHONE' ? 88 : _context3.t0 === 'CONFIRM_TYPED_PHONE' ? 92 : _context3.t0 === 'ASK_FOR_LOCATION' ? 96 : _context3.t0 === 'ASK_TO_TYPE_ADDRESS' ? 103 : _context3.t0 === 'ASK_FOR_QUANTITY' ? 107 : _context3.t0 === 'ASK_FOR_QUANTITY_MORE' ? 111 : _context3.t0 === 'SHOW_QUANTITY' ? 115 : _context3.t0 === 'ASK_FOR_SIZE' ? 119 : _context3.t0 === 'SHOW_SIZE' ? 123 : _context3.t0 === 'SHOW_SPLIT' ? 127 : _context3.t0 === 'CHECK_SPLIT' ? 131 : _context3.t0 === 'CHECK_FLAVOR' ? 135 : _context3.t0 === 'ASK_FOR_FLAVOR' ? 139 : _context3.t0 === 'SHOW_FLAVOR' ? 143 : _context3.t0 === 'CHECK_ITEM' ? 147 : _context3.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 151 : _context3.t0 === 'SHOW_NO_BEVERAGE' ? 155 : _context3.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 159 : _context3.t0 === 'SHOW_BEVERAGE' ? 163 : _context3.t0 === 'ASK_FOR_PAYMENT_TYPE' ? 167 : _context3.t0 === 'SHOW_PAYMENT_TYPE' ? 171 : _context3.t0 === 'ASK_FOR_PAYMENT_CHANGE' ? 175 : _context3.t0 === 'SHOW_PAYMENT_CHANGE' ? 179 : _context3.t0 === 'SHOW_FULL_ORDER' ? 183 : _context3.t0 === 'ASK_FOR_CHANGE_ORDER' ? 187 : _context3.t0 === 'ASK_FOR_SPECIFIC_ITEM' ? 191 : _context3.t0 === 'UPDATE_ITEM' ? 195 : _context3.t0 === 'CONFIRM_ORDER' ? 199 : _context3.t0 === 'PIZZAIBOT_MARKETING' ? 203 : 207;
            break;

          case 10:
            _context3.next = 12;
            return (0, _botController.basicReply)(data);

          case 12:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 14:
            _context3.next = 16;
            return checkTypedText(pageID, sender.id, text);

          case 16:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 18:
            _context3.next = 20;
            return (0, _botController.askForContinue)(pageID, sender.id);

          case 20:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 22:
            _context3.next = 24;
            return (0, _botController.checkLastAction)(pageID, sender.id);

          case 24:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 26:
            _context3.next = 28;
            return (0, _botController.optionsStopOrder)(pageID, sender.id);

          case 28:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 30:
            _context3.next = 32;
            return (0, _botController.passThreadControl)(pageID, sender.id);

          case 32:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 34:
            _context3.next = 36;
            return (0, _botController.sendWelcomeMessage)(pageID, sender);

          case 36:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 38:
            _context3.next = 40;
            return (0, _botController.sendMainMenu)();

          case 40:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 42:
            _context3.next = 44;
            return (0, _botController.sendCardapio)(pageID);

          case 44:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 46:
            _context3.next = 48;
            return (0, _botController.sendHorario)(pageID);

          case 48:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 50:
            _context3.next = 52;
            return bot.fetchUser(sender.id);

          case 52:
            user1 = _context3.sent;
            _context3.next = 55;
            return (0, _botController.confirmAddressOrAskLocation)(pageID, sender.id, user1);

          case 55:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 57:
            _context3.next = 59;
            return (0, _botController.confirmAddress)(pageID, sender.id, addrData);

          case 59:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 61:
            _context3.next = 63;
            return (0, _botController.askForWantOrder)(pageID, sender.id);

          case 63:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 65:
            _context3.next = 67;
            return bot.fetchUser(sender.id);

          case 67:
            user2 = _context3.sent;
            _context3.next = 70;
            return (0, _botController.confirmLocationAddress)(pageID, sender.id, location, user2);

          case 70:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 72:
            _context3.next = 74;
            return (0, _botController.askForPhone)(pageID, sender.id);

          case 74:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 76:
            _context3.next = 78;
            return (0, _botController.showPhone)(pageID, sender.id, payload || data);

          case 78:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 80:
            _context3.next = 82;
            return (0, _botController.showAddress)(pageID, sender.id, data);

          case 82:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 84:
            _context3.next = 86;
            return (0, _botController.showOrderOrAskForPhone)(pageID, sender.id);

          case 86:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 88:
            _context3.next = 90;
            return (0, _botController.askToTypePhone)(pageID, sender.id);

          case 90:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 92:
            _context3.next = 94;
            return (0, _botController.confirmTypedPhone)(pageID, sender.id, text);

          case 94:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 96:
            _context3.next = 98;
            return bot.fetchUser(sender.id);

          case 98:
            user = _context3.sent;
            _context3.next = 101;
            return (0, _botController.askForLocation)(pageID, sender.id, user);

          case 101:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 103:
            _context3.next = 105;
            return (0, _botController.askToTypeAddress)(pageID, sender.id);

          case 105:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 107:
            _context3.next = 109;
            return (0, _botController.askForQuantity)(pageID, sender.id);

          case 109:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 111:
            _context3.next = 113;
            return (0, _botController.askForQuantityMore)(pageID, sender.id);

          case 113:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 115:
            _context3.next = 117;
            return (0, _botController.showQuantity)(pageID, sender.id, data);

          case 117:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 119:
            _context3.next = 121;
            return (0, _botController.askForSize)(pageID, sender.id);

          case 121:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 123:
            _context3.next = 125;
            return (0, _botController.showSize)(pageID, sender.id, data);

          case 125:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 127:
            _context3.next = 129;
            return (0, _botController.showSplit)(pageID, sender.id, data);

          case 129:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 131:
            _context3.next = 133;
            return (0, _botController.askForSplitFlavorOrConfirm)(pageID, sender.id, 1);

          case 133:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 135:
            _context3.next = 137;
            return (0, _botController.askForFlavorOrConfirm)(pageID, sender.id, 1, data);

          case 137:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 139:
            _context3.next = 141;
            return (0, _botController.askForFlavor)(pageID, sender.id, multiple, split);

          case 141:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 143:
            _context3.next = 145;
            return (0, _botController.showFlavor)(pageID, sender.id, data);

          case 145:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 147:
            _context3.next = 149;
            return (0, _botController.showOrderOrNextItem)(pageID, sender.id);

          case 149:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 151:
            _context3.next = 153;
            return (0, _botController.askForWantBeverage)(pageID, sender.id);

          case 153:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 155:
            _context3.next = 157;
            return (0, _botController.showNoBeverage)(pageID, sender.id, data);

          case 157:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 159:
            _context3.next = 161;
            return (0, _botController.askForBeverages)(pageID, sender.id, multiple);

          case 161:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 163:
            _context3.next = 165;
            return (0, _botController.showBeverage)(pageID, sender.id, data);

          case 165:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 167:
            _context3.next = 169;
            return (0, _botController.askForPaymentType)(pageID, sender.id);

          case 169:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 171:
            _context3.next = 173;
            return (0, _botController.showPaymentType)(pageID, sender.id, data);

          case 173:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 175:
            _context3.next = 177;
            return (0, _botController.askForPaymentChange)(pageID, sender.id);

          case 177:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 179:
            _context3.next = 181;
            return (0, _botController.showPaymentChange)(pageID, sender.id, data);

          case 181:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 183:
            _context3.next = 185;
            return (0, _botController.showFullOrder)(pageID, sender.id);

          case 185:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 187:
            _context3.next = 189;
            return (0, _botController.askForChangeOrder)(pageID, sender.id);

          case 189:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 191:
            _context3.next = 193;
            return (0, _botController.askForSpecificItem)(pageID, sender.id);

          case 193:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 195:
            _context3.next = 197;
            return (0, _botController.updateItemAskOptions)(pageID, sender.id, data);

          case 197:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 199:
            _context3.next = 201;
            return (0, _botController.confirmOrder)(pageID, sender.id);

          case 201:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 203:
            _context3.next = 205;
            return marketing_flow(pageID, sender.id, data, text, payload);

          case 205:
            out = _context3.sent;
            return _context3.abrupt("break", 208);

          case 207:
            return _context3.abrupt("break", 208);

          case 208:
            _context3.next = 210;
            return bot.stopTyping(sender.id);

          case 210:
            _context3.next = 212;
            return bot.send(sender.id, out);

          case 212:
            _context3.next = 218;
            break;

          case 214:
            _context3.prev = 214;
            _context3.t1 = _context3["catch"](1);
            console.error('action:', action, 'data:', data, 'err:', _context3.t1);
            throw _context3.t1;

          case 218:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 214]]);
  }));

  return function sendActions(_x3) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * Actions for marketing controller
 * @param {*} data 
 */


exports.sendActions = sendActions;

var marketing_flow =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID, userID, data, text, payload) {
    var validation;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = data;
            _context4.next = _context4.t0 === 'GET_STARTED' ? 3 : _context4.t0 === 'howget_pizzaria' ? 6 : _context4.t0 === 'howget_facebookad' ? 6 : _context4.t0 === 'howget_activemarketing' ? 6 : _context4.t0 === 'howget_dontremember' ? 6 : _context4.t0 === 'restaurant_yes' ? 9 : _context4.t0 === 'restaurant_no' ? 12 : _context4.t0 === 'owner_yes' ? 15 : _context4.t0 === 'employee_yes' ? 18 : _context4.t0 === 'options_howitworks' ? 21 : _context4.t0 === 'howitworks_2' ? 24 : _context4.t0 === 'howitworks_3' ? 27 : _context4.t0 === 'howitworks_4' ? 30 : _context4.t0 === 'howitworks_5' ? 33 : _context4.t0 === 'options_howmuch' ? 36 : _context4.t0 === 'options_wanttest' ? 39 : _context4.t0 === 'testtype_customer' ? 42 : _context4.t0 === 'testtype_pizzaria' ? 45 : _context4.t0 === 'confirmation_yes' ? 48 : _context4.t0 === 'orderConfirmation_start' ? 51 : _context4.t0 === 'orderConfirmation_question' ? 54 : _context4.t0 === 'open_question' ? 57 : _context4.t0 === 'finalquestion_phone' ? 60 : _context4.t0 === 'finalquestion_whatsapp' ? 63 : _context4.t0 === 'finalquestion_mail' ? 66 : _context4.t0 === 'finalquestion_messenger' ? 69 : _context4.t0 === 'type_phone' ? 72 : _context4.t0 === 'retype_phone' ? 75 : _context4.t0 === 'contact_phone' ? 78 : _context4.t0 === 'contact_mail' ? 91 : _context4.t0 === 'returned_customer' ? 94 : 97;
            break;

          case 3:
            _context4.next = 5;
            return (0, _botMarkController.m_askHowGetHere)(data, pageID, userID);

          case 5:
            return _context4.abrupt("return", _context4.sent);

          case 6:
            _context4.next = 8;
            return (0, _botMarkController.m_askForRestaurant)(data, pageID, userID);

          case 8:
            return _context4.abrupt("return", _context4.sent);

          case 9:
            _context4.next = 11;
            return (0, _botMarkController.m_askForOwnership)(data, pageID, userID);

          case 11:
            return _context4.abrupt("return", _context4.sent);

          case 12:
            _context4.next = 14;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID);

          case 14:
            return _context4.abrupt("return", _context4.sent);

          case 15:
            _context4.next = 17;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID, 'owner');

          case 17:
            return _context4.abrupt("return", _context4.sent);

          case 18:
            _context4.next = 20;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID, 'employee');

          case 20:
            return _context4.abrupt("return", _context4.sent);

          case 21:
            _context4.next = 23;
            return (0, _botMarkController.m_howItWorks)(data, pageID, userID);

          case 23:
            return _context4.abrupt("return", _context4.sent);

          case 24:
            _context4.next = 26;
            return (0, _botMarkController.m_howItWorks2)(data, pageID, userID);

          case 26:
            return _context4.abrupt("return", _context4.sent);

          case 27:
            _context4.next = 29;
            return (0, _botMarkController.m_howItWorks3)(data, pageID, userID);

          case 29:
            return _context4.abrupt("return", _context4.sent);

          case 30:
            _context4.next = 32;
            return (0, _botMarkController.m_howItWorks4)(data, pageID, userID);

          case 32:
            return _context4.abrupt("return", _context4.sent);

          case 33:
            _context4.next = 35;
            return (0, _botMarkController.m_howItWorks5)(data, pageID, userID);

          case 35:
            return _context4.abrupt("return", _context4.sent);

          case 36:
            _context4.next = 38;
            return (0, _botMarkController.m_showPrices)(data, pageID, userID);

          case 38:
            return _context4.abrupt("return", _context4.sent);

          case 39:
            _context4.next = 41;
            return (0, _botMarkController.m_askForTestType)(data, pageID, userID);

          case 41:
            return _context4.abrupt("return", _context4.sent);

          case 42:
            _context4.next = 44;
            return (0, _botMarkController.m_askForBeginTest)(data, pageID, userID);

          case 44:
            return _context4.abrupt("return", _context4.sent);

          case 45:
            _context4.next = 47;
            return (0, _botMarkController.m_askTestTypePizzaria)(data, pageID, userID);

          case 47:
            return _context4.abrupt("return", _context4.sent);

          case 48:
            _context4.next = 50;
            return (0, _botMarkController.m_afterOrderConfirmation)(data, pageID, userID);

          case 50:
            return _context4.abrupt("return", _context4.sent);

          case 51:
            _context4.next = 53;
            return (0, _botMarkController.m_startTrial)(data, pageID, userID);

          case 53:
            return _context4.abrupt("return", _context4.sent);

          case 54:
            _context4.next = 56;
            return (0, _botMarkController.m_openQuestion)(data, pageID, userID);

          case 56:
            return _context4.abrupt("return", _context4.sent);

          case 57:
            _context4.next = 59;
            return (0, _botMarkController.m_confirmOpenQuestion)(data, pageID, userID, text);

          case 59:
            return _context4.abrupt("return", _context4.sent);

          case 60:
            _context4.next = 62;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'phone');

          case 62:
            return _context4.abrupt("return", _context4.sent);

          case 63:
            _context4.next = 65;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'whatsapp');

          case 65:
            return _context4.abrupt("return", _context4.sent);

          case 66:
            _context4.next = 68;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'email');

          case 68:
            return _context4.abrupt("return", _context4.sent);

          case 69:
            _context4.next = 71;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'messenger');

          case 71:
            return _context4.abrupt("return", _context4.sent);

          case 72:
            _context4.next = 74;
            return (0, _botMarkController.m_typePhone)(data, pageID, userID);

          case 74:
            return _context4.abrupt("return", _context4.sent);

          case 75:
            _context4.next = 77;
            return (0, _botMarkController.m_typePhone)(data, pageID, userID);

          case 77:
            return _context4.abrupt("return", _context4.sent);

          case 78:
            _context4.next = 80;
            return (0, _botMarkController.m_isValidPhone)(payload || text);

          case 80:
            validation = _context4.sent;
            console.info({
              validation: validation
            });

            if (!(validation === 'OK_PHONE')) {
              _context4.next = 88;
              break;
            }

            _context4.next = 85;
            return (0, _botMarkController.m_contactPhone)(data, pageID, userID, payload || text);

          case 85:
            return _context4.abrupt("return", _context4.sent);

          case 88:
            _context4.next = 90;
            return (0, _botMarkController.m_typePhone)('retype_phone', pageID, userID, validation);

          case 90:
            return _context4.abrupt("return", _context4.sent);

          case 91:
            _context4.next = 93;
            return (0, _botMarkController.m_contactMail)(data, pageID, userID, text);

          case 93:
            return _context4.abrupt("return", _context4.sent);

          case 94:
            _context4.next = 96;
            return (0, _botMarkController.m_returnedCustomer)(data, pageID, userID);

          case 96:
            return _context4.abrupt("return", _context4.sent);

          case 97:
            _context4.next = 99;
            return (0, _botController.basicReply)('Ops, não tenho uma resposta para isso.');

          case 99:
            return _context4.abrupt("return", _context4.sent);

          case 100:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function marketing_flow(_x4, _x5, _x6, _x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID 
 * @param {*} sizeID 
 */


exports.marketing_flow = marketing_flow;

var getFlavorsAndToppings =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, sizeID) {
    var flavorArray, flavorsWithPrice, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, pricing;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context5.sent;
            flavorsWithPrice = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 8;
            _iterator = flavorArray[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 32;
              break;
            }

            flavor = _step.value;

            if (!sizeID) {
              _context5.next = 17;
              break;
            }

            _context5.next = 15;
            return (0, _pricingsController.getOnePricing)(pageID, flavor.kind, sizeID);

          case 15:
            pricing = _context5.sent;

            if (pricing) {
              flavor.price = pricing.price;
            }

          case 17:
            if (!sizeID) {
              _context5.next = 25;
              break;
            }

            if (!flavor.price) {
              _context5.next = 23;
              break;
            }

            _context5.next = 21;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 21:
            flavor.toppingsNames = _context5.sent;
            flavorsWithPrice.push(flavor);

          case 23:
            _context5.next = 29;
            break;

          case 25:
            _context5.next = 27;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 27:
            flavor.toppingsNames = _context5.sent;
            flavorsWithPrice.push(flavor);

          case 29:
            _iteratorNormalCompletion = true;
            _context5.next = 10;
            break;

          case 32:
            _context5.next = 38;
            break;

          case 34:
            _context5.prev = 34;
            _context5.t0 = _context5["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 38:
            _context5.prev = 38;
            _context5.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 41:
            _context5.prev = 41;

            if (!_didIteratorError) {
              _context5.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context5.finish(41);

          case 45:
            return _context5.finish(38);

          case 46:
            return _context5.abrupt("return", flavorsWithPrice);

          case 49:
            _context5.prev = 49;
            _context5.t1 = _context5["catch"](0);
            console.error({
              flavorsAndToppingsErr: _context5.t1
            });

          case 52:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 49], [8, 34, 38, 46], [39,, 41, 45]]);
  }));

  return function getFlavorsAndToppings(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getFlavorsAndToppings = getFlavorsAndToppings;

var inputCardapioReplyMsg = function inputCardapioReplyMsg(flavorArray) {
  var replyMsg = '';

  if (flavorArray) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = flavorArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var flavor = _step2.value;
        replyMsg = replyMsg + '*' + flavor.flavor + '*' + '\n';
        replyMsg = replyMsg + flavor.toppingsNames.join();
        replyMsg = replyMsg + '\n';
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  return replyMsg;
};

exports.inputCardapioReplyMsg = inputCardapioReplyMsg;

var getOpenAndClose =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID) {
    var weekDay, openingTimes, openAndClose;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // TODO: timezone from the store
            weekDay = new Date().getDay();
            _context6.next = 3;
            return (0, _storesController.getStoreData)(pageID);

          case 3:
            openingTimes = _context6.sent;

            if (!openingTimes) {
              _context6.next = 8;
              break;
            }

            openAndClose = {
              isOpen: false,
              openTime: null,
              closeTime: null
            };

            if (weekDay === 1) {
              openAndClose.isOpen = openingTimes.mon_is_open;
              openAndClose.openTime = openingTimes.mon_open;
              openAndClose.closeTime = openingTimes.mon_close;
            } else if (weekDay === 2) {
              openAndClose.isOpen = openingTimes.tue_is_open;
              openAndClose.openTime = openingTimes.tue_open;
              openAndClose.closeTime = openingTimes.tue_close;
            } else if (weekDay === 3) {
              openAndClose.isOpen = openingTimes.wed_is_open;
              openAndClose.openTime = openingTimes.wed_open;
              openAndClose.closeTime = openingTimes.wed_close;
            } else if (weekDay === 4) {
              openAndClose.isOpen = openingTimes.thu_is_open;
              openAndClose.openTime = openingTimes.thu_open;
              openAndClose.closeTime = openingTimes.thu_close;
            } else if (weekDay === 5) {
              openAndClose.isOpen = openingTimes.fri_is_open;
              openAndClose.openTime = openingTimes.fri_open;
              openAndClose.closeTime = openingTimes.fri_close;
            } else if (weekDay === 6) {
              openAndClose.isOpen = openingTimes.sat_is_open;
              openAndClose.openTime = openingTimes.sat_open;
              openAndClose.closeTime = openingTimes.sat_close;
            } else if (weekDay === 7) {
              openAndClose.isOpen = openingTimes.sun_is_open;
              openAndClose.openTime = openingTimes.sun_open;
              openAndClose.closeTime = openingTimes.sun_close;
            }

            return _context6.abrupt("return", openAndClose);

          case 8:
            return _context6.abrupt("return", null);

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getOpenAndClose(_x11) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getOpenAndClose = getOpenAndClose;

var inputHorarioReplyMsg = function inputHorarioReplyMsg(openAndClose) {
  var replyMsg = '';

  if (openAndClose) {
    if (openAndClose.isOpen === true) {
      var strOpenTime = new Date(openAndClose.openTime).getHours() + ':' + new Date(openAndClose.openTime).getMinutes().toString().padStart(2, '0');
      var strCloseTime = new Date(openAndClose.closeTime).getHours() + ':' + new Date(openAndClose.closeTime).getMinutes().toString().padStart(2, '0');
      replyMsg = 'Olá, hoje nosso horário de funcionamento é a partir das ';
      replyMsg = replyMsg + strOpenTime + ' horas, até às ';
      replyMsg = replyMsg + strCloseTime + ' horas.';
    } else {
      replyMsg = 'Olá, infelizmente hoje estamos fechados, então, não estamos aceitando pedidos. ';
    }
  }

  return replyMsg;
};

exports.inputHorarioReplyMsg = inputHorarioReplyMsg;
//# sourceMappingURL=actionsController.js.map