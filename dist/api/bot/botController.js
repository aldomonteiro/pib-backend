"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendShippingNotification = exports.updateItemAskOptions = exports.showBeverage = exports.showNoBeverage = exports.askForBeverages = exports.askForWantBeverage = exports.askForSpecificItem = exports.askForOptionsToChange = exports.askForChangeOrder = exports.confirmOrder = exports.showFullOrder = exports.showOrderOrNextItem = exports.showFlavor = exports.askForFlavor = exports.askForFlavorOrConfirm = exports.showSplit = exports.askForSplitFlavorOrConfirm = exports.showSize = exports.askForSize = exports.showQuantity = exports.askForQuantityMore = exports.askForQuantity = exports.showPhone = exports.confirmTypedPhone = exports.askToTypePhone = exports.askForPhone = exports.showOrderOrAskForPhone = exports.showAddress = exports.confirmTypedText = exports.askToTypeAddress = exports.confirmAddressOrAskLocation = exports.confirmLocationAddress = exports.askForLocation = exports.sendCardapio = exports.sendHorario = exports.sendMainMenu = exports.sendWelcomeMessage = exports.basicReply = exports.sendErrorMsg = void 0;

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _facebookMessengerBot = require("facebook-messenger-bot");

var _pagesController = require("../controllers/pagesController");

var _pricingsController = require("../controllers/pricingsController");

var _show_cardapio = _interopRequireDefault(require("./show_cardapio"));

var _actionsController = require("./actionsController");

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

var MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico'; // create a custom timestamp format for log statements

var SimpleNodeLogger = require('simple-node-logger'),
    opts = {
  logFilePath: 'logs/bot.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
},
    log = SimpleNodeLogger.createSimpleLogger(opts);

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
              text: 'Ops, tivemos um probleminha técnico: ' + _showErrorMsg
            });
            return _context.abrupt("return", out);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sendErrorMsg(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.sendErrorMsg = sendErrorMsg;

var basicReply =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var out;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Hi, how are you doing?'
            });
            return _context2.abrupt("return", out);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function basicReply() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} sender 
 * @param {*} pageID 
 */


exports.basicReply = basicReply;

var sendWelcomeMessage =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, sender) {
    var page, replyMsg, out;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return sender.fetch('first_name');

          case 2:
            _context3.next = 4;
            return (0, _pagesController.getOnePageData)(pageID);

          case 4:
            page = _context3.sent;
            replyMsg = new String(page.firstResponseText).replace('$NAME', sender.first_name);
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: replyMsg
            });
            return _context3.abrupt("return", out);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function sendWelcomeMessage(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.sendWelcomeMessage = sendWelcomeMessage;

var sendMainMenu =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var buttons, out;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            buttons = new _facebookMessengerBot.Buttons();
            buttons.add({
              text: 'Cardápio',
              data: 'CARDAPIO_PAYLOAD',
              event: 'MAIN-MENU'
            });
            buttons.add({
              text: 'Horários',
              data: 'HORARIO_PAYLOAD',
              event: 'MAIN-MENU'
            });
            buttons.add({
              text: 'Fazer Pedido',
              data: 'PEDIDO_PAYLOAD',
              event: 'MAIN-MENU'
            });
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Por favor escolha uma das opções',
              buttons: buttons
            });
            return _context4.abrupt("return", out);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function sendMainMenu() {
    return _ref4.apply(this, arguments);
  };
}();

exports.sendMainMenu = sendMainMenu;

var sendHorario =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID) {
    var _ref6, todayIsOpen, todayOpenAt, todayCloseAt, replyMsg, out;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _storesController.getTodayOpeningTime)(pageID);

          case 2:
            _ref6 = _context5.sent;
            todayIsOpen = _ref6.todayIsOpen;
            todayOpenAt = _ref6.todayOpenAt;
            todayCloseAt = _ref6.todayCloseAt;
            replyMsg = '';

            if (todayIsOpen === true) {
              replyMsg = 'Estamos abertos hoje, a partir das ' + todayOpenAt + ' horas, até às ' + todayCloseAt + ' horas.';
            } else {
              replyMsg = 'Infelizmente hoje não estamos abertos, mas você pode consultar nosso cardápio no menu principal.';
            }

            out = new _facebookMessengerBot.Elements();
            out.add({
              text: replyMsg
            });
            return _context5.abrupt("return", out);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function sendHorario(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.sendHorario = sendHorario;

var sendCardapio =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID) {
    var replyMsg, out;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _show_cardapio.default)(pageID);

          case 2:
            replyMsg = _context6.sent;
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: replyMsg
            });
            return _context6.abrupt("return", out);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function sendCardapio(_x5) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Question No.01
 * If the user doesnt have an address in the database, this will be the first question.
 */


