"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waboxapp_sendMessage = exports.sendActions = exports.w_controller = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _luxon = require("luxon");

var _simpleBotController = require("../bot/simpleBotController");

var _storesController = require("../controllers/storesController");

var _simpleOrdersController = require("../controllers/simpleOrdersController");

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
    var myId, message, userId, contactName, profileImg, quotedMsg, processedMsg, names, first_name, last_name, _profile_pic, user, store, pageId, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('###### w_controller SIMPLE ######');
            console.dir(args);
            myId = args.myId, message = args.message, userId = args.userId, contactName = args.contactName, profileImg = args.profileImg, quotedMsg = args.quotedMsg; // If user is referencing a message (quotedMsg), insert it into processedMsg.
            // Otherwise, processdMsg is the same message sent.

            processedMsg = quotedMsg ? quotedMsg + '\n' + message : message;
            names = contactName.split(' ');
            first_name = names.shift();
            last_name = names.length >= 1 ? names.join(' ') : null;
            _profile_pic = profileImg && decodeURIComponent(profileImg.replace('https://web.whatsapp.com/pp?e=', ''));
            user = {
              first_name: first_name,
              last_name: last_name,
              profile_pic: _profile_pic
            };
            _context.next = 11;
            return (0, _storesController.getStoreByPhone)(myId);

          case 11:
            store = _context.sent;

            if (!store) {
              _context.next = 19;
              break;
            }

            console.info("store name: ".concat(store.name));
            pageId = store.pageId;
            _context.next = 17;
            return sendActions({
              action: 'BASIC_UPDATE_POSTCOMMENTS',
              pageID: pageId,
              userID: userId,
              text: processedMsg,
              user: user
            });

          case 17:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function w_controller(_x) {
    return _ref.apply(this, arguments);
  };
}(); // /**
//  * Receives the user and message from whatsapp and
//  * returns a message from the system.
//  * @param {*} args
//  */
// export const w_controller = async (args) => {
//     console.log('###### w_controller SIMPLE ######');
//     console.dir(args);
//     const { myId, message, userId, match, contactName, profileImg, quotedMsg } = args;
//     // If user is referencing a message (quotedMsg), insert it into processedMsg.
//     // Otherwise, processdMsg is the same message sent.
//     const processedMsg = quotedMsg ? quotedMsg + '\n' + message : message;
//     const names = contactName.split(' ');
//     const first_name = names.shift();
//     const last_name = names.length >= 1 ? names.join(' ') : null;
//     const _profile_pic = profileImg && decodeURIComponent(profileImg.replace('https://web.whatsapp.com/pp?e=', ''));
//     const user = {
//         first_name: first_name,
//         last_name: last_name,
//         profile_pic: _profile_pic,
//     }
//     const store = await getStoreByPhone(myId);
//     if (store) {
//         console.info(`store name: ${store.name}, match:${match}`);
//         const { pageId } = store;
//         // No option match, plain text.
//         if (!match) {
//             const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId });
//             // Found a pending order
//             if (pendingOrder && pendingOrder.order) {
//                 console.log(`pendingorder id:${pendingOrder.order.id} 
//                 waitingFor:${pendingOrder.order.waitingFor}
//                 coments:${pendingOrder.order.comments}`);
//                 let result;
//                 if (pendingOrder.order.waitingFor === 'typed_comments') {
//                     const oldComments = pendingOrder.order.comments;
//                     // Order not yet accepted
//                     if (pendingOrder.order.status < ORDERSTATUS_ACCEPTED) {
//                         // concat old comments and the new comments
//                         let updatedComents = oldComments ? oldComments + '\n' + processedMsg : processedMsg;
//                         result = await sendActions({
//                             action: 'BASIC_UPDATE_COMMENTS',
//                             pageID: pageId,
//                             userID: userId,
//                             text: updatedComents,
//                             user: user,
//                         });
//                     } else { // Order already accepted
//                         result = await sendActions({
//                             action: 'BASIC_UPDATE_POSTCOMMENTS',
//                             pageID: pageId,
//                             userID: userId,
//                             text: processedMsg,
//                             user: user,
//                         });
//                     }
//                 }
//                 return result;
//             } else { // No pending order found.
//                 const page = await getOnePageData(pageId);
//                 const store = await getStoreData(pageId);
//                 // Get the last order from this customer.
//                 const lastOrder = await getLastUserOrder({ pageId, userId, status: ORDERSTATUS_REJECTED });
//                 if (lastOrder) {
//                     console.log('>> Found lastOrder:', lastOrder.id);
//                     const orderDay = DateTime.fromJSDate(lastOrder.createdAt).get('day');
//                     const today = DateTime.local().get('day');
//                     if (orderDay === today && lastOrder.status < ORDERSTATUS_FINISHED) {
//                         console.log(' from today...');
//                         return;
//                     }
//                 }
//                 const tempoEntregar = store.delivery_time ? `(+ ou - ${store.delivery_time} min.)` : '';
//                 const tempoRetirar = store.pickup_time ? `(+ ou - ${store.pickup_time} min.)` : '';
//                 let replyText = page.firstResponseText.replace('$NAME', contactName);
//                 replyText = replyText + '\n\n';
//                 if (lastOrder && lastOrder.comments) {
//                     replyText = replyText + 'Seu último pedido:\n';
//                     replyText = replyText + lastOrder.comments + '\n';
//                     replyText = replyText + 'Envie *REPETIR* para fazer o mesmo pedido OU envie os dados do pedido:\n';
//                     return await sendActions({
//                         action: 'BASIC_OPTION',
//                         pageID: pageId,
//                         userID: userId,
//                         text: replyText,
//                         payload: lastOrder.comments,
//                         data: 'REPETIR',
//                         user: user,
//                         message: processedMsg,
//                     });
//                 } else {
//                     replyText = replyText + page.orderExample + '\n';
//                     replyText = replyText.replace('$TEMPOENTREGAR', tempoEntregar);
//                     replyText = replyText.replace('$TEMPORETIRAR', tempoRetirar);
//                     return await sendActions({
//                         action: 'BASIC_REPLY',
//                         pageID: pageId,
//                         userID: userId,
//                         text: replyText,
//                         user: user,
//                         data: processedMsg,
//                     });
//                 }
//             }
//         } else {
//             if (match.hasOwnProperty('text') && match.text === 'REPETIR') {
//                 return await sendActions({
//                     action: 'BASIC_REPLY',
//                     pageID: pageId,
//                     userID: userId,
//                     text: 'Ok, vamos repetir o pedido.',
//                     user: user,
//                     data: match.subText,
//                 });
//             }
//         }
//     } else {
//         console.info(`### w_controller ### did not find store for myId: ${myId}`);
//     }
// }


