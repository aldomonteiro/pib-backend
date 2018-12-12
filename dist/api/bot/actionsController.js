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
    var action, bot, sender, pageID, multiple, split, data, payload, out;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            action = _ref.action, bot = _ref.bot, sender = _ref.sender, pageID = _ref.pageID, multiple = _ref.multiple, split = _ref.split, data = _ref.data, payload = _ref.payload;
            _context.prev = 1;
            out = new _facebookMessengerBot.Elements();
            _context.t0 = action;
            _context.next = _context.t0 === 'SEND_WELCOME' ? 6 : _context.t0 === 'SEND_CARDAPIO' ? 20 : _context.t0 === 'ASK_FOR_PHONE' ? 32 : _context.t0 === 'SHOW_PHONE' ? 44 : _context.t0 === 'SHOW_ADDRESS' ? 56 : _context.t0 === 'SHOW_ORDER_OR_ASK_FOR_PHONE' ? 68 : _context.t0 === 'ASK_TO_TYPE_PHONE' ? 80 : _context.t0 === 'ASK_FOR_LOCATION' ? 92 : _context.t0 === 'ASK_TO_TYPE_ADDRESS' ? 104 : _context.t0 === 'ASK_FOR_QUANTITY' ? 116 : _context.t0 === 'ASK_FOR_FLAVOR' ? 128 : _context.t0 === 'SHOW_FLAVOR' ? 140 : _context.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 152 : _context.t0 === 'SHOW_NO_BEVERAGE' ? 164 : _context.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 176 : _context.t0 === 'SHOW_BEVERAGE' ? 188 : _context.t0 === 'SHOW_FULL_ORDER' ? 200 : _context.t0 === 'CONFIRM_ORDER' ? 212 : 224;
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
            return _context.abrupt("break", 225);

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
            return _context.abrupt("break", 225);

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
            return _context.abrupt("break", 225);

          case 44:
            _context.next = 46;
            return bot.startTyping(sender.id);

          case 46:
            _context.next = 48;
            return _facebookMessengerBot.Bot.wait(500);

          case 48:
            _context.next = 50;
            return (0, _botController.showPhone)(pageID, sender.id, data);

          case 50:
            out = _context.sent;
            _context.next = 53;
            return bot.stopTyping(sender.id);

          case 53:
            _context.next = 55;
            return bot.send(sender.id, out);

          case 55:
            return _context.abrupt("break", 225);

          case 56:
            _context.next = 58;
            return bot.startTyping(sender.id);

          case 58:
            _context.next = 60;
            return _facebookMessengerBot.Bot.wait(500);

          case 60:
            _context.next = 62;
            return (0, _botController.showAddress)(pageID, sender.id, data);

          case 62:
            out = _context.sent;
            _context.next = 65;
            return bot.stopTyping(sender.id);

          case 65:
            _context.next = 67;
            return bot.send(sender.id, out);

          case 67:
            return _context.abrupt("break", 225);

          case 68:
            _context.next = 70;
            return bot.startTyping(sender.id);

          case 70:
            _context.next = 72;
            return _facebookMessengerBot.Bot.wait(500);

          case 72:
            _context.next = 74;
            return (0, _botController.showOrderOrAskForPhone)(pageID, sender.id);

          case 74:
            out = _context.sent;
            _context.next = 77;
            return bot.stopTyping(sender.id);

          case 77:
            _context.next = 79;
            return bot.send(sender.id, out);

          case 79:
            return _context.abrupt("break", 225);

          case 80:
            _context.next = 82;
            return bot.startTyping(sender.id);

          case 82:
            _context.next = 84;
            return _facebookMessengerBot.Bot.wait(500);

          case 84:
            _context.next = 86;
            return (0, _botController.askToTypePhone)(pageID, sender.id);

          case 86:
            out = _context.sent;
            _context.next = 89;
            return bot.stopTyping(sender.id);

          case 89:
            _context.next = 91;
            return bot.send(sender.id, out);

          case 91:
            return _context.abrupt("break", 225);

          case 92:
            _context.next = 94;
            return bot.startTyping(sender.id);

          case 94:
            _context.next = 96;
            return _facebookMessengerBot.Bot.wait(500);

          case 96:
            _context.next = 98;
            return (0, _botController.askForLocation)();

          case 98:
            out = _context.sent;
            _context.next = 101;
            return bot.stopTyping(sender.id);

          case 101:
            _context.next = 103;
            return bot.send(sender.id, out);

          case 103:
            return _context.abrupt("break", 225);

          case 104:
            _context.next = 106;
            return bot.startTyping(sender.id);

          case 106:
            _context.next = 108;
            return _facebookMessengerBot.Bot.wait(500);

          case 108:
            _context.next = 110;
            return (0, _botController.askToTypeAddress)(pageID, sender.id);

          case 110:
            out = _context.sent;
            _context.next = 113;
            return bot.stopTyping(sender.id);

          case 113:
            _context.next = 115;
            return bot.send(sender.id, out);

          case 115:
            return _context.abrupt("break", 225);

          case 116:
            _context.next = 118;
            return bot.startTyping(sender.id);

          case 118:
            _context.next = 120;
            return _facebookMessengerBot.Bot.wait(500);

          case 120:
            _context.next = 122;
            return (0, _botController.askForQuantity)(pageID, sender.id);

          case 122:
            out = _context.sent;
            _context.next = 125;
            return bot.stopTyping(sender.id);

          case 125:
            _context.next = 127;
            return bot.send(sender.id, out);

          case 127:
            return _context.abrupt("break", 225);

          case 128:
            _context.next = 130;
            return bot.startTyping(sender.id);

          case 130:
            _context.next = 132;
            return _facebookMessengerBot.Bot.wait(500);

          case 132:
            _context.next = 134;
            return (0, _botController.askForFlavor)(pageID, sender.id, multiple, split);

          case 134:
            out = _context.sent;
            _context.next = 137;
            return bot.stopTyping(sender.id);

          case 137:
            _context.next = 139;
            return bot.send(sender.id, out);

          case 139:
            return _context.abrupt("break", 225);

          case 140:
            _context.next = 142;
            return bot.startTyping(sender.id);

          case 142:
            _context.next = 144;
            return _facebookMessengerBot.Bot.wait(500);

          case 144:
            _context.next = 146;
            return (0, _botController.showFlavor)(pageID, sender.id, data);

          case 146:
            out = _context.sent;
            _context.next = 149;
            return bot.stopTyping(sender.id);

          case 149:
            _context.next = 151;
            return bot.send(sender.id, out);

          case 151:
            return _context.abrupt("break", 225);

          case 152:
            _context.next = 154;
            return bot.startTyping(sender.id);

          case 154:
            _context.next = 156;
            return _facebookMessengerBot.Bot.wait(500);

          case 156:
            _context.next = 158;
            return (0, _botController.askForWantBeverage)(pageID, sender.id);

          case 158:
            out = _context.sent;
            _context.next = 161;
            return bot.stopTyping(sender.id);

          case 161:
            _context.next = 163;
            return bot.send(sender.id, out);

          case 163:
            return _context.abrupt("break", 225);

          case 164:
            _context.next = 166;
            return bot.startTyping(sender.id);

          case 166:
            _context.next = 168;
            return _facebookMessengerBot.Bot.wait(200);

          case 168:
            _context.next = 170;
            return (0, _botController.showNoBeverage)(pageID, sender.id, data);

          case 170:
            out = _context.sent;
            _context.next = 173;
            return bot.stopTyping(sender.id);

          case 173:
            _context.next = 175;
            return bot.send(sender.id, out);

          case 175:
            return _context.abrupt("break", 225);

          case 176:
            _context.next = 178;
            return bot.startTyping(sender.id);

          case 178:
            _context.next = 180;
            return _facebookMessengerBot.Bot.wait(500);

          case 180:
            _context.next = 182;
            return (0, _botController.askForBeverages)(pageID, sender.id, multiple);

          case 182:
            out = _context.sent;
            _context.next = 185;
            return bot.stopTyping(sender.id);

          case 185:
            _context.next = 187;
            return bot.send(sender.id, out);

          case 187:
            return _context.abrupt("break", 225);

          case 188:
            _context.next = 190;
            return bot.startTyping(sender.id);

          case 190:
            _context.next = 192;
            return _facebookMessengerBot.Bot.wait(500);

          case 192:
            _context.next = 194;
            return (0, _botController.showBeverage)(pageID, sender.id, data);

          case 194:
            out = _context.sent;
            _context.next = 197;
            return bot.stopTyping(sender.id);

          case 197:
            _context.next = 199;
            return bot.send(sender.id, out);

          case 199:
            return _context.abrupt("break", 225);

          case 200:
            _context.next = 202;
            return bot.startTyping(sender.id);

          case 202:
            _context.next = 204;
            return _facebookMessengerBot.Bot.wait(500);

          case 204:
            _context.next = 206;
            return (0, _botController.showFullOrder)(pageID, sender.id);

          case 206:
            out = _context.sent;
            _context.next = 209;
            return bot.stopTyping(sender.id);

          case 209:
            _context.next = 211;
            return bot.send(sender.id, out);

          case 211:
            return _context.abrupt("break", 225);

          case 212:
            _context.next = 214;
            return bot.startTyping(sender.id);

          case 214:
            _context.next = 216;
            return _facebookMessengerBot.Bot.wait(500);

          case 216:
            _context.next = 218;
            return (0, _botController.confirmOrder)(pageID, sender.id);

          case 218:
            out = _context.sent;
            _context.next = 221;
            return bot.stopTyping(sender.id);

          case 221:
            _context.next = 223;
            return bot.send(sender.id, out);

          case 223:
            return _context.abrupt("break", 225);

          case 224:
            return _context.abrupt("break", 225);

          case 225:
            _context.next = 231;
            break;

          case 227:
            _context.prev = 227;
            _context.t1 = _context["catch"](1);
            console.error(action, _context.t1);
            throw _context.t1;

          case 231:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 227]]);
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