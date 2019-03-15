"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendRejectionNotification = exports.sendShippingNotification = exports.updateItemAskOptions = exports.showBeverage = exports.showNoBeverage = exports.askForBeverages = exports.askForWantBeverage = exports.askForSpecificItem = exports.askForOptionsToChange = exports.askForChangeOrder = exports.confirmOrder = exports.showFullOrder = exports.showPaymentChange = exports.askForPaymentChange = exports.showPaymentType = exports.askForPaymentType = exports.showOrderOrNextItem = exports.showFlavor = exports.askForFlavor = exports.askForFlavorOrConfirm = exports.getFlavorsAndToppings = exports.inputCardapioReplyMsg = exports.showSplit = exports.askForSplitFlavorOrConfirm = exports.showSize = exports.askForSize = exports.showQuantity = exports.askForQuantityMore = exports.askForQuantity = exports.showPhone = exports.confirmTypedPhone = exports.askToTypePhone = exports.askForPhone = exports.showOrderOrAskForPhone = exports.showAddress = exports.confirmAddress = exports.askToTypeAddress = exports.confirmAddressOrAskLocation = exports.confirmLocationAddress = exports.askForLocation = exports.askForWantOrder = exports.sendCardapio = exports.sendHorario = exports.sendMainMenu = exports.sendWelcomeMessage = exports.passThreadControl = exports.optionsStopOrder = exports.checkLastAction = exports.askForContinue = exports.basicReply = exports.sendErrorMsg = void 0;

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _facebookMessengerBot = require("facebook-messenger-bot");

var _pagesController = require("../controllers/pagesController");

var _pricingsController = require("../controllers/pricingsController");

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _show_cardapio = _interopRequireDefault(require("./show_cardapio"));

var _sizesController = require("../controllers/sizesController");

var _beveragesController = require("../controllers/beveragesController");

var _storesController = require("../controllers/storesController");

var _ordersController = require("../controllers/ordersController");

var _customersController = require("../controllers/customersController");