exports.sendCardapio = sendCardapio;

var askForLocation =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
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
            return _context7.abrupt("return", out);

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function askForLocation() {
    return _ref8.apply(this, arguments);
  };
}();

exports.askForLocation = askForLocation;

var confirmLocationAddress =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(pageId, userId, location) {
    var addresses, out, foundAnyCompleteAddress, i, element, _data, buttons, addressNumber, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              location: location
            });

          case 2:
            _context8.next = 4;
            return (0, _customersController.getAddressLocation)(location);

          case 4:
            addresses = _context8.sent;

            if (!(addresses && addresses.length && addresses.length > 0)) {
              _context8.next = 22;
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
              _context8.next = 17;
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
            return _context8.abrupt("return", out);

          case 17:
            _context8.next = 19;
            return askToTypeAddress(pageId, userId);

          case 19:
            return _context8.abrupt("return", _context8.sent);

          case 20:
            _context8.next = 25;
            break;

          case 22:
            _context8.next = 24;
            return askToTypeAddress(pageId, userId);

          case 24:
            return _context8.abrupt("return", _context8.sent);

          case 25:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function confirmLocationAddress(_x6, _x7, _x8) {
    return _ref9.apply(this, arguments);
  };
}();

exports.confirmLocationAddress = confirmLocationAddress;

var confirmAddressOrAskLocation =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(pageId, userId, user) {
    var addrData, out, _replyText, replies;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              user: user
            });

          case 2:
            _context9.next = 4;
            return (0, _customersController.getCustomerAddress)(pageId, userId);

          case 4:
            addrData = _context9.sent;

            if (!addrData) {
              _context9.next = 17;
              break;
            }

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
            return _context9.abrupt("return", out);

          case 17:
            _context9.next = 19;
            return askForLocation();

          case 19:
            return _context9.abrupt("return", _context9.sent);

          case 20:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function confirmAddressOrAskLocation(_x9, _x10, _x11) {
    return _ref10.apply(this, arguments);
  };
}();

exports.confirmAddressOrAskLocation = confirmAddressOrAskLocation;

var askToTypeAddress =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageID, userID) {
    var out;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
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
            return _context10.abrupt("return", out);

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function askToTypeAddress(_x12, _x13) {
    return _ref11.apply(this, arguments);
  };
}();

exports.askToTypeAddress = askToTypeAddress;

