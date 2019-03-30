"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.askForSizeCat = exports.showCategoryAskForSize = exports.showCategory = exports.askForCategory = exports.showAddressAskForCategory = exports.showDeliverAskForCategory = exports.cancelPendingOrder = exports.sendRejectionNotification = exports.sendShippingNotification = exports.updateItemAskOptions = exports.cancelItem = exports.showCommentsItem = exports.changeItem = exports.showNoBeverageAskForPaymentType = exports.showBeverageAskForPaymentType = exports.showBeverage = exports.showNoBeverage = exports.askForBeverages = exports.askForWantBeverage = exports.askForSpecificItem = exports.askForOptionsToChange = exports.askForChangeOrder = exports.confirmOrder = exports.showFullOrderConfirmOrder = exports.showPaymentTypeAskForComments = exports.showFullOrder = exports.showComments = exports.askToTypeComments = exports.showPaymentChangeAskForComments = exports.askForComments = exports.showPaymentChange = exports.showPaymentTypeAskForPaymentChange = exports.askForPaymentChange = exports.showPaymentType = exports.askForPaymentType = exports.showFlavorCheckItem = exports.showPartialOrder = exports.cancelPendingShowPartialOrder = exports.showOrderOrNextItem = exports.showFlavor = exports.askForFlavor = exports.showSplitCheckFlavor = exports.askForFlavorOrConfirm = exports.showSplit = exports.showSizeCheckSplit = exports.checkSplit = exports.showSize = exports.showQuantityAskForSize = exports.askForSize = exports.showQuantity = exports.askForQuantityMore = exports.askForQuantity = exports.showAddressAskForQuantity = exports.showDeliverAskForQuantity = exports.showPhone = exports.confirmTypedPhone = exports.askToTypePhone = exports.askForPhone = exports.showOrderOrAskForPhone = exports.showAddress = exports.confirmAddress = exports.askToTypeAddress = exports.confirmAddressOrAskLocation = exports.confirmLocationAddress = exports.askForLocation = exports.showDeliverCheckAddress = exports.showDeliver = exports.askForDeliver = exports.askForWantOrder = exports.getFlavorsAndToppings = exports.sendCardapio = exports.sendHorario = exports.sendMainMenu = exports.sendWelcomeMessage = exports.passThreadControl = exports.optionsStopOrder = exports.checkLastAction = exports.askForContinue = exports.basicReply = exports.sendErrorMsg = void 0;

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _facebookMessengerBot = require("facebook-messenger-bot");

var _pagesController = require("../controllers/pagesController");

var _pricingsController = require("../controllers/pricingsController");

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _show_cardapio = require("./show_cardapio");

var _sizesController = require("../controllers/sizesController");

var _beveragesController = require("../controllers/beveragesController");

var _storesController = require("../controllers/storesController");

var _ordersController = require("../controllers/ordersController");

var _customersController = require("../controllers/customersController");

var _itemsController = require("../controllers/itemsController");

var _util2 = require("../util/util");

var _categoriesController = require("../controllers/categoriesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// TODO: create a debugger with json format
var log_file = _fs.default.createWriteStream(__dirname + '/debug.log', {
  flags: 'w'
});

var log_stdout = process.stdout;

console.log = function (d) {
  //
  log_file.write(_util.default.format(d) + '\n');
  log_stdout.write(_util.default.format(d) + '\n');
};

var MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico: '; // // create a custom timestamp format for log statements
// const SimpleNodeLogger = require('simple-node-logger'),
//     opts = {
//         logFilePath: 'logs/bot.log',
//         timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
//     },
//     log = SimpleNodeLogger.createSimpleLogger(opts);

var sendErrorMsg =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_errorMsg) {
    var out, _showErrorMsg;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _showErrorMsg = _errorMsg || 'ERRO DESCONHECIDO';
            out.add({
              text: MSG_GENERAL_ERROR + _showErrorMsg
            });
            return _context.abrupt("return", out);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendErrorMsg(_x) {
    return _ref.apply(this, arguments);
  };
}(); // export const updateOrderFlow = async (pageID, userID) => {
// }


exports.sendErrorMsg = sendErrorMsg;

var basicReply =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(replyText) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!replyText) {
              replyText = 'Hi, how are you doing?';
            }

            return _context2.abrupt("return", {
              type: 'text',
              text: replyText
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function basicReply(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Send Yes or No to the user asking if he wants to place an order right now.
 * @param {*} pageId
 * @param {*} userId
 */


exports.basicReply = basicReply;

var askForContinue =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", {
              type: 'replies',
              text: 'Não entendi o que você quis dizer. 😞.\n Vamos continuar com o pedido?',
              options: [{
                text: 'Sim',
                data: 'continueorder_yes',
                event: 'ORDER_CONTINUE_ORDER'
              }, {
                text: 'Não',
                data: 'continueorder_no',
                event: 'ORDER_CONTINUE_ORDER'
              }]
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function askForContinue() {
    return _ref3.apply(this, arguments);
  };
}();

exports.askForContinue = askForContinue;

var checkLastAction =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageId, userId) {
    var pendingOrder, wf, wfd, addrData, location;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId
            });

          case 2:
            pendingOrder = _context4.sent;

            if (!pendingOrder.order) {
              _context4.next = 121;
              break;
            }

            wf = pendingOrder.order.waitingFor;
            wfd = pendingOrder.order.waitingForData;

            if (!(wf === 'confirm_address')) {
              _context4.next = 15;
              break;
            }

            _context4.next = 9;
            return (0, _customersController.getCustomerAddress)(pageId, userId);

          case 9:
            addrData = _context4.sent;
            _context4.next = 12;
            return confirmAddress(pageId, userId, addrData);

          case 12:
            return _context4.abrupt("return", _context4.sent);

          case 15:
            if (!(wf === 'location')) {
              _context4.next = 21;
              break;
            }

            _context4.next = 18;
            return askForLocation(pageId, userId);

          case 18:
            return _context4.abrupt("return", _context4.sent);

          case 21:
            if (!(wf === 'location_address')) {
              _context4.next = 28;
              break;
            }

            location = {
              lat: pendingOrder.order.location_lat,
              long: pendingOrder.order.location_long,
              url: pendingOrder.order.location_url
            };
            _context4.next = 25;
            return confirmLocationAddress(pageId, userId, location);

          case 25:
            return _context4.abrupt("return", _context4.sent);

          case 28:
            if (!(wf === 'size')) {
              _context4.next = 34;
              break;
            }

            _context4.next = 31;
            return askForSizeCat(pageId, userId);

          case 31:
            return _context4.abrupt("return", _context4.sent);

          case 34:
            if (!(wf === 'deliver')) {
              _context4.next = 40;
              break;
            }

            _context4.next = 37;
            return askForDeliver(pageId, userId);

          case 37:
            return _context4.abrupt("return", _context4.sent);

          case 40:
            if (!(wf === 'category')) {
              _context4.next = 46;
              break;
            }

            _context4.next = 43;
            return askForCategory(pageId, userId, wfd);

          case 43:
            return _context4.abrupt("return", _context4.sent);

          case 46:
            if (!(wf === 'quantity')) {
              _context4.next = 52;
              break;
            }

            _context4.next = 49;
            return askForQuantity(pageId, userId);

          case 49:
            return _context4.abrupt("return", _context4.sent);

          case 52:
            if (!(wf === 'split')) {
              _context4.next = 56;
              break;
            }

            return _context4.abrupt("return", checkSplit(pageId, userId, 1));

          case 56:
            if (!(wf === 'flavor')) {
              _context4.next = 62;
              break;
            }

            _context4.next = 59;
            return askForFlavor(pageId, userId, 1);

          case 59:
            return _context4.abrupt("return", _context4.sent);

          case 62:
            if (!(wf === 'change_order')) {
              _context4.next = 68;
              break;
            }

            _context4.next = 65;
            return askForChangeOrder(pageId, userId);

          case 65:
            return _context4.abrupt("return", _context4.sent);

          case 68:
            if (!(wf === 'partial_confirmation')) {
              _context4.next = 74;
              break;
            }

            _context4.next = 71;
            return showPartialOrder(pageId, userId);

          case 71:
            return _context4.abrupt("return", _context4.sent);

          case 74:
            if (!(wf === 'want_beverage')) {
              _context4.next = 80;
              break;
            }

            _context4.next = 77;
            return askForWantBeverage(pageId, userId);

          case 77:
            return _context4.abrupt("return", _context4.sent);

          case 80:
            if (!(wf === 'beverage')) {
              _context4.next = 86;
              break;
            }

            _context4.next = 83;
            return askForBeverages(pageId, userId, 1);

          case 83:
            return _context4.abrupt("return", _context4.sent);

          case 86:
            if (!(wf === 'payment_type')) {
              _context4.next = 92;
              break;
            }

            _context4.next = 89;
            return askForPaymentType(pageId, userId);

          case 89:
            return _context4.abrupt("return", _context4.sent);

          case 92:
            if (!(wf === 'payment_change')) {
              _context4.next = 98;
              break;
            }

            _context4.next = 95;
            return askForPaymentChange(pageId, userId);

          case 95:
            return _context4.abrupt("return", _context4.sent);

          case 98:
            if (!(wf === 'comments')) {
              _context4.next = 104;
              break;
            }

            _context4.next = 101;
            return askForComments(pageId, userId);

          case 101:
            return _context4.abrupt("return", _context4.sent);

          case 104:
            if (!(wf === 'full_confirmation')) {
              _context4.next = 110;
              break;
            }

            _context4.next = 107;
            return showFullOrder(pageId, userId);

          case 107:
            return _context4.abrupt("return", _context4.sent);

          case 110:
            if (!(wf === 'nothing')) {
              _context4.next = 116;
              break;
            }

            _context4.next = 113;
            return showOrderOrNextItem(pageId, userId);

          case 113:
            return _context4.abrupt("return", _context4.sent);

          case 116:
            _context4.next = 118;
            return sendMainMenu();

          case 118:
            return _context4.abrupt("return", _context4.sent);

          case 119:
            _context4.next = 124;
            break;

          case 121:
            _context4.next = 123;
            return sendMainMenu();

          case 123:
            return _context4.abrupt("return", _context4.sent);

          case 124:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function checkLastAction(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.checkLastAction = checkLastAction;

var optionsStopOrder =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", {
              type: 'replies',
              text: 'Muito bem, aqui estão as opções:',
              options: [{
                text: 'Voltar p/ Início',
                data: 'stoporder_init',
                event: 'STOP_ORDER_OPTIONS'
              }, {
                text: 'Falar c/ Atendente',
                data: 'stoporder_human',
                event: 'STOP_ORDER_OPTIONS'
              }]
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function optionsStopOrder() {
    return _ref5.apply(this, arguments);
  };
}();

exports.optionsStopOrder = optionsStopOrder;

var passThreadControl =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageId, userId, source) {
    var _txt, result;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _txt = 'Ok, a partir de agora você está nas mãos do nosso atendente.';
            _txt += ' O que você escrever a partir de agora será respondido por uma pessoa,';
            _txt += 'o mais rápido possível!';

            if (!(source && source === 'whatsapp')) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", {
              type: 'text',
              text: _txt,
              hidden: 'stoporder_human'
            });

          case 7:
            _context6.next = 9;
            return (0, _pagesController.sendPassThreadControl)(pageId, userId);

          case 9:
            result = _context6.sent;

            if (result !== 200) {
              _txt = 'Ops, tivemos um probleminha. Tente novamente';
            }

            return _context6.abrupt("return", {
              type: 'text',
              text: _txt
            });

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function passThreadControl(_x5, _x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 *
 * @param {*} sender
 * @param {*} pageID
 */


exports.passThreadControl = passThreadControl;

var sendWelcomeMessage =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageID, sender) {
    var _nameToReplace, page, replyMsg;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.info('sendWelcomeMessage', _typeof(sender));
            _nameToReplace = '';

            if (!(sender && typeof sender !== 'string')) {
              _context7.next = 8;
              break;
            }

            _context7.next = 5;
            return sender.fetch('first_name');

          case 5:
            _nameToReplace = sender.first_name;
            _context7.next = 9;
            break;

          case 8:
            if (sender && typeof sender === 'string') _nameToReplace = sender;

          case 9:
            _context7.next = 11;
            return (0, _pagesController.getOnePageData)(pageID);

          case 11:
            page = _context7.sent;
            replyMsg = page.firstResponseText.replace('$NAME', _nameToReplace);
            return _context7.abrupt("return", {
              type: 'text',
              text: replyMsg
            });

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function sendWelcomeMessage(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();

exports.sendWelcomeMessage = sendWelcomeMessage;

var sendMainMenu =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", {
              type: 'buttons',
              text: 'Por favor escolha uma das opções',
              options: [{
                text: '🍕 Cardápio',
                data: 'CARDAPIO_PAYLOAD',
                event: 'MAIN-MENU'
              }, {
                text: '🕒 Horários',
                data: 'HORARIO_PAYLOAD',
                event: 'MAIN-MENU'
              }, {
                text: '📨 Fazer Pedido',
                data: 'PEDIDO_PAYLOAD',
                event: 'MAIN-MENU'
              }, {
                text: '🗣 Falar c/ Atendente',
                data: 'stoporder_human',
                event: 'MAIN-MENU'
              }]
            });

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function sendMainMenu() {
    return _ref8.apply(this, arguments);
  };
}();

exports.sendMainMenu = sendMainMenu;

