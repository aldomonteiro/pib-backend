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
            _context.next = _context.t0 === 'BASIC_REPLY' ? 6 : _context.t0 === 'SEND_WELCOME' ? 18 : _context.t0 === 'SEND_MAIN_MENU' ? 30 : _context.t0 === 'SEND_CARDAPIO' ? 42 : _context.t0 === 'ASK_FOR_ORDER' ? 54 : _context.t0 === 'ASK_FOR_PHONE' ? 66 : _context.t0 === 'SHOW_PHONE' ? 78 : _context.t0 === 'SHOW_ADDRESS' ? 91 : _context.t0 === 'SHOW_ORDER_OR_ASK_FOR_PHONE' ? 103 : _context.t0 === 'ASK_TO_TYPE_PHONE' ? 115 : _context.t0 === 'ASK_FOR_LOCATION' ? 127 : _context.t0 === 'ASK_TO_TYPE_ADDRESS' ? 139 : _context.t0 === 'ASK_FOR_QUANTITY' ? 151 : _context.t0 === 'ASK_FOR_FLAVOR' ? 163 : _context.t0 === 'SHOW_FLAVOR' ? 175 : _context.t0 === 'ASK_FOR_WANT_BEVERAGE' ? 187 : _context.t0 === 'SHOW_NO_BEVERAGE' ? 199 : _context.t0 === 'ASK_FOR_BEVERAGE_OPTIONS' ? 211 : _context.t0 === 'SHOW_BEVERAGE' ? 223 : _context.t0 === 'SHOW_FULL_ORDER' ? 235 : _context.t0 === 'CONFIRM_ORDER' ? 247 : 259;
            break;

          case 6:
            _context.next = 8;
            return bot.startTyping(sender.id);

          case 8:
            _context.next = 10;
            return _facebookMessengerBot.Bot.wait(500);

          case 10:
            _context.next = 12;
            return (0, _botController.basicReply)(data);

          case 12:
            out = _context.sent;
            _context.next = 15;
            return bot.stopTyping(sender.id);

          case 15:
            _context.next = 17;
            return bot.send(sender.id, out);

          case 17:
            return _context.abrupt("break", 260);

          case 18:
            _context.next = 20;
            return bot.startTyping(sender.id);

          case 20:
            _context.next = 22;
            return _facebookMessengerBot.Bot.wait(500);

          case 22:
            _context.next = 24;
            return (0, _botController.sendWelcomeMessage)(pageID, sender);

          case 24:
            out = _context.sent;
            _context.next = 27;
            return bot.stopTyping(sender.id);

          case 27:
            _context.next = 29;
            return bot.send(sender.id, out);

          case 29:
            return _context.abrupt("break", 260);

          case 30:
            _context.next = 32;
            return bot.startTyping(sender.id);

          case 32:
            _context.next = 34;
            return _facebookMessengerBot.Bot.wait(500);

          case 34:
            _context.next = 36;
            return (0, _botController.sendMainMenu)();

          case 36:
            out = _context.sent;
            _context.next = 39;
            return bot.stopTyping(sender.id);

          case 39:
            _context.next = 41;
            return bot.send(sender.id, out);

          case 41:
            return _context.abrupt("break", 260);

          case 42:
            _context.next = 44;
            return bot.startTyping(sender.id);

          case 44:
            _context.next = 46;
            return _facebookMessengerBot.Bot.wait(500);

          case 46:
            _context.next = 48;
            return (0, _botController.sendCardapio)(pageID);

          case 48:
            out = _context.sent;
            _context.next = 51;
            return bot.stopTyping(sender.id);

          case 51:
            _context.next = 53;
            return bot.send(sender.id, out);

          case 53:
            return _context.abrupt("break", 260);

          case 54:
            _context.next = 56;
            return bot.startTyping(sender.id);

          case 56:
            _context.next = 58;
            return _facebookMessengerBot.Bot.wait(500);

          case 58:
            _context.next = 60;
            return (0, _botController.askForWantOrder)(pageID, sender.id);

          case 60:
            out = _context.sent;
            _context.next = 63;
            return bot.stopTyping(sender.id);

          case 63:
            _context.next = 65;
            return bot.send(sender.id, out);

          case 65:
            return _context.abrupt("break", 260);

          case 66:
            _context.next = 68;
            return bot.startTyping(sender.id);

          case 68:
            _context.next = 70;
            return _facebookMessengerBot.Bot.wait(800);

          case 70:
            _context.next = 72;
            return (0, _botController.askForPhone)(pageID, sender.id);

          case 72:
            out = _context.sent;
            _context.next = 75;
            return bot.stopTyping(sender.id);

          case 75:
            _context.next = 77;
            return bot.send(sender.id, out);

          case 77:
            return _context.abrupt("break", 260);

          case 78:
            _context.next = 80;
            return bot.startTyping(sender.id);

          case 80:
            _context.next = 82;
            return _facebookMessengerBot.Bot.wait(500);

          case 82:
            phone = typeof data === 'undefined' ? payload : data;
            _context.next = 85;
            return (0, _botController.showPhone)(pageID, sender.id, phone);

          case 85:
            out = _context.sent;
            _context.next = 88;
            return bot.stopTyping(sender.id);

          case 88:
            _context.next = 90;
            return bot.send(sender.id, out);

          case 90:
            return _context.abrupt("break", 260);

          case 91:
            _context.next = 93;
            return bot.startTyping(sender.id);

          case 93:
            _context.next = 95;
            return _facebookMessengerBot.Bot.wait(500);

          case 95:
            _context.next = 97;
            return (0, _botController.showAddress)(pageID, sender.id, data);

          case 97:
            out = _context.sent;
            _context.next = 100;
            return bot.stopTyping(sender.id);

          case 100:
            _context.next = 102;
            return bot.send(sender.id, out);

          case 102:
            return _context.abrupt("break", 260);

          case 103:
            _context.next = 105;
            return bot.startTyping(sender.id);

          case 105:
            _context.next = 107;
            return _facebookMessengerBot.Bot.wait(500);

          case 107:
            _context.next = 109;
            return (0, _botController.showOrderOrAskForPhone)(pageID, sender.id);

          case 109:
            out = _context.sent;
            _context.next = 112;
            return bot.stopTyping(sender.id);

          case 112:
            _context.next = 114;
            return bot.send(sender.id, out);

          case 114:
            return _context.abrupt("break", 260);

          case 115:
            _context.next = 117;
            return bot.startTyping(sender.id);

          case 117:
            _context.next = 119;
            return _facebookMessengerBot.Bot.wait(500);

          case 119:
            _context.next = 121;
            return (0, _botController.askToTypePhone)(pageID, sender.id);

          case 121:
            out = _context.sent;
            _context.next = 124;
            return bot.stopTyping(sender.id);

          case 124:
            _context.next = 126;
            return bot.send(sender.id, out);

          case 126:
            return _context.abrupt("break", 260);

          case 127:
            _context.next = 129;
            return bot.startTyping(sender.id);

          case 129:
            _context.next = 131;
            return _facebookMessengerBot.Bot.wait(500);

          case 131:
            _context.next = 133;
            return (0, _botController.askForLocation)();

          case 133:
            out = _context.sent;
            _context.next = 136;
            return bot.stopTyping(sender.id);

          case 136:
            _context.next = 138;
            return bot.send(sender.id, out);

          case 138:
            return _context.abrupt("break", 260);

          case 139:
            _context.next = 141;
            return bot.startTyping(sender.id);

          case 141:
            _context.next = 143;
            return _facebookMessengerBot.Bot.wait(500);

          case 143:
            _context.next = 145;
            return (0, _botController.askToTypeAddress)(pageID, sender.id);

          case 145:
            out = _context.sent;
            _context.next = 148;
            return bot.stopTyping(sender.id);

          case 148:
            _context.next = 150;
            return bot.send(sender.id, out);

          case 150:
            return _context.abrupt("break", 260);

          case 151:
            _context.next = 153;
            return bot.startTyping(sender.id);

          case 153:
            _context.next = 155;
            return _facebookMessengerBot.Bot.wait(500);

          case 155:
            _context.next = 157;
            return (0, _botController.askForQuantity)(pageID, sender.id);

          case 157:
            out = _context.sent;
            _context.next = 160;
            return bot.stopTyping(sender.id);

          case 160:
            _context.next = 162;
            return bot.send(sender.id, out);

          case 162:
            return _context.abrupt("break", 260);

          case 163:
            _context.next = 165;
            return bot.startTyping(sender.id);

          case 165:
            _context.next = 167;
            return _facebookMessengerBot.Bot.wait(500);

          case 167:
            _context.next = 169;
            return (0, _botController.askForFlavor)(pageID, sender.id, multiple, split);

          case 169:
            out = _context.sent;
            _context.next = 172;
            return bot.stopTyping(sender.id);

          case 172:
            _context.next = 174;
            return bot.send(sender.id, out);

          case 174:
            return _context.abrupt("break", 260);

          case 175:
            _context.next = 177;
            return bot.startTyping(sender.id);

          case 177:
            _context.next = 179;
            return _facebookMessengerBot.Bot.wait(500);

          case 179:
            _context.next = 181;
            return (0, _botController.showFlavor)(pageID, sender.id, data);

          case 181:
            out = _context.sent;
            _context.next = 184;
            return bot.stopTyping(sender.id);

          case 184:
            _context.next = 186;
            return bot.send(sender.id, out);

          case 186:
            return _context.abrupt("break", 260);

          case 187:
            _context.next = 189;
            return bot.startTyping(sender.id);

          case 189:
            _context.next = 191;
            return _facebookMessengerBot.Bot.wait(500);

          case 191:
            _context.next = 193;
            return (0, _botController.askForWantBeverage)(pageID, sender.id);

          case 193:
            out = _context.sent;
            _context.next = 196;
            return bot.stopTyping(sender.id);

          case 196:
            _context.next = 198;
            return bot.send(sender.id, out);

          case 198:
            return _context.abrupt("break", 260);

          case 199:
            _context.next = 201;
            return bot.startTyping(sender.id);

          case 201:
            _context.next = 203;
            return _facebookMessengerBot.Bot.wait(200);

          case 203:
            _context.next = 205;
            return (0, _botController.showNoBeverage)(pageID, sender.id, data);

          case 205:
            out = _context.sent;
            _context.next = 208;
            return bot.stopTyping(sender.id);

          case 208:
            _context.next = 210;
            return bot.send(sender.id, out);

          case 210:
            return _context.abrupt("break", 260);

          case 211:
            _context.next = 213;
            return bot.startTyping(sender.id);

          case 213:
            _context.next = 215;
            return _facebookMessengerBot.Bot.wait(500);

          case 215:
            _context.next = 217;
            return (0, _botController.askForBeverages)(pageID, sender.id, multiple);

          case 217:
            out = _context.sent;
            _context.next = 220;
            return bot.stopTyping(sender.id);

          case 220:
            _context.next = 222;
            return bot.send(sender.id, out);

          case 222:
            return _context.abrupt("break", 260);

          case 223:
            _context.next = 225;
            return bot.startTyping(sender.id);

          case 225:
            _context.next = 227;
            return _facebookMessengerBot.Bot.wait(500);

          case 227:
            _context.next = 229;
            return (0, _botController.showBeverage)(pageID, sender.id, data);

          case 229:
            out = _context.sent;
            _context.next = 232;
            return bot.stopTyping(sender.id);

          case 232:
            _context.next = 234;
            return bot.send(sender.id, out);

          case 234:
            return _context.abrupt("break", 260);

          case 235:
            _context.next = 237;
            return bot.startTyping(sender.id);

          case 237:
            _context.next = 239;
            return _facebookMessengerBot.Bot.wait(500);

          case 239:
            _context.next = 241;
            return (0, _botController.showFullOrder)(pageID, sender.id);

          case 241:
            out = _context.sent;
            _context.next = 244;
            return bot.stopTyping(sender.id);

          case 244:
            _context.next = 246;
            return bot.send(sender.id, out);

          case 246:
            return _context.abrupt("break", 260);

          case 247:
            _context.next = 249;
            return bot.startTyping(sender.id);

          case 249:
            _context.next = 251;
            return _facebookMessengerBot.Bot.wait(500);

          case 251:
            _context.next = 253;
            return (0, _botController.confirmOrder)(pageID, sender.id);

          case 253:
            out = _context.sent;
            _context.next = 256;
            return bot.stopTyping(sender.id);

          case 256:
            _context.next = 258;
            return bot.send(sender.id, out);

          case 258:
            return _context.abrupt("break", 260);

          case 259:
            return _context.abrupt("break", 260);

          case 260:
            _context.next = 266;
            break;

          case 262:
            _context.prev = 262;
            _context.t1 = _context["catch"](1);
            console.error(action, _context.t1);
            throw _context.t1;

          case 266:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 262]]);
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
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 21:
            flavor.toppingsNames = _context2.sent;
            flavorsWithPrice.push(flavor);

          case 23:
            _context2.next = 29;
            break;

          case 25:
            _context2.next = 27;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

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