var confirmTypedText =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(pageId, userId, message) {
    var pendingOrder, out, _replyText, addrData, replies;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId
            });

          case 3:
            pendingOrder = _context11.sent;
            //console.info({ pendingOrder });
            out = new _facebookMessengerBot.Elements();

            if (!(pendingOrder && pendingOrder.order)) {
              _context11.next = 61;
              break;
            }

            if (!(typeof pendingOrder.order.waitingForAddress === 'boolean' && pendingOrder.order.waitingForAddress === true)) {
              _context11.next = 20;
              break;
            }

            _context11.next = 9;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingForAddress: false,
              waitingFor: 'address'
            });

          case 9:
            _replyText = 'A entrega será para esse endereço?\n';
            _replyText = _replyText + message.text;
            out.add({
              text: _replyText
            });
            addrData = {
              manual_addres: true,
              formattedAddress: message.text
            };
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
            return _context11.abrupt("return", out);

          case 20:
            if (!(pendingOrder.order.waitingFor === 'phone')) {
              _context11.next = 26;
              break;
            }

            _context11.next = 23;
            return confirmTypedPhone(pageId, userId, message.text);

          case 23:
            return _context11.abrupt("return", _context11.sent);

          case 26:
            if (!(pendingOrder.order.waitingFor === 'size')) {
              _context11.next = 32;
              break;
            }

            _context11.next = 29;
            return askForSize(pageId, userId);

          case 29:
            return _context11.abrupt("return", _context11.sent);

          case 32:
            if (!(pendingOrder.order.waitingFor === 'quantity')) {
              _context11.next = 38;
              break;
            }

            _context11.next = 35;
            return askForQuantity(pageId, userId);

          case 35:
            return _context11.abrupt("return", _context11.sent);

          case 38:
            if (!(pendingOrder.order.waitingFor === 'flavor')) {
              _context11.next = 44;
              break;
            }

            _context11.next = 41;
            return askForFlavor(pageId, userId, 1);

          case 41:
            return _context11.abrupt("return", _context11.sent);

          case 44:
            if (!(pendingOrder.order.waitingFor === 'beverage')) {
              _context11.next = 50;
              break;
            }

            _context11.next = 47;
            return askForBeverages(pageId, userId, 1);

          case 47:
            return _context11.abrupt("return", _context11.sent);

          case 50:
            if (!(pendingOrder.order.waitingFor === 'nothing')) {
              _context11.next = 56;
              break;
            }

            _context11.next = 53;
            return showOrderOrNextItem(pageId, userId);

          case 53:
            return _context11.abrupt("return", _context11.sent);

          case 56:
            _context11.next = 58;
            return sendMainMenu();

          case 58:
            return _context11.abrupt("return", _context11.sent);

          case 59:
            _context11.next = 64;
            break;

          case 61:
            _context11.next = 63;
            return sendMainMenu();

          case 63:
            out = _context11.sent;

          case 64:
            return _context11.abrupt("return", out);

          case 67:
            _context11.prev = 67;
            _context11.t0 = _context11["catch"](0);
            console.error({
              confirmTypedTextError: _context11.t0
            });
            throw _context11.t0;

          case 71:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this, [[0, 67]]);
  }));

  return function confirmTypedText(_x14, _x15, _x16) {
    return _ref12.apply(this, arguments);
  };
}();

exports.confirmTypedText = confirmTypedText;

var showAddress =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(pageId, userId, addrData) {
    var formattedAddrData, out;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (!(addrData && addrData.address_components)) {
              _context12.next = 8;
              break;
            }

            _context12.next = 3;
            return (0, _customersController.formatAddrData)(addrData);

          case 3:
            formattedAddrData = _context12.sent;
            _context12.next = 6;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              addrData: formattedAddrData
            });

          case 6:
            _context12.next = 10;
            break;

          case 8:
            _context12.next = 10;
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
            return _context12.abrupt("return", out);

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function showAddress(_x17, _x18, _x19) {
    return _ref13.apply(this, arguments);
  };
}();

exports.showAddress = showAddress;

var showOrderOrAskForPhone =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(pageId, userId) {
    var po;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            po = _context13.sent;

            if (!(po.order && po.order.waitingFor === 'confirmation')) {
              _context13.next = 9;
              break;
            }

            _context13.next = 6;
            return showOrderOrNextItem(pageId, userId);

          case 6:
            return _context13.abrupt("return", _context13.sent);

          case 9:
            _context13.next = 11;
            return askForPhone(pageId, userId);

          case 11:
            return _context13.abrupt("return", _context13.sent);

          case 12:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function showOrderOrAskForPhone(_x20, _x21) {
    return _ref14.apply(this, arguments);
  };
}();

exports.showOrderOrAskForPhone = showOrderOrAskForPhone;

var askForPhone =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
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
            return _context14.abrupt("return", out);

          case 9:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function askForPhone(_x22, _x23) {
    return _ref15.apply(this, arguments);
  };
}();

exports.askForPhone = askForPhone;

var askToTypePhone =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(pageId, userId) {
    var out;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'phone'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Por favor, digite o número do telefone válido para que possamos confirmar o pedido. Pode digitar:'
            });
            return _context15.abrupt("return", out);

          case 5:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function askToTypePhone(_x24, _x25) {
    return _ref16.apply(this, arguments);
  };
}();

exports.askToTypePhone = askToTypePhone;