var sendHorario =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(pageID, source) {
    var _ref10, todayIsOpen, todayOpenAt, todayCloseAt, replyMsg, reply;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _storesController.getTodayOpeningTime)(pageID);

          case 2:
            _ref10 = _context9.sent;
            todayIsOpen = _ref10.todayIsOpen;
            todayOpenAt = _ref10.todayOpenAt;
            todayCloseAt = _ref10.todayCloseAt;
            replyMsg = '';

            if (todayIsOpen === true) {
              replyMsg = 'Estamos abertos hoje, a partir das ' + todayOpenAt + ' horas, até às ' + todayCloseAt + ' horas.';
            } else {
              replyMsg = 'Infelizmente hoje não estamos abertos, mas você pode consultar nosso cardápio no menu principal.';
            }

            if (!(source && source === 'whatsapp')) {
              _context9.next = 16;
              break;
            }

            _context9.next = 11;
            return sendMainMenu();

          case 11:
            reply = _context9.sent;
            reply.text = replyMsg + '\n\n' + reply.text;
            return _context9.abrupt("return", reply);

          case 16:
            return _context9.abrupt("return", {
              type: 'text',
              text: replyMsg
            });

          case 17:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function sendHorario(_x10, _x11) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Returns only the formatted text to be sent to the user
 * @param {*} pageID
 */


exports.sendHorario = sendHorario;

var sendCardapio =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageID, data, source) {
    var replyMsg, reply;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return (0, _show_cardapio.getCardapio)(pageID, data.id);

          case 2:
            replyMsg = _context10.sent;

            if (!(source && source === 'whatsapp')) {
              _context10.next = 11;
              break;
            }

            _context10.next = 6;
            return sendMainMenu();

          case 6:
            reply = _context10.sent;
            reply.text = replyMsg + '\n\n' + reply.text;
            return _context10.abrupt("return", reply);

          case 11:
            return _context10.abrupt("return", {
              type: 'text',
              text: replyMsg
            });

          case 12:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function sendCardapio(_x12, _x13, _x14) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID
 * @param {*} sizeID
 */


exports.sendCardapio = sendCardapio;

var getFlavorsAndToppings =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(pageID, categoryID, sizeID) {
    var flavorArray, allToppings, pricings, flavorsWithPrice, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, price, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, tId, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, topping;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context11.sent;
            _context11.next = 6;
            return (0, _toppingsController.getToppingsFull)(pageID);

          case 6:
            allToppings = _context11.sent;
            _context11.next = 9;
            return (0, _pricingsController.getPricings)(pageID);

          case 9:
            pricings = _context11.sent;
            flavorsWithPrice = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context11.prev = 14;
            _iterator = flavorArray[Symbol.iterator]();

          case 16:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context11.next = 96;
              break;
            }

            flavor = _step.value;

            if (!(categoryID && flavor.categoryId === categoryID)) {
              _context11.next = 93;
              break;
            }

            if (!sizeID) {
              _context11.next = 47;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context11.prev = 23;
            _iterator2 = pricings[Symbol.iterator]();

          case 25:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context11.next = 33;
              break;
            }

            price = _step2.value;

            if (!(price.categoryId === flavor.categoryId && price.sizeId === sizeID)) {
              _context11.next = 30;
              break;
            }

            flavor.price = price.price;
            return _context11.abrupt("break", 33);

          case 30:
            _iteratorNormalCompletion2 = true;
            _context11.next = 25;
            break;

          case 33:
            _context11.next = 39;
            break;

          case 35:
            _context11.prev = 35;
            _context11.t0 = _context11["catch"](23);
            _didIteratorError2 = true;
            _iteratorError2 = _context11.t0;

          case 39:
            _context11.prev = 39;
            _context11.prev = 40;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 42:
            _context11.prev = 42;

            if (!_didIteratorError2) {
              _context11.next = 45;
              break;
            }

            throw _iteratorError2;

          case 45:
            return _context11.finish(42);

          case 46:
            return _context11.finish(39);

          case 47:
            if (!flavor.price) {
              _context11.next = 93;
              break;
            }

            flavor.toppingsNames = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context11.prev = 52;
            _iterator3 = flavor.toppings[Symbol.iterator]();

          case 54:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context11.next = 78;
              break;
            }

            tId = _step3.value;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context11.prev = 59;

            for (_iterator4 = allToppings[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              topping = _step4.value;

              if (topping.id === tId) {
                flavor.toppingsNames.push(topping.topping);
              }
            }

            _context11.next = 67;
            break;

          case 63:
            _context11.prev = 63;
            _context11.t1 = _context11["catch"](59);
            _didIteratorError4 = true;
            _iteratorError4 = _context11.t1;

          case 67:
            _context11.prev = 67;
            _context11.prev = 68;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 70:
            _context11.prev = 70;

            if (!_didIteratorError4) {
              _context11.next = 73;
              break;
            }

            throw _iteratorError4;

          case 73:
            return _context11.finish(70);

          case 74:
            return _context11.finish(67);

          case 75:
            _iteratorNormalCompletion3 = true;
            _context11.next = 54;
            break;

          case 78:
            _context11.next = 84;
            break;

          case 80:
            _context11.prev = 80;
            _context11.t2 = _context11["catch"](52);
            _didIteratorError3 = true;
            _iteratorError3 = _context11.t2;

          case 84:
            _context11.prev = 84;
            _context11.prev = 85;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 87:
            _context11.prev = 87;

            if (!_didIteratorError3) {
              _context11.next = 90;
              break;
            }

            throw _iteratorError3;

          case 90:
            return _context11.finish(87);

          case 91:
            return _context11.finish(84);

          case 92:
            flavorsWithPrice.push(flavor);

          case 93:
            _iteratorNormalCompletion = true;
            _context11.next = 16;
            break;

          case 96:
            _context11.next = 102;
            break;

          case 98:
            _context11.prev = 98;
            _context11.t3 = _context11["catch"](14);
            _didIteratorError = true;
            _iteratorError = _context11.t3;

          case 102:
            _context11.prev = 102;
            _context11.prev = 103;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 105:
            _context11.prev = 105;

            if (!_didIteratorError) {
              _context11.next = 108;
              break;
            }

            throw _iteratorError;

          case 108:
            return _context11.finish(105);

          case 109:
            return _context11.finish(102);

          case 110:
            return _context11.abrupt("return", flavorsWithPrice);

          case 113:
            _context11.prev = 113;
            _context11.t4 = _context11["catch"](0);
            console.error({
              flavorsAndToppingsErr: _context11.t4
            });

          case 116:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 113], [14, 98, 102, 110], [23, 35, 39, 47], [40,, 42, 46], [52, 80, 84, 92], [59, 63, 67, 75], [68,, 70, 74], [85,, 87, 91], [103,, 105, 109]]);
  }));

  return function getFlavorsAndToppings(_x15, _x16, _x17) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * Send Yes or No to the user asking if he wants to place an order right now.
 */


exports.getFlavorsAndToppings = getFlavorsAndToppings;

var askForWantOrder =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12() {
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt("return", {
              type: 'replies',
              text: 'Agora que você viu nosso cardápio, você está pronto para fazer o pedido?',
              options: [{
                text: 'Sim',
                data: 'wantorder_yes',
                event: 'ORDER_WANT_ORDER'
              }, {
                text: 'Não',
                data: 'wantorder_no',
                event: 'ORDER_WANT_ORDER'
              }]
            });

          case 1:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function askForWantOrder() {
    return _ref13.apply(this, arguments);
  };
}();

exports.askForWantOrder = askForWantOrder;

var askForDeliver =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(pageId, userId) {
    var storeData, _txt, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, delivFee;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'deliver'
            });

          case 2:
            _context13.next = 4;
            return (0, _storesController.getStoreData)(pageId);

          case 4:
            storeData = _context13.sent;
            _txt = '';

            if (storeData.delivery_time) {
              _txt += "\uD83D\uDC49 Tempo de entrega: \u23F1 *".concat(storeData.delivery_time, "* minutos\n");
            }

            if (!(storeData.delivery_fees && storeData.delivery_fees.length > 0)) {
              _context13.next = 29;
              break;
            }

            _txt += 'Taxa de Entrega: ';
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context13.prev = 12;

            for (_iterator5 = storeData.delivery_fees[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              delivFee = _step5.value;
              _txt += "".concat((0, _util2.formatAsCurrency)(delivFee.fee), " (at\xE9 ").concat(delivFee.to, " km) ");
            }

            _context13.next = 20;
            break;

          case 16:
            _context13.prev = 16;
            _context13.t0 = _context13["catch"](12);
            _didIteratorError5 = true;
            _iteratorError5 = _context13.t0;

          case 20:
            _context13.prev = 20;
            _context13.prev = 21;

            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }

          case 23:
            _context13.prev = 23;

            if (!_didIteratorError5) {
              _context13.next = 26;
              break;
            }

            throw _iteratorError5;

          case 26:
            return _context13.finish(23);

          case 27:
            return _context13.finish(20);

          case 28:
            _txt += '\n';

          case 29:
            if (storeData.pickup_time) {
              _txt += "\uD83D\uDC49 Para retirar aqui: \u23F1 *".concat(storeData.pickup_time, "* minutos\n");
            }

            _txt += 'O pedido é para entregar ou você vem retirar aqui?';
            return _context13.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: [{
                text: 'Entregar',
                data: {
                  type: 'delivery',
                  time: storeData.delivery_time
                },
                event: 'ORDER_DELIVER'
              }, {
                text: 'Retirar',
                data: {
                  type: 'pickup',
                  time: storeData.pickup_time,
                  address: storeData.address
                },
                event: 'ORDER_DELIVER'
              }]
            });

          case 32:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[12, 16, 20, 28], [21,, 23, 27]]);
  }));

  return function askForDeliver(_x18, _x19) {
    return _ref14.apply(this, arguments);
  };
}();

exports.askForDeliver = askForDeliver;

var showDeliver =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(pageId, userId, data, user, source) {
    var _phone, _txtReply;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _phone = null;

            if (source && source === 'whatsapp') {
              _phone = (0, _util2.formatWhatsappNumber)(userId);
            }

            _context14.next = 4;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              deliverType: data.type,
              deliverTime: data.time,
              storeAddress: data.address,
              user: user,
              phone: _phone,
              source: source
            });

          case 4:
            if (data && data.type === 'delivery') _txtReply = 'Entregaremos o seu pedido.';else {
              _txtReply = 'Retirar o pedido conosco.\n';
              if (data.address) _txtReply += '📌 Nosso endereço: ' + data.address;
            }
            return _context14.abrupt("return", {
              type: 'text',
              text: '✅ ' + _txtReply
            });

          case 6:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function showDeliver(_x20, _x21, _x22, _x23, _x24) {
    return _ref15.apply(this, arguments);
  };
}();

exports.showDeliver = showDeliver;

var showDeliverCheckAddress =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(pageId, userId, data, user, source) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return showDeliver(pageId, userId, data, user, source);

          case 2:
            prevAnswer = _context15.sent;
            _context15.next = 5;
            return confirmAddressOrAskLocation(pageId, userId, user, source);

          case 5:
            nextQuestion = _context15.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context15.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function showDeliverCheckAddress(_x25, _x26, _x27, _x28, _x29) {
    return _ref16.apply(this, arguments);
  };
}();
/**
 * Question No.01
 * If the user doesnt have an address in the database, this will be the first question.
 */


exports.showDeliverCheckAddress = showDeliverCheckAddress;

var askForLocation =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(pageId, userId, user, source) {
    var _phone;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _phone = null;

            if (source && source === 'whatsapp') {
              _phone = (0, _util2.formatWhatsappNumber)(userId);
            }

            _context16.next = 4;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              user: user,
              waitingFor: 'location',
              phone: _phone,
              source: source
            });

          case 4:
            if (!(!source || source === 'messenger')) {
              _context16.next = 8;
              break;
            }

            return _context16.abrupt("return", {
              type: 'replies',
              text: 'Para começar, preciso saber aonde você está. Por favor clique no botão abaixo para me mandá-la.',
              options: [{
                text: 'Localização',
                isLocation: true,
                data: 'location_location',
                event: 'LOCATION'
              }]
            });

          case 8:
            if (!(source === 'whatsapp')) {
              _context16.next = 10;
              break;
            }

            return _context16.abrupt("return", {
              type: 'text',
              text: 'Para começar, preciso saber aonde você está. Favor enviar a sua localização.',
              options: [{
                text: 'Localização',
                data: 'location_location',
                event: 'LOCATION'
              }]
            });

          case 10:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function askForLocation(_x30, _x31, _x32, _x33) {
    return _ref17.apply(this, arguments);
  };
}();

exports.askForLocation = askForLocation;

var confirmLocationAddress =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(pageId, userId, location, user) {
    var addresses, foundAnyCompleteAddress, options, i, element, _data, button, addressNumber, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            if (!location) {
              _context17.next = 26;
              break;
            }

            _context17.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              location: location,
              user: user,
              waitingFor: 'location_address'
            });

          case 3:
            _context17.next = 5;
            return (0, _customersController.getAddressLocation)(location);

          case 5:
            addresses = _context17.sent;

            if (!(addresses && addresses.length && addresses.length > 0)) {
              _context17.next = 21;
              break;
            }

            foundAnyCompleteAddress = false;
            options = [];

            for (i = 0; i < 4; i++) {
              element = addresses[i];

              if (element.address_components && element.address_components.length >= 6) {
                foundAnyCompleteAddress = true;
                _data = {
                  formatted_address: element.formatted_address,
                  address_components: element.address_components
                };
                button = {
                  text: 'Esse!',
                  data: _data,
                  event: 'LOCATION_ADDRESS'
                };
                addressNumber = i + 1;
                options.push({
                  text: 'Endereço ' + addressNumber,
                  subtext: element.formatted_address,
                  buttons: button
                });
              }
            }

            if (!foundAnyCompleteAddress) {
              _context17.next = 16;
              break;
            }

            buttonsOpt = {
              data: 'incorrect_address',
              event: 'LOCATION_ADDRESS'
            };
            options.push({
              text: 'Não é meu endereço..',
              subtext: 'Selecione essa opção se seu endereço não aparece',
              buttons: buttonsOpt,
              isOnlyButtons: true
            });
            return _context17.abrupt("return", {
              type: 'list',
              text: 'Encontrei esses endereços, selecione o correto:',
              options: options
            });

          case 16:
            _context17.next = 18;
            return askToTypeAddress(pageId, userId);

          case 18:
            return _context17.abrupt("return", _context17.sent);

          case 19:
            _context17.next = 24;
            break;

          case 21:
            _context17.next = 23;
            return askToTypeAddress(pageId, userId);

          case 23:
            return _context17.abrupt("return", _context17.sent);

          case 24:
            _context17.next = 29;
            break;

          case 26:
            _context17.next = 28;
            return askToTypeAddress(pageId, userId);

          case 28:
            return _context17.abrupt("return", _context17.sent);

          case 29:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function confirmLocationAddress(_x34, _x35, _x36, _x37) {
    return _ref18.apply(this, arguments);
  };
}();

