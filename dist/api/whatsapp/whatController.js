"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waboxapp_sendMessage = exports.sendActions = exports.w_controller = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _botController = require("../bot/botController");

var _storesController = require("../controllers/storesController");

var _ordersController = require("../controllers/ordersController");

var _show_cardapio = require("../bot/show_cardapio");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Receives the user and message from whatsapp and
 * returns a message from the system.
 * @param {*} args
 */
var w_controller =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(args) {
    var myId, message, userId, match, location, contactName, profileImg, names, first_name, last_name, _profile_pic, user, store, pageId, pendingOrder, result, addrData, replyText, dataMenu, objectWithEvent, _objectWithEvent, event, data, multiple, action, _result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.info('###### w_controller ######');
            console.info(args);
            myId = args.myId, message = args.message, userId = args.userId, match = args.match, location = args.location, contactName = args.contactName, profileImg = args.profileImg;
            names = contactName.split(' ');
            first_name = names.shift();
            last_name = names.length >= 1 ? names.join(' ') : null;
            _profile_pic = profileImg && decodeURIComponent(profileImg.replace('https://web.whatsapp.com/pp?e=', ''));
            user = {
              first_name: first_name,
              last_name: last_name,
              profile_pic: _profile_pic
            };
            _context.next = 10;
            return (0, _storesController.getStoreByPhone)(myId);

          case 10:
            store = _context.sent;

            if (!store) {
              _context.next = 83;
              break;
            }

            console.info("store name: ".concat(store.name, ", match:").concat(match));
            pageId = store.pageId; // Welcome Message

            if (match) {
              _context.next = 73;
              break;
            }

            _context.next = 17;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId
            });

          case 17:
            pendingOrder = _context.sent;

            if (!(pendingOrder && pendingOrder.order)) {
              _context.next = 62;
              break;
            }

            console.info("pendingorder id:".concat(pendingOrder.order.id, " \n                waitingFor:").concat(pendingOrder.order.waitingFor, "\n                undo:").concat(pendingOrder.order.undo, " "));

            if (!(message === '0')) {
              _context.next = 31;
              break;
            }

            if (!(pendingOrder.order.undo === 'quantity')) {
              _context.next = 27;
              break;
            }

            _context.next = 24;
            return sendActions({
              action: 'ASK_FOR_QUANTITY',
              pageID: pageId,
              userID: userId
            });

          case 24:
            return _context.abrupt("return", _context.sent);

          case 27:
            if (!(pendingOrder.order.undo === 'size')) {
              _context.next = 31;
              break;
            }

            _context.next = 30;
            return sendActions({
              action: 'ASK_FOR_SIZE',
              pageID: pageId,
              userID: userId,
              data: pendingOrder.order.currentItemCategory
            });

          case 30:
            return _context.abrupt("return", _context.sent);

          case 31:
            if (!(pendingOrder.order.waitingFor === 'typed_address')) {
              _context.next = 38;
              break;
            }

            addrData = {
              manual_addres: true,
              formattedAddress: message
            };
            _context.next = 35;
            return sendActions({
              action: 'CONFIRM_ADDRESS',
              pageID: pageId,
              userID: userId,
              addrData: addrData,
              user: user
            });

          case 35:
            result = _context.sent;
            _context.next = 59;
            break;

          case 38:
            if (!(pendingOrder.order.waitingFor === 'typed_comments')) {
              _context.next = 44;
              break;
            }

            _context.next = 41;
            return sendActions({
              action: 'SHOW_FULL_ORDER_CONFIRM_ORDER',
              pageID: pageId,
              userID: userId,
              data: message
            });

          case 41:
            result = _context.sent;
            _context.next = 59;
            break;

          case 44:
            if (!(pendingOrder.order.waitingFor === 'location')) {
              _context.next = 56;
              break;
            }

            if (!location) {
              _context.next = 51;
              break;
            }

            _context.next = 48;
            return sendActions({
              action: 'LOCATION_CONFIRM_ADDRESS',
              pageID: pageId,
              userID: userId,
              location: location
            });

          case 48:
            result = _context.sent;
            _context.next = 54;
            break;

          case 51:
            _context.next = 53;
            return sendActions({
              action: 'ASK_TO_TYPE_ADDRESS',
              pageID: pageId,
              userID: userId
            });

          case 53:
            result = _context.sent;

          case 54:
            _context.next = 59;
            break;

          case 56:
            _context.next = 58;
            return sendActions({
              action: 'ASK_FOR_CONTINUE',
              pageID: pageId,
              userID: userId,
              user: user
            });

          case 58:
            result = _context.sent;

          case 59:
            return _context.abrupt("return", result);

          case 62:
            _context.next = 64;
            return getText(_botController.sendWelcomeMessage, [pageId, contactName]);

          case 64:
            replyText = _context.sent;
            replyText = replyText + '\n';
            _context.next = 68;
            return (0, _botController.sendMainMenu)();

          case 68:
            dataMenu = _context.sent;
            dataMenu.text = replyText + dataMenu.text;
            return _context.abrupt("return", dataMenu);

          case 71:
            _context.next = 81;
            break;

          case 73:
            if (match.hasOwnProperty('event')) objectWithEvent = match;else if (match.hasOwnProperty('buttons')) {
              if (match.buttons.hasOwnProperty('event')) objectWithEvent = match.buttons;
            }
            _objectWithEvent = objectWithEvent, event = _objectWithEvent.event, data = _objectWithEvent.data;
            multiple = data ? data.multiple ? data.multiple : 1 : 1;
            action = mapEventsActions(event, data);
            _context.next = 79;
            return sendActions({
              action: action,
              pageID: pageId,
              userID: userId,
              data: data,
              location: location,
              multiple: multiple,
              user: user
            });

          case 79:
            _result = _context.sent;
            return _context.abrupt("return", _result);

          case 81:
            _context.next = 84;
            break;

          case 83:
            console.info("### w_controller ### did not find store for myId: ".concat(myId));

          case 84:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function w_controller(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.w_controller = w_controller;

var getText =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(fn, params) {
    var data, replyText, index;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!params) {
              _context2.next = 6;
              break;
            }

            _context2.next = 3;
            return fn.apply(void 0, _toConsumableArray(params));

          case 3:
            _context2.t0 = _context2.sent;
            _context2.next = 9;
            break;

          case 6:
            _context2.next = 8;
            return fn();

          case 8:
            _context2.t0 = _context2.sent;

          case 9:
            data = _context2.t0;
            replyText = '';

            if (data.type === 'buttons') {
              replyText = data.text + '\n';
              index = 1;
              data.options.map(function (option) {
                replyText = replyText + index + '. ' + option.text + '\n';
                index++;
              });
            } else if (data.type === 'text') {
              replyText = data.text + '\n';
            }

            return _context2.abrupt("return", replyText);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getText(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var mapEventsActions = function mapEventsActions(event, data) {
  switch (event) {
    case 'MAIN_MENU':
      return 'SEND_MAIN_MENU';

    case 'ORDER_CONTINUE_ORDER':
      switch (data) {
        case 'continueorder_yes':
          return 'CHECK_LAST_ACTION';

        case 'continueorder_no':
          return 'CONTINUE_ORDER_NO';
      }

      break;

    case 'STOP_ORDER_OPTIONS':
      switch (data) {
        case 'stoporder_init':
          return 'CANCEL_PENDING_ORDER';

        case 'stoporder_human':
          return 'PASS_THREAD_CONTROL';
      }

      break;

    case 'MAIN-MENU':
      switch (data) {
        case 'CARDAPIO_PAYLOAD':
          return 'SEND_CARDAPIO';

        case 'PEDIDO_PAYLOAD':
          return 'ASK_FOR_DELIVER';

        case 'HORARIO_PAYLOAD':
          return 'SEND_HORARIO';

        case 'stoporder_human':
          return 'PASS_THREAD_CONTROL';
      }

      break;

    case 'ORDER_WANT_ORDER':
      switch (data) {
        case 'wantorder_yes':
          return 'ASK_FOR_DELIVER';

        case 'wantorder_no':
          return 'SEND_MAIN_MENU';
      }

      break;

    case 'ORDER_DELIVER':
      switch (data.type) {
        case 'delivery':
          return 'SHOW_DELIVER_CHECK_ADDRESS';

        case 'pickup':
          return 'SHOW_DELIVER_ASK_FOR_CATEGORY';
      }

      break;

    case 'CORRECT_SAVED_ADDRESS':
      return 'SHOW_ADDRESS_ASK_FOR_CATEGORY';

    case 'WRONG_SAVED_ADDRESS':
      return 'ASK_FOR_LOCATION';

    case 'LOCATION':
      switch (data) {
        case 'location_location':
          return 'LOCATION_CONFIRM_ADDRESS';
      }

      break;

    case 'LOCATION_ADDRESS':
      switch (data) {
        case 'incorrect_address':
          return 'ASK_TO_TYPE_ADDRESS';

        default:
          return 'SHOW_ADDRESS_ASK_FOR_CATEGORY';
      }

    case 'ORDER_QTY':
      switch (data) {
        case 'qty_more':
          return 'ASK_FOR_QUANTITY_MORE';

        case 'qty_less':
          return 'ASK_FOR_QUANTITY';

        default:
          return 'SHOW_QUANTITY_ASK_FOR_SIZE';
      }

    case 'ORDER_SIZE':
      return 'SHOW_SIZE_CHECK_SPLIT';

    case 'ORDER_SPLIT':
      return 'SHOW_SPLIT_CHECK_FLAVOR';

    case 'ORDER_FLAVOR':
      switch (data.option) {
        case 'flavors_more':
          return 'ASK_FOR_FLAVOR';

        default:
          return 'SHOW_FLAVOR_CHECK_ITEM';
      }

    case 'ORDER_PIZZA_CONFIRMATION':
      switch (data.type) {
        case 'confirmation_yes':
          return 'ASK_FOR_PAYMENT_TYPE';

        default:
          return 'ASK_FOR_CHANGE_ORDER';
      }

    case 'ORDER_WANT_CHANGE':
      return 'ASK_FOR_SPECIFIC_ITEM';

    case 'ORDER_CHANGE':
      switch (data) {
        case 'change_quantity':
          return 'ASK_FOR_QUANTITY';

        case 'change_size':
          return 'ASK_FOR_SIZE';

        case 'change_flavor':
          return 'ASK_FOR_FLAVOR';

        case 'change_address':
          return 'ASK_FOR_LOCATION';

        case 'change_item':
          return 'CHANGE_ITEM';

        case 'cancel_item':
          return 'CANCEL_ITEM';
      }

      break;

    case 'ORDER_CHANGE_ITEM':
      return 'CHANGE_ITEM';

    case 'ORDER_CANCEL_ITEM':
      return 'CANCEL_ITEM';

    case 'ORDER_CONFIRM_BEVERAGE':
      switch (data) {
        case 'beverage_yes':
          return 'ASK_FOR_BEVERAGE_OPTIONS';

        default:
          return 'SHOW_NO_BEVERAGE_ASK_FOR_PAYMENT_TYPE';
      }

    case 'ORDER_BEVERAGE':
      switch (data.option) {
        case 'beverages_more':
          return 'ASK_FOR_BEVERAGE_OPTIONS';

        case 'beverages_cancel':
          return 'SHOW_NO_BEVERAGE_ASK_FOR_PAYMENT_TYPE';

        default:
          return 'SHOW_BEVERAGE_ASK_FOR_PAYMENT_TYPE';
      }

    case 'ORDER_PAYMENT_TYPE':
      switch (data) {
        case 'payment_money':
          return 'SHOW_PAYMENT_TYPE_ASK_FOR_PAYMENT_CHANGE';

        case 'payment_card':
          return 'SHOW_PAYMENT_TYPE_ASK_FOR_COMMENTS';
      }

      break;

    case 'ORDER_PAYMENT_CHANGE':
      return 'SHOW_PAYMENT_CHANGE_ASK_FOR_COMMENTS';

    case 'ORDER_COMMENTS':
      switch (data) {
        case 'comments_yes':
          return 'ASK_FOR_TYPE_COMMENTS';

        default:
          return 'SHOW_FULL_ORDER_CONFIRM_ORDER';
      }

    case 'ORDER_CONFIRMATION':
      switch (data.type) {
        case 'confirmation_yes':
          return 'CONFIRM_ORDER';

        default:
          return 'ASK_FOR_CHANGE_ORDER';
      }

    case 'ORDER_CHANGE_SELECT_ITEM':
      return 'UPDATE_ITEM';

    case 'ORDER_PARTIAL_CONFIRMATION':
      return 'CANCEL_PENDING_SHOW_PARTIAL_ORDER';

    case 'ORDER_CATEGORY':
      return 'SHOW_CATEGORY_ASK_FOR_SIZE';

    case 'ORDER_ASK_CATEGORY':
      return 'ASK_FOR_CATEGORY';

    case 'ORDER_CATEGORY_CARDAPIO':
      return 'SHOW_FLAVORS_CATEGORY';
  }
};

var sendActions =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref3) {
    var action, pageID, userID, multiple, data, payload, location, text, addrData, user, out;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            action = _ref3.action, pageID = _ref3.pageID, userID = _ref3.userID, multiple = _ref3.multiple, data = _ref3.data, payload = _ref3.payload, location = _ref3.location, text = _ref3.text, addrData = _ref3.addrData, user = _ref3.user;
            _context3.prev = 1;
            _context3.t0 = action;
            _context3.next = _context3.t0 === 'BASIC_REPLY' ? 5 : _context3.t0 === 'CHECK_TYPED_TEXT' ? 9 : _context3.t0 === 'ASK_FOR_CONTINUE' ? 13 : _context3.t0 === 'CHECK_LAST_ACTION' ? 17 : _context3.t0 === 'CONTINUE_ORDER_NO' ? 21 : _context3.t0 === 'PASS_THREAD_CONTROL' ? 25 : _context3.t0 === 'SEND_WELCOME' ? 29 : _context3.t0 === 'SEND_MAIN_MENU' ? 33 : _context3.t0 === 'SEND_CARDAPIO' ? 37 : _context3.t0 === 'SEND_HORARIO' ? 41 : _context3.t0 === 'ASK_FOR_DELIVER' ? 45 : _context3.t0 === 'SHOW_DELIVER_CHECK_ADDRESS' ? 49 : _context3.t0 === 'CHECK_ADDRESS' ? 53 : _context3.t0 === 'CONFIRM_ADDRESS' ? 57 : _context3.t0 === 'ASK_FOR_ORDER' ? 61 : _context3.t0 === 'LOCATION_CONFIRM_ADDRESS' ? 65 : _context3.t0 === 'SHOW_ADDRESS_ASK_FOR_CATEGORY' ? 69 : _context3.t0 === 'ASK_FOR_LOCATION' ? 73 : _context3.t0 === 'ASK_TO_TYPE_ADDRESS' ? 77 : _context3.t0 === 'SHOW_DELIVER_ASK_FOR_CATEGORY' ? 81 : _context3.t0 === 'ASK_FOR_QUANTITY' ? 85 : _context3.t0 === 'ASK_FOR_QUANTITY_MORE' ? 89 : _context3.t0 === 'SHOW_QUANTITY_ASK_FOR_SIZE' ? 93 : _context3.t0 === 'ASK_FOR_SIZE' ? 97 : _context3.t0 === 'SHOW_SIZE_CHECK_SPLIT' ? 101 : _context3.t0 === 'SHOW_SPLIT_CHECK_FLAVOR' ? 105 : _context3.t0 === 'ASK_FOR_FLAVOR' ? 109 : _context3.t0 === 'SHOW_FLAVOR' ? 113 : _context3.t0 === 'CHECK_ITEM' ? 117 : _context3.t0 === 'SHOW_FLAVOR_CHECK_ITEM' ? 121 : _context3.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 125 : _context3.t0 === 'SHOW_NO_BEVERAGE_ASK_FOR_PAYMENT_TYPE' ? 129 : _context3.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 133 : _context3.t0 === 'SHOW_BEVERAGE_ASK_FOR_PAYMENT_TYPE' ? 137 : _context3.t0 === 'ASK_FOR_PAYMENT_TYPE' ? 141 : _context3.t0 === 'SHOW_PAYMENT_TYPE_ASK_FOR_COMMENTS' ? 145 : _context3.t0 === 'SHOW_PAYMENT_TYPE_ASK_FOR_PAYMENT_CHANGE' ? 149 : _context3.t0 === 'SHOW_PAYMENT_CHANGE_ASK_FOR_COMMENTS' ? 153 : _context3.t0 === 'ASK_FOR_COMMENTS' ? 157 : _context3.t0 === 'ASK_FOR_TYPE_COMMENTS' ? 161 : _context3.t0 === 'SHOW_FULL_ORDER_CONFIRM_ORDER' ? 165 : _context3.t0 === 'ASK_FOR_CHANGE_ORDER' ? 169 : _context3.t0 === 'ASK_FOR_SPECIFIC_ITEM' ? 173 : _context3.t0 === 'CHANGE_ITEM' ? 177 : _context3.t0 === 'CANCEL_ITEM' ? 181 : _context3.t0 === 'UPDATE_ITEM' ? 185 : _context3.t0 === 'CONFIRM_ORDER' ? 189 : _context3.t0 === 'CANCEL_PENDING_ORDER' ? 193 : _context3.t0 === 'SHOW_CATEGORY_ASK_FOR_SIZE' ? 197 : _context3.t0 === 'ASK_FOR_CATEGORY' ? 201 : _context3.t0 === 'CANCEL_PENDING_SHOW_PARTIAL_ORDER' ? 205 : _context3.t0 === 'SHOW_FLAVORS_CATEGORY' ? 209 : 213;
            break;

          case 5:
            _context3.next = 7;
            return getElement(_botController.basicReply, data);

          case 7:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 9:
            _context3.next = 11;
            return checkTypedText(pageID, userID, text);

          case 11:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 13:
            _context3.next = 15;
            return getElement(_botController.askForContinue);

          case 15:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 17:
            _context3.next = 19;
            return (0, _botController.checkLastAction)(pageID, userID);

          case 19:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 21:
            _context3.next = 23;
            return getElement(_botController.optionsStopOrder);

          case 23:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 25:
            _context3.next = 27;
            return (0, _botController.passThreadControl)(pageID, userID, 'whatsapp');

          case 27:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 29:
            _context3.next = 31;
            return getElement(_botController.sendWelcomeMessage, [pageID, user.first_name]);

          case 31:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 33:
            _context3.next = 35;
            return getElement(_botController.sendMainMenu);

          case 35:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 37:
            _context3.next = 39;
            return getElement(_show_cardapio.askForCategoryCardapio, [pageID]);

          case 39:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 41:
            _context3.next = 43;
            return getElement(_botController.sendHorario, [pageID, 'whatsapp']);

          case 43:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 45:
            _context3.next = 47;
            return getElement(_botController.askForDeliver, [pageID, userID]);

          case 47:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 49:
            _context3.next = 51;
            return getElement(_botController.showDeliverCheckAddress, [pageID, userID, data, user, 'whatsapp']);

          case 51:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 53:
            _context3.next = 55;
            return getElement(_botController.confirmAddressOrAskLocation, [pageID, userID, user, 'whatsapp']);

          case 55:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 57:
            _context3.next = 59;
            return getElement(_botController.confirmAddress, [pageID, userID, addrData, user, 'whatsapp']);

          case 59:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 61:
            _context3.next = 63;
            return getElement(askForWantOrder);

          case 63:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 65:
            _context3.next = 67;
            return getElement(_botController.confirmLocationAddress, [pageID, userID, location]);

          case 67:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 69:
            _context3.next = 71;
            return getElement(_botController.showAddressAskForCategory, [pageID, userID, data, 'whatsapp']);

          case 71:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 73:
            _context3.next = 75;
            return getElement(_botController.askForLocation, [pageID, userID, user, 'whatsapp']);

          case 75:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 77:
            _context3.next = 79;
            return (0, _botController.askToTypeAddress)(pageID, userID);

          case 79:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 81:
            _context3.next = 83;
            return getElement(_botController.showDeliverAskForCategory, [pageID, userID, data, user, 'whatsapp']);

          case 83:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 85:
            _context3.next = 87;
            return getElement(_botController.askForQuantity, [pageID, userID]);

          case 87:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 89:
            _context3.next = 91;
            return getElement(_botController.askForQuantityMore, [pageID, userID]);

          case 91:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 93:
            _context3.next = 95;
            return getElement(_botController.showQuantityAskForSize, [pageID, userID, data]);

          case 95:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 97:
            _context3.next = 99;
            return (0, _botController.askForSizeCat)(pageID, userID, data);

          case 99:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 101:
            _context3.next = 103;
            return (0, _botController.showSizeCheckSplit)(pageID, userID, data, 1);

          case 103:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 105:
            _context3.next = 107;
            return (0, _botController.showSplitCheckFlavor)(pageID, userID, data);

          case 107:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 109:
            _context3.next = 111;
            return (0, _botController.askForFlavorOrConfirm)(pageID, userID, multiple);

          case 111:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 113:
            _context3.next = 115;
            return (0, _botController.showFlavor)(pageID, userID, data);

          case 115:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 117:
            _context3.next = 119;
            return (0, _botController.showOrderOrNextItem)(pageID, userID);

          case 119:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 121:
            _context3.next = 123;
            return (0, _botController.showFlavorCheckItem)(pageID, userID, data);

          case 123:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 125:
            _context3.next = 127;
            return (0, _botController.askForWantBeverage)(pageID, userID);

          case 127:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 129:
            _context3.next = 131;
            return (0, _botController.showNoBeverageAskForPaymentType)(pageID, userID, data);

          case 131:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 133:
            _context3.next = 135;
            return (0, _botController.askForBeverages)(pageID, userID, multiple);

          case 135:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 137:
            _context3.next = 139;
            return (0, _botController.showBeverageAskForPaymentType)(pageID, userID, data);

          case 139:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 141:
            _context3.next = 143;
            return (0, _botController.askForPaymentType)(pageID, userID);

          case 143:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 145:
            _context3.next = 147;
            return (0, _botController.showPaymentTypeAskForComments)(pageID, userID, data);

          case 147:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 149:
            _context3.next = 151;
            return (0, _botController.showPaymentTypeAskForPaymentChange)(pageID, userID, data);

          case 151:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 153:
            _context3.next = 155;
            return (0, _botController.showPaymentChangeAskForComments)(pageID, userID, data);

          case 155:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 157:
            _context3.next = 159;
            return (0, _botController.askForComments)(pageID, userID);

          case 159:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 161:
            _context3.next = 163;
            return getElement(_botController.askToTypeComments, [pageID, userID]);

          case 163:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 165:
            _context3.next = 167;
            return (0, _botController.showFullOrderConfirmOrder)(pageID, userID, data);

          case 167:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 169:
            _context3.next = 171;
            return (0, _botController.askForChangeOrder)(pageID, userID, data);

          case 171:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 173:
            _context3.next = 175;
            return (0, _botController.askForSpecificItem)(pageID, userID);

          case 175:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 177:
            _context3.next = 179;
            return (0, _botController.changeItem)(pageID, userID, data);

          case 179:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 181:
            _context3.next = 183;
            return (0, _botController.cancelItem)(pageID, userID, data);

          case 183:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 185:
            _context3.next = 187;
            return (0, _botController.updateItemAskOptions)(pageID, userID, data);

          case 187:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 189:
            _context3.next = 191;
            return (0, _botController.confirmOrder)(pageID, userID);

          case 191:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 193:
            _context3.next = 195;
            return (0, _botController.cancelPendingOrder)(pageID, userID);

          case 195:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 197:
            _context3.next = 199;
            return getElement(_botController.showCategoryAskForSize, [pageID, userID, data]);

          case 199:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 201:
            _context3.next = 203;
            return getElement(_botController.askForCategory, [pageID, userID, data]);

          case 203:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 205:
            _context3.next = 207;
            return getElement(_botController.cancelPendingShowPartialOrder, [pageID, userID]);

          case 207:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 209:
            _context3.next = 211;
            return getElement(_botController.sendCardapio, [pageID, data, 'whatsapp']);

          case 211:
            out = _context3.sent;
            return _context3.abrupt("break", 214);

          case 213:
            return _context3.abrupt("break", 214);

          case 214:
            return _context3.abrupt("return", out);

          case 217:
            _context3.prev = 217;
            _context3.t1 = _context3["catch"](1);
            console.error('action:', action, 'data:', data, 'err:', _context3.t1);
            throw _context3.t1;

          case 221:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 217]]);
  }));

  return function sendActions(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.sendActions = sendActions;

var getElement =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(fn, params) {
    var data;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!params) {
              _context4.next = 6;
              break;
            }

            _context4.next = 3;
            return fn.apply(void 0, _toConsumableArray(params));

          case 3:
            _context4.t0 = _context4.sent;
            _context4.next = 9;
            break;

          case 6:
            _context4.next = 8;
            return fn();

          case 8:
            _context4.t0 = _context4.sent;

          case 9:
            data = _context4.t0;
            return _context4.abrupt("return", data);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getElement(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Used in waboxapp
 * @param {*} to
 * @param {*} text
 */


var waboxapp_sendMessage =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(to, text) {
    var myToken, uid, custom_uid, qText, waboxApp;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            myToken = '3207ecb3e9815b97c7efea3f45e7f8205c646bc16cd19';
            uid = '554499485760';
            custom_uid = encodeURIComponent(Math.random() * 100);
            qText = encodeURIComponent(text); // eslint-disable-next-line max-len

            waboxApp = "https://www.waboxapp.com/api/send/chat?token=".concat(myToken, "&uid=").concat(uid, "&to=").concat(to, "&custom_uid=").concat(custom_uid, "&text=").concat(qText);
            console.info('**** Ready to send: ****');
            console.info(waboxApp);
            _context5.next = 9;
            return _axios.default.get(waboxApp);

          case 9:
            return _context5.abrupt("return", _context5.sent);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function waboxapp_sendMessage(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

exports.waboxapp_sendMessage = waboxapp_sendMessage;
//# sourceMappingURL=whatController.js.map