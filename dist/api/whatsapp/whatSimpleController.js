"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waboxapp_sendMessage = exports.sendActions = exports.w_controller = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _botController = require("../bot/botController");

var _storesController = require("../controllers/storesController");

var _ordersController = require("../controllers/ordersController");

var _pagesController = require("../controllers/pagesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    var myId, message, userId, match, location, contactName, profileImg, names, first_name, last_name, _profile_pic, user, store, pageId, pendingOrder, result, addrData, oldComments, updatedComents, page, _store, lastOrder, tempoEntregar, tempoRetirar, replyText, objectWithEvent, _objectWithEvent, event, data, multiple, action, _result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.info('###### w_controller SIMPLE ######');
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
              _context.next = 84;
              break;
            }

            console.info("store name: ".concat(store.name, ", match:").concat(match));
            pageId = store.pageId;

            if (match) {
              _context.next = 67;
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
              _context.next = 36;
              break;
            }

            console.log("pendingorder id:".concat(pendingOrder.order.id, " \n                waitingFor:").concat(pendingOrder.order.waitingFor));

            if (!(pendingOrder.order.waitingFor === 'typed_address')) {
              _context.next = 27;
              break;
            }

            addrData = {
              manual_addres: true,
              formattedAddress: message
            };
            _context.next = 24;
            return sendActions({
              action: 'CONFIRM_ADDRESS',
              pageID: pageId,
              userID: userId,
              addrData: addrData,
              user: user
            });

          case 24:
            result = _context.sent;
            _context.next = 33;
            break;

          case 27:
            if (!(pendingOrder.order.waitingFor === 'typed_comments')) {
              _context.next = 33;
              break;
            }

            oldComments = pendingOrder.order.comments; // concat old comments and the new comments

            updatedComents = oldComments ? oldComments + '\n' + message : message;
            _context.next = 32;
            return sendActions({
              action: 'BASIC_UPDATE_COMMENTS',
              pageID: pageId,
              userID: userId,
              text: updatedComents
            });

          case 32:
            result = _context.sent;

          case 33:
            return _context.abrupt("return", result);

          case 36:
            _context.next = 38;
            return (0, _pagesController.getOnePageData)(pageId);

          case 38:
            page = _context.sent;
            _context.next = 41;
            return (0, _storesController.getStoreData)(pageId);

          case 41:
            _store = _context.sent;
            _context.next = 44;
            return (0, _ordersController.getLastUserOrder)({
              pageId: pageId,
              userId: userId
            });

          case 44:
            lastOrder = _context.sent;
            console.log('>> Found lastOrder:', lastOrder.id);
            tempoEntregar = _store.delivery_time ? "(+ ou - ".concat(_store.delivery_time, " min.)") : '';
            tempoRetirar = _store.pickup_time ? "(+ ou - ".concat(_store.pickup_time, " min.)") : '';
            replyText = page.firstResponseText.replace('$NAME', contactName);
            replyText = replyText + '\n\n';

            if (!(lastOrder && lastOrder.comments)) {
              _context.next = 59;
              break;
            }

            replyText = replyText + 'Seu último pedido:\n';
            replyText = replyText + lastOrder.comments + '\n';
            replyText = replyText + 'Envie *REPETIR* para fazer o mesmo pedido OU envie os dados do pedido:\n';
            _context.next = 56;
            return sendActions({
              action: 'BASIC_OPTION',
              pageID: pageId,
              userID: userId,
              text: replyText,
              payload: lastOrder.comments,
              data: 'REPETIR',
              user: user
            });

          case 56:
            return _context.abrupt("return", _context.sent);

          case 59:
            replyText = replyText + page.orderExample + '\n';
            replyText = replyText.replace('$TEMPOENTREGAR', tempoEntregar);
            replyText = replyText.replace('$TEMPORETIRAR', tempoRetirar);
            _context.next = 64;
            return sendActions({
              action: 'BASIC_REPLY',
              pageID: pageId,
              userID: userId,
              text: replyText,
              user: user
            });

          case 64:
            return _context.abrupt("return", _context.sent);

          case 65:
            _context.next = 82;
            break;

          case 67:
            if (match.hasOwnProperty('event')) objectWithEvent = match;else if (match.hasOwnProperty('buttons')) {
              if (match.buttons.hasOwnProperty('event')) objectWithEvent = match.buttons;
            }

            if (!objectWithEvent) {
              _context.next = 78;
              break;
            }

            _objectWithEvent = objectWithEvent, event = _objectWithEvent.event, data = _objectWithEvent.data;
            multiple = data ? data.multiple ? data.multiple : 1 : 1;
            action = mapEventsActions(event, data);
            _context.next = 74;
            return sendActions({
              action: action,
              pageID: pageId,
              userID: userId,
              data: data,
              location: location,
              multiple: multiple,
              user: user
            });

          case 74:
            _result = _context.sent;
            return _context.abrupt("return", _result);

          case 78:
            if (!(match.hasOwnProperty('text') && match.text === 'REPETIR')) {
              _context.next = 82;
              break;
            }

            _context.next = 81;
            return sendActions({
              action: 'BASIC_REPLY',
              pageID: pageId,
              userID: userId,
              text: 'Ok, vamos repetir o pedido.',
              user: user,
              data: match.subText
            });

          case 81:
            return _context.abrupt("return", _context.sent);

          case 82:
            _context.next = 85;
            break;

          case 84:
            console.info("### w_controller ### did not find store for myId: ".concat(myId));

          case 85:
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
      // switch (data) {
      //     case 'payment_money':
      //         return 'SHOW_PAYMENT_TYPE_ASK_FOR_PAYMENT_CHANGE';
      //     case 'payment_card':
      return 'SHOW_PAYMENT_TYPE_ASK_FOR_COMMENTS';
    // }
    // break;

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
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref2) {
    var action, pageID, userID, multiple, data, payload, location, text, addrData, user, out;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            action = _ref2.action, pageID = _ref2.pageID, userID = _ref2.userID, multiple = _ref2.multiple, data = _ref2.data, payload = _ref2.payload, location = _ref2.location, text = _ref2.text, addrData = _ref2.addrData, user = _ref2.user;
            _context2.prev = 1;
            _context2.t0 = action;
            _context2.next = _context2.t0 === 'BASIC_REPLY' ? 5 : _context2.t0 === 'BASIC_OPTION' ? 9 : _context2.t0 === 'BASIC_UPDATE_COMMENTS' ? 13 : 17;
            break;

          case 5:
            _context2.next = 7;
            return (0, _botController.basicReply)(pageID, userID, text, user, data);

          case 7:
            out = _context2.sent;
            return _context2.abrupt("break", 18);

          case 9:
            _context2.next = 11;
            return (0, _botController.basicOption)(pageID, userID, text, data, payload, user);

          case 11:
            out = _context2.sent;
            return _context2.abrupt("break", 18);

          case 13:
            _context2.next = 15;
            return (0, _botController.basicComments)(pageID, userID, text, user);

          case 15:
            out = _context2.sent;
            return _context2.abrupt("break", 18);

          case 17:
            return _context2.abrupt("break", 18);

          case 18:
            return _context2.abrupt("return", out);

          case 21:
            _context2.prev = 21;
            _context2.t1 = _context2["catch"](1);
            console.error('action:', action, 'data:', data, 'err:', _context2.t1);
            throw _context2.t1;

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 21]]);
  }));

  return function sendActions(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Used in waboxapp
 * @param {*} to
 * @param {*} text
 */


exports.sendActions = sendActions;

var waboxapp_sendMessage =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(to, text) {
    var myToken, uid, custom_uid, qText, waboxApp;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            myToken = '3207ecb3e9815b97c7efea3f45e7f8205c646bc16cd19';
            uid = '554499485760';
            custom_uid = encodeURIComponent(Math.random() * 100);
            qText = encodeURIComponent(text); // eslint-disable-next-line max-len

            waboxApp = "https://www.waboxapp.com/api/send/chat?token=".concat(myToken, "&uid=").concat(uid, "&to=").concat(to, "&custom_uid=").concat(custom_uid, "&text=").concat(qText);
            console.info('**** Ready to send: ****');
            console.info(waboxApp);
            _context3.next = 9;
            return _axios["default"].get(waboxApp);

          case 9:
            return _context3.abrupt("return", _context3.sent);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function waboxapp_sendMessage(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.waboxapp_sendMessage = waboxapp_sendMessage;
//# sourceMappingURL=whatSimpleController.js.map