exports.confirmLocationAddress = confirmLocationAddress;

var confirmAddressOrAskLocation =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(pageId, userId, user, source) {
    var addrData;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return (0, _customersController.getCustomerAddress)(pageId, userId);

          case 2:
            addrData = _context18.sent;

            if (!addrData) {
              _context18.next = 7;
              break;
            }

            return _context18.abrupt("return", confirmAddress(pageId, userId, addrData, user, source));

          case 7:
            _context18.next = 9;
            return askForLocation(pageId, userId, user, source);

          case 9:
            return _context18.abrupt("return", _context18.sent);

          case 10:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function confirmAddressOrAskLocation(_x38, _x39, _x40, _x41) {
    return _ref19.apply(this, arguments);
  };
}();

exports.confirmAddressOrAskLocation = confirmAddressOrAskLocation;

var askToTypeAddress =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19(pageID, userID) {
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              waitingForAddress: true,
              waitingFor: 'typed_address'
            });

          case 2:
            return _context19.abrupt("return", {
              type: 'text',
              text: 'Não foi possível localizar um endereço válido. Digite o seu endereço completo por favor.'
            });

          case 3:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function askToTypeAddress(_x42, _x43) {
    return _ref20.apply(this, arguments);
  };
}();

exports.askToTypeAddress = askToTypeAddress;

var confirmAddress =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(pageId, userId, addrData, user, source) {
    var _phone, _replyText;

    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _phone = null;

            if (source && source === 'whatsapp') {
              _phone = (0, _util2.formatWhatsappNumber)(userId);
            }

            if (!user) {
              _context20.next = 7;
              break;
            }

            _context20.next = 5;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              user: user,
              waitingForAddress: false,
              waitingFor: 'confirm_address',
              phone: _phone
            });

          case 5:
            _context20.next = 9;
            break;

          case 7:
            _context20.next = 9;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingForAddress: false,
              waitingFor: 'confirm_address',
              phone: _phone
            });

          case 9:
            _replyText = 'A entrega será para esse endereço?\n';
            _replyText = _replyText + addrData.formattedAddress;
            return _context20.abrupt("return", {
              type: 'replies',
              text: _replyText,
              options: [{
                text: 'Sim',
                data: addrData,
                event: 'CORRECT_SAVED_ADDRESS'
              }, {
                text: 'Não',
                data: addrData,
                event: 'WRONG_SAVED_ADDRESS'
              }]
            });

          case 12:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function confirmAddress(_x44, _x45, _x46, _x47, _x48) {
    return _ref21.apply(this, arguments);
  };
}();

exports.confirmAddress = confirmAddress;

var showAddress =
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(pageId, userId, addrData, source) {
    var _phone, formattedAddrData;

    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _phone = null;

            if (source && source === 'whatsapp') {
              _phone = (0, _util2.formatWhatsappNumber)(userId);
            }

            if (!(addrData && addrData.address_components)) {
              _context21.next = 10;
              break;
            }

            _context21.next = 5;
            return (0, _customersController.formatAddrData)(addrData);

          case 5:
            formattedAddrData = _context21.sent;
            _context21.next = 8;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              addrData: formattedAddrData,
              phone: _phone
            });

          case 8:
            _context21.next = 12;
            break;

          case 10:
            _context21.next = 12;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              addrData: addrData,
              phone: _phone
            });

          case 12:
            return _context21.abrupt("return", {
              type: 'text',
              text: 'Ok, entregaremos nesse endereço.'
            });

          case 13:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function showAddress(_x49, _x50, _x51, _x52) {
    return _ref22.apply(this, arguments);
  };
}();

exports.showAddress = showAddress;

var showOrderOrAskForPhone =
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee22(pageId, userId) {
    var po;
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context22.sent;

            if (!(po.order && po.order.waitingFor === 'partial_confirmation')) {
              _context22.next = 9;
              break;
            }

            _context22.next = 6;
            return showOrderOrNextItem(pageId, userId);

          case 6:
            return _context22.abrupt("return", _context22.sent);

          case 9:
            _context22.next = 11;
            return askForPhone(pageId, userId);

          case 11:
            return _context22.abrupt("return", _context22.sent);

          case 12:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function showOrderOrAskForPhone(_x53, _x54) {
    return _ref23.apply(this, arguments);
  };
}();

exports.showOrderOrAskForPhone = showOrderOrAskForPhone;

var askForPhone =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23(pageId, userId) {
    var _txt, _options;

    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'phone'
            });

          case 2:
            _txt = 'Pode nos enviar o seu telefone para confirmar o seu pedido? Se não aparecer o seu telefone (ou estiver errado), use a opção digitar.';
            _options = [];

            _options.push({
              text: 'Telefone',
              isPhoneNumber: true,
              data: 'phone_number',
              event: 'PHONE_NUMBER'
            });

            _options.push({
              text: 'Digitar o telefone',
              data: 'change_phone',
              event: 'PHONE_CONFIRMED'
            });

            return _context23.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: _options
            });

          case 7:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function askForPhone(_x55, _x56) {
    return _ref24.apply(this, arguments);
  };
}();

exports.askForPhone = askForPhone;

var askToTypePhone =
/*#__PURE__*/
function () {
  var _ref25 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee24(pageId, userId) {
    var out;
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'phone'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Por favor, digite o número do telefone válido para que possamos confirmar o pedido. Pode digitar o 📞:'
            });
            return _context24.abrupt("return", out);

          case 5:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function askToTypePhone(_x57, _x58) {
    return _ref25.apply(this, arguments);
  };
}();

exports.askToTypePhone = askToTypePhone;

var confirmTypedPhone =
/*#__PURE__*/
function () {
  var _ref26 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee25(pageId, userId, phone) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context25.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'phone'
            });

          case 3:
            _txt = 'O telefone ' + phone + ' está coreto?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Sim',
              data: phone,
              event: 'PHONE_CONFIRMED'
            });
            replies.add({
              text: 'Não, usar outro',
              data: 'change_phone',
              event: 'PHONE_CONFIRMED'
            });
            out.setQuickReplies(replies);
            return _context25.abrupt("return", out);

          case 10:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));

  return function confirmTypedPhone(_x59, _x60, _x61) {
    return _ref26.apply(this, arguments);
  };
}();

exports.confirmTypedPhone = confirmTypedPhone;

var showPhone =
/*#__PURE__*/
function () {
  var _ref27 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee26(pageId, userId, phone) {
    var out;
    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              phone: phone,
              waitingFor: 'nothing'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Usaremos o número ' + phone + ' para confirmar o pedido. Agora vou pegar as informações do pedido.'
            });
            return _context26.abrupt("return", out);

          case 5:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function showPhone(_x62, _x63, _x64) {
    return _ref27.apply(this, arguments);
  };
}();

exports.showPhone = showPhone;

var showDeliverAskForQuantity =
/*#__PURE__*/
function () {
  var _ref28 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee27(pageId, userId, data, user, source) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.next = 2;
            return showDeliver(pageId, userId, data, user, source);

          case 2:
            prevAnswer = _context27.sent;
            _context27.next = 5;
            return askForQuantity(pageId, userId);

          case 5:
            nextQuestion = _context27.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context27.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));

  return function showDeliverAskForQuantity(_x65, _x66, _x67, _x68, _x69) {
    return _ref28.apply(this, arguments);
  };
}();
/**
 * Show Address only stores the addres in database. Ignoring the return.
 * The user is gonna see the AskForQuantity.
 * Used on Whatsapp.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} addrData
 */


exports.showDeliverAskForQuantity = showDeliverAskForQuantity;

var showAddressAskForQuantity =
/*#__PURE__*/
function () {
  var _ref29 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee28(pageId, userId, addrData, source) {
    var prevAnswer, nextQuestion, po;
    return regeneratorRuntime.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _context28.next = 2;
            return showAddress(pageId, userId, addrData, source);

          case 2:
            prevAnswer = _context28.sent;
            _context28.next = 5;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 5:
            po = _context28.sent;

            if (!(po && po.order && po.order.backToConfirmation)) {
              _context28.next = 24;
              break;
            }

            if (!(po.order.backToConfirmation === 'full_confirmation')) {
              _context28.next = 13;
              break;
            }

            _context28.next = 10;
            return showFullOrder(pageId, userId);

          case 10:
            nextQuestion = _context28.sent;
            _context28.next = 22;
            break;

          case 13:
            if (!(po.order.backToConfirmation === 'partial_confirmation')) {
              _context28.next = 19;
              break;
            }

            _context28.next = 16;
            return showOrderOrNextItem(pageId, userId);

          case 16:
            nextQuestion = _context28.sent;
            _context28.next = 22;
            break;

          case 19:
            _context28.next = 21;
            return askForQuantity(pageId, userId);

          case 21:
            nextQuestion = _context28.sent;

          case 22:
            _context28.next = 27;
            break;

          case 24:
            _context28.next = 26;
            return askForQuantity(pageId, userId);

          case 26:
            nextQuestion = _context28.sent;

          case 27:
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context28.abrupt("return", nextQuestion);

          case 29:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28);
  }));

  return function showAddressAskForQuantity(_x70, _x71, _x72, _x73) {
    return _ref29.apply(this, arguments);
  };
}();

exports.showAddressAskForQuantity = showAddressAskForQuantity;

var askForQuantity =
/*#__PURE__*/
function () {
  var _ref30 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee29(pageId, userId) {
    return regeneratorRuntime.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'quantity'
            });

          case 2:
            return _context29.abrupt("return", {
              type: 'replies',
              text: 'Quantas pizzas você quer?',
              options: [{
                text: '1',
                whatsText: 'Uma',
                data: 'qty_1',
                event: 'ORDER_QTY'
              }, {
                text: '2',
                whatsText: 'Duas',
                data: 'qty_2',
                event: 'ORDER_QTY'
              }, {
                text: '3',
                whatsText: 'Três',
                data: 'qty_3',
                event: 'ORDER_QTY'
              }, {
                text: '+ de 3',
                data: 'qty_more',
                event: 'ORDER_QTY'
              }]
            });

          case 3:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));

  return function askForQuantity(_x74, _x75) {
    return _ref30.apply(this, arguments);
  };
}();

exports.askForQuantity = askForQuantity;

var askForQuantityMore =
/*#__PURE__*/
function () {
  var _ref31 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee30(pageId, userId) {
    return regeneratorRuntime.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'quantity'
            });

          case 2:
            return _context30.abrupt("return", {
              type: 'replies',
              text: 'Quantas pizzas você quer?',
              options: [{
                text: '- de 4',
                data: 'qty_less',
                event: 'ORDER_QTY'
              }, {
                text: '4',
                whatsText: 'Quatro',
                data: 'qty_4',
                event: 'ORDER_QTY'
              }, {
                text: '5',
                whatsText: 'Cinco',
                data: 'qty_5',
                event: 'ORDER_QTY'
              }, {
                text: '6',
                whatsText: 'Seis',
                data: 'qty_6',
                event: 'ORDER_QTY'
              }]
            });

          case 3:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30);
  }));

  return function askForQuantityMore(_x76, _x77) {
    return _ref31.apply(this, arguments);
  };
}();

exports.askForQuantityMore = askForQuantityMore;

var showQuantity =
/*#__PURE__*/
function () {
  var _ref32 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee31(pageId, userId, data) {
    var qty, out;
    return regeneratorRuntime.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            // data is 'qty_1', 'qty_2', 'qty_3'...
            qty = data.substr(data.length - 1, 1);
            _context31.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              qty: qty,
              waitingFor: 'size',
              undo: 'quantity',
              currentItem: 1
            });

          case 3:
            if (qty == 1) {
              out = {
                type: 'text',
                text: '✅ ' + ' 1 pizza.'
              };
            } else {
              out = {
                type: 'text',
                text: '✅ ' + qty + ' pizzas.'
              };
            } // out.text = out.text + '(digite 0 p/ desfazer)'


            return _context31.abrupt("return", out);

          case 5:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));

  return function showQuantity(_x78, _x79, _x80) {
    return _ref32.apply(this, arguments);
  };
}();

exports.showQuantity = showQuantity;

var askForSize =
/*#__PURE__*/
function () {
  var _ref33 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee32(pageId, userId) {
    var po, _text, _options, sizesWithPricing, sizes, i, _data, out, _out;

    return regeneratorRuntime.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context32.sent;

            if (!po.order) {
              _context32.next = 25;
              break;
            }

            _text = '';

            if (po.order.qty === 1) {
              _text = 'Qual o tamanho da pizza?';
            } else {
              _text = 'Agora vou pegar os detalhes da ' + po.order.currentItem + 'a. pizza.\n';
              _text = _text + 'Qual o tamanho dela?';
            }

            _options = [];
            _context32.next = 9;
            return (0, _pricingsController.getPricingSizing)(pageId);

          case 9:
            sizesWithPricing = _context32.sent;
            _context32.next = 12;
            return (0, _sizesController.getSizes)(pageId, sizesWithPricing);

          case 12:
            sizes = _context32.sent;

            for (i = 0; i < sizes.length; i++) {
              _data = {
                id: sizes[i].id,
                size: sizes[i].size,
                split: sizes[i].split
              };

              _options.push({
                text: sizes[i].size,
                data: _data,
                event: 'ORDER_SIZE'
              });
            }

            out = {
              type: 'replies',
              text: _text,
              options: _options
            };

            if (!(po.order.qty === 1)) {
              _context32.next = 20;
              break;
            }

            _context32.next = 18;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size'
            });

          case 18:
            _context32.next = 22;
            break;

          case 20:
            _context32.next = 22;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size',
              qty_total: po.order.qty_total,
              currentItem: po.order.currentItem,
              eraseSplit: true
            });

          case 22:
            return _context32.abrupt("return", out);

          case 25:
            _out = {
              type: 'text',
              text: MSG_GENERAL_ERROR
            };
            return _context32.abrupt("return", _out);

          case 27:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));

  return function askForSize(_x81, _x82) {
    return _ref33.apply(this, arguments);
  };
}();
/**
 * Calls ShowQuantity and AskForSize
 * Used on Whatsapp.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.askForSize = askForSize;

var showQuantityAskForSize =
/*#__PURE__*/
function () {
  var _ref34 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee33(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return showQuantity(pageId, userId, data);

          case 2:
            prevAnswer = _context33.sent;
            _context33.next = 5;
            return askForSize(pageId, userId);

          case 5:
            nextQuestion = _context33.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context33.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));

  return function showQuantityAskForSize(_x83, _x84, _x85) {
    return _ref34.apply(this, arguments);
  };
}();

