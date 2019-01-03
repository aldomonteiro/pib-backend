"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputHorarioReplyMsg = exports.getOpenAndClose = exports.inputCardapioReplyMsg = exports.getFlavorsAndToppings = exports.marketing_flow = exports.sendActions = exports.mapEventsActions = void 0;

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _storesController = require("../controllers/storesController");

var _pricingsController = require("../controllers/pricingsController");

var _facebookMessengerBot = require("facebook-messenger-bot");

var _botController = require("./botController");

var _botMarkController = require("./botMarkController");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var QTY_1 = [1, "um", "uma"];
/**
 * Receive events, dispatch actions
 * @param {*} param0 
 */

var mapEventsActions =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var event, data, bot, sender, pageID;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event = _ref.event, data = _ref.data, bot = _ref.bot, sender = _ref.sender, pageID = _ref.pageID;
            _context.prev = 1;
            _context.t0 = event;
            _context.next = _context.t0 === 'MAIN-MENU' ? 5 : _context.t0 === 'ORDER_WANT_ORDER' ? 22 : _context.t0 === 'CORRECT_SAVED_ADDRESS' ? 34 : _context.t0 === 'WRONG-SAVED-ADDRESS' ? 39 : _context.t0 === 'LOCATION_ADDRESS' ? 42 : _context.t0 === 'PHONE_CONFIRMED' ? 54 : _context.t0 === 'ORDER_QTY' ? 66 : _context.t0 === 'ORDER_SIZE' ? 81 : _context.t0 === 'ORDER_SPLIT' ? 86 : _context.t0 === 'ORDER_FLAVOR' ? 91 : _context.t0 === 'ORDER_PIZZA_CONFIRMATION' ? 103 : _context.t0 === 'ORDER_WANT_CHANGE' ? 113 : _context.t0 === 'ORDER_CHANGE' ? 116 : _context.t0 === 'ORDER_CONFIRM_BEVERAGE' ? 133 : _context.t0 === 'ORDER_BEVERAGE' ? 145 : _context.t0 === 'ORDER_CONFIRMATION' ? 162 : _context.t0 === 'ORDER_CHANGE_SELECT_ITEM' ? 175 : 178;
            break;

          case 5:
            _context.t1 = data;
            _context.next = _context.t1 === 'CARDAPIO_PAYLOAD' ? 8 : _context.t1 === 'PEDIDO_PAYLOAD' ? 15 : _context.t1 === 'HORARIO_PAYLOAD' ? 18 : 21;
            break;

          case 8:
            _context.next = 10;
            return sendActions({
              action: 'SEND_CARDAPIO',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 10:
            _context.next = 12;
            return _facebookMessengerBot.Bot.wait(3000);

          case 12:
            _context.next = 14;
            return sendActions({
              action: 'ASK_FOR_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 14:
            return _context.abrupt("break", 21);

          case 15:
            _context.next = 17;
            return sendActions({
              action: 'CHECK_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 17:
            return _context.abrupt("break", 21);

          case 18:
            _context.next = 20;
            return sendActions({
              action: 'SEND_HORARIO',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 20:
            return _context.abrupt("break", 21);

          case 21:
            return _context.abrupt("break", 178);

          case 22:
            _context.t2 = data;
            _context.next = _context.t2 === 'wantorder_yes' ? 25 : _context.t2 === 'wantorder_no' ? 28 : 33;
            break;

          case 25:
            _context.next = 27;
            return sendActions({
              action: 'CHECK_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 27:
            return _context.abrupt("break", 33);

          case 28:
            _context.next = 30;
            return sendActions({
              action: 'BASIC_REPLY',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: 'Ok, vou enviar as opções então. Para continuar é só clicar em uma delas'
            });

          case 30:
            _context.next = 32;
            return sendActions({
              action: 'SEND_MAIN_MENU',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 32:
            return _context.abrupt("break", 33);

          case 33:
            return _context.abrupt("break", 178);

          case 34:
            _context.next = 36;
            return sendActions({
              action: 'SHOW_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 36:
            _context.next = 38;
            return sendActions({
              action: 'ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 38:
            return _context.abrupt("break", 178);

          case 39:
            _context.next = 41;
            return sendActions({
              action: 'ASK_FOR_LOCATION',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 41:
            return _context.abrupt("break", 178);

          case 42:
            _context.t3 = data;
            _context.next = _context.t3 === 'incorrect_address' ? 45 : 48;
            break;

          case 45:
            _context.next = 47;
            return sendActions({
              action: 'ASK_TO_TYPE_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 47:
            return _context.abrupt("break", 53);

          case 48:
            _context.next = 50;
            return sendActions({
              action: 'SHOW_ADDRESS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 50:
            _context.next = 52;
            return sendActions({
              action: 'SHOW_ORDER_OR_ASK_FOR_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 52:
            return _context.abrupt("break", 53);

          case 53:
            return _context.abrupt("break", 178);

          case 54:
            _context.t4 = data;
            _context.next = _context.t4 === 'change_phone' ? 57 : 60;
            break;

          case 57:
            _context.next = 59;
            return sendActions({
              action: 'ASK_TO_TYPE_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 59:
            return _context.abrupt("break", 65);

          case 60:
            _context.next = 62;
            return sendActions({
              action: 'SHOW_PHONE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 62:
            _context.next = 64;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 64:
            return _context.abrupt("break", 65);

          case 65:
            return _context.abrupt("break", 178);

          case 66:
            _context.t5 = data;
            _context.next = _context.t5 === 'qty_more' ? 69 : _context.t5 === 'qty_less' ? 72 : 75;
            break;

          case 69:
            _context.next = 71;
            return sendActions({
              action: 'ASK_FOR_QUANTITY_MORE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 71:
            return _context.abrupt("break", 80);

          case 72:
            _context.next = 74;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 74:
            return _context.abrupt("break", 80);

          case 75:
            _context.next = 77;
            return sendActions({
              action: 'SHOW_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 77:
            _context.next = 79;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 79:
            return _context.abrupt("break", 80);

          case 80:
            return _context.abrupt("break", 178);

          case 81:
            _context.next = 83;
            return sendActions({
              action: 'SHOW_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 83:
            _context.next = 85;
            return sendActions({
              action: 'CHECK_SPLIT',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 85:
            return _context.abrupt("break", 178);

          case 86:
            _context.next = 88;
            return sendActions({
              action: 'SHOW_SPLIT',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 88:
            _context.next = 90;
            return sendActions({
              action: 'CHECK_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 90:
            return _context.abrupt("break", 178);

          case 91:
            _context.t6 = data.option;
            _context.next = _context.t6 === 'flavors_more' ? 94 : 97;
            break;

          case 94:
            _context.next = 96;
            return sendActions({
              action: 'ASK_FOR_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: data.multiple
            });

          case 96:
            return _context.abrupt("break", 102);

          case 97:
            _context.next = 99;
            return sendActions({
              action: 'SHOW_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 99:
            _context.next = 101;
            return sendActions({
              action: 'CHECK_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 101:
            return _context.abrupt("break", 102);

          case 102:
            return _context.abrupt("break", 178);

          case 103:
            _context.t7 = data;
            _context.next = _context.t7 === 'confirmation_yes' ? 106 : 109;
            break;

          case 106:
            _context.next = 108;
            return sendActions({
              action: 'ASK_FOR_WANT_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 108:
            return _context.abrupt("break", 112);

          case 109:
            _context.next = 111;
            return sendActions({
              action: 'ASK_FOR_CHANGE_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 111:
            return _context.abrupt("break", 112);

          case 112:
            return _context.abrupt("break", 178);

          case 113:
            _context.next = 115;
            return sendActions({
              action: 'ASK_FOR_SPECIFIC_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 115:
            return _context.abrupt("break", 178);

          case 116:
            _context.t8 = data;
            _context.next = _context.t8 === 'change_quantity' ? 119 : _context.t8 === 'change_size' ? 122 : _context.t8 === 'change_flavor' ? 125 : _context.t8 === 'change_address' ? 128 : 131;
            break;

          case 119:
            _context.next = 121;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 121:
            return _context.abrupt("break", 132);

          case 122:
            _context.next = 124;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 124:
            return _context.abrupt("break", 132);

          case 125:
            _context.next = 127;
            return sendActions({
              action: 'ASK_FOR_FLAVOR',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: 1
            });

          case 127:
            return _context.abrupt("break", 132);

          case 128:
            _context.next = 130;
            return sendActions({
              action: 'ASK_FOR_LOCATION',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 130:
            return _context.abrupt("break", 132);

          case 131:
            return _context.abrupt("break", 132);

          case 132:
            return _context.abrupt("break", 178);

          case 133:
            _context.t9 = data;
            _context.next = _context.t9 === 'beverage_yes' ? 136 : 139;
            break;

          case 136:
            _context.next = 138;
            return sendActions({
              action: 'ASK_FOR_BEVERAGE_OPTIONS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: 1
            });

          case 138:
            return _context.abrupt("break", 144);

          case 139:
            _context.next = 141;
            return sendActions({
              action: 'SHOW_NO_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 141:
            _context.next = 143;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 143:
            return _context.abrupt("break", 144);

          case 144:
            return _context.abrupt("break", 178);

          case 145:
            _context.t10 = data.option;
            _context.next = _context.t10 === 'beverages_more' ? 148 : _context.t10 === 'beverages_cancel' ? 151 : 156;
            break;

          case 148:
            _context.next = 150;
            return sendActions({
              action: 'ASK_FOR_BEVERAGE_OPTIONS',
              bot: bot,
              sender: sender,
              pageID: pageID,
              multiple: data.multiple
            });

          case 150:
            return _context.abrupt("break", 161);

          case 151:
            _context.next = 153;
            return sendActions({
              action: 'SHOW_NO_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 153:
            _context.next = 155;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 155:
            return _context.abrupt("break", 161);

          case 156:
            _context.next = 158;
            return sendActions({
              action: 'SHOW_BEVERAGE',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 158:
            _context.next = 160;
            return sendActions({
              action: 'SHOW_FULL_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 160:
            return _context.abrupt("break", 161);

          case 161:
            return _context.abrupt("break", 178);

          case 162:
            _context.t11 = data;
            _context.next = _context.t11 === 'confirmation_yes' ? 165 : 171;
            break;

          case 165:
            _context.next = 167;
            return sendActions({
              action: 'CONFIRM_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 167:
            if (!bot.marketing) {
              _context.next = 170;
              break;
            }

            _context.next = 170;
            return sendActions({
              action: 'PIZZAIBOT_MARKETING',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: 'confirmation_yes'
            });

          case 170:
            return _context.abrupt("break", 174);

          case 171:
            _context.next = 173;
            return sendActions({
              action: 'ASK_FOR_CHANGE_ORDER',
              bot: bot,
              sender: sender,
              pageID: pageID
            });

          case 173:
            return _context.abrupt("break", 174);

          case 174:
            return _context.abrupt("break", 178);

          case 175:
            _context.next = 177;
            return sendActions({
              action: 'UPDATE_ITEM',
              bot: bot,
              sender: sender,
              pageID: pageID,
              data: data
            });

          case 177:
            return _context.abrupt("break", 178);

          case 178:
            _context.next = 183;
            break;

          case 180:
            _context.prev = 180;
            _context.t12 = _context["catch"](1);
            console.error({
              event: event
            }, {
              mapEventsActionsErr: _context.t12
            }, {
              data: data
            });

          case 183:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 180]]);
  }));

  return function mapEventsActions(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.mapEventsActions = mapEventsActions;

var sendActions =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref3) {
    var action, bot, sender, pageID, multiple, split, data, payload, location, text, last_answer, out, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            action = _ref3.action, bot = _ref3.bot, sender = _ref3.sender, pageID = _ref3.pageID, multiple = _ref3.multiple, split = _ref3.split, data = _ref3.data, payload = _ref3.payload, location = _ref3.location, text = _ref3.text, last_answer = _ref3.last_answer;
            _context2.prev = 1;
            out = new _facebookMessengerBot.Elements();
            _context2.next = 5;
            return bot.startTyping(sender.id);

          case 5:
            _context2.next = 7;
            return _facebookMessengerBot.Bot.wait(500);

          case 7:
            _context2.t0 = action;
            _context2.next = _context2.t0 === 'BASIC_REPLY' ? 10 : _context2.t0 === 'SEND_WELCOME' ? 14 : _context2.t0 === 'SEND_MAIN_MENU' ? 18 : _context2.t0 === 'SEND_CARDAPIO' ? 22 : _context2.t0 === 'SEND_HORARIO' ? 26 : _context2.t0 === 'CHECK_ADDRESS' ? 30 : _context2.t0 === 'ASK_FOR_ORDER' ? 34 : _context2.t0 === 'LOCATION_CONFIRM_ADDRESS' ? 38 : _context2.t0 === 'ASK_FOR_PHONE' ? 45 : _context2.t0 === 'SHOW_PHONE' ? 49 : _context2.t0 === 'SHOW_ADDRESS' ? 53 : _context2.t0 === 'SHOW_ORDER_OR_ASK_FOR_PHONE' ? 57 : _context2.t0 === 'ASK_TO_TYPE_PHONE' ? 61 : _context2.t0 === 'ASK_FOR_LOCATION' ? 65 : _context2.t0 === 'ASK_TO_TYPE_ADDRESS' ? 69 : _context2.t0 === 'ASK_FOR_QUANTITY' ? 73 : _context2.t0 === 'ASK_FOR_QUANTITY_MORE' ? 77 : _context2.t0 === 'SHOW_QUANTITY' ? 81 : _context2.t0 === 'ASK_FOR_SIZE' ? 85 : _context2.t0 === 'SHOW_SIZE' ? 89 : _context2.t0 === 'SHOW_SPLIT' ? 93 : _context2.t0 === 'CHECK_SPLIT' ? 97 : _context2.t0 === 'CHECK_FLAVOR' ? 101 : _context2.t0 === 'ASK_FOR_FLAVOR' ? 105 : _context2.t0 === 'SHOW_FLAVOR' ? 109 : _context2.t0 === 'CHECK_ITEM' ? 113 : _context2.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 117 : _context2.t0 === 'SHOW_NO_BEVERAGE' ? 121 : _context2.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 125 : _context2.t0 === 'SHOW_BEVERAGE' ? 129 : _context2.t0 === 'SHOW_FULL_ORDER' ? 133 : _context2.t0 === 'ASK_FOR_CHANGE_ORDER' ? 137 : _context2.t0 === 'ASK_FOR_SPECIFIC_ITEM' ? 141 : _context2.t0 === 'UPDATE_ITEM' ? 145 : _context2.t0 === 'CONFIRM_ORDER' ? 149 : _context2.t0 === 'PIZZAIBOT_MARKETING' ? 153 : 157;
            break;

          case 10:
            _context2.next = 12;
            return (0, _botController.basicReply)(data);

          case 12:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 14:
            _context2.next = 16;
            return (0, _botController.sendWelcomeMessage)(pageID, sender);

          case 16:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 18:
            _context2.next = 20;
            return (0, _botController.sendMainMenu)();

          case 20:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 22:
            _context2.next = 24;
            return (0, _botController.sendCardapio)(pageID);

          case 24:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 26:
            _context2.next = 28;
            return (0, _botController.sendHorario)(pageID);

          case 28:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 30:
            _context2.next = 32;
            return (0, _botController.confirmAddressOrAskLocation)(pageID, sender.id, user);

          case 32:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 34:
            _context2.next = 36;
            return (0, _botController.askForWantOrder)(pageID, sender.id);

          case 36:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 38:
            _context2.next = 40;
            return bot.fetchUser(sender.id);

          case 40:
            user = _context2.sent;
            _context2.next = 43;
            return (0, _botController.confirmLocationAddress)(pageID, sender.id, location, user);

          case 43:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 45:
            _context2.next = 47;
            return (0, _botController.askForPhone)(pageID, sender.id);

          case 47:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 49:
            _context2.next = 51;
            return (0, _botController.showPhone)(pageID, sender.id, payload || data);

          case 51:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 53:
            _context2.next = 55;
            return (0, _botController.showAddress)(pageID, sender.id, data);

          case 55:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 57:
            _context2.next = 59;
            return (0, _botController.showOrderOrAskForPhone)(pageID, sender.id);

          case 59:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 61:
            _context2.next = 63;
            return (0, _botController.askToTypePhone)(pageID, sender.id);

          case 63:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 65:
            _context2.next = 67;
            return (0, _botController.askForLocation)();

          case 67:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 69:
            _context2.next = 71;
            return (0, _botController.askToTypeAddress)(pageID, sender.id);

          case 71:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 73:
            _context2.next = 75;
            return (0, _botController.askForQuantity)(pageID, sender.id);

          case 75:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 77:
            _context2.next = 79;
            return (0, _botController.askForQuantityMore)(pageID, sender.id);

          case 79:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 81:
            _context2.next = 83;
            return (0, _botController.showQuantity)(pageID, sender.id, data);

          case 83:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 85:
            _context2.next = 87;
            return (0, _botController.askForSize)(pageID, sender.id);

          case 87:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 89:
            _context2.next = 91;
            return (0, _botController.showSize)(pageID, sender.id, data);

          case 91:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 93:
            _context2.next = 95;
            return (0, _botController.showSplit)(pageID, sender.id, data);

          case 95:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 97:
            _context2.next = 99;
            return (0, _botController.askForSplitFlavorOrConfirm)(pageID, sender.id, 1);

          case 99:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 101:
            _context2.next = 103;
            return (0, _botController.askForFlavorOrConfirm)(pageID, sender.id, 1, data);

          case 103:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 105:
            _context2.next = 107;
            return (0, _botController.askForFlavor)(pageID, sender.id, multiple, split);

          case 107:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 109:
            _context2.next = 111;
            return (0, _botController.showFlavor)(pageID, sender.id, data);

          case 111:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 113:
            _context2.next = 115;
            return (0, _botController.showOrderOrNextItem)(pageID, sender.id);

          case 115:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 117:
            _context2.next = 119;
            return (0, _botController.askForWantBeverage)(pageID, sender.id);

          case 119:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 121:
            _context2.next = 123;
            return (0, _botController.showNoBeverage)(pageID, sender.id, data);

          case 123:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 125:
            _context2.next = 127;
            return (0, _botController.askForBeverages)(pageID, sender.id, multiple);

          case 127:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 129:
            _context2.next = 131;
            return (0, _botController.showBeverage)(pageID, sender.id, data);

          case 131:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 133:
            _context2.next = 135;
            return (0, _botController.showFullOrder)(pageID, sender.id);

          case 135:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 137:
            _context2.next = 139;
            return (0, _botController.askForChangeOrder)(pageID, sender.id);

          case 139:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 141:
            _context2.next = 143;
            return (0, _botController.askForSpecificItem)(pageID, sender.id);

          case 143:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 145:
            _context2.next = 147;
            return (0, _botController.updateItemAskOptions)(pageID, sender.id, data);

          case 147:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 149:
            _context2.next = 151;
            return (0, _botController.confirmOrder)(pageID, sender.id);

          case 151:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 153:
            _context2.next = 155;
            return marketing_flow(pageID, sender.id, data, text, payload);

          case 155:
            out = _context2.sent;
            return _context2.abrupt("break", 158);

          case 157:
            return _context2.abrupt("break", 158);

          case 158:
            _context2.next = 160;
            return bot.stopTyping(sender.id);

          case 160:
            _context2.next = 162;
            return bot.send(sender.id, out);

          case 162:
            _context2.next = 168;
            break;

          case 164:
            _context2.prev = 164;
            _context2.t1 = _context2["catch"](1);
            console.error('action:', action, 'data:', data, 'err:', _context2.t1);
            throw _context2.t1;

          case 168:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 164]]);
  }));

  return function sendActions(_x2) {
    return _ref4.apply(this, arguments);
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
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, userID, data, text, payload) {
    var validation;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = data;
            _context3.next = _context3.t0 === 'GET_STARTED' ? 3 : _context3.t0 === 'howget_pizzaria' ? 6 : _context3.t0 === 'howget_facebookad' ? 6 : _context3.t0 === 'howget_activemarketing' ? 6 : _context3.t0 === 'howget_dontremember' ? 6 : _context3.t0 === 'restaurant_yes' ? 9 : _context3.t0 === 'restaurant_no' ? 12 : _context3.t0 === 'owner_yes' ? 15 : _context3.t0 === 'employee_yes' ? 18 : _context3.t0 === 'options_howitworks' ? 21 : _context3.t0 === 'howitworks_2' ? 24 : _context3.t0 === 'howitworks_3' ? 27 : _context3.t0 === 'howitworks_4' ? 30 : _context3.t0 === 'howitworks_5' ? 33 : _context3.t0 === 'options_howmuch' ? 36 : _context3.t0 === 'options_wanttest' ? 39 : _context3.t0 === 'testtype_customer' ? 42 : _context3.t0 === 'testtype_pizzaria' ? 45 : _context3.t0 === 'confirmation_yes' ? 48 : _context3.t0 === 'orderConfirmation_start' ? 51 : _context3.t0 === 'orderConfirmation_question' ? 54 : _context3.t0 === 'open_question' ? 57 : _context3.t0 === 'finalquestion_phone' ? 60 : _context3.t0 === 'finalquestion_whatsapp' ? 63 : _context3.t0 === 'finalquestion_mail' ? 66 : _context3.t0 === 'finalquestion_messenger' ? 69 : _context3.t0 === 'type_phone' ? 72 : _context3.t0 === 'retype_phone' ? 75 : _context3.t0 === 'contact_phone' ? 78 : _context3.t0 === 'contact_mail' ? 91 : _context3.t0 === 'returned_customer' ? 94 : 97;
            break;

          case 3:
            _context3.next = 5;
            return (0, _botMarkController.m_askHowGetHere)(data, pageID, userID);

          case 5:
            return _context3.abrupt("return", _context3.sent);

          case 6:
            _context3.next = 8;
            return (0, _botMarkController.m_askForRestaurant)(data, pageID, userID);

          case 8:
            return _context3.abrupt("return", _context3.sent);

          case 9:
            _context3.next = 11;
            return (0, _botMarkController.m_askForOwnership)(data, pageID, userID);

          case 11:
            return _context3.abrupt("return", _context3.sent);

          case 12:
            _context3.next = 14;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID);

          case 14:
            return _context3.abrupt("return", _context3.sent);

          case 15:
            _context3.next = 17;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID, 'owner');

          case 17:
            return _context3.abrupt("return", _context3.sent);

          case 18:
            _context3.next = 20;
            return (0, _botMarkController.m_askForOptions)(data, pageID, userID, 'employee');

          case 20:
            return _context3.abrupt("return", _context3.sent);

          case 21:
            _context3.next = 23;
            return (0, _botMarkController.m_howItWorks)(data, pageID, userID);

          case 23:
            return _context3.abrupt("return", _context3.sent);

          case 24:
            _context3.next = 26;
            return (0, _botMarkController.m_howItWorks2)(data, pageID, userID);

          case 26:
            return _context3.abrupt("return", _context3.sent);

          case 27:
            _context3.next = 29;
            return (0, _botMarkController.m_howItWorks3)(data, pageID, userID);

          case 29:
            return _context3.abrupt("return", _context3.sent);

          case 30:
            _context3.next = 32;
            return (0, _botMarkController.m_howItWorks4)(data, pageID, userID);

          case 32:
            return _context3.abrupt("return", _context3.sent);

          case 33:
            _context3.next = 35;
            return (0, _botMarkController.m_howItWorks5)(data, pageID, userID);

          case 35:
            return _context3.abrupt("return", _context3.sent);

          case 36:
            _context3.next = 38;
            return (0, _botMarkController.m_showPrices)(data, pageID, userID);

          case 38:
            return _context3.abrupt("return", _context3.sent);

          case 39:
            _context3.next = 41;
            return (0, _botMarkController.m_askForTestType)(data, pageID, userID);

          case 41:
            return _context3.abrupt("return", _context3.sent);

          case 42:
            _context3.next = 44;
            return (0, _botMarkController.m_askForBeginTest)(data, pageID, userID);

          case 44:
            return _context3.abrupt("return", _context3.sent);

          case 45:
            _context3.next = 47;
            return (0, _botMarkController.m_askTestTypePizzaria)(data, pageID, userID);

          case 47:
            return _context3.abrupt("return", _context3.sent);

          case 48:
            _context3.next = 50;
            return (0, _botMarkController.m_afterOrderConfirmation)(data, pageID, userID);

          case 50:
            return _context3.abrupt("return", _context3.sent);

          case 51:
            _context3.next = 53;
            return (0, _botMarkController.m_startTrial)(data, pageID, userID);

          case 53:
            return _context3.abrupt("return", _context3.sent);

          case 54:
            _context3.next = 56;
            return (0, _botMarkController.m_openQuestion)(data, pageID, userID);

          case 56:
            return _context3.abrupt("return", _context3.sent);

          case 57:
            _context3.next = 59;
            return (0, _botMarkController.m_confirmOpenQuestion)(data, pageID, userID, text);

          case 59:
            return _context3.abrupt("return", _context3.sent);

          case 60:
            _context3.next = 62;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'phone');

          case 62:
            return _context3.abrupt("return", _context3.sent);

          case 63:
            _context3.next = 65;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'whatsapp');

          case 65:
            return _context3.abrupt("return", _context3.sent);

          case 66:
            _context3.next = 68;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'email');

          case 68:
            return _context3.abrupt("return", _context3.sent);

          case 69:
            _context3.next = 71;
            return (0, _botMarkController.m_returnContact)(data, pageID, userID, 'messenger');

          case 71:
            return _context3.abrupt("return", _context3.sent);

          case 72:
            _context3.next = 74;
            return (0, _botMarkController.m_typePhone)(data, pageID, userID);

          case 74:
            return _context3.abrupt("return", _context3.sent);

          case 75:
            _context3.next = 77;
            return (0, _botMarkController.m_typePhone)(data, pageID, userID);

          case 77:
            return _context3.abrupt("return", _context3.sent);

          case 78:
            _context3.next = 80;
            return (0, _botMarkController.m_isValidPhone)(payload || text);

          case 80:
            validation = _context3.sent;
            console.info({
              validation: validation
            });

            if (!(validation === 'OK_PHONE')) {
              _context3.next = 88;
              break;
            }

            _context3.next = 85;
            return (0, _botMarkController.m_contactPhone)(data, pageID, userID, payload || text);

          case 85:
            return _context3.abrupt("return", _context3.sent);

          case 88:
            _context3.next = 90;
            return (0, _botMarkController.m_typePhone)('retype_phone', pageID, userID, validation);

          case 90:
            return _context3.abrupt("return", _context3.sent);

          case 91:
            _context3.next = 93;
            return (0, _botMarkController.m_contactMail)(data, pageID, userID, text);

          case 93:
            return _context3.abrupt("return", _context3.sent);

          case 94:
            _context3.next = 96;
            return (0, _botMarkController.m_returnedCustomer)(data, pageID, userID);

          case 96:
            return _context3.abrupt("return", _context3.sent);

          case 97:
            _context3.next = 99;
            return (0, _botController.basicReply)('Ops, não tenho uma resposta para isso.');

          case 99:
            return _context3.abrupt("return", _context3.sent);

          case 100:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function marketing_flow(_x3, _x4, _x5, _x6, _x7) {
    return _ref5.apply(this, arguments);
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
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID, sizeID) {
    var flavorArray, flavorsWithPrice, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, pricing;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context4.sent;
            flavorsWithPrice = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 8;
            _iterator = flavorArray[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context4.next = 32;
              break;
            }

            flavor = _step.value;

            if (!sizeID) {
              _context4.next = 17;
              break;
            }

            _context4.next = 15;
            return (0, _pricingsController.getOnePricing)(pageID, flavor.kind, sizeID);

          case 15:
            pricing = _context4.sent;

            if (pricing) {
              flavor.price = pricing.price;
            }

          case 17:
            if (!sizeID) {
              _context4.next = 25;
              break;
            }

            if (!flavor.price) {
              _context4.next = 23;
              break;
            }

            _context4.next = 21;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 21:
            flavor.toppingsNames = _context4.sent;
            flavorsWithPrice.push(flavor);

          case 23:
            _context4.next = 29;
            break;

          case 25:
            _context4.next = 27;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 27:
            flavor.toppingsNames = _context4.sent;
            flavorsWithPrice.push(flavor);

          case 29:
            _iteratorNormalCompletion = true;
            _context4.next = 10;
            break;

          case 32:
            _context4.next = 38;
            break;

          case 34:
            _context4.prev = 34;
            _context4.t0 = _context4["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 38:
            _context4.prev = 38;
            _context4.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 41:
            _context4.prev = 41;

            if (!_didIteratorError) {
              _context4.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context4.finish(41);

          case 45:
            return _context4.finish(38);

          case 46:
            return _context4.abrupt("return", flavorsWithPrice);

          case 49:
            _context4.prev = 49;
            _context4.t1 = _context4["catch"](0);
            console.error({
              flavorsAndToppingsErr: _context4.t1
            });

          case 52:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 49], [8, 34, 38, 46], [39,, 41, 45]]);
  }));

  return function getFlavorsAndToppings(_x8, _x9) {
    return _ref6.apply(this, arguments);
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
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID) {
    var weekDay, openingTimes, openAndClose;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // TODO: timezone from the store
            weekDay = new Date().getDay();
            _context5.next = 3;
            return (0, _storesController.getStoreData)(pageID);

          case 3:
            openingTimes = _context5.sent;

            if (!openingTimes) {
              _context5.next = 8;
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

            return _context5.abrupt("return", openAndClose);

          case 8:
            return _context5.abrupt("return", null);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getOpenAndClose(_x10) {
    return _ref7.apply(this, arguments);
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