var confirmTypedPhone =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(pageId, userId, phone) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context16.next = 3;
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
            return _context16.abrupt("return", out);

          case 10:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function confirmTypedPhone(_x26, _x27, _x28) {
    return _ref17.apply(this, arguments);
  };
}();

exports.confirmTypedPhone = confirmTypedPhone;

var showPhone =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(pageId, userId, phone) {
    var out;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
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
            return _context17.abrupt("return", out);

          case 5:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function showPhone(_x29, _x30, _x31) {
    return _ref18.apply(this, arguments);
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
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(pageId, userId) {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
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
              event: 'ORDER_QTY_MORE'
            });
            out.setQuickReplies(replies);
            _context18.next = 10;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'quantity'
            });

          case 10:
            return _context18.abrupt("return", out);

          case 11:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function askForQuantity(_x32, _x33) {
    return _ref19.apply(this, arguments);
  };
}();

exports.askForQuantity = askForQuantity;

var askForQuantityMore =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19() {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Por favor informe a quantidade de pizzas:'
            });
            replies = new _facebookMessengerBot.QuickReplies();
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
            });
            replies.add({
              text: '+ de 6',
              data: 'qty_more_more',
              event: 'ORDER_QTY_MORE'
            });
            out.setQuickReplies(replies);
            _context19.next = 10;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'quantity'
            });

          case 10:
            return _context19.abrupt("return", out);

          case 11:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function askForQuantityMore() {
    return _ref20.apply(this, arguments);
  };
}();

exports.askForQuantityMore = askForQuantityMore;

var showQuantity =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(pageId, userId, data) {
    var qty, out;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            // data is 'qty_1', 'qty_2', 'qty_3'...
            qty = new String(data).substr(data.length - 1, 1);
            _context20.next = 3;
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

            return _context20.abrupt("return", out);

          case 6:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, this);
  }));

  return function showQuantity(_x34, _x35, _x36) {
    return _ref21.apply(this, arguments);
  };
}();

exports.showQuantity = showQuantity;

var askForSize =
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(pageId, userId) {
    var out, po, _text, replies, sizesWithPricing, sizes, i, _data;

    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context21.next = 3;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 3:
            po = _context21.sent;

            if (!po.order) {
              _context21.next = 26;
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
            _context21.next = 11;
            return (0, _pricingsController.getPricingSizing)(pageId);

          case 11:
            sizesWithPricing = _context21.sent;
            _context21.next = 14;
            return (0, _sizesController.getSizes)(pageId, sizesWithPricing);

          case 14:
            sizes = _context21.sent;

            for (i = 0; i < sizes.length; i++) {
              _data = {
                id: sizes[i].id,
                size: sizes[i].size
              };
              replies.add({
                text: sizes[i].size,
                data: _data,
                event: 'ORDER_SIZE'
              });
            }

            out.setQuickReplies(replies);

            if (!(po.order.qty_total === 1)) {
              _context21.next = 22;
              break;
            }

            _context21.next = 20;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size'
            });

          case 20:
            _context21.next = 24;
            break;

          case 22:
            _context21.next = 24;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size',
              qty: po.order.qty_total,
              eraseSplit: true
            });

          case 24:
            _context21.next = 27;
            break;

          case 26:
            out.add({
              text: MSG_GENERAL_ERROR
            });

          case 27:
            return _context21.abrupt("return", out);

          case 28:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, this);
  }));

  return function askForSize(_x37, _x38) {
    return _ref22.apply(this, arguments);
  };
}();

exports.askForSize = askForSize;

var showSize =
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee22(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id,
              waitingFor: 'flavor'
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + ' Tamanho: ' + data.size
            });
            return _context22.abrupt("return", out);

          case 5:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, this);
  }));

  return function showSize(_x39, _x40, _x41) {
    return _ref23.apply(this, arguments);
  };
}();

exports.showSize = showSize;