exports.showQuantityAskForSize = showQuantityAskForSize;

var showSize =
/*#__PURE__*/
function () {
  var _ref35 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee34(pageId, userId, data) {
    return regeneratorRuntime.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            if (!(data && data.split && data.split > 1)) {
              _context34.next = 5;
              break;
            }

            _context34.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              undo: 'size',
              waitingFor: 'split'
            });

          case 3:
            _context34.next = 7;
            break;

          case 5:
            _context34.next = 7;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              undo: 'size',
              waitingFor: 'flavor'
            });

          case 7:
            return _context34.abrupt("return", {
              type: 'text',
              text: '✅ ' + ' Tamanho: ' + data.size // + ' (digite 0 p/ desfazer)',

            });

          case 8:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34);
  }));

  return function showSize(_x86, _x87, _x88) {
    return _ref35.apply(this, arguments);
  };
}();
/**
 * Triggered by action CHECK_SPLIT
 * @param {*} pageId
 * @param {*} userId
 * @param {*} multiple
 */


exports.showSize = showSize;

var checkSplit =
/*#__PURE__*/
function () {
  var _ref36 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee35(pageId, userId, multiple) {
    var pendingOrder, currentSize, _txt, _options, i, _replyText;

    return regeneratorRuntime.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context35.sent;

            if (!pendingOrder.order) {
              _context35.next = 18;
              break;
            }

            _context35.next = 6;
            return (0, _sizesController.getSize)(pageId, pendingOrder.order.currentItemSize);

          case 6:
            currentSize = _context35.sent;

            if (!(currentSize.split && currentSize.split > 1)) {
              _context35.next = 15;
              break;
            }

            _txt = 'A pizza ' + currentSize.size + ' pode ser dividida em ' + currentSize.split + ' sabores.\n';
            _txt = _txt + 'Escolha quantos sabores você quer:';
            _options = [];

            for (i = 1; i <= currentSize.split; i++) {
              _replyText = i === 1 ? i + ' Sabor' : i + ' Sabores';

              _options.push({
                text: _replyText,
                data: i,
                event: 'ORDER_SPLIT'
              });
            }

            return _context35.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: _options
            });

          case 15:
            _context35.next = 17;
            return askForFlavorOrConfirm(pageId, userId, multiple);

          case 17:
            return _context35.abrupt("return", _context35.sent);

          case 18:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function checkSplit(_x89, _x90, _x91) {
    return _ref36.apply(this, arguments);
  };
}();

exports.checkSplit = checkSplit;

var showSizeCheckSplit =
/*#__PURE__*/
function () {
  var _ref37 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee36(pageId, userId, data, multiple) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.next = 2;
            return showSize(pageId, userId, data);

          case 2:
            prevAnswer = _context36.sent;
            _context36.next = 5;
            return checkSplit(pageId, userId, multiple);

          case 5:
            nextQuestion = _context36.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context36.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36);
  }));

  return function showSizeCheckSplit(_x92, _x93, _x94, _x95) {
    return _ref37.apply(this, arguments);
  };
}();
/**
 * After user answer if he wants to split the pizza, show the chosen option.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 **/


exports.showSizeCheckSplit = showSizeCheckSplit;

var showSplit =
/*#__PURE__*/
function () {
  var _ref38 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee37(pageId, userId, data) {
    var _txtFlavor;

    return regeneratorRuntime.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _context37.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              waitingFor: 'flavor',
              originalSplit: data
            });

          case 2:
            _txtFlavor = data === 1 ? 'Sabor' : 'Sabores';
            return _context37.abrupt("return", {
              type: 'text',
              text: '✅ ' + data + ' ' + _txtFlavor
            });

          case 4:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37);
  }));

  return function showSplit(_x96, _x97, _x98) {
    return _ref38.apply(this, arguments);
  };
}();

exports.showSplit = showSplit;

var askForFlavorOrConfirm =
/*#__PURE__*/
function () {
  var _ref39 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee38(pageId, userId, multiple) {
    var po, i;
    return regeneratorRuntime.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context38.sent;

            if (!po.order) {
              _context38.next = 25;
              break;
            }

            if (!(po.order.originalSplit > 1 && po.order.originalSplit >= po.order.currentItemSplit)) {
              _context38.next = 10;
              break;
            }

            _context38.next = 7;
            return askForFlavor(pageId, userId, multiple, po);

          case 7:
            return _context38.abrupt("return", _context38.sent);

          case 10:
            if (!(po.items && po.items.length)) {
              _context38.next = 25;
              break;
            }

            i = 0;

          case 12:
            if (!(i < po.items.length)) {
              _context38.next = 22;
              break;
            }

            if (!(po.items[i].status === 0 && po.items[i].flavorId > 0)) {
              _context38.next = 19;
              break;
            }

            _context38.next = 16;
            return (0, _itemsController.updateStatusSpecificItem)(po.items[i]._id, 1);

          case 16:
            _context38.next = 18;
            return showOrderOrNextItem(pageId, userId);

          case 18:
            return _context38.abrupt("return", _context38.sent);

          case 19:
            i++;
            _context38.next = 12;
            break;

          case 22:
            _context38.next = 24;
            return askForFlavor(pageId, userId, multiple, po);

          case 24:
            return _context38.abrupt("return", _context38.sent);

          case 25:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38);
  }));

  return function askForFlavorOrConfirm(_x99, _x100, _x101) {
    return _ref39.apply(this, arguments);
  };
}();

exports.askForFlavorOrConfirm = askForFlavorOrConfirm;

var showSplitCheckFlavor =
/*#__PURE__*/
function () {
  var _ref40 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee39(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.next = 2;
            return showSplit(pageId, userId, data);

          case 2:
            prevAnswer = _context39.sent;
            _context39.next = 5;
            return askForFlavor(pageId, userId, 1);

          case 5:
            nextQuestion = _context39.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context39.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39);
  }));

  return function showSplitCheckFlavor(_x102, _x103, _x104) {
    return _ref40.apply(this, arguments);
  };
}();
/**
 *
 * @param {*} pageId
 * @param {*} userId
 * @param {*} multiple: if are the first 4 flavors, multiple=1, if are the next, multiple=2 and so on.
 */


exports.showSplitCheckFlavor = showSplitCheckFlavor;

var askForFlavor =
/*#__PURE__*/
function () {
  var _ref41 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee40(pageId, userId, multiple, pendingOrder) {
    var po, flavorsArray, _splitForTheItem, currentSplit, _txt, NUMBER_OF_ITEMS, _rangeIni, _rangeEnd, _options, i, _fl, _data, _subtext, buttons, _buttons, buttonsOpt, _buttons2;

    return regeneratorRuntime.wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            po = null;

            if (!(pendingOrder && pendingOrder.order)) {
              _context40.next = 5;
              break;
            }

            po = pendingOrder;
            _context40.next = 8;
            break;

          case 5:
            _context40.next = 7;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 7:
            po = _context40.sent;

          case 8:
            _context40.next = 10;
            return getFlavorsAndToppings(pageId, po.order.currentItemCategory, po.order.currentItemSize);

          case 10:
            flavorsArray = _context40.sent;
            // This variable will be passed as split parameter to updateOrder, so,
            // updateOrder can update the item properly, with the value of originalSplit.
            _splitForTheItem = po.order.originalSplit; // In case where the user typed an option wrongly, the bot invokes askForFlavor
            // without the split parameter. So, because of this situation, I am retrieving
            // the split from the order.

            if (po.order.originalSplit > 1) {
              if (!po.order.currentItemSplit) {
                currentSplit = 1;
              } else {
                currentSplit = po.order.currentItemSplit;
              }
            } // Rule to show 'Escolha o 1o. sabor', 'Escolha o 2o. sabor'


            _txt = 'Escolha o produto:';

            if (currentSplit) {
              // First time currentItemSplit is undefined, so, I am gonna use the originalSplit itself.
              _txt = "Escolha o ".concat(currentSplit, "o. sabor:");
            }

            NUMBER_OF_ITEMS = 10;
            _rangeIni = (multiple - 1) * NUMBER_OF_ITEMS;
            _rangeEnd = multiple * NUMBER_OF_ITEMS;
            _options = [];

            for (i = 0; i < flavorsArray.length; i++) {
              if (flavorsArray[i]) {
                _fl = flavorsArray[i];
                _data = {
                  id: _fl.id,
                  flavor: _fl.flavor,
                  price: _fl.price
                };
                _subtext = '';
                if (_fl.toppingsNames && _fl.toppingsNames.length > 0) _subtext = _fl.toppingsNames.join() + '\n';

                if (_fl.price) {
                  _subtext = _subtext.concat('R$', _fl.price);
                }

                buttons = {
                  text: 'Quero',
                  data: _data,
                  event: 'ORDER_FLAVOR'
                };
                if (i >= _rangeIni && i < _rangeEnd) _options.push({
                  text: _fl.flavor,
                  subtext: _subtext,
                  buttons: buttons
                });else _options.push({
                  text: _fl.flavor,
                  subtext: _subtext,
                  buttons: buttons,
                  hidden: true
                });
              }
            }

            if (flavorsArray.length > _rangeEnd) {
              _buttons = {
                text: 'Voltar',
                data: currentSplit,
                event: 'ORDER_ASK_CATEGORY'
              };

              _options.push({
                text: 'Ver outra categoria',
                subtext: 'Ver outra categoria',
                buttons: _buttons,
                hidden: true
              });

              multiple++;
              buttonsOpt = {
                text: '+ Opções',
                data: {
                  option: 'flavors_more',
                  multiple: multiple
                },
                event: 'ORDER_FLAVOR'
              };

              _options.push({
                text: 'Ver + sabores',
                subtext: '+ sabores do cardápio',
                buttons: buttonsOpt,
                isOnlyButtons: true
              });
            } else {
              _buttons2 = {
                text: 'Voltar',
                data: currentSplit,
                event: 'ORDER_ASK_CATEGORY'
              };

              _options.push({
                text: 'Ver outra categoria',
                subtext: 'Ver outra categoria',
                buttons: _buttons2
              });
            }

            (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'flavor',
              currentItemSplit: currentSplit,
              currentItem: po.order.currentItem,
              split: _splitForTheItem
            });
            return _context40.abrupt("return", {
              type: 'fulllist',
              text: _txt,
              options: _options
            });

          case 23:
          case "end":
            return _context40.stop();
        }
      }
    }, _callee40);
  }));

  return function askForFlavor(_x105, _x106, _x107, _x108) {
    return _ref41.apply(this, arguments);
  };
}();

exports.askForFlavor = askForFlavor;

var showFlavor =
/*#__PURE__*/
function () {
  var _ref42 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee41(pageId, userId, data) {
    var po, currentSplit, itemId, origSplit, orderId, _complete, _showSplit;

    return regeneratorRuntime.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            _context41.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context41.sent;
            origSplit = po.order.originalSplit;
            orderId = po.order.id;

            if (origSplit > 1 && po.order.currentItemSplit <= origSplit) {
              if (po.order.currentItemSplit === 1) itemId = po.order.currentItem ? po.order.currentItem + 1 : 1;else itemId = po.order.currentItem;
              currentSplit = po.order.currentItemSplit + 1;
            } else {
              itemId = po.order.currentItem ? po.order.currentItem + 1 : 1;
            }

            _complete = false;
            if (origSplit > 1 && currentSplit > origSplit) _complete = true;else if (!po.order.originalSplit || origSplit === 1) _complete = true;
            console.info('showFlavor _complete:', _complete, ' originalSplit:', po.order.originalSplit, 'currentSplit: ', currentSplit, ' price: ', data.price);
            _context41.next = 11;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              flavorId: data.id,
              price: data.price,
              completeItem: _complete,
              waitingFor: 'nothing',
              currentItemSplit: currentSplit,
              currentItem: itemId,
              categoryId: po.order.currentItemCategory,
              calcTotal: true
            });

          case 11:
            if (_complete) {
              // without await, so, it can run later
              (0, _itemsController.updateItemStatus)(pageId, orderId, itemId);
            }

            if (!currentSplit) {
              _context41.next = 17;
              break;
            }

            _showSplit = currentSplit - 1;
            return _context41.abrupt("return", {
              type: 'text',
              text: '✅ ' + _showSplit + 'o. Sabor: ' + data.flavor
            });

          case 17:
            return _context41.abrupt("return", {
              type: 'text',
              text: '✅ ' + ' Sabor: ' + data.flavor
            });

          case 18:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));

  return function showFlavor(_x109, _x110, _x111) {
    return _ref42.apply(this, arguments);
  };
}();

exports.showFlavor = showFlavor;