var _itemsController = require("../controllers/itemsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            _showErrorMsg = _errorMsg ? _errorMsg : 'ERRO DESCONHECIDO';
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
  regeneratorRuntime.mark(function _callee3(pageId, userId) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", {
              type: 'replies',
              text: 'Não entendi o que você quis dizer. 😞. Vamos continuar com o pedido?',
              options: [{
                text: "Sim",
                data: "continueorder_yes",
                event: 'ORDER_CONTINUE_ORDER'
              }, {
                text: "Não",
                data: "continueorder_no",
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

  return function askForContinue(_x3, _x4) {
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
    var pendingOrder, addrData, location;
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
              _context4.next = 77;
              break;
            }

            if (!(pendingOrder.order.waitingFor === 'confirm_address')) {
              _context4.next = 13;
              break;
            }

            _context4.next = 7;
            return (0, _customersController.getCustomerAddress)(pageId, userId);

          case 7:
            addrData = _context4.sent;
            _context4.next = 10;
            return confirmAddress(pageId, userId, addrData);

          case 10:
            return _context4.abrupt("return", _context4.sent);

          case 13:
            if (!(pendingOrder.order.waitingFor === 'location')) {
              _context4.next = 19;
              break;
            }

            _context4.next = 16;
            return askForLocation(pageId, userId);

          case 16:
            return _context4.abrupt("return", _context4.sent);

          case 19:
            if (!(pendingOrder.order.waitingFor === 'location_address')) {
              _context4.next = 26;
              break;
            }

            location = {
              lat: pendingOrder.order.location_lat,
              long: pendingOrder.order.location_long,
              url: pendingOrder.order.location_url
            };
            _context4.next = 23;
            return confirmLocationAddress(pageId, userId, location);

          case 23:
            return _context4.abrupt("return", _context4.sent);

          case 26:
            if (!(pendingOrder.order.waitingFor === 'size')) {
              _context4.next = 32;
              break;
            }

            _context4.next = 29;
            return askForSize(pageId, userId);

          case 29:
            return _context4.abrupt("return", _context4.sent);

          case 32:
            if (!(pendingOrder.order.waitingFor === 'quantity')) {
              _context4.next = 38;
              break;
            }

            _context4.next = 35;
            return askForQuantity(pageId, userId);

          case 35:
            return _context4.abrupt("return", _context4.sent);

          case 38:
            if (!(pendingOrder.order.waitingFor === 'split')) {
              _context4.next = 42;
              break;
            }

            return _context4.abrupt("return", askForSplitFlavorOrConfirm(pageId, userId, 1));

          case 42:
            if (!(pendingOrder.order.waitingFor === 'flavor')) {
              _context4.next = 48;
              break;
            }

            _context4.next = 45;
            return askForFlavor(pageId, userId, 1);

          case 45:
            return _context4.abrupt("return", _context4.sent);

          case 48:
            if (!(pendingOrder.order.waitingFor === 'want_beverage')) {
              _context4.next = 54;
              break;
            }

            _context4.next = 51;
            return askForWantBeverage(pageId, userId);

          case 51:
            return _context4.abrupt("return", _context4.sent);

          case 54:
            if (!(pendingOrder.order.waitingFor === 'beverage')) {
              _context4.next = 60;
              break;
            }

            _context4.next = 57;
            return askForBeverages(pageId, userId, 1);

          case 57:
            return _context4.abrupt("return", _context4.sent);

          case 60:
            if (!(pendingOrder.order.waitingFor === 'confirmation')) {
              _context4.next = 66;
              break;
            }

            _context4.next = 63;
            return showFullOrder(pageId, userId);

          case 63:
            return _context4.abrupt("return", _context4.sent);

          case 66:
            if (!(pendingOrder.order.waitingFor === 'nothing')) {
              _context4.next = 72;
              break;
            }

            _context4.next = 69;
            return showOrderOrNextItem(pageId, userId);

          case 69:
            return _context4.abrupt("return", _context4.sent);

          case 72:
            _context4.next = 74;
            return sendMainMenu();

          case 74:
            return _context4.abrupt("return", _context4.sent);

          case 75:
            _context4.next = 80;
            break;

          case 77:
            _context4.next = 79;
            return sendMainMenu();

          case 79:
            return _context4.abrupt("return", _context4.sent);

          case 80:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function checkLastAction(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.checkLastAction = checkLastAction;

var optionsStopOrder =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageId, userId) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Muito bem, aqui estão as opções:';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies(); // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });

            replies.add({
              text: "Voltar p/ Início",
              data: "stoporder_init",
              event: 'STOP_ORDER_OPTIONS'
            });
            replies.add({
              text: "Falar c/ Humano",
              data: "stoporder_human",
              event: 'STOP_ORDER_OPTIONS'
            });
            out.setQuickReplies(replies);
            return _context5.abrupt("return", out);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function optionsStopOrder(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.optionsStopOrder = optionsStopOrder;

var passThreadControl =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageId, userId) {
    var out, result, _txt, _txt2;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context6.next = 3;
            return (0, _pagesController.sendPassThreadControl)(pageId, userId);

          case 3:
            result = _context6.sent;

            if (result === 200) {
              _txt = 'Ok, a partir de agora você está nas mãos do nosso humano. \
    O que você escrever a partir de agora será respondido por uma pessoa, \
    o mais rápido possível!';
              out.add({
                text: _txt
              });
            } else {
              _txt2 = 'Ops, tivemos um probleminha. Tente novamente';
              out.add({
                text: _txt2
              });
            }

            return _context6.abrupt("return", out);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function passThreadControl(_x9, _x10) {
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
    var page, replyMsg, out;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return sender.fetch('first_name');

          case 2:
            _context7.next = 4;
            return (0, _pagesController.getOnePageData)(pageID);

          case 4:
            page = _context7.sent;
            replyMsg = new String(page.firstResponseText).replace('$NAME', sender.first_name);
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: replyMsg
            });
            return _context7.abrupt("return", out);

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function sendWelcomeMessage(_x11, _x12) {
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
  regeneratorRuntime.mark(function _callee9(pageID) {
    var _ref10, todayIsOpen, todayOpenAt, todayCloseAt, replyMsg;

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

            return _context9.abrupt("return", {
              type: 'text',
              text: replyMsg
            });

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function sendHorario(_x13) {
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
  regeneratorRuntime.mark(function _callee10(pageID) {
    var replyMsg;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return (0, _show_cardapio.default)(pageID);

          case 2:
            replyMsg = _context10.sent;
            return _context10.abrupt("return", {
              type: 'text',
              text: replyMsg
            });

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function sendCardapio(_x14) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Send Yes or No to the user asking if he wants to place an order right now.
 */


exports.sendCardapio = sendCardapio;

var askForWantOrder =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt("return", {
              type: 'replies',
              text: 'Agora que você viu nosso cardápio, você está pronto para fazer o pedido?',
              options: [{
                text: "Sim",
                data: "wantorder_yes",
                event: 'ORDER_WANT_ORDER'
              }, {
                text: "Não",
                data: "wantorder_no",
                event: 'ORDER_WANT_ORDER'
              }]
            });

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function askForWantOrder() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * Question No.01
 * If the user doesnt have an address in the database, this will be the first question.
 */


exports.askForWantOrder = askForWantOrder;

var askForLocation =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(pageId, userId, user) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              user: user,
              waitingFor: 'location'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Para começar, preciso saber aonde você está. Clique no botão abaixo que receberei a sua localização.'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Localização',
              isLocation: true,
              data: 'location_location',
              event: 'LOCATION'
            }); // replies.add({ text: 'Informar o CEP', data: 'location_cep', event: 'LOCATION' });

            out.setQuickReplies(replies);
            return _context12.abrupt("return", out);

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function askForLocation(_x15, _x16, _x17) {
    return _ref13.apply(this, arguments);
  };
}();

exports.askForLocation = askForLocation;

var confirmLocationAddress =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(pageId, userId, location, user) {
    var addresses, out, foundAnyCompleteAddress, i, element, _data, buttons, addressNumber, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              location: location,
              user: user,
              waitingFor: 'location_address'
            });

          case 2:
            _context13.next = 4;
            return (0, _customersController.getAddressLocation)(location);

          case 4:
            addresses = _context13.sent;

            if (!(addresses && addresses.length && addresses.length > 0)) {
              _context13.next = 22;
              break;
            }

            out = new _facebookMessengerBot.Elements();
            out.setListStyle('compact');
            foundAnyCompleteAddress = false;

            for (i = 0; i < 4; i++) {
              element = addresses[i];

              if (element.address_components && element.address_components.length >= 6) {
                foundAnyCompleteAddress = true;
                _data = {
                  formatted_address: element.formatted_address,
                  address_components: element.address_components
                };
                buttons = new _facebookMessengerBot.Buttons();
                buttons.add({
                  text: 'Esse!',
                  data: _data,
                  event: 'LOCATION_ADDRESS'
                });
                addressNumber = i + 1;
                out.add({
                  text: 'Endereço ' + addressNumber,
                  subtext: element.formatted_address,
                  buttons: buttons
                });
              }
            }

            if (!foundAnyCompleteAddress) {
              _context13.next = 17;
              break;
            }

            buttonsOpt = new _facebookMessengerBot.Buttons();
            buttonsOpt.add({
              text: 'Não é meu endereço..',
              data: "incorrect_address",
              event: 'LOCATION_ADDRESS'
            });
            out.add({
              buttons: buttonsOpt,
              isOnlyButtons: true
            });
            return _context13.abrupt("return", out);

          case 17:
            _context13.next = 19;
            return askToTypeAddress(pageId, userId);

          case 19:
            return _context13.abrupt("return", _context13.sent);

          case 20:
            _context13.next = 25;
            break;

          case 22:
            _context13.next = 24;
            return askToTypeAddress(pageId, userId);

          case 24:
            return _context13.abrupt("return", _context13.sent);

          case 25:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function confirmLocationAddress(_x18, _x19, _x20, _x21) {
    return _ref14.apply(this, arguments);
  };
}();

exports.confirmLocationAddress = confirmLocationAddress;

var confirmAddressOrAskLocation =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(pageId, userId, user) {
    var addrData;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _customersController.getCustomerAddress)(pageId, userId);

          case 2:
            addrData = _context14.sent;

            if (!addrData) {
              _context14.next = 7;
              break;
            }

            return _context14.abrupt("return", confirmAddress(pageId, userId, addrData, user));

          case 7:
            _context14.next = 9;
            return askForLocation(pageId, userId, user);

          case 9:
            return _context14.abrupt("return", _context14.sent);

          case 10:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function confirmAddressOrAskLocation(_x22, _x23, _x24) {
    return _ref15.apply(this, arguments);
  };
}();

exports.confirmAddressOrAskLocation = confirmAddressOrAskLocation;

var askToTypeAddress =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(pageID, userID) {
    var out;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              waitingForAddress: true,
              waitingFor: 'typed_address'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Não foi possível localizar um endereço válido. Digite o seu endereço completo por favor.'
            });
            return _context15.abrupt("return", out);

          case 5:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function askToTypeAddress(_x25, _x26) {
    return _ref16.apply(this, arguments);
  };
}();

exports.askToTypeAddress = askToTypeAddress;

var confirmAddress =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(pageId, userId, addrData, user) {
    var out, _replyText, replies;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            if (!user) {
              _context16.next = 5;
              break;
            }

            _context16.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              user: user,
              waitingForAddress: false,
              waitingFor: 'confirm_address'
            });

          case 3:
            _context16.next = 7;
            break;

          case 5:
            _context16.next = 7;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingForAddress: false,
              waitingFor: 'confirm_address'
            });

          case 7:
            out = new _facebookMessengerBot.Elements();
            _replyText = 'A entrega será para esse endereço?\n';
            _replyText = _replyText + addrData.formattedAddress;
            out.add({
              text: _replyText
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Sim',
              data: addrData,
              event: 'CORRECT_SAVED_ADDRESS'
            });
            replies.add({
              text: 'Não',
              data: addrData,
              event: 'WRONG_SAVED_ADDRESS'
            });
            out.setQuickReplies(replies);
            return _context16.abrupt("return", out);

          case 16:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function confirmAddress(_x27, _x28, _x29, _x30) {
    return _ref17.apply(this, arguments);
  };
}();

