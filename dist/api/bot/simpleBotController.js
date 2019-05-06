"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicAutoReply = exports.basicPostComments = exports.basicComments = exports.basicOption = exports.basicReply = void 0;

var _simpleOrdersController = require("../controllers/simpleOrdersController");

var _util = require("../util/util");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import { emitEventBotWebapp } from './redisController';

/**
 *
 * @param {*} pageId .
 * @param {*} userId .
 * @param {*} replyText is gonna be returned by bot
 * @param {*} user
 * @param {*} data message received by the bot
 */
var basicReply =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageId, userId, replyText, user, data) {
    var confirm, _phone;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            confirm = !!data;
            _phone = (0, _util.formatWhatsappNumber)(userId);
            _context.next = 4;
            return (0, _simpleOrdersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'typed_comments',
              user: user,
              comments: data,
              confirmOrder: confirm,
              phone: _phone
            });

          case 4:
            return _context.abrupt("return", {
              type: 'text',
              text: replyText
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function basicReply(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.basicReply = basicReply;

var basicOption =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageId, userId, text, optionText, data, user, message) {
    var _phone, _options;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _phone = (0, _util.formatWhatsappNumber)(userId);
            _context2.next = 3;
            return (0, _simpleOrdersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'typed_comments',
              user: user,
              phone: _phone,
              comments: message
            });

          case 3:
            _options = [];

            _options.push({
              text: optionText,
              subText: data,
              hidden: true
            });

            return _context2.abrupt("return", {
              type: 'list',
              text: text,
              options: _options
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function basicOption(_x6, _x7, _x8, _x9, _x10, _x11, _x12) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Just update the comments, do not return nothing.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} text
 */


exports.basicOption = basicOption;

var basicComments =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageId, userId, text, user) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _simpleOrdersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'typed_comments',
              comments: text,
              user: user,
              confirmOrder: true
            });

          case 2:
            return _context3.abrupt("return", true);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function basicComments(_x13, _x14, _x15, _x16) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Just update the comments, do not return nothing.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} text
 */


exports.basicComments = basicComments;

var basicPostComments =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageId, userId, text, user, autoReplyMsg) {
    var _phone, order;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _phone = (0, _util.formatWhatsappNumber)(userId);
            _context4.next = 3;
            return (0, _simpleOrdersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              phone: _phone,
              waitingFor: 'typed_comments',
              postComments: text,
              user: user,
              mergeComments: true,
              autoReplyMsg: autoReplyMsg
            });

          case 3:
            order = _context4.sent;
            return _context4.abrupt("return", order);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function basicPostComments(_x17, _x18, _x19, _x20, _x21) {
    return _ref4.apply(this, arguments);
  };
}(); // WhatsappWebBot-Delay - This solution works well with delay managed by whatsapp-web-bot.
// export const basicAutoReply = async (pageId, userId, text) => {
//     await updateOrder({
//         pageId, userId, sentAutoReply: true, comments: text, mergeComments: true,
//     });
//     return { type: 'text', text: text, msgType: 'withdelay' };
// }


exports.basicPostComments = basicPostComments;

var basicAutoReply =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageId, userId, text) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _simpleOrdersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sentAutoReply: true,
              comments: text,
              mergeComments: true
            });

          case 2:
            return _context5.abrupt("return", true);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function basicAutoReply(_x22, _x23, _x24) {
    return _ref5.apply(this, arguments);
  };
}();

exports.basicAutoReply = basicAutoReply;
//# sourceMappingURL=simpleBotController.js.map