var askForSplitFlavorOrConfirm =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23(pageId, userId, multiple) {
    var pendingOrder, currentSize, _txt, out, replies, i, _replyText;

    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context23.sent;

            if (!pendingOrder.order) {
              _context23.next = 21;
              break;
            }

            _context23.next = 6;
            return (0, _sizesController.getSize)(pageId, pendingOrder.order.currentItemSize);

          case 6:
            currentSize = _context23.sent;

            if (!(currentSize.split && currentSize.split > 1)) {
              _context23.next = 18;
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
            return _context23.abrupt("return", out);

          case 18:
            _context23.next = 20;
            return askForFlavorOrConfirm(pageId, userId, multiple);

          case 20:
            return _context23.abrupt("return", _context23.sent);

          case 21:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, this);
  }));

  return function askForSplitFlavorOrConfirm(_x42, _x43, _x44) {
    return _ref24.apply(this, arguments);
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
  var _ref25 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee24(pageId, userId, data) {
    var _txtFlavor, out;

    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
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
            return _context24.abrupt("return", out);

          case 6:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, this);
  }));

  return function showSplit(_x45, _x46, _x47) {
    return _ref25.apply(this, arguments);
  };
}();

exports.showSplit = showSplit;

var askForFlavorOrConfirm =
/*#__PURE__*/
function () {
  var _ref26 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee25(pageId, userId, multiple, split) {
    var pendingOrder, currentSize, i;
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context25.sent;

            if (!pendingOrder.order) {
              _context25.next = 28;
              break;
            }

            if (!(split && split > 1)) {
              _context25.next = 10;
              break;
            }

            _context25.next = 7;
            return askForFlavor(pageId, userId, multiple, split, pendingOrder);

          case 7:
            return _context25.abrupt("return", _context25.sent);

          case 10:
            _context25.next = 12;
            return (0, _sizesController.getSize)(pageId, pendingOrder.order.currentItemSize);

          case 12:
            currentSize = _context25.sent;

            if (!(pendingOrder.items && pendingOrder.items.length)) {
              _context25.next = 28;
              break;
            }

            i = 0;

          case 15:
            if (!(i < pendingOrder.items.length)) {
              _context25.next = 25;
              break;
            }

            if (!(pendingOrder.items[i].status === 0 && pendingOrder.items[i].flavorId > 0)) {
              _context25.next = 22;
              break;
            }

            _context25.next = 19;
            return (0, _itemsController.updateStatusSpecificItem)(pendingOrder.items[i]._id, 1);

          case 19:
            _context25.next = 21;
            return showOrderOrNextItem(pageId, userId);

          case 21:
            return _context25.abrupt("return", _context25.sent);

          case 22:
            i++;
            _context25.next = 15;
            break;

          case 25:
            _context25.next = 27;
            return askForFlavor(pageId, userId, multiple);

          case 27:
            return _context25.abrupt("return", _context25.sent);

          case 28:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, this);
  }));

  return function askForFlavorOrConfirm(_x48, _x49, _x50, _x51) {
    return _ref26.apply(this, arguments);
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
  var _ref27 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee26(pageId, userId, multiple, split, pendingOrder) {
    var out, po, flavorsArray, _rangeIni, _rangeEnd, i, _fl, _data, buttons, _subtext, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.setListStyle('compact'); // or 'large'

            po = null;

            if (!pendingOrder) {
              _context26.next = 7;
              break;
            }

            po = pendingOrder;
            _context26.next = 10;
            break;

          case 7:
            _context26.next = 9;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 9:
            po = _context26.sent;

          case 10:
            _context26.next = 12;
            return (0, _actionsController.getFlavorsAndToppings)(pageId, po.order.currentItemSize);

          case 12:
            flavorsArray = _context26.sent;
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

            _context26.next = 19;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'flavor',
              split: split
            });

          case 19:
            return _context26.abrupt("return", out);

          case 20:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, this);
  }));

  return function askForFlavor(_x52, _x53, _x54, _x55, _x56) {
    return _ref27.apply(this, arguments);
  };
}();

exports.askForFlavor = askForFlavor;

var showFlavor =
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
            _context27.next = 2;
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
            return _context27.abrupt("return", out);

          case 5:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, this);
  }));

  return function showFlavor(_x57, _x58, _x59) {
    return _ref28.apply(this, arguments);
  };
}();

exports.showFlavor = showFlavor;