exports.confirmAddress = confirmAddress;

var showAddress =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(pageId, userId, addrData) {
    var formattedAddrData, out;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            if (!(addrData && addrData.address_components)) {
              _context17.next = 8;
              break;
            }

            _context17.next = 3;
            return (0, _customersController.formatAddrData)(addrData);

          case 3:
            formattedAddrData = _context17.sent;
            _context17.next = 6;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              addrData: formattedAddrData
            });

          case 6:
            _context17.next = 10;
            break;

          case 8:
            _context17.next = 10;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              addrData: addrData
            });

          case 10:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Ok, entregaremos nesse endereço.'
            });
            return _context17.abrupt("return", out);

          case 13:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function showAddress(_x31, _x32, _x33) {
    return _ref18.apply(this, arguments);
  };
}();

exports.showAddress = showAddress;

var showOrderOrAskForPhone =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(pageId, userId) {
    var po;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context18.sent;

            if (!(po.order && po.order.waitingFor === 'confirmation')) {
              _context18.next = 9;
              break;
            }

            _context18.next = 6;
            return showOrderOrNextItem(pageId, userId);

          case 6:
            return _context18.abrupt("return", _context18.sent);

          case 9:
            _context18.next = 11;
            return askForPhone(pageId, userId);

          case 11:
            return _context18.abrupt("return", _context18.sent);

          case 12:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function showOrderOrAskForPhone(_x34, _x35) {
    return _ref19.apply(this, arguments);
  };
}();

exports.showOrderOrAskForPhone = showOrderOrAskForPhone;

var askForPhone =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'phone'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Pode nos enviar o seu telefone para confirmar o seu pedido? Se não aparecer o seu telefone (ou estiver errado), use a opção digitar.'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Telefone',
              isPhoneNumber: true,
              data: 'phone_number',
              event: 'PHONE_NUMBER'
            });
            replies.add({
              text: 'Digitar o telefone',
              data: 'change_phone',
              event: 'PHONE_CONFIRMED'
            });
            out.setQuickReplies(replies);
            return _context19.abrupt("return", out);

          case 9:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function askForPhone(_x36, _x37) {
    return _ref20.apply(this, arguments);
  };
}();

exports.askForPhone = askForPhone;

var askToTypePhone =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(pageId, userId) {
    var out;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
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
            return _context20.abrupt("return", out);

          case 5:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function askToTypePhone(_x38, _x39) {
    return _ref21.apply(this, arguments);
  };
}();

exports.askToTypePhone = askToTypePhone;

var confirmTypedPhone =
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(pageId, userId, phone) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context21.next = 3;
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
              text: "Sim",
              data: phone,
              event: 'PHONE_CONFIRMED'
            });
            replies.add({
              text: "Não, usar outro",
              data: "change_phone",
              event: 'PHONE_CONFIRMED'
            });
            out.setQuickReplies(replies);
            return _context21.abrupt("return", out);

          case 10:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function confirmTypedPhone(_x40, _x41, _x42) {
    return _ref22.apply(this, arguments);
  };
}();

exports.confirmTypedPhone = confirmTypedPhone;

var showPhone =
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee22(pageId, userId, phone) {
    var out;
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
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
            return _context22.abrupt("return", out);

          case 5:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function showPhone(_x43, _x44, _x45) {
    return _ref23.apply(this, arguments);
  };
}(); // export const askForEmail = async () => {
//     const out = new Elements();
//     out.add({ text: 'Pode também nos enviar o seu e-mail?' });
//     const replies = new QuickReplies();
//     replies.add({ text: 'E-mail', isPhoneNumber: true, data: 'phone_number', event: 'PHONE_NUMBER' });
//     out.setQuickReplies(replies);
//     return out;
// }


exports.showPhone = showPhone;

var askForQuantity =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Quantas pizzas você quer?'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: '1',
              data: 'qty_1',
              event: 'ORDER_QTY'
            });
            replies.add({
              text: '2',
              data: 'qty_2',
              event: 'ORDER_QTY'
            });
            replies.add({
              text: '3',
              data: 'qty_3',
              event: 'ORDER_QTY'
            });
            replies.add({
              text: '+ de 3',
              data: 'qty_more',
              event: 'ORDER_QTY'
            });
            out.setQuickReplies(replies);
            _context23.next = 10;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'quantity'
            });

          case 10:
            return _context23.abrupt("return", out);

          case 11:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function askForQuantity(_x46, _x47) {
    return _ref24.apply(this, arguments);
  };
}();

exports.askForQuantity = askForQuantity;

var askForQuantityMore =
/*#__PURE__*/
function () {
  var _ref25 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee24(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Por favor informe a quantidade de pizzas:'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: '- de 4',
              data: 'qty_less',
              event: 'ORDER_QTY'
            });
            replies.add({
              text: '4',
              data: 'qty_4',
              event: 'ORDER_QTY'
            });
            replies.add({
              text: '5',
              data: 'qty_5',
              event: 'ORDER_QTY'
            });
            replies.add({
              text: '6',
              data: 'qty_6',
              event: 'ORDER_QTY'
            }); // replies.add({ text: '+ de 6', data: 'qty_more_more', event: 'ORDER_QTY' });

            out.setQuickReplies(replies);
            _context24.next = 10;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'quantity'
            });

          case 10:
            return _context24.abrupt("return", out);

          case 11:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function askForQuantityMore(_x48, _x49) {
    return _ref25.apply(this, arguments);
  };
}();

exports.askForQuantityMore = askForQuantityMore;