var showOrderOrNextItem =
/*#__PURE__*/
function () {
  var _ref43 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee42(pageId, userId) {
    var po;
    return regeneratorRuntime.wrap(function _callee42$(_context42) {
      while (1) {
        switch (_context42.prev = _context42.next) {
          case 0:
            _context42.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context42.sent;

            if (!(po.order.originalSplit > 1 && po.order.currentItemSplit <= po.order.originalSplit)) {
              _context42.next = 9;
              break;
            }

            _context42.next = 6;
            return askForCategory(pageId, userId, po.order.currentItemSplit);

          case 6:
            return _context42.abrupt("return", _context42.sent);

          case 9:
            _context42.next = 11;
            return showPartialOrder(pageId, userId, po);

          case 11:
            return _context42.abrupt("return", _context42.sent);

          case 12:
          case "end":
            return _context42.stop();
        }
      }
    }, _callee42);
  }));

  return function showOrderOrNextItem(_x112, _x113) {
    return _ref43.apply(this, arguments);
  };
}();

exports.showOrderOrNextItem = showOrderOrNextItem;

var cancelPendingShowPartialOrder =
/*#__PURE__*/
function () {
  var _ref44 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee43(pageId, userId) {
    var po, i;
    return regeneratorRuntime.wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            _context43.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context43.sent;

            if (!(po.items && po.items.length > 0)) {
              _context43.next = 7;
              break;
            }

            _context43.next = 6;
            return (0, _itemsController.deletePendingItem)(pageId, po.order.id);

          case 6:
            for (i = 0; i < po.items.length; i++) {
              if (po.items[i].status === 0) {
                po.items.splice(i, 1);
              }
            }

          case 7:
            _context43.next = 9;
            return showPartialOrder(pageId, userId, po);

          case 9:
            return _context43.abrupt("return", _context43.sent);

          case 10:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));

  return function cancelPendingShowPartialOrder(_x114, _x115) {
    return _ref44.apply(this, arguments);
  };
}();

exports.cancelPendingShowPartialOrder = cancelPendingShowPartialOrder;

var showPartialOrder =
/*#__PURE__*/
function () {
  var _ref45 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee44(pageId, userId, po) {
    var total_price, _txt, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item, _txtQty, _txtSize, _options;

    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            if (po) {
              _context44.next = 4;
              break;
            }

            _context44.next = 3;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 3:
            po = _context44.sent;

          case 4:
            _context44.next = 6;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'partial_confirmation',
              eraseSplit: true,
              undo: ''
            });

          case 6:
            total_price = 0;
            _txt = '𝗣𝗲𝗱𝗶𝗱𝗼:' + po.order.id + '\n';

            if (!(po.items && po.items.length > 0)) {
              _context44.next = 33;
              break;
            }

            _txt = _txt + 'Seguem os detalhes do seu pedido:\n\n';
            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context44.prev = 13;

            for (_iterator6 = po.items[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              item = _step6.value;

              if (item.flavorId) {
                _txtQty = item.split > 1 ? item.qty + '/' + item.split : item.qty;
                _txtSize = '';
                if (item.sizeId) _txtSize = item.size; // _txt = _txt + `${item.category}: ${_txtQty} ${item.flavor} ${_txtSize} - ${formatAsCurrency(item.price)} \n`;

                _txt = _txt + "".concat(_txtQty, " ").concat(item.flavor, " ").concat(_txtSize, " - ").concat((0, _util2.formatAsCurrency)(item.price), " \n");
              }

              if (item.price) total_price += item.price;
            }

            _context44.next = 21;
            break;

          case 17:
            _context44.prev = 17;
            _context44.t0 = _context44["catch"](13);
            _didIteratorError6 = true;
            _iteratorError6 = _context44.t0;

          case 21:
            _context44.prev = 21;
            _context44.prev = 22;

            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }

          case 24:
            _context44.prev = 24;

            if (!_didIteratorError6) {
              _context44.next = 27;
              break;
            }

            throw _iteratorError6;

          case 27:
            return _context44.finish(24);

          case 28:
            return _context44.finish(21);

          case 29:
            if (po.order.deliver_type && po.order.deliver_type === 'delivery') {
              if (po.order.delivery_fee > 0) {
                _txt += "*Taxa de Entrega:* ".concat((0, _util2.formatAsCurrency)(po.order.delivery_fee), "\n");
                total_price += po.order.delivery_fee;
              }
            }

            _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + (0, _util2.formatAsCurrency)(total_price) + '\n\n';
            _context44.next = 34;
            break;

          case 33:
            _txt = _txt + 'Ainda não foram incluídos itens no seu pedido.\n\n';

          case 34:
            _txt = _txt + 'O que deseja fazer?';
            _options = [];

            _options.push({
              text: "Incluir ".concat(po.items && po.items.length > 0 ? 'mais' : '', " itens no pedido"),
              event: 'ORDER_ASK_CATEGORY'
            });

            if (po.items && po.items.length > 0) {
              _options.push({
                text: '*Confirmar o pedido*',
                data: {
                  type: 'confirmation_yes',
                  backTo: 'partial_confirmation'
                },
                event: 'ORDER_PIZZA_CONFIRMATION'
              });

              _options.push({
                text: 'Remover algum item',
                data: {
                  backTo: 'partial_confirmation',
                  option: 'remove_item'
                },
                event: 'ORDER_WANT_CHANGE'
              });

              _options.push({
                text: 'Observações em algum item',
                data: {
                  backTo: 'partial_confirmation',
                  option: 'change_item'
                },
                event: 'ORDER_WANT_CHANGE'
              });
            }

            _options.push({
              text: 'Voltar p/ Início',
              data: 'stoporder_init',
              event: 'STOP_ORDER_OPTIONS'
            });

            return _context44.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: _options
            });

          case 40:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44, null, [[13, 17, 21, 29], [22,, 24, 28]]);
  }));

  return function showPartialOrder(_x116, _x117, _x118) {
    return _ref45.apply(this, arguments);
  };
}(); // export const showOrderOrNextItem = async (pageId, userId) => {
//     const po = await getOrderPending({ pageId, userId, isComplete: true });
//     if (po.order.originalSplit > 1 && po.order.currentItemSplit <= po.order.originalSplit) {
//         return await askForFlavor(pageId, userId, 1, po);
//     } else if (po.order.qty > 1 && po.order.currentItem < po.order.qty) {
//         const nextItem = po.order.currentItem + 1;
//         await updateOrder({ pageId, userId, waitingFor: 'size', currentItem: nextItem });
//         return await askForSize(pageId, userId);
//     } else {
//         await updateOrder({ pageId, userId, waitingFor: 'partial_confirmation', backToConfirmation: null });
//         let total_price = 0;
//         let _txt = 'Seguem os detalhes do seu pedido:\n';
//         _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼:' + po.order.id + '\n';
//         for (let i = 0; i < po.items.length; i++) {
//             const _item = po.items[i];
//             if (_item.flavorId && _item.sizeId) {
//                 let _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;
//                 _txt = _txt + `${_txtQty} pizza ${_item.size} de ${_item.flavor}\n`;
//             } else if (_item.beverageId && _item.beverage) {
//                 _txt = _txt + `1 ${_item.beverage}\n`;
//             }
//             total_price += _item.price;
//         }
//         if (po.order.deliver_type && po.order.deliver_type === 'pickup')
//             _txt += 'Cliente vem retirar.'
//         else
//             _txt = _txt + '𝗘𝗻𝗱𝗲𝗿𝗲𝗰̧𝗼 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ' + po.order.address + '\n';
//         _txt = _txt + '𝗧𝗲𝗹𝗲𝗳𝗼𝗻𝗲: ' + po.order.phone + '\n';
//         _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + formatAsCurrency(total_price) + '\n';
//         _txt = _txt + 'O pedido está correto?';
//         const _options = [];
//         _options.push({
//             text: 'Sim',
//             data: {
//                 type: 'confirmation_yes',
//                 backTo: 'partial_confirmation',
//             },
//             event: 'ORDER_PIZZA_CONFIRMATION',
//         });
//         _options.push({
//             text: 'Não',
//             data: {
//                 type: 'confirmation_no',
//                 backTo: 'partial_confirmation',
//             },
//             event: 'ORDER_PIZZA_CONFIRMATION',
//         });
//         return {
//             type: 'replies',
//             text: _txt,
//             options: _options,
//         };
//     }
// }

/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.showPartialOrder = showPartialOrder;

var showFlavorCheckItem =
/*#__PURE__*/
function () {
  var _ref46 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee45(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee45$(_context45) {
      while (1) {
        switch (_context45.prev = _context45.next) {
          case 0:
            _context45.next = 2;
            return showFlavor(pageId, userId, data);

          case 2:
            prevAnswer = _context45.sent;
            _context45.next = 5;
            return showOrderOrNextItem(pageId, userId);

          case 5:
            nextQuestion = _context45.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context45.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context45.stop();
        }
      }
    }, _callee45);
  }));

  return function showFlavorCheckItem(_x119, _x120, _x121) {
    return _ref46.apply(this, arguments);
  };
}();

exports.showFlavorCheckItem = showFlavorCheckItem;

var askForPaymentType =
/*#__PURE__*/
function () {
  var _ref47 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee46(pageId, userId) {
    var _options, storeData, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, paymentType, _txt;

    return regeneratorRuntime.wrap(function _callee46$(_context46) {
      while (1) {
        switch (_context46.prev = _context46.next) {
          case 0:
            _options = [];
            _context46.next = 3;
            return (0, _storesController.getStoreData)(pageId);

          case 3:
            storeData = _context46.sent;

            if (!(storeData.payment_types && storeData.payment_types.length > 0)) {
              _context46.next = 26;
              break;
            }

            _iteratorNormalCompletion7 = true;
            _didIteratorError7 = false;
            _iteratorError7 = undefined;
            _context46.prev = 8;

            for (_iterator7 = storeData.payment_types[Symbol.iterator](); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              paymentType = _step7.value;
              _txt = paymentType.payment_type;

              if (paymentType.surcharge_percent > 0) {
                _txt += " (Cobramos + ".concat(paymentType.surcharge_percent, "% no valor do pedido)");
              } else if (paymentType.surcharge_amount > 0) {
                _txt += " (Cobramos + ".concat((0, _util2.formatAsCurrency)(paymentType.surcharge_amount), " no valor do pedido)");
              }

              _options.push({
                text: _txt,
                data: {
                  payment_type: paymentType.payment_type,
                  surcharge_percent: paymentType.surcharge_percent,
                  surcharge_amount: paymentType.surcharge_amount
                },
                event: 'ORDER_PAYMENT_TYPE'
              });
            }

            _context46.next = 16;
            break;

          case 12:
            _context46.prev = 12;
            _context46.t0 = _context46["catch"](8);
            _didIteratorError7 = true;
            _iteratorError7 = _context46.t0;

          case 16:
            _context46.prev = 16;
            _context46.prev = 17;

            if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
              _iterator7.return();
            }

          case 19:
            _context46.prev = 19;

            if (!_didIteratorError7) {
              _context46.next = 22;
              break;
            }

            throw _iteratorError7;

          case 22:
            return _context46.finish(19);

          case 23:
            return _context46.finish(16);

          case 24:
            _context46.next = 28;
            break;

          case 26:
            _options.push({
              text: 'Dinheiro',
              data: {
                payment_type: 'Dinheiro',
                surcharge_percent: 0,
                surcharge_amonut: 0
              },
              event: 'ORDER_PAYMENT_TYPE'
            });

            _options.push({
              text: 'Cartão',
              data: {
                payment_type: 'Cartão',
                surcharge_percent: 0,
                surcharge_amount: 0
              },
              event: 'ORDER_PAYMENT_TYPE'
            });

          case 28:
            _context46.next = 30;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'payment_type'
            });

          case 30:
            return _context46.abrupt("return", {
              type: 'replies',
              text: 'Qual a forma de pagamento?',
              options: _options
            });

          case 31:
          case "end":
            return _context46.stop();
        }
      }
    }, _callee46, null, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));

  return function askForPaymentType(_x122, _x123) {
    return _ref47.apply(this, arguments);
  };
}();

exports.askForPaymentType = askForPaymentType;

var showPaymentType =
/*#__PURE__*/
function () {
  var _ref48 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee47(pageId, userId, data) {
    var _txtPaymentType;

    return regeneratorRuntime.wrap(function _callee47$(_context47) {
      while (1) {
        switch (_context47.prev = _context47.next) {
          case 0:
            _context47.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              paymentType: data.payment_type,
              surcharge_percent: data.surcharge_percent,
              surcharge_amount: data.surcharge_amount
            });

          case 2:
            _txtPaymentType = data.payment_type;
            return _context47.abrupt("return", {
              type: 'text',
              text: '✅ ' + ' Forma de pagamento: ' + _txtPaymentType
            });

          case 4:
          case "end":
            return _context47.stop();
        }
      }
    }, _callee47);
  }));

  return function showPaymentType(_x124, _x125, _x126) {
    return _ref48.apply(this, arguments);
  };
}();

exports.showPaymentType = showPaymentType;

var askForPaymentChange =
/*#__PURE__*/
function () {
  var _ref49 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee48(pageId, userId) {
    var _options;

    return regeneratorRuntime.wrap(function _callee48$(_context48) {
      while (1) {
        switch (_context48.prev = _context48.next) {
          case 0:
            _options = [];

            _options.push({
              text: 'Sim',
              data: 'payment_change_yes',
              event: 'ORDER_PAYMENT_CHANGE'
            });

            _options.push({
              text: 'Não',
              data: 'payment_change_no',
              event: 'ORDER_PAYMENT_CHANGE'
            });

            _context48.next = 5;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'payment_change'
            });

          case 5:
            return _context48.abrupt("return", {
              type: 'replies',
              text: 'Precisa de troco?',
              options: _options
            });

          case 6:
          case "end":
            return _context48.stop();
        }
      }
    }, _callee48);
  }));

  return function askForPaymentChange(_x127, _x128) {
    return _ref49.apply(this, arguments);
  };
}();
/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.askForPaymentChange = askForPaymentChange;

var showPaymentTypeAskForPaymentChange =
/*#__PURE__*/
function () {
  var _ref50 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee49(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee49$(_context49) {
      while (1) {
        switch (_context49.prev = _context49.next) {
          case 0:
            _context49.next = 2;
            return showPaymentType(pageId, userId, data);

          case 2:
            prevAnswer = _context49.sent;
            _context49.next = 5;
            return askForPaymentChange(pageId, userId);

          case 5:
            nextQuestion = _context49.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context49.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context49.stop();
        }
      }
    }, _callee49);
  }));

  return function showPaymentTypeAskForPaymentChange(_x129, _x130, _x131) {
    return _ref50.apply(this, arguments);
  };
}();