var showOrderOrNextItem =
/*#__PURE__*/
function () {
  var _ref29 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee28(pageId, userId) {
    var po, split, nextItem, out, total_price, _txt, i, _item, _txtQty, replies;

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
            po = _context28.sent;

            if (!(po.order.currentItemSplit > 1)) {
              _context28.next = 10;
              break;
            }

            split = po.order.currentItemSplit - 1;
            _context28.next = 7;
            return askForFlavor(pageId, userId, 1, split, po);

          case 7:
            return _context28.abrupt("return", _context28.sent);

          case 10:
            if (!(po.order.qty_total > 1 && po.order.item_complete < po.order.qty_total)) {
              _context28.next = 19;
              break;
            }

            nextItem = po.order.currentItem + 1;
            _context28.next = 14;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'size',
              currentItem: nextItem
            });

          case 14:
            _context28.next = 16;
            return askForSize(pageId, userId);

          case 16:
            return _context28.abrupt("return", _context28.sent);

          case 19:
            out = new _facebookMessengerBot.Elements();
            total_price = 0;
            _txt = 'Seguem os detalhes do seu pedido:\n';
            _txt = _txt + '*Pedido:* ' + po.order.id + '\n';

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

            _txt = _txt + '*Endereço de entrega:* ' + po.order.address + '\n';
            _txt = _txt + '*Telefone:* ' + po.order.phone + '\n';
            _txt = _txt + '*Total:* R$ ' + total_price + '\n';
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
            return _context28.abrupt("return", out);

          case 34:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, this);
  }));

  return function showOrderOrNextItem(_x60, _x61) {
    return _ref29.apply(this, arguments);
  };
}();

exports.showOrderOrNextItem = showOrderOrNextItem;

var showFullOrder =
/*#__PURE__*/
function () {
  var _ref30 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee29(pageId, userId) {
    var po, out, total_price, _txt, i, _item, _txtQty, replies;

    return regeneratorRuntime.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            po = _context29.sent;
            out = new _facebookMessengerBot.Elements();
            total_price = 0;
            _txt = 'Seguem os detalhes do seu pedido:\n';
            _txt = _txt + '*Pedido:* ' + po.order.id + '\n';

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

            _txt = _txt + '*Endereço de entrega:* ' + po.order.address + '\n';
            _txt = _txt + '*Telefone:* ' + po.order.phone + '\n';
            _txt = _txt + '*Total:* R$ ' + total_price + '\n';
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
            return _context29.abrupt("return", out);

          case 18:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, this);
  }));

  return function showFullOrder(_x62, _x63) {
    return _ref30.apply(this, arguments);
  };
}();

exports.showFullOrder = showFullOrder;

var confirmOrder =
/*#__PURE__*/
function () {
  var _ref31 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee30(pageId, userId) {
    var out;
    return regeneratorRuntime.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.next = 2;
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
            return _context30.abrupt("return", out);

          case 5:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, this);
  }));

  return function confirmOrder(_x64, _x65) {
    return _ref31.apply(this, arguments);
  };
}();

exports.confirmOrder = confirmOrder;

var askForChangeOrder =
/*#__PURE__*/
function () {
  var _ref32 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee31(pageId, userId) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context31.next = 3;
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
            return _context31.abrupt("return", out);

          case 11:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31, this);
  }));

  return function askForChangeOrder(_x66, _x67) {
    return _ref32.apply(this, arguments);
  };
}();

exports.askForChangeOrder = askForChangeOrder;

var askForOptionsToChange =
/*#__PURE__*/
function () {
  var _ref33 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee32(pageId, userId, item) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.prev = 0;

            if (!(item && item.beverageId)) {
              _context32.next = 7;
              break;
            }

            _context32.next = 4;
            return askForBeverages(pageId, userId, 1);

          case 4:
            return _context32.abrupt("return", _context32.sent);

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
            return _context32.abrupt("return", out);

          case 15:
            _context32.next = 21;
            break;

          case 17:
            _context32.prev = 17;
            _context32.t0 = _context32["catch"](0);
            console.error({
              askForOptionsToChangeErr: _context32.t0
            });
            throw _context32.t0;

          case 21:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32, this, [[0, 17]]);
  }));

  return function askForOptionsToChange(_x68, _x69, _x70) {
    return _ref33.apply(this, arguments);
  };
}();

exports.askForOptionsToChange = askForOptionsToChange;