var showQuantity =
/*#__PURE__*/
function () {
  var _ref26 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee25(pageId, userId, data) {
    var qty, out;
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            // data is 'qty_1', 'qty_2', 'qty_3'...
            qty = new String(data).substr(data.length - 1, 1);
            _context25.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              qty: qty,
              waitingFor: 'size',
              currentItem: 1
            });

          case 3:
            out = new _facebookMessengerBot.Elements();

            if (qty == 1) {
              out.add({
                text: '✅ ' + ' 1 pizza.'
              });
            } else {
              out.add({
                text: '✅ ' + qty + ' pizzas.'
              });
            }

            return _context25.abrupt("return", out);

          case 6:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));

  return function showQuantity(_x50, _x51, _x52) {
    return _ref26.apply(this, arguments);
  };
}();

exports.showQuantity = showQuantity;

var askForSize =
/*#__PURE__*/
function () {
  var _ref27 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee26(pageId, userId) {
    var out, po, _text, replies, sizesWithPricing, sizes, i, _data;

    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context26.next = 3;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 3:
            po = _context26.sent;

            if (!po.order) {
              _context26.next = 26;
              break;
            }

            _text = '';

            if (po.order.qty_total === 1) {
              _text = 'Qual o tamanho da pizza?';
            } else {
              _text = 'Agora vou pegar os detalhes da ' + po.order.currentItem + 'a. pizza.\n';
              _text = _text + 'Qual o tamanho dela?';
            }

            out.add({
              text: _text
            });
            replies = new _facebookMessengerBot.QuickReplies();
            _context26.next = 11;
            return (0, _pricingsController.getPricingSizing)(pageId);

          case 11:
            sizesWithPricing = _context26.sent;
            _context26.next = 14;
            return (0, _sizesController.getSizes)(pageId, sizesWithPricing);

          case 14:
            sizes = _context26.sent;

            for (i = 0; i < sizes.length; i++) {
              _data = {
                id: sizes[i].id,
                size: sizes[i].size,
                split: sizes[i].split
              };
              replies.add({
                text: sizes[i].size,
                data: _data,
                event: 'ORDER_SIZE'
              });
            }

            out.setQuickReplies(replies);

            if (!(po.order.qty_total === 1)) {
              _context26.next = 22;
              break;
            }

            _context26.next = 20;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size'
            });

          case 20:
            _context26.next = 24;
            break;

          case 22:
            _context26.next = 24;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size',
              qty: po.order.qty_total,
              eraseSplit: true
            });

          case 24:
            _context26.next = 27;
            break;

          case 26:
            out.add({
              text: MSG_GENERAL_ERROR
            });

          case 27:
            return _context26.abrupt("return", out);

          case 28:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function askForSize(_x53, _x54) {
    return _ref27.apply(this, arguments);
  };
}();

exports.askForSize = askForSize;

var showSize =
/*#__PURE__*/
function () {
  var _ref28 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee27(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            if (!(data && data.split && data.split > 1)) {
              _context27.next = 5;
              break;
            }

            _context27.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              waitingFor: 'split'
            });

          case 3:
            _context27.next = 7;
            break;

          case 5:
            _context27.next = 7;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              waitingFor: 'flavor'
            });

          case 7:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + ' Tamanho: ' + data.size
            });
            return _context27.abrupt("return", out);

          case 10:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));

  return function showSize(_x55, _x56, _x57) {
    return _ref28.apply(this, arguments);
  };
}();

exports.showSize = showSize;

var askForSplitFlavorOrConfirm =
/*#__PURE__*/
function () {
  var _ref29 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee28(pageId, userId, multiple) {
    var pendingOrder, currentSize, _txt, out, replies, i, _replyText;

    return regeneratorRuntime.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _context28.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context28.sent;

            if (!pendingOrder.order) {
              _context28.next = 21;
              break;
            }

            _context28.next = 6;
            return (0, _sizesController.getSize)(pageId, pendingOrder.order.currentItemSize);

          case 6:
            currentSize = _context28.sent;

            if (!(currentSize.split && currentSize.split > 1)) {
              _context28.next = 18;
              break;
            }

            _txt = 'A pizza ' + currentSize.size + ' pode ser dividida em ' + currentSize.split + ' sabores.\n';
            _txt = _txt + 'Escolha quantos sabores você quer:';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();

            for (i = 1; i <= currentSize.split; i++) {
              _replyText = i === 1 ? i + ' Sabor' : i + ' Sabores';
              replies.add({
                text: _replyText,
                data: i,
                event: 'ORDER_SPLIT'
              });
            }

            out.setQuickReplies(replies);
            return _context28.abrupt("return", out);

          case 18:
            _context28.next = 20;
            return askForFlavorOrConfirm(pageId, userId, multiple);

          case 20:
            return _context28.abrupt("return", _context28.sent);

          case 21:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28);
  }));

  return function askForSplitFlavorOrConfirm(_x58, _x59, _x60) {
    return _ref29.apply(this, arguments);
  };
}();
/**
 * After user answer if he wants to split the pizza, show the chosen option.
 * @param {*} pageId 
 * @param {*} userId 
 * @param {*} data 
 */


exports.askForSplitFlavorOrConfirm = askForSplitFlavorOrConfirm;

var showSplit =
/*#__PURE__*/
function () {
  var _ref30 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee29(pageId, userId, data) {
    var _txtFlavor, out;

    return regeneratorRuntime.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              waitingFor: 'flavor',
              originalSplit: data
            });

          case 2:
            _txtFlavor = data === 1 ? 'Sabor' : 'Sabores';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + data + ' ' + _txtFlavor
            });
            return _context29.abrupt("return", out);

          case 6:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));

  return function showSplit(_x61, _x62, _x63) {
    return _ref30.apply(this, arguments);
  };
}();

exports.showSplit = showSplit;

var inputCardapioReplyMsg = function inputCardapioReplyMsg(flavorArray) {
  var replyMsg = '';

  if (flavorArray) {
    for (var i = 0; i < flavorArray.length; i++) {
      var flavor = flavorArray[i];
      replyMsg = replyMsg + '𝐒𝐚𝐛𝐨𝐫: ' + flavor.flavor + '\n';
      replyMsg = replyMsg + '𝐈𝐧𝐠𝐫𝐞𝐝𝐢𝐞𝐧𝐭𝐞𝐬: ' + flavor.toppingsNames.join(", ");
      replyMsg = replyMsg + '\n\n';
    }
  }

  return replyMsg;
};
/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID 
 * @param {*} sizeID 
 */


exports.inputCardapioReplyMsg = inputCardapioReplyMsg;

