"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actionsController = require("./actionsController");

var _pricingsController = require("../controllers/pricingsController");

var _util = require("../util/util");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico';

var getCardapio =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    var pricingArray, flavorArray, kinds, replyText;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _pricingsController.getPricingsWithSize)(pageID);

          case 2:
            pricingArray = _context.sent;
            _context.next = 5;
            return (0, _actionsController.getFlavorsAndToppings)(pageID);

          case 5:
            flavorArray = _context.sent;
            kinds = (0, _util.choices_kinds)();
            replyText = new String();

            if (flavorArray) {
              (function () {
                replyText = 'Segue o nosso cardápio:\n';
                var currentKind = '';
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = pricingArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var pricing = _step.value;

                    if (currentKind !== pricing.kind) {
                      if (currentKind !== '') {
                        var _flavorByKind = flavorArray.filter(function (value) {
                          return value.kind === currentKind;
                        });

                        replyText = replyText + '\n' + (0, _actionsController.inputCardapioReplyMsg)(_flavorByKind);
                      }

                      currentKind = pricing.kind;
                      var kindName = kinds.filter(function (e) {
                        return e.id === currentKind;
                      })[0].name;
                      replyText = replyText + '\n*Tipo:* ' + kindName + '\n';
                    }

                    replyText = replyText + pricing.size + ' - R$ ' + pricing.price + '\n';
                  } // the last kind

                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                if (currentKind !== '') {
                  var flavorByKind = flavorArray.filter(function (value) {
                    return value.kind === currentKind;
                  });
                  replyText = replyText + '\n' + (0, _actionsController.inputCardapioReplyMsg)(flavorByKind);
                }
              })();
            } else {
              replyText = MSG_GENERAL_ERROR;
            }

            return _context.abrupt("return", replyText);

          case 10:
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