exports.showPaymentTypeAskForPaymentChange = showPaymentTypeAskForPaymentChange;

var showPaymentChange =
/*#__PURE__*/
function () {
  var _ref51 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee50(pageId, userId, data) {
    var _txtPaymentChange;

    return regeneratorRuntime.wrap(function _callee50$(_context50) {
      while (1) {
        switch (_context50.prev = _context50.next) {
          case 0:
            _context50.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              paymentChange: data
            });

          case 2:
            _txtPaymentChange = data === 'payment_change_yes' ? 'Levaremos trocado' : 'Não precisa de troco';
            return _context50.abrupt("return", {
              type: 'text',
              text: '✅ ' + _txtPaymentChange
            });

          case 4:
          case "end":
            return _context50.stop();
        }
      }
    }, _callee50);
  }));

  return function showPaymentChange(_x132, _x133, _x134) {
    return _ref51.apply(this, arguments);
  };
}();

exports.showPaymentChange = showPaymentChange;

var askForComments =
/*#__PURE__*/
function () {
  var _ref52 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee51(pageId, userId) {
    var _options;

    return regeneratorRuntime.wrap(function _callee51$(_context51) {
      while (1) {
        switch (_context51.prev = _context51.next) {
          case 0:
            _options = [];

            _options.push({
              text: 'Sim',
              data: 'comments_yes',
              event: 'ORDER_COMMENTS'
            });

            _options.push({
              text: 'Não',
              data: 'comments_no',
              event: 'ORDER_COMMENTS'
            });

            _context51.next = 5;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'comments'
            });

          case 5:
            return _context51.abrupt("return", {
              type: 'replies',
              text: 'Quer enviar alguma observação sobre o pedido ou entrega?',
              options: _options
            });

          case 6:
          case "end":
            return _context51.stop();
        }
      }
    }, _callee51);
  }));

  return function askForComments(_x135, _x136) {
    return _ref52.apply(this, arguments);
  };
}();

exports.askForComments = askForComments;

var showPaymentChangeAskForComments =
/*#__PURE__*/
function () {
  var _ref53 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee52(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee52$(_context52) {
      while (1) {
        switch (_context52.prev = _context52.next) {
          case 0:
            _context52.next = 2;
            return showPaymentChange(pageId, userId, data);

          case 2:
            prevAnswer = _context52.sent;
            _context52.next = 5;
            return askForComments(pageId, userId);

          case 5:
            nextQuestion = _context52.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context52.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context52.stop();
        }
      }
    }, _callee52);
  }));

  return function showPaymentChangeAskForComments(_x137, _x138, _x139) {
    return _ref53.apply(this, arguments);
  };
}();

exports.showPaymentChangeAskForComments = showPaymentChangeAskForComments;

var askToTypeComments =
/*#__PURE__*/
function () {
  var _ref54 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee53(pageID, userID, item) {
    var _txt;

    return regeneratorRuntime.wrap(function _callee53$(_context53) {
      while (1) {
        switch (_context53.prev = _context53.next) {
          case 0:
            if (!item) {
              _context53.next = 6;
              break;
            }

            _context53.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              waitingFor: 'typed_comments_item',
              waitingForData: item.id
            });

          case 3:
            _txt = 'Diga o que gostaria de pedir: por ex. sem cebola ou ovos. Pode digitar:';
            _context53.next = 9;
            break;

          case 6:
            _context53.next = 8;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              waitingFor: 'typed_comments'
            });

          case 8:
            _txt = 'Digite as observações que você tem para a entrega ou pedido. Pode digitar!';

          case 9:
            return _context53.abrupt("return", {
              type: 'text',
              text: _txt
            });

          case 10:
          case "end":
            return _context53.stop();
        }
      }
    }, _callee53);
  }));

  return function askToTypeComments(_x140, _x141, _x142) {
    return _ref54.apply(this, arguments);
  };
}();

exports.askToTypeComments = askToTypeComments;

var showComments =
/*#__PURE__*/
function () {
  var _ref55 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee54(pageId, userId, text) {
    var _txtComments;

    return regeneratorRuntime.wrap(function _callee54$(_context54) {
      while (1) {
        switch (_context54.prev = _context54.next) {
          case 0:
            _context54.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              comments: text
            });

          case 2:
            _txtComments = 'Observações para o pedido/entrega:\n';
            _txtComments += text;
            return _context54.abrupt("return", {
              type: 'text',
              text: '✅ ' + _txtComments
            });

          case 5:
          case "end":
            return _context54.stop();
        }
      }
    }, _callee54);
  }));

  return function showComments(_x143, _x144, _x145) {
    return _ref55.apply(this, arguments);
  };
}();

exports.showComments = showComments;

var showFullOrder =
/*#__PURE__*/
function () {
  var _ref56 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee55(pageId, userId) {
    var po, total_price, _txt, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, item, _txtQty, _txtSize, _txtComments;

    return regeneratorRuntime.wrap(function _callee55$(_context55) {
      while (1) {
        switch (_context55.prev = _context55.next) {
          case 0:
            _context55.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context55.sent;
            total_price = 0;
            _txt = 'Seguem os detalhes do seu pedido:\n\n';
            _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼: ' + po.order.id + '\n';
            _iteratorNormalCompletion8 = true;
            _didIteratorError8 = false;
            _iteratorError8 = undefined;
            _context55.prev = 9;

            for (_iterator8 = po.items[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              item = _step8.value;

              if (item.flavorId) {
                _txtQty = item.split > 1 ? item.qty + '/' + item.split : item.qty;
                _txtSize = item.sizeId ? item.size : ''; // _txt = _txt + `_${item.category}_: ${_txtQty} ${item.flavor}  ${_txtSize}\n`;

                _txt = _txt + "".concat(_txtQty, " ").concat(item.flavor, "  ").concat(_txtSize, "\n");
                total_price += item.price;
              }
            }

            _context55.next = 17;
            break;

          case 13:
            _context55.prev = 13;
            _context55.t0 = _context55["catch"](9);
            _didIteratorError8 = true;
            _iteratorError8 = _context55.t0;

          case 17:
            _context55.prev = 17;
            _context55.prev = 18;

            if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
              _iterator8.return();
            }

          case 20:
            _context55.prev = 20;

            if (!_didIteratorError8) {
              _context55.next = 23;
              break;
            }

            throw _iteratorError8;

          case 23:
            return _context55.finish(20);

          case 24:
            return _context55.finish(17);

          case 25:
            if (po.order.deliver_type && po.order.deliver_type === 'pickup') {
              _txt += 'Cliente retira.\n';
              if (po.order.store_address) _txt += '📌 Nosso endereço: ' + po.order.store_address + '\n';
            } else {
              _txt += '𝗘𝗻𝗱𝗲𝗿𝗲𝗰̧𝗼 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ' + po.order.address + '\n';

              if (po.order.delivery_fee > 0) {
                _txt += "\uD835\uDDE7\uD835\uDDEE\uD835\uDE05\uD835\uDDEE \uD835\uDDF1\uD835\uDDF2 \uD835\uDDD8\uD835\uDDFB\uD835\uDE01\uD835\uDDFF\uD835\uDDF2\uD835\uDDF4\uD835\uDDEE: ".concat((0, _util2.formatAsCurrency)(po.order.delivery_fee), "\n");
                total_price += po.order.delivery_fee;
              }
            }

            _txt = _txt + '𝗧𝗲𝗹𝗲𝗳𝗼𝗻𝗲: ' + po.order.phone + '\n';
            _txt = _txt + '𝗙𝗼𝗿𝗺𝗮 𝗱𝗲 𝗣𝗮𝗴𝗮𝗺𝗲𝗻𝘁𝗼: ' + po.order.payment_type + '\n';

            if (po.payment_change === 'payment_change_yes') {
              _txt = _txt + '𝗟𝗲𝘃𝗮𝗿 𝗧𝗿𝗼𝗰𝗼? Sim \n';
            }

            if (po.order.surcharge_percent > 0) {
              _txt += "\uD835\uDDE7\uD835\uDDEE\uD835\uDE05\uD835\uDDEE \uD835\uDDF1\uD835\uDDF2 ".concat(po.order.payment_type, ": ").concat(po.order.surcharge_percent * 100, "%\n");
              total_price += total_price * po.order.surcharge_percent;
            }

            if (po.order.surcharge_amount > 0) {
              _txt += "\uD835\uDDE7\uD835\uDDEE\uD835\uDE05\uD835\uDDEE \uD835\uDDF1\uD835\uDDF2 ".concat(po.order.payment_type, ": ").concat((0, _util2.formatAsCurrency)(po.order.surcharge_amount), "\n");
              total_price += po.order.surcharge_amount;
            }

            _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + (0, _util2.formatAsCurrency)(total_price) + '\n';
            _txtComments = po.order.comments || 'Sem observações';
            _txt = _txt + '𝗢𝗯𝘀𝗲𝗿𝘃𝗮𝗰̧𝗼̃𝗲𝘀: ' + _txtComments + '\n';
            return _context55.abrupt("return", {
              type: 'text',
              text: _txt // the code below was used to ask for a final confirmation.
              // _txt = _txt + 'Posso confirmar o pedido?';
              // const _options = [];
              // _options.push({
              //     text: 'Sim',
              //     data: {
              //         type: 'confirmation_yes',
              //         backTo: 'full_confirmation',
              //     },
              //     event: 'ORDER_CONFIRMATION',
              // });
              // _options.push({
              //     text: 'Não',
              //     data: {
              //         type: 'confirmation_no',
              //         backTo: 'full_confirmation',
              //     },
              //     event: 'ORDER_CONFIRMATION',
              // });
              // return {
              //     type: 'replies',
              //     text: _txt,
              //     options: _options,
              // };

            });

          case 35:
          case "end":
            return _context55.stop();
        }
      }
    }, _callee55, null, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function showFullOrder(_x146, _x147) {
    return _ref56.apply(this, arguments);
  };
}();
/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.showFullOrder = showFullOrder;

var showPaymentTypeAskForComments =
/*#__PURE__*/
function () {
  var _ref57 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee56(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee56$(_context56) {
      while (1) {
        switch (_context56.prev = _context56.next) {
          case 0:
            _context56.next = 2;
            return showPaymentType(pageId, userId, data);

          case 2:
            prevAnswer = _context56.sent;
            _context56.next = 5;
            return askForComments(pageId, userId);

          case 5:
            nextQuestion = _context56.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context56.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context56.stop();
        }
      }
    }, _callee56);
  }));

  return function showPaymentTypeAskForComments(_x148, _x149, _x150) {
    return _ref57.apply(this, arguments);
  };
}();
/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.showPaymentTypeAskForComments = showPaymentTypeAskForComments;

var showFullOrderConfirmOrder =
/*#__PURE__*/
function () {
  var _ref58 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee57(pageId, userId, data) {
    var prevAnswer, nextAnswer;
    return regeneratorRuntime.wrap(function _callee57$(_context57) {
      while (1) {
        switch (_context57.prev = _context57.next) {
          case 0:
            if (!(data && data !== 'comments_no')) {
              _context57.next = 3;
              break;
            }

            _context57.next = 3;
            return showComments(pageId, userId, data);

          case 3:
            _context57.next = 5;
            return showFullOrder(pageId, userId);

          case 5:
            prevAnswer = _context57.sent;
            _context57.next = 8;
            return confirmOrder(pageId, userId);

          case 8:
            nextAnswer = _context57.sent;
            nextAnswer.text = prevAnswer.text + '\n\n' + nextAnswer.text;
            return _context57.abrupt("return", nextAnswer);

          case 11:
          case "end":
            return _context57.stop();
        }
      }
    }, _callee57);
  }));

  return function showFullOrderConfirmOrder(_x151, _x152, _x153) {
    return _ref58.apply(this, arguments);
  };
}();

exports.showFullOrderConfirmOrder = showFullOrderConfirmOrder;

var confirmOrder =
/*#__PURE__*/
function () {
  var _ref59 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee58(pageId, userId) {
    return regeneratorRuntime.wrap(function _callee58$(_context58) {
      while (1) {
        switch (_context58.prev = _context58.next) {
          case 0:
            _context58.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              confirmOrder: true,
              calcTotal: true
            });

          case 2:
            return _context58.abrupt("return", {
              type: 'text',
              text: '✅ Pedido Confirmado!'
            });

          case 3:
          case "end":
            return _context58.stop();
        }
      }
    }, _callee58);
  }));

  return function confirmOrder(_x154, _x155) {
    return _ref59.apply(this, arguments);
  };
}();

exports.confirmOrder = confirmOrder;

var askForChangeOrder =
/*#__PURE__*/
function () {
  var _ref60 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee59(pageId, userId, data) {
    var confirmStep, _txt, _options, _evt;

    return regeneratorRuntime.wrap(function _callee59$(_context59) {
      while (1) {
        switch (_context59.prev = _context59.next) {
          case 0:
            if (data && data.hasOwnProperty('backTo')) {
              confirmStep = data.backTo;
            }

            if (!confirmStep) {
              _context59.next = 6;
              break;
            }

            _context59.next = 4;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'change_order',
              backToConfirmation: confirmStep
            });

          case 4:
            _context59.next = 8;
            break;

          case 6:
            _context59.next = 8;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'change_order'
            });

          case 8:
            _txt = 'O que você gostaria de fazer com o seu pedido?';
            _options = [];

            _options.push({
              text: 'Mudar pedido',
              data: 'changeOrder',
              event: 'ORDER_WANT_CHANGE'
            });

            _options.push({
              text: 'Mudar endereço',
              data: 'change_address',
              event: 'ORDER_CHANGE'
            });

            if (confirmStep) {
              // confirmStep can be 'partial_confirmation' or 'full_confirmation'
              _evt = confirmStep === 'partial_confirmation' ? 'ORDER_PIZZA_CONFIRMATION' : 'ORDER_CONFIRMATION';

              _options.push({
                text: 'Confirmar.',
                data: {
                  type: 'confirmation_yes',
                  backTo: confirmStep
                },
                event: _evt
              });
            }

            return _context59.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: _options
            });

          case 14:
          case "end":
            return _context59.stop();
        }
      }
    }, _callee59);
  }));

  return function askForChangeOrder(_x156, _x157, _x158) {
    return _ref60.apply(this, arguments);
  };
}();