var getFlavorsAndToppings =
/*#__PURE__*/
function () {
  var _ref31 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee30(pageID, sizeID) {
    var flavorArray, flavorsWithPrice, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, pricing;

    return regeneratorRuntime.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.prev = 0;
            _context30.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context30.sent;
            flavorsWithPrice = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context30.prev = 8;
            _iterator = flavorArray[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context30.next = 32;
              break;
            }

            flavor = _step.value;

            if (!sizeID) {
              _context30.next = 17;
              break;
            }

            _context30.next = 15;
            return getOnePricing(pageID, flavor.kind, sizeID);

          case 15:
            pricing = _context30.sent;

            if (pricing) {
              flavor.price = pricing.price;
            }

          case 17:
            if (!sizeID) {
              _context30.next = 25;
              break;
            }

            if (!flavor.price) {
              _context30.next = 23;
              break;
            }

            _context30.next = 21;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 21:
            flavor.toppingsNames = _context30.sent;
            flavorsWithPrice.push(flavor);

          case 23:
            _context30.next = 29;
            break;

          case 25:
            _context30.next = 27;
            return (0, _toppingsController.getToppingsNames)(flavor.toppings, pageID);

          case 27:
            flavor.toppingsNames = _context30.sent;
            flavorsWithPrice.push(flavor);

          case 29:
            _iteratorNormalCompletion = true;
            _context30.next = 10;
            break;

          case 32:
            _context30.next = 38;
            break;

          case 34:
            _context30.prev = 34;
            _context30.t0 = _context30["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context30.t0;

          case 38:
            _context30.prev = 38;
            _context30.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 41:
            _context30.prev = 41;

            if (!_didIteratorError) {
              _context30.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context30.finish(41);

          case 45:
            return _context30.finish(38);

          case 46:
            return _context30.abrupt("return", flavorsWithPrice);

          case 49:
            _context30.prev = 49;
            _context30.t1 = _context30["catch"](0);
            console.error({
              flavorsAndToppingsErr: _context30.t1
            });

          case 52:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, null, [[0, 49], [8, 34, 38, 46], [39,, 41, 45]]);
  }));

  return function getFlavorsAndToppings(_x64, _x65) {
    return _ref31.apply(this, arguments);
  };
}();

exports.getFlavorsAndToppings = getFlavorsAndToppings;

var askForFlavorOrConfirm =
/*#__PURE__*/
function () {
  var _ref32 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee31(pageId, userId, multiple, split) {
    var pendingOrder, currentSize, i;
    return regeneratorRuntime.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            _context31.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context31.sent;

            if (!pendingOrder.order) {
              _context31.next = 28;
              break;
            }

            if (!(split && split > 1)) {
              _context31.next = 10;
              break;
            }

            _context31.next = 7;
            return askForFlavor(pageId, userId, multiple, split, pendingOrder);

          case 7:
            return _context31.abrupt("return", _context31.sent);

          case 10:
            _context31.next = 12;
            return (0, _sizesController.getSize)(pageId, pendingOrder.order.currentItemSize);

          case 12:
            currentSize = _context31.sent;

            if (!(pendingOrder.items && pendingOrder.items.length)) {
              _context31.next = 28;
              break;
            }

            i = 0;

          case 15:
            if (!(i < pendingOrder.items.length)) {
              _context31.next = 25;
              break;
            }

            if (!(pendingOrder.items[i].status === 0 && pendingOrder.items[i].flavorId > 0)) {
              _context31.next = 22;
              break;
            }

            _context31.next = 19;
            return (0, _itemsController.updateStatusSpecificItem)(pendingOrder.items[i]._id, 1);

          case 19:
            _context31.next = 21;
            return showOrderOrNextItem(pageId, userId);

          case 21:
            return _context31.abrupt("return", _context31.sent);

          case 22:
            i++;
            _context31.next = 15;
            break;

          case 25:
            _context31.next = 27;
            return askForFlavor(pageId, userId, multiple);

          case 27:
            return _context31.abrupt("return", _context31.sent);

          case 28:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));

  return function askForFlavorOrConfirm(_x66, _x67, _x68, _x69) {
    return _ref32.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} pageId 
 * @param {*} userId 
 * @param {*} multiple: if are the first 4 flavors, multiple=1, if are the next, multiple=2 and so on. 
 */


exports.askForFlavorOrConfirm = askForFlavorOrConfirm;

var askForFlavor =
/*#__PURE__*/
function () {
  var _ref33 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee32(pageId, userId, multiple, split, pendingOrder) {
    var out, po, flavorsArray, _rangeIni, _rangeEnd, i, _fl, _data, buttons, _subtext, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.setListStyle('compact'); // or 'large'

            po = null;

            if (!pendingOrder) {
              _context32.next = 7;
              break;
            }

            po = pendingOrder;
            _context32.next = 10;
            break;

          case 7:
            _context32.next = 9;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 9:
            po = _context32.sent;

          case 10:
            _context32.next = 12;
            return getFlavorsAndToppings(pageId, po.order.currentItemSize);

          case 12:
            flavorsArray = _context32.sent;
            _rangeIni = (multiple - 1) * 4;
            _rangeEnd = multiple * 4;

            for (i = _rangeIni; i < _rangeEnd; i++) {
              if (flavorsArray[i]) {
                _fl = flavorsArray[i];
                _data = {
                  id: _fl.id,
                  flavor: _fl.flavor
                };
                buttons = new _facebookMessengerBot.Buttons();
                buttons.add({
                  text: 'Quero',
                  data: _data,
                  event: 'ORDER_FLAVOR'
                });
                _subtext = _fl.toppingsNames.join();

                if (_fl.price) {
                  _subtext = _subtext.concat('\n R$', _fl.price);
                }

                out.add({
                  text: _fl.flavor,
                  subtext: _subtext,
                  buttons: buttons
                });
              }
            }

            if (flavorsArray.length > _rangeEnd) {
              multiple++;
              buttonsOpt = new _facebookMessengerBot.Buttons();
              buttonsOpt.add({
                text: '+ Opções',
                data: {
                  option: "flavors_more",
                  multiple: multiple
                },
                event: 'ORDER_FLAVOR'
              });
              out.add({
                buttons: buttonsOpt,
                isOnlyButtons: true
              });
            }

            _context32.next = 19;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'flavor',
              split: split
            });

          case 19:
            return _context32.abrupt("return", out);

          case 20:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));

  return function askForFlavor(_x70, _x71, _x72, _x73, _x74) {
    return _ref33.apply(this, arguments);
  };
}();

exports.askForFlavor = askForFlavor;

var showFlavor =
/*#__PURE__*/
function () {
  var _ref34 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee33(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              flavorId: data.id,
              completeItem: true,
              waitingFor: 'nothing',
              calcTotal: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + ' Sabor: ' + data.flavor
            });
            return _context33.abrupt("return", out);

          case 5:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));

  return function showFlavor(_x75, _x76, _x77) {
    return _ref34.apply(this, arguments);
  };
}();