exports.w_controller = w_controller;

var sendActions =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref2) {
    var action, pageID, userID, multiple, data, payload, location, text, message, user, out;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            action = _ref2.action, pageID = _ref2.pageID, userID = _ref2.userID, multiple = _ref2.multiple, data = _ref2.data, payload = _ref2.payload, location = _ref2.location, text = _ref2.text, message = _ref2.message, user = _ref2.user;
            _context2.prev = 1;
            _context2.t0 = action;
            _context2.next = _context2.t0 === 'BASIC_REPLY' ? 5 : _context2.t0 === 'BASIC_OPTION' ? 9 : _context2.t0 === 'BASIC_UPDATE_COMMENTS' ? 13 : _context2.t0 === 'BASIC_UPDATE_POSTCOMMENTS' ? 17 : 21;
            break;

          case 5:
            _context2.next = 7;
            return (0, _simpleBotController.basicReply)(pageID, userID, text, user, data);

          case 7:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 9:
            _context2.next = 11;
            return (0, _simpleBotController.basicOption)(pageID, userID, text, data, payload, user, message);

          case 11:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 13:
            _context2.next = 15;
            return (0, _simpleBotController.basicComments)(pageID, userID, text, user);

          case 15:
            out = _context2.sent;
            return _context2.abrupt("break", 22);

          case 17:
            _context2.next = 19;
            return (0, _simpleBotController.basicPostComments)(pageID, userID, text, user);

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