exports.askForChangeOrder = askForChangeOrder;

var askForOptionsToChange =
/*#__PURE__*/
function () {
  var _ref61 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee60(pageId, userId, item) {
    var _txt, _options;

    return regeneratorRuntime.wrap(function _callee60$(_context60) {
      while (1) {
        switch (_context60.prev = _context60.next) {
          case 0:
            _context60.prev = 0;
            _txt = 'Ok, o que você gostaria de fazer?';
            _options = [];

            _options.push({
              text: 'Mandar observação para esse item',
              data: item,
              event: 'ORDER_CHANGE_ITEM'
            });

            _options.push({
              text: 'Cancelar/Remover',
              data: item,
              event: 'ORDER_CANCEL_ITEM'
            });

            return _context60.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: _options
            });

          case 8:
            _context60.prev = 8;
            _context60.t0 = _context60["catch"](0);
            console.error({
              askForOptionsToChangeErr: _context60.t0
            });
            throw _context60.t0;

          case 12:
          case "end":
            return _context60.stop();
        }
      }
    }, _callee60, null, [[0, 8]]);
  }));

  return function askForOptionsToChange(_x159, _x160, _x161) {
    return _ref61.apply(this, arguments);
  };
}();

exports.askForOptionsToChange = askForOptionsToChange;

var askForSpecificItem =
/*#__PURE__*/
function () {
  var _ref62 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee61(pageId, userId, data) {
    var pendingOrder, _options, _itemId, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, item, _txt, _sizeSplit, _txtHead;

    return regeneratorRuntime.wrap(function _callee61$(_context61) {
      while (1) {
        switch (_context61.prev = _context61.next) {
          case 0:
            _context61.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context61.sent;

            if (!(pendingOrder.items && pendingOrder.items.length > 1)) {
              _context61.next = 30;
              break;
            }

            _options = [];
            _itemId = 0;
            _iteratorNormalCompletion9 = true;
            _didIteratorError9 = false;
            _iteratorError9 = undefined;
            _context61.prev = 9;

            for (_iterator9 = pendingOrder.items[Symbol.iterator](); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              item = _step9.value;

              if (item.itemId !== _itemId) {
                _txt = void 0;

                if (item.size && item.flavor) {
                  _sizeSplit = "".concat(item.size);

                  if (item.split && item.split > 1) {
                    if (item.category.toUpperCase().indexOf('PIZZA') > -1) _sizeSplit = 'Pizza ' + _sizeSplit;
                    _sizeSplit = _sizeSplit + " ".concat(item.split, " Sabores");
                  } else _sizeSplit = item.flavor + ' ' + _sizeSplit;

                  _txt = "".concat(_sizeSplit);
                } else {
                  _txt = item.flavor;
                }

                if (_txt) {
                  if (data && data.option === 'change_item') {
                    _options.push({
                      text: _txt,
                      data: item,
                      event: 'ORDER_CHANGE_ITEM'
                    });
                  } else {
                    _options.push({
                      text: _txt,
                      data: item,
                      event: 'ORDER_CANCEL_ITEM'
                    });
                  }
                }

                _itemId = item.itemId;
              }
            }

            _context61.next = 17;
            break;

          case 13:
            _context61.prev = 13;
            _context61.t0 = _context61["catch"](9);
            _didIteratorError9 = true;
            _iteratorError9 = _context61.t0;

          case 17:
            _context61.prev = 17;
            _context61.prev = 18;

            if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
              _iterator9.return();
            }

          case 20:
            _context61.prev = 20;

            if (!_didIteratorError9) {
              _context61.next = 23;
              break;
            }

            throw _iteratorError9;

          case 23:
            return _context61.finish(20);

          case 24:
            return _context61.finish(17);

          case 25:
            _txtHead = 'Escolha qual dos itens deseja ';
            if (data && data.option === 'change_item') _txtHead = _txtHead + 'alterar:';else _txtHead = _txtHead + 'remover:';
            return _context61.abrupt("return", {
              type: 'replies',
              text: _txtHead,
              options: _options
            });

          case 30:
            _context61.next = 32;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              completeItem: false
            });

          case 32:
            _context61.next = 34;
            return askForOptionsToChange(pageId, userId, pendingOrder.items[0]);

          case 34:
            return _context61.abrupt("return", _context61.sent);

          case 35:
          case "end":
            return _context61.stop();
        }
      }
    }, _callee61, null, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function askForSpecificItem(_x162, _x163, _x164) {
    return _ref62.apply(this, arguments);
  };
}();
/**
 *
 * @param {*} pageId
 * @param {*} userId
 */


exports.askForSpecificItem = askForSpecificItem;

var askForWantBeverage =
/*#__PURE__*/
function () {
  var _ref63 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee62(pageId, userId) {
    var pendingOrder, noBeverage, _txt, _options;

    return regeneratorRuntime.wrap(function _callee62$(_context62) {
      while (1) {
        switch (_context62.prev = _context62.next) {
          case 0:
            (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'want_beverage'
            });
            _context62.next = 3;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 3:
            pendingOrder = _context62.sent;
            noBeverage = pendingOrder.order.no_beverage;

            if (!(typeof noBeverage === 'undefined')) {
              _context62.next = 13;
              break;
            }

            _txt = 'Gostaria de algo para beber?';
            _options = [];

            _options.push({
              text: 'Sim',
              data: 'beverage_yes',
              event: 'ORDER_CONFIRM_BEVERAGE'
            });

            _options.push({
              text: 'Não',
              data: 'beverage_no',
              event: 'ORDER_CONFIRM_BEVERAGE'
            });

            return _context62.abrupt("return", {
              type: 'replies',
              text: _txt,
              options: _options
            });

          case 13:
            return _context62.abrupt("return", showFullOrder(pageId, userId));

          case 14:
          case "end":
            return _context62.stop();
        }
      }
    }, _callee62);
  }));

  return function askForWantBeverage(_x165, _x166) {
    return _ref63.apply(this, arguments);
  };
}();
/**
 *
 * @param {*} pageId
 * @param {*} userId
 * @param {*} multiple
 */


exports.askForWantBeverage = askForWantBeverage;

var askForBeverages =
/*#__PURE__*/
function () {
  var _ref64 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee63(pageId, userId, multiple) {
    var beveragesArr, _rangeIni, _rangeEnd, _options, i, _bev, _data, buttons, _subtext, buttonsOpt, _data2, _buttons3, _subtext2;

    return regeneratorRuntime.wrap(function _callee63$(_context63) {
      while (1) {
        switch (_context63.prev = _context63.next) {
          case 0:
            _context63.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'beverage',
              noBeverage: false
            });

          case 2:
            _context63.next = 4;
            return (0, _beveragesController.getBeverages)(pageId);

          case 4:
            beveragesArr = _context63.sent;
            _rangeIni = (multiple - 1) * 4;
            _rangeEnd = multiple * 4;
            _options = [];

            for (i = _rangeIni; i < _rangeEnd; i++) {
              if (beveragesArr[i]) {
                _bev = beveragesArr[i];
                _data = {
                  id: _bev.id,
                  beverage: _bev.name,
                  price: _bev.price
                };
                buttons = {
                  text: 'Quero',
                  data: _data,
                  event: 'ORDER_BEVERAGE'
                };
                _subtext = _bev.kind;

                if (_bev.price) {
                  _subtext = _subtext.concat('\n R$', _bev.price);
                }

                _options.push({
                  text: _bev.name,
                  subtext: _subtext,
                  buttons: buttons
                });
              }
            }

            if (beveragesArr.length + 1 > _rangeEnd) {
              multiple++;
              buttonsOpt = {
                text: '+ Opções',
                data: {
                  option: 'beverages_more',
                  multiple: multiple
                },
                event: 'ORDER_BEVERAGE'
              };

              _options.push({
                text: 'Clique aqui p/ ver + opções',
                buttons: buttonsOpt,
                isOnlyButtons: true
              });
            } else {
              _data2 = {
                option: 'beverages_cancel'
              };
              _buttons3 = {
                text: 'Sem bebida',
                data: _data2,
                event: 'ORDER_BEVERAGE'
              };
              _subtext2 = 'Se não encontrou, selecione "Sem bebida"';

              _options.push({
                text: 'Sem bebida',
                subtext: _subtext2,
                buttons: _buttons3
              });
            }

            return _context63.abrupt("return", {
              type: 'fulllist',
              text: 'Selecione uma bebida:',
              options: _options
            });

          case 11:
          case "end":
            return _context63.stop();
        }
      }
    }, _callee63);
  }));

  return function askForBeverages(_x167, _x168, _x169) {
    return _ref64.apply(this, arguments);
  };
}();
/**
 * Show that user did not want beverage and update order with this info.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.askForBeverages = askForBeverages;

var showNoBeverage =
/*#__PURE__*/
function () {
  var _ref65 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee64(pageId, userId, data) {
    return regeneratorRuntime.wrap(function _callee64$(_context64) {
      while (1) {
        switch (_context64.prev = _context64.next) {
          case 0:
            _context64.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              noBeverage: true,
              waitingFor: 'confirm'
            });

          case 2:
            return _context64.abrupt("return", {
              type: 'text',
              text: '❌ ' + ' Sem bebida para o seu pedido. '
            });

          case 3:
          case "end":
            return _context64.stop();
        }
      }
    }, _callee64);
  }));

  return function showNoBeverage(_x170, _x171, _x172) {
    return _ref65.apply(this, arguments);
  };
}();
/**
 * Show the chosen beverage.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.showNoBeverage = showNoBeverage;

var showBeverage =
/*#__PURE__*/
function () {
  var _ref66 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee65(pageId, userId, data) {
    return regeneratorRuntime.wrap(function _callee65$(_context65) {
      while (1) {
        switch (_context65.prev = _context65.next) {
          case 0:
            _context65.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              beverageId: data.id,
              beveragePrice: data.price,
              completeItem: true,
              noBeverage: false,
              waitingFor: 'full_confirmation',
              calcTotal: true
            });

          case 2:
            return _context65.abrupt("return", {
              type: 'text',
              text: '✅ ' + '1 Bebida: ' + data.beverage
            });

          case 3:
          case "end":
            return _context65.stop();
        }
      }
    }, _callee65);
  }));

  return function showBeverage(_x173, _x174, _x175) {
    return _ref66.apply(this, arguments);
  };
}();
/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.showBeverage = showBeverage;

var showBeverageAskForPaymentType =
/*#__PURE__*/
function () {
  var _ref67 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee66(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee66$(_context66) {
      while (1) {
        switch (_context66.prev = _context66.next) {
          case 0:
            _context66.next = 2;
            return showBeverage(pageId, userId, data);

          case 2:
            prevAnswer = _context66.sent;
            _context66.next = 5;
            return askForPaymentType(pageId, userId);

          case 5:
            nextQuestion = _context66.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context66.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context66.stop();
        }
      }
    }, _callee66);
  }));

  return function showBeverageAskForPaymentType(_x176, _x177, _x178) {
    return _ref67.apply(this, arguments);
  };
}();
/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */


exports.showBeverageAskForPaymentType = showBeverageAskForPaymentType;

var showNoBeverageAskForPaymentType =
/*#__PURE__*/
function () {
  var _ref68 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee67(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee67$(_context67) {
      while (1) {
        switch (_context67.prev = _context67.next) {
          case 0:
            _context67.next = 2;
            return showNoBeverage(pageId, userId, data);

          case 2:
            prevAnswer = _context67.sent;
            _context67.next = 5;
            return askForPaymentType(pageId, userId);

          case 5:
            nextQuestion = _context67.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context67.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context67.stop();
        }
      }
    }, _callee67);
  }));

  return function showNoBeverageAskForPaymentType(_x179, _x180, _x181) {
    return _ref68.apply(this, arguments);
  };
}();
/**
 * Cancel the selected item, reorder the itemIds and askForSize
 * @param {*} pageId
 * @param {*} userId
 * @param {*} itemId
 */


exports.showNoBeverageAskForPaymentType = showNoBeverageAskForPaymentType;

var changeItem =
/*#__PURE__*/
function () {
  var _ref69 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee68(pageId, userId, item) {
    return regeneratorRuntime.wrap(function _callee68$(_context68) {
      while (1) {
        switch (_context68.prev = _context68.next) {
          case 0:
            return _context68.abrupt("return", askToTypeComments(pageId, userId, item));

          case 1:
          case "end":
            return _context68.stop();
        }
      }
    }, _callee68);
  }));

  return function changeItem(_x182, _x183, _x184) {
    return _ref69.apply(this, arguments);
  };
}();

exports.changeItem = changeItem;

var showCommentsItem =
/*#__PURE__*/
function () {
  var _ref70 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee69(pageId, userId, data) {
    var po;
    return regeneratorRuntime.wrap(function _callee69$(_context69) {
      while (1) {
        switch (_context69.prev = _context69.next) {
          case 0:
            _context69.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context69.sent;

            if (po && po.order && po.order.waitingFor === 'typed_comments_item') {
              // without await to run later.
              (0, _itemsController.updateItemDirect)(pageId, po.order.id, po.order.waitingForData, data);
            }

            _context69.next = 6;
            return showPartialOrder(pageId, userId);

          case 6:
            return _context69.abrupt("return", _context69.sent);

          case 7:
          case "end":
            return _context69.stop();
        }
      }
    }, _callee69);
  }));

  return function showCommentsItem(_x185, _x186, _x187) {
    return _ref70.apply(this, arguments);
  };
}();