exports.showFlavor = showFlavor;

var showOrderOrNextItem =
/*#__PURE__*/
function () {
  var _ref35 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee34(pageId, userId) {
    var po, split, nextItem, out, total_price, _txt, i, _item, _txtQty, replies;

    return regeneratorRuntime.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context34.sent;

            if (!(po.order.currentItemSplit > 1)) {
              _context34.next = 10;
              break;
            }

            split = po.order.currentItemSplit - 1;
            _context34.next = 7;
            return askForFlavor(pageId, userId, 1, split, po);

          case 7:
            return _context34.abrupt("return", _context34.sent);

          case 10:
            if (!(po.order.qty_total > 1 && po.order.item_complete < po.order.qty_total)) {
              _context34.next = 19;
              break;
            }

            nextItem = po.order.currentItem + 1;
            _context34.next = 14;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size',
              currentItem: nextItem
            });

          case 14:
            _context34.next = 16;
            return askForSize(pageId, userId);

          case 16:
            return _context34.abrupt("return", _context34.sent);

          case 19:
            _context34.next = 21;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'want_beverage'
            });

          case 21:
            out = new _facebookMessengerBot.Elements();
            total_price = 0;
            _txt = 'Seguem os detalhes do seu pedido:\n';
            _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼:' + po.order.id + '\n';

            for (i = 0; i < po.items.length; i++) {
              _item = po.items[i];

              if (_item.flavorId && _item.sizeId) {
                _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;
                _txt = _txt + "".concat(_txtQty, " pizza ").concat(_item.size, " de ").concat(_item.flavor, "\n");
              } else if (_item.beverageId && _item.beverage) {
                _txt = _txt + "1 ".concat(_item.beverage, "\n");
              }

              total_price += _item.price;
            }

            _txt = _txt + '𝗘𝗻𝗱𝗲𝗿𝗲𝗰̧𝗼 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ' + po.order.address + '\n';
            _txt = _txt + '𝗧𝗲𝗹𝗲𝗳𝗼𝗻𝗲: ' + po.order.phone + '\n';
            _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: R$ ' + total_price + '\n';
            _txt = _txt + 'O pedido está correto?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Sim",
              data: "confirmation_yes",
              event: 'ORDER_PIZZA_CONFIRMATION'
            });
            replies.add({
              text: "Não",
              data: "confirmation_no",
              event: 'ORDER_PIZZA_CONFIRMATION'
            });
            out.setQuickReplies(replies);
            return _context34.abrupt("return", out);

          case 36:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34);
  }));

  return function showOrderOrNextItem(_x78, _x79) {
    return _ref35.apply(this, arguments);
  };
}();

exports.showOrderOrNextItem = showOrderOrNextItem;

var askForPaymentType =
/*#__PURE__*/
function () {
  var _ref36 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee35(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Qual a forma de pagamento?'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Dinheiro',
              data: 'payment_money',
              event: 'ORDER_PAYMENT_TYPE'
            });
            replies.add({
              text: 'Cartão',
              data: 'payment_card',
              event: 'ORDER_PAYMENT_TYPE'
            });
            out.setQuickReplies(replies);
            _context35.next = 8;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'payment_type'
            });

          case 8:
            return _context35.abrupt("return", out);

          case 9:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function askForPaymentType(_x80, _x81) {
    return _ref36.apply(this, arguments);
  };
}();

exports.askForPaymentType = askForPaymentType;

var showPaymentType =
/*#__PURE__*/
function () {
  var _ref37 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee36(pageId, userId, data) {
    var _txtPaymentType, out;

    return regeneratorRuntime.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              paymentType: data
            });

          case 2:
            _txtPaymentType = data === 'payment_money' ? 'Dinheiro' : 'Cartão';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + ' Forma de pagamento: ' + _txtPaymentType
            });
            return _context36.abrupt("return", out);

          case 6:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36);
  }));

  return function showPaymentType(_x82, _x83, _x84) {
    return _ref37.apply(this, arguments);
  };
}();

exports.showPaymentType = showPaymentType;

var askForPaymentChange =
/*#__PURE__*/
function () {
  var _ref38 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee37(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Precisa de troco?'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Sim',
              data: 'payment_change_yes',
              event: 'ORDER_PAYMENT_CHANGE'
            });
            replies.add({
              text: 'Não',
              data: 'payment_change_no',
              event: 'ORDER_PAYMENT_CHANGE'
            });
            out.setQuickReplies(replies);
            _context37.next = 8;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'payment_change'
            });

          case 8:
            return _context37.abrupt("return", out);

          case 9:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37);
  }));

  return function askForPaymentChange(_x85, _x86) {
    return _ref38.apply(this, arguments);
  };
}();

exports.askForPaymentChange = askForPaymentChange;

var showPaymentChange =
/*#__PURE__*/
function () {
  var _ref39 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee38(pageId, userId, data) {
    var _txtPaymentChange, out;

    return regeneratorRuntime.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              paymentChange: data
            });

          case 2:
            _txtPaymentChange = data === 'payment_change_yes' ? 'Levaremos trocado' : 'Não precisa de troco';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + _txtPaymentChange
            });
            return _context38.abrupt("return", out);

          case 6:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38);
  }));

  return function showPaymentChange(_x87, _x88, _x89) {
    return _ref39.apply(this, arguments);
  };
}();

exports.showPaymentChange = showPaymentChange;

var showFullOrder =
/*#__PURE__*/
function () {
  var _ref40 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee39(pageId, userId) {
    var po, out, total_price, _txt, i, _item, _txtQty, _txtPaymentType, replies;

    return regeneratorRuntime.wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context39.sent;
            out = new _facebookMessengerBot.Elements();
            total_price = 0;
            _txt = 'Seguem os detalhes do seu pedido:\n';
            _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼: ' + po.order.id + '\n';

            for (i = 0; i < po.items.length; i++) {
              _item = po.items[i];

              if (_item.flavorId && _item.sizeId) {
                _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;
                _txt = _txt + "".concat(_txtQty, " pizza ").concat(_item.size, " de ").concat(_item.flavor, "\n");
              } else if (_item.beverageId && _item.beverage) {
                _txt = _txt + "1 ".concat(_item.beverage, "\n");
              }

              total_price += _item.price;
            }

            _txt = _txt + '𝗘𝗻𝗱𝗲𝗿𝗲𝗰̧𝗼 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ' + po.order.address + '\n';
            _txt = _txt + '𝗧𝗲𝗹𝗲𝗳𝗼𝗻𝗲: ' + po.order.phone + '\n';
            _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: R$ ' + total_price + '\n';
            _txtPaymentType = po.payment_type === 'payment_card' ? 'Cartão' : 'Dinheiro';
            _txt = _txt + '𝗙𝗼𝗿𝗺𝗮 𝗱𝗲 𝗣𝗮𝗴𝗮𝗺𝗲𝗻𝘁𝗼: ' + _txtPaymentType + '\n';

            if (po.payment_change === 'payment_change_yes') {
              _txt = _txt + '𝗟𝗲𝘃𝗮𝗿 𝗧𝗿𝗼𝗰𝗼? Sim \n';
            }

            _txt = _txt + 'Posso confirmar o pedido?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Sim",
              data: "confirmation_yes",
              event: 'ORDER_CONFIRMATION'
            });
            replies.add({
              text: "Não",
              data: "confirmation_no",
              event: 'ORDER_CONFIRMATION'
            });
            out.setQuickReplies(replies);
            return _context39.abrupt("return", out);

          case 21:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39);
  }));

  return function showFullOrder(_x90, _x91) {
    return _ref40.apply(this, arguments);
  };
}();

