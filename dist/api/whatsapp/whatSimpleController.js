"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waboxapp_sendMessage = exports.sendActions = exports.w_controller = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _luxon = require("luxon");

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
    var myId, message, userId, match, contactName, profileImg, names, first_name, last_name, _profile_pic, user, store, pageId, pendingOrder, result, addrData, oldComments, updatedComents, page, _store, lastOrder, orderDay, today, tempoEntregar, tempoRetirar, replyText;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.info('###### w_controller SIMPLE ######');
            console.info(args);
            myId = args.myId, message = args.message, userId = args.userId, match = args.match, contactName = args.contactName, profileImg = args.profileImg;
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
              _context.next = 85;
              break;
            }

            console.info("store name: ".concat(store.name, ", match:").concat(match));
            pageId = store.pageId;

            if (match) {
              _context.next = 79;
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
              _context.next = 42;
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
            _context.next = 39;
            break;

          case 27:
            if (!(pendingOrder.order.waitingFor === 'typed_comments')) {
              _context.next = 39;
              break;
            }

            oldComments = pendingOrder.order.comments;

            if (!(pendingOrder.order.status >= _ordersController.ORDERSTATUS_ACCEPTED)) {
              _context.next = 35;
              break;
            }

            _context.next = 32;
            return sendActions({
              action: 'BASIC_UPDATE_POSTCOMMENTS',
              pageID: pageId,
              userID: userId,
              text: message,
              user: user
            });

          case 32:
            result = _context.sent;
            _context.next = 39;
            break;

          case 35:
            // concat old comments and the new comments
            updatedComents = oldComments ? oldComments + '\n' + message : message;
            _context.next = 38;
            return sendActions({
              action: 'BASIC_UPDATE_COMMENTS',
              pageID: pageId,
              userID: userId,
              text: updatedComents,
              user: user
            });

          case 38:
            result = _context.sent;

          case 39:
            return _context.abrupt("return", result);

          case 42:
            _context.next = 44;
            return (0, _pagesController.getOnePageData)(pageId);

          case 44:
            page = _context.sent;
            _context.next = 47;
            return (0, _storesController.getStoreData)(pageId);

          case 47:
            _store = _context.sent;
            _context.next = 50;
            return (0, _ordersController.getLastUserOrder)({
              pageId: pageId,
              userId: userId
            });

          case 50:
            lastOrder = _context.sent;

            if (!lastOrder) {
              _context.next = 58;
              break;
            }

            console.log('>> Found lastOrder:', lastOrder.id);
            orderDay = _luxon.DateTime.fromJSDate(lastOrder.createdAt).get('day');
            today = _luxon.DateTime.local().get('day');

            if (!(orderDay === today && lastOrder.status < _ordersController.ORDERSTATUS_FINISHED)) {
              _context.next = 58;
              break;
            }

            console.log(' from today...');
            return _context.abrupt("return");

          case 58:
            tempoEntregar = _store.delivery_time ? "(+ ou - ".concat(_store.delivery_time, " min.)") : '';
            tempoRetirar = _store.pickup_time ? "(+ ou - ".concat(_store.pickup_time, " min.)") : '';
            replyText = page.firstResponseText.replace('$NAME', contactName);
            replyText = replyText + '\n\n';

            if (!(lastOrder && lastOrder.comments)) {
              _context.next = 71;
              break;
            }

            replyText = replyText + 'Seu último pedido:\n';
            replyText = replyText + lastOrder.comments + '\n';
            replyText = replyText + 'Envie *REPETIR* para fazer o mesmo pedido OU envie os dados do pedido:\n';
            _context.next = 68;
            return sendActions({
              action: 'BASIC_OPTION',
              pageID: pageId,
              userID: userId,
              text: replyText,
              payload: lastOrder.comments,
              data: 'REPETIR',
              user: user
            });

          case 68:
            return _context.abrupt("return", _context.sent);

          case 71:
            replyText = replyText + page.orderExample + '\n';
            replyText = replyText.replace('$TEMPOENTREGAR', tempoEntregar);
            replyText = replyText.replace('$TEMPORETIRAR', tempoRetirar);
            _context.next = 76;
            return sendActions({
              action: 'BASIC_REPLY',
              pageID: pageId,
              userID: userId,
              text: replyText,
              user: user
            });

          case 76:
            return _context.abrupt("return", _context.sent);

          case 77:
            _context.next = 83;
            break;

          case 79:
            if (!(match.hasOwnProperty('text') && match.text === 'REPETIR')) {
              _context.next = 83;
              break;
            }

            _context.next = 82;
            return sendActions({
              action: 'BASIC_REPLY',
              pageID: pageId,
              userID: userId,
              text: 'Ok, vamos repetir o pedido.',
              user: user,
              data: match.subText
            });

          case 82:
            return _context.abrupt("return", _context.sent);

          case 83:
            _context.next = 86;
            break;

          case 85:
            console.info("### w_controller ### did not find store for myId: ".concat(myId));

          case 86:
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
            _context2.next = _context2.t0 === 'BASIC_REPLY' ? 5 : _context2.t0 === 'BASIC_OPTION' ? 9 : _context2.t0 === 'BASIC_UPDATE_COMMENTS' ? 13 : _context2.t0 === 'BASIC_UPDATE_POSTCOMMENTS' ? 17 : 21;
            break;

          case 5:
            _context2.next = 7;
            return (0, _botController.basicReply)(pageID, userID, text, user, data);

          case 7:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 9:
            _context2.next = 11;
            return (0, _botController.basicOption)(pageID, userID, text, data, payload, user);

          case 11:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 13:
            _context2.next = 15;
            return (0, _botController.basicComments)(pageID, userID, text, user);

          case 15:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 17:
            _context2.next = 19;
            return (0, _botController.basicPostComments)(pageID, userID, text, user);

          case 19:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 21:
            return _context2.abrupt("break", 22);

          case 22:
            return _context2.abrupt("return", out);

          case 25:
            _context2.prev = 25;
            _context2.t1 = _context2["catch"](1);
            console.error('action:', action, 'data:', data, 'err:', _context2.t1);
            throw _context2.t1;

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 25]]);
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