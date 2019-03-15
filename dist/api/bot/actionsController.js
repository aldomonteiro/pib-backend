"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.marketing_flow = exports.sendActions = exports.mapEventsActions = exports.checkTypedText = void 0;

var _facebookMessengerBot = require("facebook-messenger-bot");

var _botController = require("./botController");

var _botMarkController = require("./botMarkController");

var _ordersController = require("../controllers/ordersController");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var QTY_1 = [1, 'um', 'uma'];

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
              _context.next = 34;
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
            _context.next = 32;
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
            _context.next = 32;
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
            _context.next = 32;
            break;

          case 23:
            if (!(pendingOrder.order.waitingFor === 'typed_comments')) {
              _context.next = 30;
              break;
            }

            _context.next = 26;
            return sendActions({
              action: 'SHOW_COMMENTS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              text: text
            });

          case 26:
            _context.next = 28;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 28:
            _context.next = 32;
            break;

          case 30:
            _context.next = 32;
            return sendActions({
              action: 'ASK_FOR_CONTINUE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 32:
            _context.next = 36;
            break;

          case 34:
            _context.next = 36;
            return sendActions({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 36:
            _context.next = 42;
            break;

          case 38:
            _context.prev = 38;
            _context.t0 = _context["catch"](1);
            console.error({
              confirmTypedTextError: _context.t0
            });
            throw _context.t0;

          case 42:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 38]]);
  }));

  return function checkTypedText(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Receive events, dispatch actions
 * @param {*} param
 */


exports.checkTypedText = checkTypedText;

var mapEventsActions =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref3) {
    var event, data, bot, sender, pageID, text;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            event = _ref3.event, data = _ref3.data, bot = _ref3.bot, sender = _ref3.sender, pageID = _ref3.pageID, text = _ref3.text;
            _context2.prev = 1;
            _context2.t0 = event;
            _context2.next = _context2.t0 === 'ORDER_CONTINUE_ORDER' ? 5 : _context2.t0 === 'STOP_ORDER_OPTIONS' ? 15 : _context2.t0 === 'MAIN-MENU' ? 25 : _context2.t0 === 'ORDER_WANT_ORDER' ? 42 : _context2.t0 === 'ORDER_DELIVER' ? 54 : _context2.t0 === 'CORRECT_SAVED_ADDRESS' ? 66 : _context2.t0 === 'WRONG_SAVED_ADDRESS' ? 71 : _context2.t0 === 'LOCATION_ADDRESS' ? 74 : _context2.t0 === 'PHONE_CONFIRMED' ? 86 : _context2.t0 === 'ORDER_QTY' ? 98 : _context2.t0 === 'ORDER_SIZE' ? 113 : _context2.t0 === 'ORDER_SPLIT' ? 118 : _context2.t0 === 'ORDER_FLAVOR' ? 123 : _context2.t0 === 'ORDER_PIZZA_CONFIRMATION' ? 135 : _context2.t0 === 'ORDER_WANT_CHANGE' ? 145 : _context2.t0 === 'ORDER_CHANGE' ? 148 : _context2.t0 === 'ORDER_CHANGE_ITEM' ? 165 : _context2.t0 === 'ORDER_CANCEL_ITEM' ? 168 : _context2.t0 === 'ORDER_CONFIRM_BEVERAGE' ? 171 : _context2.t0 === 'ORDER_BEVERAGE' ? 183 : _context2.t0 === 'ORDER_PAYMENT_TYPE' ? 200 : _context2.t0 === 'ORDER_PAYMENT_CHANGE' ? 212 : _context2.t0 === 'ORDER_COMMENTS' ? 217 : _context2.t0 === 'ORDER_CONFIRMATION' ? 227 : _context2.t0 === 'ORDER_CHANGE_SELECT_ITEM' ? 240 : 243;
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
            return _context2.abrupt("break", 243);

          case 15:
            _context2.t2 = data;
            _context2.next = _context2.t2 === 'stoporder_init' ? 18 : _context2.t2 === 'stoporder_human' ? 21 : 24;
            break;

          case 18:
            _context2.next = 20;
            return sendActions({
              action: 'CANCEL_PENDING_ORDER',
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
            return _context2.abrupt("break", 243);

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
              action: 'ASK_FOR_DELIVER',
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
            return _context2.abrupt("break", 243);

          case 42:
            _context2.t4 = data;
            _context2.next = _context2.t4 === 'wantorder_yes' ? 45 : _context2.t4 === 'wantorder_no' ? 48 : 53;
            break;

          case 45:
            _context2.next = 47;
            return sendActions({
              action: 'ASK_FOR_DELIVER',
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
            return _context2.abrupt("break", 243);

          case 54:
            _context2.next = 56;
            return sendActions({
              action: 'SHOW_DELIVER',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 56:
            _context2.t5 = data.type;
            _context2.next = _context2.t5 === 'delivery' ? 59 : _context2.t5 === 'pickup' ? 62 : 65;
            break;

          case 59:
            _context2.next = 61;
            return sendActions({
              action: 'CHECK_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 61:
            return _context2.abrupt("break", 65);

          case 62:
            _context2.next = 64;
            return sendActions({
              action: 'ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 64:
            return _context2.abrupt("break", 65);

          case 65:
            return _context2.abrupt("break", 243);

          case 66:
            _context2.next = 68;
            return sendActions({
              action: 'SHOW_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 68:
            _context2.next = 70;
            return sendActions({
              action: 'ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 70:
            return _context2.abrupt("break", 243);

          case 71:
            _context2.next = 73;
            return sendActions({
              action: 'ASK_FOR_LOCATION',
              bot: bot,
              sender: sender,
              pageID: pageID,
              event: event
            });

          case 73:
            return _context2.abrupt("break", 243);

          case 74:
            _context2.t6 = data;
            _context2.next = _context2.t6 === 'incorrect_address' ? 77 : 80;
            break;

          case 77:
            _context2.next = 79;
            return sendActions({
              action: 'ASK_TO_TYPE_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 79:
            return _context2.abrupt("break", 85);

          case 80:
            _context2.next = 82;
            return sendActions({
              action: 'SHOW_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 82:
            _context2.next = 84;
            return sendActions({
              action: 'SHOW_ORDER_OR_ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 84:
            return _context2.abrupt("break", 85);

          case 85:
            return _context2.abrupt("break", 243);

          case 86:
            _context2.t7 = data;
            _context2.next = _context2.t7 === 'change_phone' ? 89 : 92;
            break;

          case 89:
            _context2.next = 91;
            return sendActions({
              action: 'ASK_TO_TYPE_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 91:
            return _context2.abrupt("break", 97);

          case 92:
            _context2.next = 94;
            return sendActions({
              action: 'SHOW_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 94:
            _context2.next = 96;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 96:
            return _context2.abrupt("break", 97);

          case 97:
            return _context2.abrupt("break", 243);

          case 98:
            _context2.t8 = data;
            _context2.next = _context2.t8 === 'qty_more' ? 101 : _context2.t8 === 'qty_less' ? 104 : 107;
            break;

          case 101:
            _context2.next = 103;
            return sendActions({
              action: 'ASK_FOR_QUANTITY_MORE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 103:
            return _context2.abrupt("break", 112);

          case 104:
            _context2.next = 106;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 106:
            return _context2.abrupt("break", 112);

          case 107:
            _context2.next = 109;
            return sendActions({
              action: 'SHOW_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 109:
            _context2.next = 111;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 111:
            return _context2.abrupt("break", 112);

          case 112:
            return _context2.abrupt("break", 243);

          case 113:
            _context2.next = 115;
            return sendActions({
              action: 'SHOW_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 115:
            _context2.next = 117;
            return sendActions({
              action: 'CHECK_SPLIT',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 117:
            return _context2.abrupt("break", 243);

          case 118:
            _context2.next = 120;
            return sendActions({
              action: 'SHOW_SPLIT',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 120:
            _context2.next = 122;
            return sendActions({
              action: 'CHECK_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 122:
            return _context2.abrupt("break", 243);

          case 123:
            _context2.t9 = data.option;
            _context2.next = _context2.t9 === 'flavors_more' ? 126 : 129;
            break;

          case 126:
            _context2.next = 128;
            return sendActions({
              action: 'ASK_FOR_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: data.multiple
            });

          case 128:
            return _context2.abrupt("break", 134);

          case 129:
            _context2.next = 131;
            return sendActions({
              action: 'SHOW_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 131:
            _context2.next = 133;
            return sendActions({
              action: 'CHECK_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 133:
            return _context2.abrupt("break", 134);

          case 134:
            return _context2.abrupt("break", 243);

          case 135:
            _context2.t10 = data.type;
            _context2.next = _context2.t10 === 'confirmation_yes' ? 138 : 141;
            break;

          case 138:
            _context2.next = 140;
            return sendActions({
              action: 'ASK_FOR_WANT_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 140:
            return _context2.abrupt("break", 144);

          case 141:
            _context2.next = 143;
            return sendActions({
              action: 'ASK_FOR_CHANGE_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 143:
            return _context2.abrupt("break", 144);

          case 144:
            return _context2.abrupt("break", 243);

          case 145:
            _context2.next = 147;
            return sendActions({
              action: 'ASK_FOR_SPECIFIC_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 147:
            return _context2.abrupt("break", 243);

          case 148:
            _context2.t11 = data;
            _context2.next = _context2.t11 === 'change_quantity' ? 151 : _context2.t11 === 'change_size' ? 154 : _context2.t11 === 'change_flavor' ? 157 : _context2.t11 === 'change_address' ? 160 : 163;
            break;

          case 151:
            _context2.next = 153;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 153:
            return _context2.abrupt("break", 164);

          case 154:
            _context2.next = 156;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 156:
            return _context2.abrupt("break", 164);

          case 157:
            _context2.next = 159;
            return sendActions({
              action: 'ASK_FOR_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: 1
            });

          case 159:
            return _context2.abrupt("break", 164);

          case 160:
            _context2.next = 162;
            return sendActions({
              action: 'ASK_FOR_LOCATION',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 162:
            return _context2.abrupt("break", 164);

          case 163:
            return _context2.abrupt("break", 164);

          case 164:
            return _context2.abrupt("break", 243);

          case 165:
            _context2.next = 167;
            return sendActions({
              action: 'CHANGE_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 167:
            return _context2.abrupt("break", 243);

          case 168:
            _context2.next = 170;
            return sendActions({
              action: 'CANCEL_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 170:
            return _context2.abrupt("break", 243);

          case 171:
            _context2.t12 = data;
            _context2.next = _context2.t12 === 'beverage_yes' ? 174 : 177;
            break;

          case 174:
            _context2.next = 176;
            return sendActions({
              action: 'ASK_FOR_BEVERAGE_OPTIONS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: 1
            });

          case 176:
            return _context2.abrupt("break", 182);

          case 177:
            _context2.next = 179;
            return sendActions({
              action: 'SHOW_NO_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 179:
            _context2.next = 181;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 181:
            return _context2.abrupt("break", 182);

          case 182:
            return _context2.abrupt("break", 243);

          case 183:
            _context2.t13 = data.option;
            _context2.next = _context2.t13 === 'beverages_more' ? 186 : _context2.t13 === 'beverages_cancel' ? 189 : 194;
            break;

          case 186:
            _context2.next = 188;
            return sendActions({
              action: 'ASK_FOR_BEVERAGE_OPTIONS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: data.multiple
            });

          case 188:
            return _context2.abrupt("break", 199);

          case 189:
            _context2.next = 191;
            return sendActions({
              action: 'SHOW_NO_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 191:
            _context2.next = 193;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 193:
            return _context2.abrupt("break", 199);

          case 194:
            _context2.next = 196;
            return sendActions({
              action: 'SHOW_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 196:
            _context2.next = 198;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 198:
            return _context2.abrupt("break", 199);

          case 199:
            return _context2.abrupt("break", 243);

          case 200:
            _context2.next = 202;
            return sendActions({
              action: 'SHOW_PAYMENT_TYPE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 202:
            _context2.t14 = data;
            _context2.next = _context2.t14 === 'payment_money' ? 205 : _context2.t14 === 'payment_card' ? 208 : 211;
            break;

          case 205:
            _context2.next = 207;
            return sendActions({
              action: 'ASK_FOR_PAYMENT_CHANGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 207:
            return _context2.abrupt("break", 211);

          case 208:
            _context2.next = 210;
            return sendActions({
              action: 'ASK_FOR_COMMENTS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 210:
            return _context2.abrupt("break", 211);

          case 211:
            return _context2.abrupt("break", 243);

          case 212:
            _context2.next = 214;
            return sendActions({
              action: 'SHOW_PAYMENT_CHANGE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 214:
            _context2.next = 216;
            return sendActions({
              action: 'ASK_FOR_COMMENTS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 216:
            return _context2.abrupt("break", 243);

          case 217:
            _context2.t15 = data;
            _context2.next = _context2.t15 === 'comments_yes' ? 220 : 223;
            break;

          case 220:
            _context2.next = 222;
            return sendActions({
              action: 'ASK_FOR_TYPE_COMMENTS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 222:
            return _context2.abrupt("break", 226);

          case 223:
            _context2.next = 225;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 225:
            return _context2.abrupt("break", 226);

          case 226:
            return _context2.abrupt("break", 243);

          case 227:
            _context2.t16 = data.type;
            _context2.next = _context2.t16 === 'confirmation_yes' ? 230 : 236;
            break;

          case 230:
            _context2.next = 232;
            return sendActions({
              action: 'CONFIRM_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 232:
            if (!bot.marketing) {
              _context2.next = 235;
              break;
            }

            _context2.next = 235;
            return sendActions({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: 'confirmation_yes'
            });

          case 235:
            return _context2.abrupt("break", 239);

          case 236:
            _context2.next = 238;
            return sendActions({
              action: 'ASK_FOR_CHANGE_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 238:
            return _context2.abrupt("break", 239);

          case 239:
            return _context2.abrupt("break", 243);

          case 240:
            _context2.next = 242;
            return sendActions({
              action: 'UPDATE_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 242:
            return _context2.abrupt("break", 243);

          case 243:
            _context2.next = 248;
            break;

          case 245:
            _context2.prev = 245;
            _context2.t17 = _context2["catch"](1);
            console.error({
              event: event
            }, {
              mapEventsActionsErr: _context2.t17
            }, {
              data: data
            });

          case 248:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 245]]);
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
            _context3.next = _context3.t0 === 'BASIC_REPLY' ? 10 : _context3.t0 === 'CHECK_TYPED_TEXT' ? 14 : _context3.t0 === 'ASK_FOR_CONTINUE' ? 18 : _context3.t0 === 'CHECK_LAST_ACTION' ? 22 : _context3.t0 === 'CONTINUE_ORDER_NO' ? 26 : _context3.t0 === 'PASS_THREAD_CONTROL' ? 30 : _context3.t0 === 'SEND_WELCOME' ? 34 : _context3.t0 === 'SEND_MAIN_MENU' ? 38 : _context3.t0 === 'SEND_CARDAPIO' ? 42 : _context3.t0 === 'SEND_HORARIO' ? 46 : _context3.t0 === 'ASK_FOR_DELIVER' ? 50 : _context3.t0 === 'SHOW_DELIVER' ? 54 : _context3.t0 === 'CHECK_ADDRESS' ? 58 : _context3.t0 === 'CONFIRM_ADDRESS' ? 65 : _context3.t0 === 'ASK_FOR_ORDER' ? 69 : _context3.t0 === 'LOCATION_CONFIRM_ADDRESS' ? 73 : _context3.t0 === 'ASK_FOR_PHONE' ? 80 : _context3.t0 === 'SHOW_PHONE' ? 84 : _context3.t0 === 'SHOW_ADDRESS' ? 88 : _context3.t0 === 'SHOW_ORDER_OR_ASK_FOR_PHONE' ? 92 : _context3.t0 === 'ASK_TO_TYPE_PHONE' ? 96 : _context3.t0 === 'CONFIRM_TYPED_PHONE' ? 100 : _context3.t0 === 'ASK_FOR_LOCATION' ? 104 : _context3.t0 === 'ASK_TO_TYPE_ADDRESS' ? 111 : _context3.t0 === 'ASK_FOR_QUANTITY' ? 115 : _context3.t0 === 'ASK_FOR_QUANTITY_MORE' ? 119 : _context3.t0 === 'SHOW_QUANTITY' ? 123 : _context3.t0 === 'ASK_FOR_SIZE' ? 127 : _context3.t0 === 'SHOW_SIZE' ? 131 : _context3.t0 === 'SHOW_SPLIT' ? 135 : _context3.t0 === 'CHECK_SPLIT' ? 139 : _context3.t0 === 'CHECK_FLAVOR' ? 143 : _context3.t0 === 'ASK_FOR_FLAVOR' ? 147 : _context3.t0 === 'SHOW_FLAVOR' ? 151 : _context3.t0 === 'CHECK_ITEM' ? 155 : _context3.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 159 : _context3.t0 === 'SHOW_NO_BEVERAGE' ? 163 : _context3.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 167 : _context3.t0 === 'SHOW_BEVERAGE' ? 171 : _context3.t0 === 'ASK_FOR_PAYMENT_TYPE' ? 175 : _context3.t0 === 'SHOW_PAYMENT_TYPE' ? 179 : _context3.t0 === 'ASK_FOR_PAYMENT_CHANGE' ? 183 : _context3.t0 === 'SHOW_PAYMENT_CHANGE' ? 187 : _context3.t0 === 'ASK_FOR_COMMENTS' ? 191 : _context3.t0 === 'ASK_FOR_TYPE_COMMENTS' ? 195 : _context3.t0 === 'SHOW_COMMENTS' ? 199 : _context3.t0 === 'ASK_TO_TYPE_COMMENTS' ? 203 : _context3.t0 === 'SHOW_FULL_ORDER' ? 207 : _context3.t0 === 'ASK_FOR_CHANGE_ORDER' ? 211 : _context3.t0 === 'ASK_FOR_SPECIFIC_ITEM' ? 215 : _context3.t0 === 'CHANGE_ITEM' ? 219 : _context3.t0 === 'CANCEL_ITEM' ? 223 : _context3.t0 === 'UPDATE_ITEM' ? 227 : _context3.t0 === 'CANCEL_PENDING_ORDER' ? 231 : _context3.t0 === 'CONFIRM_ORDER' ? 235 : _context3.t0 === 'PIZZAIBOT_MARKETING' ? 239 : 243;
            break;

          case 10:
            _context3.next = 12;
            return getElement(_botController.basicReply, data);

          case 12:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 14:
            _context3.next = 16;
            return checkTypedText(pageID, sender.id, text);

          case 16:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 18:
            _context3.next = 20;
            return getElement(_botController.askForContinue);

          case 20:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 22:
            _context3.next = 24;
            return getElement(_botController.checkLastAction, [pageID, sender.id]);

          case 24:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 26:
            _context3.next = 28;
            return getElement(_botController.optionsStopOrder);

          case 28:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 30:
            _context3.next = 32;
            return getElement(_botController.passThreadControl, [pageID, sender.id]);

          case 32:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 34:
            _context3.next = 36;
            return getElement(_botController.sendWelcomeMessage, [pageID, sender]);

          case 36:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 38:
            _context3.next = 40;
            return getElement(_botController.sendMainMenu);

          case 40:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 42:
            _context3.next = 44;
            return getElement(_botController.sendCardapio, [pageID]);

          case 44:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 46:
            _context3.next = 48;
            return getElement(_botController.sendHorario, [pageID]);

          case 48:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 50:
            _context3.next = 52;
            return getElement(_botController.askForDeliver, [pageID, sender.id]);

          case 52:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 54:
            _context3.next = 56;
            return getElement(_botController.showDeliver, [pageID, sender.id, data]);

          case 56:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 58:
            _context3.next = 60;
            return bot.fetchUser(sender.id);

          case 60:
            user1 = _context3.sent;
            _context3.next = 63;
            return getElement(_botController.confirmAddressOrAskLocation, [pageID, sender.id, user1]);

          case 63:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 65:
            _context3.next = 67;
            return getElement(_botController.confirmAddress, [pageID, sender.id, addrData]);

          case 67:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 69:
            _context3.next = 71;
            return getElement(_botController.askForWantOrder);

          case 71:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 73:
            _context3.next = 75;
            return bot.fetchUser(sender.id);

          case 75:
            user2 = _context3.sent;
            _context3.next = 78;
            return getElement(_botController.confirmLocationAddress, [pageID, sender.id, location, user2]);

          case 78:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 80:
            _context3.next = 82;
            return getElement(_botController.askForPhone, [pageID, sender.id]);

          case 82:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 84:
            _context3.next = 86;
            return (0, _botController.showPhone)(pageID, sender.id, payload || data);

          case 86:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 88:
            _context3.next = 90;
            return getElement(_botController.showAddress, [pageID, sender.id, data]);

          case 90:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 92:
            _context3.next = 94;
            return getElement(_botController.showOrderOrAskForPhone, [pageID, sender.id]);

          case 94:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 96:
            _context3.next = 98;
            return (0, _botController.askToTypePhone)(pageID, sender.id);

          case 98:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 100:
            _context3.next = 102;
            return (0, _botController.confirmTypedPhone)(pageID, sender.id, text);

          case 102:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 104:
            _context3.next = 106;
            return bot.fetchUser(sender.id);

          case 106:
            user = _context3.sent;
            _context3.next = 109;
            return getElement(_botController.askForLocation, [pageID, sender.id, user]);

          case 109:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 111:
            _context3.next = 113;
            return getElement(_botController.askToTypeAddress, [pageID, sender.id]);

          case 113:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 115:
            _context3.next = 117;
            return getElement(_botController.askForQuantity, [pageID, sender.id]);

          case 117:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 119:
            _context3.next = 121;
            return getElement(_botController.askForQuantityMore, [pageID, sender.id]);

          case 121:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 123:
            _context3.next = 125;
            return getElement(_botController.showQuantity, [pageID, sender.id, data]);

          case 125:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 127:
            _context3.next = 129;
            return getElement(_botController.askForSize, [pageID, sender.id]);

          case 129:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 131:
            _context3.next = 133;
            return getElement(_botController.showSize, [pageID, sender.id, data]);

          case 133:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 135:
            _context3.next = 137;
            return getElement(_botController.showSplit, [pageID, sender.id, data]);

          case 137:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 139:
            _context3.next = 141;
            return getElement(_botController.checkSplit, [pageID, sender.id, 1]);

          case 141:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 143:
            _context3.next = 145;
            return getElement(_botController.askForFlavorOrConfirm, [pageID, sender.id, 1]);

          case 145:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 147:
            _context3.next = 149;
            return getElement(_botController.askForFlavor, [pageID, sender.id, multiple]);

          case 149:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 151:
            _context3.next = 153;
            return getElement(_botController.showFlavor, [pageID, sender.id, data]);

          case 153:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 155:
            _context3.next = 157;
            return getElement(_botController.showOrderOrNextItem, [pageID, sender.id]);

          case 157:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 159:
            _context3.next = 161;
            return getElement(_botController.askForWantBeverage, [pageID, sender.id]);

          case 161:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 163:
            _context3.next = 165;
            return getElement(_botController.showNoBeverage, [pageID, sender.id, data]);

          case 165:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 167:
            _context3.next = 169;
            return getElement(_botController.askForBeverages, [pageID, sender.id, multiple]);

          case 169:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 171:
            _context3.next = 173;
            return getElement(_botController.showBeverage, [pageID, sender.id, data]);

          case 173:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 175:
            _context3.next = 177;
            return getElement(_botController.askForPaymentType, [pageID, sender.id]);

          case 177:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 179:
            _context3.next = 181;
            return getElement(_botController.showPaymentType, [pageID, sender.id, data]);

          case 181:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 183:
            _context3.next = 185;
            return getElement(_botController.askForPaymentChange, [pageID, sender.id]);

          case 185:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 187:
            _context3.next = 189;
            return getElement(_botController.showPaymentChange, [pageID, sender.id, data]);

          case 189:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 191:
            _context3.next = 193;
            return getElement(_botController.askForComments, [pageID, sender.id]);

          case 193:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 195:
            _context3.next = 197;
            return getElement(_botController.askToTypeComments, [pageID, sender.id]);

          case 197:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 199:
            _context3.next = 201;
            return getElement(_botController.showComments, [pageID, sender.id, text]);

          case 201:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 203:
            _context3.next = 205;
            return getElement(_botController.askToTypeComments, [pageID, sender.id]);

          case 205:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 207:
            _context3.next = 209;
            return getElement(_botController.showFullOrder, [pageID, sender.id]);

          case 209:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 211:
            _context3.next = 213;
            return getElement(_botController.askForChangeOrder, [pageID, sender.id, data]);

          case 213:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 215:
            _context3.next = 217;
            return getElement(_botController.askForSpecificItem, [pageID, sender.id]);

          case 217:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 219:
            _context3.next = 221;
            return getElement(_botController.changeItem, [pageID, sender.id, data]);

          case 221:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 223:
            _context3.next = 225;
            return getElement(_botController.cancelItem, [pageID, sender.id, data]);

          case 225:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 227:
            _context3.next = 229;
            return getElement(_botController.updateItemAskOptions, [pageID, sender.id, data]);

          case 229:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 231:
            _context3.next = 233;
            return getElement(_botController.cancelPendingOrder, [pageID, sender.id]);

          case 233:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 235:
            _context3.next = 237;
            return getElement(_botController.confirmOrder, [pageID, sender.id]);

          case 237:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 239:
            _context3.next = 241;
            return marketing_flow(pageID, sender.id, data, text, payload);

          case 241:
            out = _context3.sent;
            return _context3.abrupt("break", 244);

          case 243:
            return _context3.abrupt("break", 244);

          case 244:
            _context3.next = 246;
            return bot.stopTyping(sender.id);

          case 246:
            _context3.next = 248;
            return bot.send(sender.id, out);

          case 248:
            _context3.next = 254;
            break;

          case 250:
            _context3.prev = 250;
            _context3.t1 = _context3["catch"](1);
            console.error('action:', action, 'data:', data, 'err:', _context3.t1);
            throw _context3.t1;

          case 254:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 250]]);
  }));

  return function sendActions(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.sendActions = sendActions;

var getElement =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(fn, params) {
    var out, data, buttons, replies;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // TODO: Where check if it is facebook or whatsapp?
            out = new _facebookMessengerBot.Elements();

            if (!params) {
              _context4.next = 7;
              break;
            }

            _context4.next = 4;
            return fn.apply(void 0, _toConsumableArray(params));

          case 4:
            _context4.t0 = _context4.sent;
            _context4.next = 10;
            break;

          case 7:
            _context4.next = 9;
            return fn();

          case 9:
            _context4.t0 = _context4.sent;

          case 10:
            data = _context4.t0;

            if (data.type === 'text') {
              out.add({
                text: data.text
              });
            } else if (data.type === 'buttons') {
              buttons = new _facebookMessengerBot.Buttons();
              data.options.map(function (option) {
                return buttons.add(option);
              });
              out.add({
                text: data.text,
                buttons: buttons
              });
            } else if (data.type === 'replies') {
              out.add({
                text: data.text
              });
              replies = new _facebookMessengerBot.QuickReplies();
              data.options.map(function (option) {
                return replies.add(option);
              });
              out.setQuickReplies(replies);
            } else if (data.type === 'list' || data.type === 'fulllist') {
              out.setListStyle('compact');
              data.options.map(function (option) {
                if (!option.hidden) {
                  var _buttons = new _facebookMessengerBot.Buttons();

                  _buttons.add(option.buttons);

                  if (option.isOnlyButtons) out.add({
                    isOnlyButtons: option.isOnlyButtons,
                    buttons: _buttons
                  });else out.add({
                    text: option.text,
                    subtext: option.subtext,
                    buttons: _buttons
                  });
                }
              });
            }

            return _context4.abrupt("return", out);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getElement(_x4, _x5) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Actions for marketing controller
 * @param {*} data 
 */


var marketing_flow =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, userID, data, text, payload) {
    var validation;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.t0 = data;
            _context5.next = _context5.t0 === 'GET_STARTED' ? 3 : _context5.t0 === 'howget_pizzaria' ? 6 : _context5.t0 === 'howget_facebookad' ? 6 : _context5.t0 === 'howget_activemarketing' ? 6 : _context5.t0 === 'howget_dontremember' ? 6 : _context5.t0 === 'restaurant_yes' ? 9 : _context5.t0 === 'restaurant_no' ? 12 : _context5.t0 === 'owner_yes' ? 15 : _context5.t0 === 'employee_yes' ? 18 : _context5.t0 === 'options_howitworks' ? 21 : _context5.t0 === 'howitworks_2' ? 24 : _context5.t0 === 'howitworks_3' ? 27 : _context5.t0 === 'howitworks_4' ? 30 : _context5.t0 === 'howitworks_5' ? 33 : _context5.t0 === 'options_howmuch' ? 36 : _context5.t0 === 'options_wanttest' ? 39 : _context5.t0 === 'testtype_customer' ? 42 : _context5.t0 === 'testtype_pizzaria' ? 45 : _context5.t0 === 'confirmation_yes' ? 48 : _context5.t0 === 'orderConfirmation_start' ? 51 : _context5.t0 === 'orderConfirmation_question' ? 54 : _context5.t0 === 'open_question' ? 57 : _context5.t0 === 'finalquestion_phone' ? 60 : _context5.t0 === 'finalquestion_whatsapp' ? 63 : _context5.t0 === 'finalquestion_mail' ? 66 : _context5.t0 === 'finalquestion_messenger' ? 69 : _context5.t0 === 'type_phone' ? 72 : _context5.t0 === 'retype_phone' ? 75 : _context5.t0 === 'contact_phone' ? 78 : _context5.t0 === 'contact_mail' ? 91 : _context5.t0 === 'returned_customer' ? 94 : 97;
            break;

          case 3:
            _context5.next = 5;
            return (0, _botMarkController.m_askHowGetHere)(data, pageID, userID);

          case 5:
            return _context5.abrupt("return", _context5.sent);

          case 6:
            _context5.next = 8;
            return (0, _botMarkController.m_askForRestaurant)(data, pageID, userID);

          case 8:
            return _context5.abrupt("return", _context5.sent);

          case 9:
            _context5.next = 11;
            return (0, _botMarkController.m_askForOwnership)(data, pageID, userID);

          case 11:
            return _context5.abrupt("return", _context5.sent);

          case 12:
            _context5.next = 14;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID);

          case 14:
            return _context5.abrupt("return", _context5.sent);

          case 15:
            _context5.next = 17;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID, 'owner');

          case 17:
            return _context5.abrupt("return", _context5.sent);

          case 18:
            _context5.next = 20;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID, 'employee');

          case 20:
            return _context5.abrupt("return", _context5.sent);

          case 21:
            _context5.next = 23;
            return (0, _botMarkController.m_howItWorks)(data, pageID, userID);

          case 23:
            return _context5.abrupt("return", _context5.sent);

          case 24:
            _context5.next = 26;
            return (0, _botMarkController.m_howItWorks2)(data, pageID, userID);

          case 26:
            return _context5.abrupt("return", _context5.sent);

          case 27:
            _context5.next = 29;
            return (0, _botMarkController.m_howItWorks3)(data, pageID, userID);

          case 29:
            return _context5.abrupt("return", _context5.sent);

          case 30:
            _context5.next = 32;
            return (0, _botMarkController.m_howItWorks4)(data, pageID, userID);

          case 32:
            return _context5.abrupt("return", _context5.sent);

          case 33:
            _context5.next = 35;
            return (0, _botMarkController.m_howItWorks5)(data, pageID, userID);

          case 35:
            return _context5.abrupt("return", _context5.sent);

          case 36:
            _context5.next = 38;
            return (0, _botMarkController.m_showPrices)(data, pageID, userID);

          case 38:
            return _context5.abrupt("return", _context5.sent);

          case 39:
            _context5.next = 41;
            return (0, _botMarkController.m_askForTestType)(data, pageID, userID);

          case 41:
            return _context5.abrupt("return", _context5.sent);

          case 42:
            _context5.next = 44;
            return (0, _botMarkController.m_askForBeginTest)(data, pageID, userID);

          case 44:
            return _context5.abrupt("return", _context5.sent);

          case 45:
            _context5.next = 47;
            return (0, _botMarkController.m_askTestTypePizzaria)(data, pageID, userID);

          case 47:
            return _context5.abrupt("return", _context5.sent);

          case 48:
            _context5.next = 50;
            return (0, _botMarkController.m_afterOrderConfirmation)(data, pageID, userID);

          case 50:
            return _context5.abrupt("return", _context5.sent);

          case 51:
            _context5.next = 53;
            return (0, _botMarkController.m_startTrial)(data, pageID, userID);

          case 53:
            return _context5.abrupt("return", _context5.sent);

          case 54:
            _context5.next = 56;
            return (0, _botMarkController.m_openQuestion)(data, pageID, userID);

          case 56:
            return _context5.abrupt("return", _context5.sent);

          case 57:
            _context5.next = 59;
            return (0, _botMarkController.m_confirmOpenQuestion)(data, pageID, userID, text);

          case 59:
            return _context5.abrupt("return", _context5.sent);

          case 60:
            _context5.next = 62;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'phone');

          case 62:
            return _context5.abrupt("return", _context5.sent);

          case 63:
            _context5.next = 65;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'whatsapp');

          case 65:
            return _context5.abrupt("return", _context5.sent);

          case 66:
            _context5.next = 68;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'email');

          case 68:
            return _context5.abrupt("return", _context5.sent);

          case 69:
            _context5.next = 71;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'messenger');

          case 71:
            return _context5.abrupt("return", _context5.sent);

          case 72:
            _context5.next = 74;
            return (0, _botMarkController.m_typePhone)(data, pageID, userID);

          case 74:
            return _context5.abrupt("return", _context5.sent);

          case 75:
            _context5.next = 77;
            return (0, _botMarkController.m_typePhone)(data, pageID, userID);

          case 77:
            return _context5.abrupt("return", _context5.sent);

          case 78:
            _context5.next = 80;
            return (0, _botMarkController.m_isValidPhone)(payload || text);

          case 80:
            validation = _context5.sent;
            console.info({
              validation: validation
            });

            if (!(validation === 'OK_PHONE')) {
              _context5.next = 88;
              break;
            }

            _context5.next = 85;
            return (0, _botMarkController.m_contactPhone)(data, pageID, userID, payload || text);

          case 85:
            return _context5.abrupt("return", _context5.sent);

          case 88:
            _context5.next = 90;
            return (0, _botMarkController.m_typePhone)('retype_phone', pageID, userID, validation);

          case 90:
            return _context5.abrupt("return", _context5.sent);

          case 91:
            _context5.next = 93;
            return (0, _botMarkController.m_contactMail)(data, pageID, userID, text);

          case 93:
            return _context5.abrupt("return", _context5.sent);

          case 94:
            _context5.next = 96;
            return (0, _botMarkController.m_returnedCustomer)(data, pageID, userID);

          case 96:
            return _context5.abrupt("return", _context5.sent);

          case 97:
            _context5.next = 99;
            return (0, _botController.basicReply)('Ops, não tenho uma resposta para isso.');

          case 99:
            return _context5.abrupt("return", _context5.sent);

          case 100:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function marketing_flow(_x6, _x7, _x8, _x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}(); // export const getOpenAndClose = async (pageID) => {
//     // TODO: timezone from the store
//     const weekDay = (new Date()).getDay();
//     const openingTimes = await getStoreData(pageID);
//     if (openingTimes) {
//         let openAndClose = { isOpen: false, openTime: null, closeTime: null };
//         if (weekDay === 1) {
//             openAndClose.isOpen = openingTimes.mon_is_open;
//             openAndClose.openTime = openingTimes.mon_open;
//             openAndClose.closeTime = openingTimes.mon_close;
//         } else if (weekDay === 2) {
//             openAndClose.isOpen = openingTimes.tue_is_open;
//             openAndClose.openTime = openingTimes.tue_open;
//             openAndClose.closeTime = openingTimes.tue_close;
//         } else if (weekDay === 3) {
//             openAndClose.isOpen = openingTimes.wed_is_open;
//             openAndClose.openTime = openingTimes.wed_open;
//             openAndClose.closeTime = openingTimes.wed_close;
//         } else if (weekDay === 4) {
//             openAndClose.isOpen = openingTimes.thu_is_open;
//             openAndClose.openTime = openingTimes.thu_open;
//             openAndClose.closeTime = openingTimes.thu_close;
//         } else if (weekDay === 5) {
//             openAndClose.isOpen = openingTimes.fri_is_open;
//             openAndClose.openTime = openingTimes.fri_open;
//             openAndClose.closeTime = openingTimes.fri_close;
//         } else if (weekDay === 6) {
//             openAndClose.isOpen = openingTimes.sat_is_open;
//             openAndClose.openTime = openingTimes.sat_open;
//             openAndClose.closeTime = openingTimes.sat_close;
//         }
//         else if (weekDay === 7) {
//             openAndClose.isOpen = openingTimes.sun_is_open;
//             openAndClose.openTime = openingTimes.sun_open;
//             openAndClose.closeTime = openingTimes.sun_close;
//         }
//         return openAndClose;
//     }
//     return null;
// }
// export const inputHorarioReplyMsg = (openAndClose) => {
//     let replyMsg = '';
//     if (openAndClose) {
//         if (openAndClose.isOpen === true) {
//             const strOpenTime = new Date(openAndClose.openTime).getHours() + ':' + new Date(openAndClose.openTime).getMinutes().toString().padStart(2, '0');
//             const strCloseTime = new Date(openAndClose.closeTime).getHours() + ':' + new Date(openAndClose.closeTime).getMinutes().toString().padStart(2, '0');
//             replyMsg = 'Olá, hoje nosso horário de funcionamento é a partir das ';
//             replyMsg = replyMsg + strOpenTime + ' horas, até às ';
//             replyMsg = replyMsg + strCloseTime + ' horas.';
//         } else {
//             replyMsg = 'Olá, infelizmente hoje estamos fechados, então, não estamos aceitando pedidos. ';
//         }
//     }
//     return replyMsg;
// }


exports.marketing_flow = marketing_flow;
//# sourceMappingURL=actionsController.js.map