exports.showFullOrder = showFullOrder;

var confirmOrder =
/*#__PURE__*/
function () {
  var _ref41 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee40(pageId, userId) {
    var out;
    return regeneratorRuntime.wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            _context40.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              confirmOrder: true,
              calcTotal: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: "Pedido Confirmado!"
            });
            return _context40.abrupt("return", out);

          case 5:
          case "end":
            return _context40.stop();
        }
      }
    }, _callee40);
  }));

  return function confirmOrder(_x92, _x93) {
    return _ref41.apply(this, arguments);
  };
}();

exports.confirmOrder = confirmOrder;

var askForChangeOrder =
/*#__PURE__*/
function () {
  var _ref42 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee41(pageId, userId) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context41.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'confirmation'
            });

          case 3:
            _txt = 'O que você gostaria de fazer com o seu pedido?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Mudar pedido",
              data: "changeOrder",
              event: 'ORDER_WANT_CHANGE'
            });
            replies.add({
              text: "Mudar endereço",
              data: "change_address",
              event: 'ORDER_CHANGE'
            });
            replies.add({
              text: "Confirmar.",
              data: "confirmation_yes",
              event: 'ORDER_CONFIRMATION'
            });
            out.setQuickReplies(replies);
            return _context41.abrupt("return", out);

          case 11:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));

  return function askForChangeOrder(_x94, _x95) {
    return _ref42.apply(this, arguments);
  };
}();

exports.askForChangeOrder = askForChangeOrder;

var askForOptionsToChange =
/*#__PURE__*/
function () {
  var _ref43 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee42(pageId, userId, item) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee42$(_context42) {
      while (1) {
        switch (_context42.prev = _context42.next) {
          case 0:
            _context42.prev = 0;

            if (!(item && item.beverageId)) {
              _context42.next = 7;
              break;
            }

            _context42.next = 4;
            return askForBeverages(pageId, userId, 1);

          case 4:
            return _context42.abrupt("return", _context42.sent);

          case 7:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Ok, qual das informações que você gostaria de alterar?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies(); // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });

            replies.add({
              text: "Tamanho",
              data: "change_size",
              event: 'ORDER_CHANGE'
            });
            replies.add({
              text: "Sabor",
              data: "change_flavor",
              event: 'ORDER_CHANGE'
            });
            out.setQuickReplies(replies);
            return _context42.abrupt("return", out);

          case 15:
            _context42.next = 21;
            break;

          case 17:
            _context42.prev = 17;
            _context42.t0 = _context42["catch"](0);
            console.error({
              askForOptionsToChangeErr: _context42.t0
            });
            throw _context42.t0;

          case 21:
          case "end":
            return _context42.stop();
        }
      }
    }, _callee42, null, [[0, 17]]);
  }));

  return function askForOptionsToChange(_x96, _x97, _x98) {
    return _ref43.apply(this, arguments);
  };
}();

exports.askForOptionsToChange = askForOptionsToChange;