exports.showCommentsItem = showCommentsItem;

var cancelItem =
/*#__PURE__*/
function () {
  var _ref71 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee70(pageId, userId, item) {
    var po, result1;
    return regeneratorRuntime.wrap(function _callee70$(_context70) {
      while (1) {
        switch (_context70.prev = _context70.next) {
          case 0:
            _context70.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context70.sent;
            _context70.next = 5;
            return (0, _itemsController.deleteItem)(pageId, po.order.id, item.itemId);

          case 5:
            result1 = _context70.sent;
            console.info('cancelItem:', result1); // if (result1) {

            if (!(po.order.backToConfirmation === 'full_confirmation')) {
              _context70.next = 13;
              break;
            }

            _context70.next = 10;
            return showFullOrder(pageId, userId);

          case 10:
            return _context70.abrupt("return", _context70.sent);

          case 13:
            _context70.next = 15;
            return showPartialOrder(pageId, userId);

          case 15:
            return _context70.abrupt("return", _context70.sent);

          case 16:
          case "end":
            return _context70.stop();
        }
      }
    }, _callee70);
  }));

  return function cancelItem(_x188, _x189, _x190) {
    return _ref71.apply(this, arguments);
  };
}();

exports.cancelItem = cancelItem;

var updateItemAskOptions =
/*#__PURE__*/
function () {
  var _ref72 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee71(pageId, userId, item) {
    return regeneratorRuntime.wrap(function _callee71$(_context71) {
      while (1) {
        switch (_context71.prev = _context71.next) {
          case 0:
            _context71.next = 2;
            return askForOptionsToChange(pageId, userId, item);

          case 2:
            return _context71.abrupt("return", _context71.sent);

          case 3:
          case "end":
            return _context71.stop();
        }
      }
    }, _callee71);
  }));

  return function updateItemAskOptions(_x191, _x192, _x193) {
    return _ref72.apply(this, arguments);
  };
}();

exports.updateItemAskOptions = updateItemAskOptions;

var sendShippingNotification =
/*#__PURE__*/
function () {
  var _ref73 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee72(pageId, userId, orderId) {
    var _ref74, accessToken, _txt, out;

    return regeneratorRuntime.wrap(function _callee72$(_context72) {
      while (1) {
        switch (_context72.prev = _context72.next) {
          case 0:
            _context72.next = 2;
            return (0, _pagesController.getOnePageToken)(pageId);

          case 2:
            _ref74 = _context72.sent;
            accessToken = _ref74.accessToken;
            _txt = 'O seu pedido número ' + orderId + ' acabou de sair para entrega. Bom apetite!';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: _txt
            });
            _context72.next = 9;
            return _facebookMessengerBot.Bot.send_message_tag(accessToken, userId, out);

          case 9:
          case "end":
            return _context72.stop();
        }
      }
    }, _callee72);
  }));

  return function sendShippingNotification(_x194, _x195, _x196) {
    return _ref73.apply(this, arguments);
  };
}();

exports.sendShippingNotification = sendShippingNotification;

var sendRejectionNotification =
/*#__PURE__*/
function () {
  var _ref75 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee73(pageId, userId, orderId, rejectionExplanation) {
    var _ref76, accessToken, _txt, out;

    return regeneratorRuntime.wrap(function _callee73$(_context73) {
      while (1) {
        switch (_context73.prev = _context73.next) {
          case 0:
            _context73.next = 2;
            return (0, _pagesController.getOnePageToken)(pageId);

          case 2:
            _ref76 = _context73.sent;
            accessToken = _ref76.accessToken;
            _txt = 'Infelizmente não poderemos atender o seu pedido número ' + orderId + '. Segue o motivo: ' + rejectionExplanation;
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: _txt
            });
            _context73.next = 9;
            return _facebookMessengerBot.Bot.send_message_tag(accessToken, userId, out);

          case 9:
          case "end":
            return _context73.stop();
        }
      }
    }, _callee73);
  }));

  return function sendRejectionNotification(_x197, _x198, _x199, _x200) {
    return _ref75.apply(this, arguments);
  };
}();
/**
 * Delete the pending order and shows the Main Menu.
 * @param {*} pageId
 * @param {*} userId
 */


exports.sendRejectionNotification = sendRejectionNotification;

var cancelPendingOrder =
/*#__PURE__*/
function () {
  var _ref77 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee74(pageId, userId) {
    var out;
    return regeneratorRuntime.wrap(function _callee74$(_context74) {
      while (1) {
        switch (_context74.prev = _context74.next) {
          case 0:
            _context74.next = 2;
            return (0, _ordersController.cancelOrder)({
              pageId: pageId,
              userId: userId
            });

          case 2:
            _context74.next = 4;
            return sendMainMenu();

          case 4:
            out = _context74.sent;
            out.text = '❌ Pedido Cancelado!' + '\n\n' + out.text;
            return _context74.abrupt("return", out);

          case 7:
          case "end":
            return _context74.stop();
        }
      }
    }, _callee74);
  }));

  return function cancelPendingOrder(_x201, _x202) {
    return _ref77.apply(this, arguments);
  };
}();

exports.cancelPendingOrder = cancelPendingOrder;

var showDeliverAskForCategory =
/*#__PURE__*/
function () {
  var _ref78 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee75(pageId, userId, data, user, source) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee75$(_context75) {
      while (1) {
        switch (_context75.prev = _context75.next) {
          case 0:
            _context75.next = 2;
            return showDeliver(pageId, userId, data, user, source);

          case 2:
            prevAnswer = _context75.sent;
            _context75.next = 5;
            return askForCategory(pageId, userId);

          case 5:
            nextQuestion = _context75.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context75.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context75.stop();
        }
      }
    }, _callee75);
  }));

  return function showDeliverAskForCategory(_x203, _x204, _x205, _x206, _x207) {
    return _ref78.apply(this, arguments);
  };
}();

exports.showDeliverAskForCategory = showDeliverAskForCategory;

var showAddressAskForCategory =
/*#__PURE__*/
function () {
  var _ref79 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee76(pageId, userId, addrData, source) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee76$(_context76) {
      while (1) {
        switch (_context76.prev = _context76.next) {
          case 0:
            _context76.next = 2;
            return showAddress(pageId, userId, addrData, source);

          case 2:
            prevAnswer = _context76.sent;
            _context76.next = 5;
            return askForCategory(pageId, userId);

          case 5:
            nextQuestion = _context76.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context76.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context76.stop();
        }
      }
    }, _callee76);
  }));

  return function showAddressAskForCategory(_x208, _x209, _x210, _x211) {
    return _ref79.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} pageId
 * @param {*} userId
 * @param {*} split: if true, only show categories that are marked 'is_pizza'.
 * Show only categories with split to allow user mix categories in same pizza.
 */


exports.showAddressAskForCategory = showAddressAskForCategory;

var askForCategory =
/*#__PURE__*/
function () {
  var _ref80 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee77(pageId, userId, split) {
    var categories, _txt, _options, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, item, _data, _buttons4, buttons;

    return regeneratorRuntime.wrap(function _callee77$(_context77) {
      while (1) {
        switch (_context77.prev = _context77.next) {
          case 0:
            _context77.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'category',
              waitingForData: split
            });

          case 2:
            _context77.next = 4;
            return (0, _categoriesController.getCategories)(pageId);

          case 4:
            categories = _context77.sent;
            _txt = '';

            if (split) {
              _txt = "Para escolher o ".concat(split, "o. sabor, escolha a categoria:\n");
            } else {
              _txt = 'Selecione uma categoria:';
            }

            _options = [];
            _iteratorNormalCompletion10 = true;
            _didIteratorError10 = false;
            _iteratorError10 = undefined;
            _context77.prev = 11;
            _iterator10 = categories[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
              _context77.next = 23;
              break;
            }

            item = _step10.value;

            if (!(split && !item.is_pizza)) {
              _context77.next = 17;
              break;
            }

            return _context77.abrupt("continue", 20);

          case 17:
            _data = {
              id: item.id,
              name: item.name
            };
            _buttons4 = {
              text: 'Quero',
              data: _data,
              event: 'ORDER_CATEGORY'
            };

            _options.push({
              text: item.name,
              subtext: item.name,
              buttons: _buttons4
            });

          case 20:
            _iteratorNormalCompletion10 = true;
            _context77.next = 13;
            break;

          case 23:
            _context77.next = 29;
            break;

          case 25:
            _context77.prev = 25;
            _context77.t0 = _context77["catch"](11);
            _didIteratorError10 = true;
            _iteratorError10 = _context77.t0;

          case 29:
            _context77.prev = 29;
            _context77.prev = 30;

            if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
              _iterator10.return();
            }

          case 32:
            _context77.prev = 32;

            if (!_didIteratorError10) {
              _context77.next = 35;
              break;
            }

            throw _iteratorError10;

          case 35:
            return _context77.finish(32);

          case 36:
            return _context77.finish(29);

          case 37:
            buttons = {
              text: 'Voltar',
              data: 'partial_confirmation',
              event: 'ORDER_PARTIAL_CONFIRMATION'
            };

            _options.push({
              text: 'Voltar para o pedido',
              subtext: 'Voltar para o pedido',
              buttons: buttons
            });

            return _context77.abrupt("return", {
              type: 'list',
              text: _txt,
              options: _options
            });

          case 40:
          case "end":
            return _context77.stop();
        }
      }
    }, _callee77, null, [[11, 25, 29, 37], [30,, 32, 36]]);
  }));

  return function askForCategory(_x212, _x213, _x214) {
    return _ref80.apply(this, arguments);
  };
}();

exports.askForCategory = askForCategory;

var showCategory =
/*#__PURE__*/
function () {
  var _ref81 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee78(pageId, userId, data) {
    return regeneratorRuntime.wrap(function _callee78$(_context78) {
      while (1) {
        switch (_context78.prev = _context78.next) {
          case 0:
            _context78.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              categoryId: data.id,
              eraseSize: true
            });

          case 2:
            return _context78.abrupt("return", {
              type: 'text',
              text: '✅ ' + 'Categoria: ' + data.name
            });

          case 3:
          case "end":
            return _context78.stop();
        }
      }
    }, _callee78);
  }));

  return function showCategory(_x215, _x216, _x217) {
    return _ref81.apply(this, arguments);
  };
}();

exports.showCategory = showCategory;

var showCategoryAskForSize =
/*#__PURE__*/
function () {
  var _ref82 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee79(pageId, userId, data) {
    var prevAnswer, nextQuestion;
    return regeneratorRuntime.wrap(function _callee79$(_context79) {
      while (1) {
        switch (_context79.prev = _context79.next) {
          case 0:
            _context79.next = 2;
            return showCategory(pageId, userId, data);

          case 2:
            prevAnswer = _context79.sent;
            _context79.next = 5;
            return askForSizeCat(pageId, userId, data.id);

          case 5:
            nextQuestion = _context79.sent;
            nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
            return _context79.abrupt("return", nextQuestion);

          case 8:
          case "end":
            return _context79.stop();
        }
      }
    }, _callee79);
  }));

  return function showCategoryAskForSize(_x218, _x219, _x220) {
    return _ref82.apply(this, arguments);
  };
}();

exports.showCategoryAskForSize = showCategoryAskForSize;

var askForSizeCat =
/*#__PURE__*/
function () {
  var _ref83 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee80(pageId, userId, categoryId) {
    var po, category, sizesWithPricing, size, sizeData, _text, _options, sizes, i, _data;

    return regeneratorRuntime.wrap(function _callee80$(_context80) {
      while (1) {
        switch (_context80.prev = _context80.next) {
          case 0:
            _context80.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context80.sent;
            if (!categoryId) categoryId = po.order.currentItemCategory; // User is spliting the pizza into more than one category

            if (!(po.order.originalSplit > 1 && po.order.currentItemSplit <= po.order.originalSplit)) {
              _context80.next = 8;
              break;
            }

            return _context80.abrupt("return", askForFlavor(pageId, userId, 1, po));

          case 8:
            _context80.next = 10;
            return (0, _categoriesController.getCategory)(pageId, categoryId);

          case 10:
            category = _context80.sent;

            if (!category.price_by_size) {
              _context80.next = 33;
              break;
            }

            _context80.next = 14;
            return (0, _pricingsController.getPricingSizing)(pageId, categoryId);

          case 14:
            sizesWithPricing = _context80.sent;

            if (!(sizesWithPricing.length === 1)) {
              _context80.next = 23;
              break;
            }

            _context80.next = 18;
            return (0, _sizesController.getSize)(pageId, sizesWithPricing[0]);

          case 18:
            size = _context80.sent;
            sizeData = {
              id: size.id,
              size: size.size // Update the order with the unique size and checkSplit

            };
            return _context80.abrupt("return", showSizeCheckSplit(pageId, userId, sizeData));

          case 23:
            // Without await, to run later
            (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size'
            });
            _text = 'Selecione o tamanho:';
            _options = [];
            _context80.next = 28;
            return (0, _sizesController.getSizes)(pageId, sizesWithPricing);

          case 28:
            sizes = _context80.sent;

            for (i = 0; i < sizes.length; i++) {
              _data = {
                id: sizes[i].id,
                size: sizes[i].size,
                split: sizes[i].split
              };

              _options.push({
                text: sizes[i].size,
                data: _data,
                event: 'ORDER_SIZE'
              });
            }

            return _context80.abrupt("return", {
              type: 'replies',
              text: _text,
              options: _options
            });

          case 31:
            _context80.next = 36;
            break;

          case 33:
            _context80.next = 35;
            return askForFlavor(pageId, userId, 1);

          case 35:
            return _context80.abrupt("return", _context80.sent);

          case 36:
          case "end":
            return _context80.stop();
        }
      }
    }, _callee80);
  }));

  return function askForSizeCat(_x221, _x222, _x223) {
    return _ref83.apply(this, arguments);
  };
}();

exports.askForSizeCat = askForSizeCat;
//# sourceMappingURL=botController.js.map