"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actionsController = require("./actionsController");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico';

var getCardapio =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    var flavorArray, replyText;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _actionsController.getFlavorsAndToppings)(pageID);

          case 2:
            flavorArray = _context.sent;
            replyText = new String();

            if (flavorArray) {
              replyText = 'Seguem as pizzas do nosso cardápio:\n' + (0, _actionsController.inputCardapioReplyMsg)(flavorArray);
            } else {
              replyText = MSG_GENERAL_ERROR;
            }

            return _context.abrupt("return", replyText);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getCardapio(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = getCardapio;
exports.default = _default;
//# sourceMappingURL=show_cardapio.js.map