var askForSpecificItem =
/*#__PURE__*/
function () {
  var _ref44 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee43(pageId, userId) {
    var pendingOrder, out, replies, i;
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
            pendingOrder = _context43.sent;

            if (!(pendingOrder.items && pendingOrder.items.length > 1)) {
              _context43.next = 13;
              break;
            }

            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Primeiro, escolha qual os itens deseja mudar:'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            i = 1;
            pendingOrder.items.forEach(function (item) {
              var _txt = item.flavor ? item.flavor : item.beverage;

              replies.add({
                text: i + "a. " + _txt,
                data: item._id,
                event: 'ORDER_CHANGE_SELECT_ITEM'
              });
              i++;
            });
            out.setQuickReplies(replies);
            return _context43.abrupt("return", out);

          case 13:
            _context43.next = 15;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              completeItem: false
            });

          case 15:
            _context43.next = 17;
            return askForOptionsToChange(pageId, userId);

          case 17:
            return _context43.abrupt("return", _context43.sent);

          case 18:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));

  return function askForSpecificItem(_x99, _x100) {
    return _ref44.apply(this, arguments);
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
  var _ref45 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee44(pageId, userId) {
    var pendingOrder, noBeverage, out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            _context44.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            pendingOrder = _context44.sent;
            noBeverage = pendingOrder.order.no_beverage;

            if (!(typeof noBeverage === 'undefined')) {
              _context44.next = 15;
              break;
            }

            out = new _facebookMessengerBot.Elements();
            _txt = 'Gostaria de algo para beber?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies(); // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });

            replies.add({
              text: "Sim",
              data: "beverage_yes",
              event: 'ORDER_CONFIRM_BEVERAGE'
            });
            replies.add({
              text: "Não",
              data: "beverage_no",
              event: 'ORDER_CONFIRM_BEVERAGE'
            });
            out.setQuickReplies(replies);
            return _context44.abrupt("return", out);

          case 15:
            return _context44.abrupt("return", showFullOrder(pageId, userId));

          case 16:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));

  return function askForWantBeverage(_x101, _x102) {
    return _ref45.apply(this, arguments);
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
  var _ref46 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee45(pageId, userId, multiple) {
    var out, beveragesArr, _rangeIni, _rangeEnd, i, _bev, _data, buttons, _subtext, buttonsOpt, _data2, _buttons, _subtext2;

    return regeneratorRuntime.wrap(function _callee45$(_context45) {
      while (1) {
        switch (_context45.prev = _context45.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.setListStyle('compact'); // or 'large'
            // const po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: false });

            _context45.next = 4;
            return (0, _beveragesController.getBeverages)(pageId);

          case 4:
            beveragesArr = _context45.sent;
            _rangeIni = (multiple - 1) * 4;
            _rangeEnd = multiple * 4;

            for (i = _rangeIni; i < _rangeEnd; i++) {
              if (beveragesArr[i]) {
                _bev = beveragesArr[i];
                _data = {
                  id: _bev.id,
                  beverage: _bev.name,
                  price: _bev.price
                };
                buttons = new _facebookMessengerBot.Buttons();
                buttons.add({
                  text: 'Quero',
                  data: _data,
                  event: 'ORDER_BEVERAGE'
                });
                _subtext = _bev.kind;

                if (_bev.price) {
                  _subtext = _subtext.concat('\n R$', _bev.price);
                }

                out.add({
                  text: _bev.name,
                  subtext: _subtext,
                  buttons: buttons
                });
              }
            }

            if (beveragesArr.length + 1 > _rangeEnd) {
              multiple++;
              buttonsOpt = new _facebookMessengerBot.Buttons();
              buttonsOpt.add({
                text: '+ Opções (clique aqui para ver + opções..)',
                data: {
                  option: "beverages_more",
                  multiple: multiple
                },
                event: 'ORDER_BEVERAGE'
              });
              out.add({
                buttons: buttonsOpt,
                isOnlyButtons: true
              });
            } else {
              // const lastButton = new Buttons();
              // lastButton.add({ text: 'Não tem, cancelar.', data: { option: "beverages_cancel" }, event: 'ORDER_BEVERAGE' });
              // out.add({ buttons: lastButton, isOnlyButtons: true });
              _data2 = {
                option: 'beverages_cancel'
              };
              _buttons = new _facebookMessengerBot.Buttons();

              _buttons.add({
                text: 'Sem bebida',
                data: _data2,
                event: 'ORDER_BEVERAGE'
              });

              _subtext2 = 'Se não encontrou, clique em "Sem bebida"';
              out.add({
                text: 'Não encontrei',
                subtext: _subtext2,
                buttons: _buttons
              });
            }

            _context45.next = 11;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'beverage',
              noBeverage: false
            });

          case 11:
            return _context45.abrupt("return", out);

          case 12:
          case "end":
            return _context45.stop();
        }
      }
    }, _callee45);
  }));

  return function askForBeverages(_x103, _x104, _x105) {
    return _ref46.apply(this, arguments);
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
  var _ref47 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee46(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee46$(_context46) {
      while (1) {
        switch (_context46.prev = _context46.next) {
          case 0:
            _context46.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              noBeverage: true,
              waitingFor: 'confirm'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '❌ ' + ' Sem bebida para o seu pedido. '
            });
            return _context46.abrupt("return", out);

          case 5:
          case "end":
            return _context46.stop();
        }
      }
    }, _callee46);
  }));

  return function showNoBeverage(_x106, _x107, _x108) {
    return _ref47.apply(this, arguments);
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
  var _ref48 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee47(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee47$(_context47) {
      while (1) {
        switch (_context47.prev = _context47.next) {
          case 0:
            _context47.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              beverageId: data.id,
              beveragePrice: data.price,
              completeItem: true,
              noBeverage: false,
              waitingFor: 'confirmation',
              calcTotal: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + '1 Bebida: ' + data.beverage
            });
            return _context47.abrupt("return", out);

          case 5:
          case "end":
            return _context47.stop();
        }
      }
    }, _callee47);
  }));

  return function showBeverage(_x109, _x110, _x111) {
    return _ref48.apply(this, arguments);
  };
}();

exports.showBeverage = showBeverage;

var updateItemAskOptions =
/*#__PURE__*/
function () {
  var _ref49 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee48(pageId, userId, objectId) {
    var item;
    return regeneratorRuntime.wrap(function _callee48$(_context48) {
      while (1) {
        switch (_context48.prev = _context48.next) {
          case 0:
            _context48.next = 2;
            return (0, _itemsController.updateStatusSpecificItem)(objectId, 0);

          case 2:
            item = _context48.sent;
            _context48.next = 5;
            return askForOptionsToChange(pageId, userId, item);

          case 5:
            return _context48.abrupt("return", _context48.sent);

          case 6:
          case "end":
            return _context48.stop();
        }
      }
    }, _callee48);
  }));

  return function updateItemAskOptions(_x112, _x113, _x114) {
    return _ref49.apply(this, arguments);
  };
}();

exports.updateItemAskOptions = updateItemAskOptions;

var sendShippingNotification =
/*#__PURE__*/
function () {
  var _ref50 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee49(pageId, userId, orderId) {
    var _ref51, accessToken, _txt, out;

    return regeneratorRuntime.wrap(function _callee49$(_context49) {
      while (1) {
        switch (_context49.prev = _context49.next) {
          case 0:
            _context49.next = 2;
            return (0, _pagesController.getOnePageToken)(pageId);

          case 2:
            _ref51 = _context49.sent;
            accessToken = _ref51.accessToken;
            _txt = 'O seu pedido número ' + orderId + ' acabou de sair para entrega. Bom apetite!';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: _txt
            });
            _context49.next = 9;
            return _facebookMessengerBot.Bot.send_message_tag(accessToken, userId, out);

          case 9:
          case "end":
            return _context49.stop();
        }
      }
    }, _callee49);
  }));

  return function sendShippingNotification(_x115, _x116, _x117) {
    return _ref50.apply(this, arguments);
  };
}();

exports.sendShippingNotification = sendShippingNotification;

var sendRejectionNotification =
/*#__PURE__*/
function () {
  var _ref52 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee50(pageId, userId, orderId, rejectionExplanation) {
    var _ref53, accessToken, _txt, out;

    return regeneratorRuntime.wrap(function _callee50$(_context50) {
      while (1) {
        switch (_context50.prev = _context50.next) {
          case 0:
            _context50.next = 2;
            return (0, _pagesController.getOnePageToken)(pageId);

          case 2:
            _ref53 = _context50.sent;
            accessToken = _ref53.accessToken;
            _txt = 'Infelizmente não poderemos atender o seu pedido número ' + orderId + '. Segue o motivo: ' + rejectionExplanation;
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: _txt
            });
            _context50.next = 9;
            return _facebookMessengerBot.Bot.send_message_tag(accessToken, userId, out);

          case 9:
          case "end":
            return _context50.stop();
        }
      }
    }, _callee50);
  }));

  return function sendRejectionNotification(_x118, _x119, _x120, _x121) {
    return _ref52.apply(this, arguments);
  };
}();

exports.sendRejectionNotification = sendRejectionNotification;
//# sourceMappingURL=bkpBotController.js.map