"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputHorarioReplyMsg = exports.getOpenAndClose = exports.inputCardapioReplyMsg = exports.getFlavorsAndToppings = exports.sendActions = void 0;

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _storesController = require("../controllers/storesController");

var _pricingsController = require("../controllers/pricingsController");

var _facebookMessengerBot = require("facebook-messenger-bot");

var _botController = require("./botController");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var QTY_1 = [1, "um", "uma"];

var sendActions =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var action, bot, sender, pageID, multiple, split, data, payload, out, phone;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            action = _ref.action, bot = _ref.bot, sender = _ref.sender, pageID = _ref.pageID, multiple = _ref.multiple, split = _ref.split, data = _ref.data, payload = _ref.payload;
            _context.prev = 1;
            out = new _facebookMessengerBot.Elements();
            _context.t0 = action;
            _context.next = _context.t0 === 'SEND_WELCOME' ? 6 : _context.t0 === 'SEND_CARDAPIO' ? 20 : _context.t0 === 'ASK_FOR_PHONE' ? 32 : _context.t0 === 'SHOW_PHONE' ? 44 : _context.t0 === 'SHOW_ADDRESS' ? 57 : _context.t0 === 'SHOW_ORDER_OR_ASK_FOR_PHONE' ? 69 : _context.t0 === 'ASK_TO_TYPE_PHONE' ? 81 : _context.t0 === 'ASK_FOR_LOCATION' ? 93 : _context.t0 === 'ASK_TO_TYPE_ADDRESS' ? 105 : _context.t0 === 'ASK_FOR_QUANTITY' ? 117 : _context.t0 === 'ASK_FOR_FLAVOR' ? 129 : _context.t0 === 'SHOW_FLAVOR' ? 141 : _context.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 153 : _context.t0 === 'SHOW_NO_BEVERAGE' ? 165 : _context.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 177 : _context.t0 === 'SHOW_BEVERAGE' ? 189 : _context.t0 === 'SHOW_FULL_ORDER' ? 201 : _context.t0 === 'CONFIRM_ORDER' ? 213 : 225;
            break;

          case 6:
            _context.next = 8;
            return bot.startTyping(sender.id);

          case 8:
            _context.next = 10;
            return _facebookMessengerBot.Bot.wait(500);

          case 10:
            _context.next = 12;
            return (0, _botController.sendWelcomeMessage)(pageID, sender);

          case 12:
            out = _context.sent;
            _context.next = 15;
            return _facebookMessengerBot.Bot.wait(500);

          case 15:
            _context.next = 17;
            return bot.stopTyping(sender.id);

          case 17:
            _context.next = 19;
            return bot.send(sender.id, out);

          case 19:
            return _context.abrupt("break", 226);

          case 20:
            _context.next = 22;
            return bot.startTyping(sender.id);

          case 22:
            _context.next = 24;
            return _facebookMessengerBot.Bot.wait(500);

          case 24:
            _context.next = 26;
            return (0, _botController.sendCardapio)(pageID);

          case 26:
            out = _context.sent;
            _context.next = 29;
            return bot.stopTyping(sender.id);

          case 29:
            _context.next = 31;
            return bot.send(sender.id, out);

          case 31:
            return _context.abrupt("break", 226);

          case 32:
            _context.next = 34;
            return bot.startTyping(sender.id);

          case 34:
            _context.next = 36;
            return _facebookMessengerBot.Bot.wait(800);

          case 36:
            _context.next = 38;
            return (0, _botController.askForPhone)(pageID, sender.id);

          case 38:
            out = _context.sent;
            _context.next = 41;
            return bot.stopTyping(sender.id);

          case 41:
            _context.next = 43;
            return bot.send(sender.id, out);

          case 43:
            return _context.abrupt("break", 226);

          case 44:
            _context.next = 46;
            return bot.startTyping(sender.id);

          case 46:
            _context.next = 48;
            return _facebookMessengerBot.Bot.wait(500);

          case 48:
            phone = typeof data === 'undefined' ? payload : data;
            _context.next = 51;
            return (0, _botController.showPhone)(pageID, sender.id, phone);

          case 51:
            out = _context.sent;
            _context.next = 54;
            return bot.stopTyping(sender.id);

          case 54:
            _context.next = 56;
            return bot.send(sender.id, out);

          case 56:
            return _context.abrupt("break", 226);

          case 57:
            _context.next = 59;
            return bot.startTyping(sender.id);

          case 59:
            _context.next = 61;
            return _facebookMessengerBot.Bot.wait(500);

          case 61:
            _context.next = 63;
            return (0, _botController.showAddress)(pageID, sender.id, data);

          case 63:
            out = _context.sent;
            _context.next = 66;
            return bot.stopTyping(sender.id);

          case 66:
            _context.next = 68;
            return bot.send(sender.id, out);

          case 68:
            return _context.abrupt("break", 226);

          case 69:
            _context.next = 71;
            return bot.startTyping(sender.id);

          case 71:
            _context.next = 73;
            return _facebookMessengerBot.Bot.wait(500);

          case 73:
            _context.next = 75;
            return (0, _botController.showOrderOrAskForPhone)(pageID, sender.id);

          case 75:
            out = _context.sent;
            _context.next = 78;
            return bot.stopTyping(sender.id);

          case 78:
            _context.next = 80;
            return bot.send(sender.id, out);

          case 80:
            return _context.abrupt("break", 226);

          case 81:
            _context.next = 83;
            return bot.startTyping(sender.id);

          case 83:
            _context.next = 85;
            return _facebookMessengerBot.Bot.wait(500);

          case 85:
            _context.next = 87;
            return (0, _botController.askToTypePhone)(pageID, sender.id);

          case 87:
            out = _context.sent;
            _context.next = 90;
            return bot.stopTyping(sender.id);

          case 90:
            _context.next = 92;
            return bot.send(sender.id, out);

          case 92:
            return _context.abrupt("break", 226);

          case 93:
            _context.next = 95;
            return bot.startTyping(sender.id);

          case 95:
            _context.next = 97;
            return _facebookMessengerBot.Bot.wait(500);

          case 97:
            _context.next = 99;
            return (0, _botController.askForLocation)();

          case 99:
            out = _context.sent;
            _context.next = 102;
            return bot.stopTyping(sender.id);

          case 102:
            _context.next = 104;
            return bot.send(sender.id, out);

          case 104:
            return _context.abrupt("break", 226);

          case 105:
            _context.next = 107;
            return bot.startTyping(sender.id);

          case 107:
            _context.next = 109;
            return _facebookMessengerBot.Bot.wait(500);

          case 109:
            _context.next = 111;
            return (0, _botController.askToTypeAddress)(pageID, sender.id);

          case 111:
            out = _context.sent;
            _context.next = 114;
            return bot.stopTyping(sender.id);

          case 114:
            _context.next = 116;
            return bot.send(sender.id, out);

          case 116:
            return _context.abrupt("break", 226);

          case 117:
            _context.next = 119;
            return bot.startTyping(sender.id);

          case 119:
            _context.next = 121;
            return _facebookMessengerBot.Bot.wait(500);

          case 121:
            _context.next = 123;
            return (0, _botController.askForQuantity)(pageID, sender.id);

          case 123:
            out = _context.sent;
            _context.next = 126;
            return bot.stopTyping(sender.id);

          case 126:
            _context.next = 128;
            return bot.send(sender.id, out);

          case 128:
            return _context.abrupt("break", 226);

          case 129:
            _context.next = 131;
            return bot.startTyping(sender.id);

          case 131:
            _context.next = 133;
            return _facebookMessengerBot.Bot.wait(500);

          case 133:
            _context.next = 135;
            return (0, _botController.askForFlavor)(pageID, sender.id, multiple, split);

          case 135:
            out = _context.sent;
            _context.next = 138;
            return bot.stopTyping(sender.id);

          case 138:
            _context.next = 140;
            return bot.send(sender.id, out);

          case 140:
            return _context.abrupt("break", 226);

          case 141:
            _context.next = 143;
            return bot.startTyping(sender.id);

          case 143:
            _context.next = 145;
            return _facebookMessengerBot.Bot.wait(500);

          case 145:
            _context.next = 147;
            return (0, _botController.showFlavor)(pageID, sender.id, data);

          case 147:
            out = _context.sent;
            _context.next = 150;
            return bot.stopTyping(sender.id);

          case 150:
            _context.next = 152;
            return bot.send(sender.id, out);

          case 152:
            return _context.abrupt("break", 226);

          case 153:
            _context.next = 155;
            return bot.startTyping(sender.id);

          case 155:
            _context.next = 157;
            return _facebookMessengerBot.Bot.wait(500);

          case 157:
            _context.next = 159;
            return (0, _botController.askForWantBeverage)(pageID, sender.id);

          case 159:
            out = _context.sent;
            _context.next = 162;
            return bot.stopTyping(sender.id);

          case 162:
            _context.next = 164;
            return bot.send(sender.id, out);

          case 164:
            return _context.abrupt("break", 226);

          case 165:
            _context.next = 167;
            return bot.startTyping(sender.id);

          case 167:
            _context.next = 169;
            return _facebookMessengerBot.Bot.wait(200);

          case 169:
            _context.next = 171;
            return (0, _botController.showNoBeverage)(pageID, sender.id, data);

          case 171:
            out = _context.sent;
            _context.next = 174;
            return bot.stopTyping(sender.id);

          case 174:
            _context.next = 176;
            return bot.send(sender.id, out);

          case 176:
            return _context.abrupt("break", 226);

          case 177:
            _context.next = 179;
            return bot.startTyping(sender.id);

          case 179:
            _context.next = 181;
            return _facebookMessengerBot.Bot.wait(500);

          case 181:
            _context.next = 183;
            return (0, _botController.askForBeverages)(pageID, sender.id, multiple);

          case 183:
            out = _context.sent;
            _context.next = 186;
            return bot.stopTyping(sender.id);

          case 186:
            _context.next = 188;
            return bot.send(sender.id, out);

          case 188:
            return _context.abrupt("break", 226);

          case 189:
            _context.next = 191;
            return bot.startTyping(sender.id);

          case 191:
            _context.next = 193;
            return _facebookMessengerBot.Bot.wait(500);

          case 193:
            _context.next = 195;
            return (0, _botController.showBeverage)(pageID, sender.id, data);

          case 195:
            out = _context.sent;
            _context.next = 198;
            return bot.stopTyping(sender.id);

          case 198:
            _context.next = 200;
            return bot.send(sender.id, out);

          case 200:
            return _context.abrupt("break", 226);

          case 201:
            _context.next = 203;
            return bot.startTyping(sender.id);

          case 203:
            _context.next = 205;
            return _facebookMessengerBot.Bot.wait(500);

          case 205:
            _context.next = 207;
            return (0, _botController.showFullOrder)(pageID, sender.id);

          case 207:
            out = _context.sent;
            _context.next = 210;
            return bot.stopTyping(sender.id);

          case 210:
            _context.next = 212;
            return bot.send(sender.id, out);

          case 212:
            return _context.abrupt("break", 226);

          case 213:
            _context.next = 215;
            return bot.startTyping(sender.id);

          case 215:
            _context.next = 217;
            return _facebookMessengerBot.Bot.wait(500);

          case 217:
            _context.next = 219;
            return (0, _botController.confirmOrder)(pageID, sender.id);

          case 219:
            out = _context.sent;
            _context.next = 222;
            return bot.stopTyping(sender.id);

          case 222:
            _context.next = 224;
            return bot.send(sender.id, out);

          case 224:
            return _context.abrupt("break", 226);

          case 225:
            return _context.abrupt("break", 226);

          case 226:
            _context.next = 232;
            break;

          case 228:
            _context.prev = 228;
            _context.t1 = _context["catch"](1);
            console.error(action, _context.t1);
            throw _context.t1;

          case 232:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 228]]);
  }));

  return function sendActions(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID 
 * @param {*} sizeID 
 */


exports.sendActions = sendActions;

var getFlavorsAndToppings =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageID, sizeID) {
    var flavorArray, flavorsWithPrice, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, pricing;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context2.sent;
            flavorsWithPrice = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 8;
            _iterator = flavorArray[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 32;
              break;
            }

            flavor = _step.value;

            if (!sizeID) {
              _context2.next = 17;
              break;
            }

            _context2.next = 15;
            return (0, _pricingsController.getOnePricing)(pageID, flavor.kind, sizeID);

          case 15:
            pricing = _context2.sent;

            if (pricing) {
              flavor.price = pricing.price;
            }

          case 17:
            if (!sizeID) {
              _context2.next = 25;
              break;
            }

            if (!flavor.price) {
              _context2.next = 23;
              break;
            }

            _context2.next = 21;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings);

          case 21:
            flavor.toppingsNames = _context2.sent;
            flavorsWithPrice.push(flavor);

          case 23:
            _context2.next = 29;
            break;

          case 25:
            _context2.next = 27;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings);

          case 27:
            flavor.toppingsNames = _context2.sent;
            flavorsWithPrice.push(flavor);

          case 29:
            _iteratorNormalCompletion = true;
            _context2.next = 10;
            break;

          case 32:
            _context2.next = 38;
            break;

          case 34:
            _context2.prev = 34;
            _context2.t0 = _context2["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 38:
            _context2.prev = 38;
            _context2.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 41:
            _context2.prev = 41;

            if (!_didIteratorError) {
              _context2.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context2.finish(41);

          case 45:
            return _context2.finish(38);

          case 46:
            return _context2.abrupt("return", flavorsWithPrice);

          case 49:
            _context2.prev = 49;
            _context2.t1 = _context2["catch"](0);
            console.error({
              flavorsAndToppingsErr: _context2.t1
            });

          case 52:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 49], [8, 34, 38, 46], [39,, 41, 45]]);
  }));

  return function getFlavorsAndToppings(_x2, _x3) {
    return _ref3.apply(this, arguments);
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
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID) {
    var weekDay, openingTimes, openAndClose;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // TODO: timezone from the store
            weekDay = new Date().getDay();
            _context3.next = 3;
            return (0, _storesController.getOpeningTimes)(pageID);

          case 3:
            openingTimes = _context3.sent;

            if (!openingTimes) {
              _context3.next = 8;
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

            return _context3.abrupt("return", openAndClose);

          case 8:
            return _context3.abrupt("return", null);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getOpenAndClose(_x4) {
    return _ref4.apply(this, arguments);
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