var askForSpecificItem =
/*#__PURE__*/
function () {
  var _ref34 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee33(pageId, userId) {
    var pendingOrder, out, replies, i;
    return regeneratorRuntime.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context33.sent;

            if (!(pendingOrder.items && pendingOrder.items.length > 1)) {
              _context33.next = 13;
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
            return _context33.abrupt("return", out);

          case 13:
            _context33.next = 15;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              completeItem: false
            });

          case 15:
            _context33.next = 17;
            return askForOptionsToChange(pageId, userId);

          case 17:
            return _context33.abrupt("return", _context33.sent);

          case 18:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33, this);
  }));

  return function askForSpecificItem(_x71, _x72) {
    return _ref34.apply(this, arguments);
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
  var _ref35 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee34(pageId, userId) {
    var pendingOrder, noBeverage, out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: false
            });

          case 2:
            pendingOrder = _context34.sent;
            noBeverage = pendingOrder.order.no_beverage;

            if (!(typeof noBeverage === 'undefined')) {
              _context34.next = 15;
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
            return _context34.abrupt("return", out);

          case 15:
            return _context34.abrupt("return", showFullOrder(pageId, userId));

          case 16:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34, this);
  }));

  return function askForWantBeverage(_x73, _x74) {
    return _ref35.apply(this, arguments);
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
  var _ref36 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee35(pageId, userId, multiple) {
    var out, beveragesArr, _rangeIni, _rangeEnd, i, _bev, _data, buttons, _subtext, buttonsOpt, _data2, _buttons, _subtext2;

    return regeneratorRuntime.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.setListStyle('compact'); // or 'large'
            // const po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: false });

            _context35.next = 4;
            return (0, _beveragesController.getBeverages)(pageId);

          case 4:
            beveragesArr = _context35.sent;
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

            if (beveragesArr.length > _rangeEnd) {
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

            _context35.next = 11;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              waitingFor: 'beverage',
              noBeverage: false
            });

          case 11:
            return _context35.abrupt("return", out);

          case 12:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35, this);
  }));

  return function askForBeverages(_x75, _x76, _x77) {
    return _ref36.apply(this, arguments);
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
  var _ref37 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee36(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.next = 2;
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
            return _context36.abrupt("return", out);

          case 5:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36, this);
  }));

  return function showNoBeverage(_x78, _x79, _x80) {
    return _ref37.apply(this, arguments);
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
  var _ref38 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee37(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _context37.next = 2;
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
            return _context37.abrupt("return", out);

          case 5:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37, this);
  }));

  return function showBeverage(_x81, _x82, _x83) {
    return _ref38.apply(this, arguments);
  };
}();

exports.showBeverage = showBeverage;

var updateItemAskOptions =
/*#__PURE__*/
function () {
  var _ref39 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee38(pageId, userId, objectId) {
    var item;
    return regeneratorRuntime.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return (0, _itemsController.updateStatusSpecificItem)(objectId, 0);

          case 2:
            item = _context38.sent;
            _context38.next = 5;
            return askForOptionsToChange(pageId, userId, item);

          case 5:
            return _context38.abrupt("return", _context38.sent);

          case 6:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38, this);
  }));

  return function updateItemAskOptions(_x84, _x85, _x86) {
    return _ref39.apply(this, arguments);
  };
}();

exports.updateItemAskOptions = updateItemAskOptions;

var sendShippingNotification =
/*#__PURE__*/
function () {
  var _ref40 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee39(pageId, userId, orderId) {
    var _ref41, accessToken, _txt, out;

    return regeneratorRuntime.wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.next = 2;
            return (0, _pagesController.getOnePageToken)(pageId);

          case 2:
            _ref41 = _context39.sent;
            accessToken = _ref41.accessToken;
            _txt = 'O seu pedido número ' + orderId + ' acabou de sair para entrega. Bom apetite!';
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: _txt
            });
            _context39.next = 9;
            return _facebookMessengerBot.Bot.send_message_tag(accessToken, userId, out);

          case 9:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39, this);
  }));

  return function sendShippingNotification(_x87, _x88, _x89) {
    return _ref40.apply(this, arguments);
  };
}();

exports.sendShippingNotification = sendShippingNotification;
//# sourceMappingURL=botController.js.map