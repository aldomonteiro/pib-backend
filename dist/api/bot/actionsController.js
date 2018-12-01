"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addQuickReplyOptions = exports.inputHorarioReplyMsg = exports.getOpenAndClose = exports.inputCardapioReplyMsg = exports.getFlavorsAndToppings = void 0;

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _storesController = require("../controllers/storesController");

var _pricingsController = require("../controllers/pricingsController");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var QTY_1 = [1, "um", "uma"];
/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID 
 * @param {*} sizeID 
 */

var getFlavorsAndToppings =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID, sizeID) {
    var flavorArray, flavorsWithPrice, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, pricing;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context.sent;
            flavorsWithPrice = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 8;
            _iterator = flavorArray[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 32;
              break;
            }

            flavor = _step.value;

            if (!sizeID) {
              _context.next = 17;
              break;
            }

            _context.next = 15;
            return (0, _pricingsController.getOnePricing)(pageID, flavor.kind, sizeID);

          case 15:
            pricing = _context.sent;

            if (pricing) {
              flavor.price = pricing.price;
            }

          case 17:
            if (!sizeID) {
              _context.next = 25;
              break;
            }

            if (!flavor.price) {
              _context.next = 23;
              break;
            }

            _context.next = 21;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings);

          case 21:
            flavor.toppingsNames = _context.sent;
            flavorsWithPrice.push(flavor);

          case 23:
            _context.next = 29;
            break;

          case 25:
            _context.next = 27;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings);

          case 27:
            flavor.toppingsNames = _context.sent;
            flavorsWithPrice.push(flavor);

          case 29:
            _iteratorNormalCompletion = true;
            _context.next = 10;
            break;

          case 32:
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 38:
            _context.prev = 38;
            _context.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 41:
            _context.prev = 41;

            if (!_didIteratorError) {
              _context.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context.finish(41);

          case 45:
            return _context.finish(38);

          case 46:
            return _context.abrupt("return", flavorsWithPrice);

          case 49:
            _context.prev = 49;
            _context.t1 = _context["catch"](0);
            console.error({
              flavorsAndToppingsErr: _context.t1
            });

          case 52:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 49], [8, 34, 38, 46], [39,, 41, 45]]);
  }));

  return function getFlavorsAndToppings(_x, _x2) {
    return _ref.apply(this, arguments);
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
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageID) {
    var weekDay, openingTimes, openAndClose;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // TODO: timezone from the store
            weekDay = new Date().getDay();
            _context2.next = 3;
            return (0, _storesController.getOpeningTimes)(pageID);

          case 3:
            openingTimes = _context2.sent;

            if (!openingTimes) {
              _context2.next = 8;
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

            return _context2.abrupt("return", openAndClose);

          case 8:
            return _context2.abrupt("return", null);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getOpenAndClose(_x3) {
    return _ref2.apply(this, arguments);
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

var addQuickReplyOptions = function addQuickReplyOptions(quickReplyOptions) {};

exports.addQuickReplyOptions = addQuickReplyOptions;
//# sourceMappingURL=actionsController.js.map