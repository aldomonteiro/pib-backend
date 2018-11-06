"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirmOrder = exports.showOrderOrNextItem = exports.showFlavor = exports.askForFlavor = exports.showSize = exports.askForSize = exports.showQuantity = exports.askForQuantityMore = exports.askForQuantity = exports.showPhone = exports.askForPhone = exports.showAddress = exports.confirmTypedAddress = exports.askToTypeAddress = exports.confirmAddressOrAskLocation = exports.confirmLocationAddress = exports.askForLocation = exports.sendCardapio = exports.sendMainMenu = exports.sendWelcomeMessage = exports.sendErrorMsg = void 0;

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _facebookMessengerBot = require("facebook-messenger-bot");

var _pagesController = require("../controllers/pagesController");

var _pricingsController = require("../controllers/pricingsController");

var _show_cardapio = _interopRequireDefault(require("./show_cardapio"));

var _actionsController = require("./actionsController");

var _sizesController = require("../controllers/sizesController");

var _ordersController = require("../controllers/ordersController");

var _customersController = require("../controllers/customersController");

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
  regeneratorRuntime.mark(function _callee() {
    var out;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return sender.fetch('first_name');

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Ops, tivemos um probleminha técnico.'
            });
            return _context.abrupt("return", out);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sendErrorMsg() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} sender 
 * @param {*} pageID 
 */


exports.sendErrorMsg = sendErrorMsg;

var sendWelcomeMessage =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(sender, pageID) {
    var page, replyMsg, out;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return sender.fetch('first_name');

          case 2:
            _context2.next = 4;
            return (0, _pagesController.getOnePageData)(pageID);

          case 4:
            page = _context2.sent;
            replyMsg = new String(page.firstResponseText).replace('$NAME', sender.first_name);
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: replyMsg
            });
            return _context2.abrupt("return", out);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function sendWelcomeMessage(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.sendWelcomeMessage = sendWelcomeMessage;

var sendMainMenu =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var buttons, out;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
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
            return _context3.abrupt("return", out);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function sendMainMenu() {
    return _ref3.apply(this, arguments);
  };
}();

exports.sendMainMenu = sendMainMenu;

var sendCardapio =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    var replyMsg, out;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _show_cardapio.default)(pageID);

          case 2:
            replyMsg = _context4.sent;
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: replyMsg
            });
            return _context4.abrupt("return", out);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function sendCardapio(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.sendCardapio = sendCardapio;

var askForLocation =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
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
            return _context5.abrupt("return", out);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function askForLocation() {
    return _ref5.apply(this, arguments);
  };
}();

exports.askForLocation = askForLocation;

var confirmLocationAddress =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageId, userId, location) {
    var addresses, out, foundAnyCompleteAddress, i, element, _data, buttons, addressNumber, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              location: location
            });

          case 2:
            _context6.next = 4;
            return (0, _customersController.getAddressLocation)(location);

          case 4:
            addresses = _context6.sent;

            if (!(addresses && addresses.length && addresses.length > 0)) {
              _context6.next = 22;
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
              _context6.next = 17;
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
            return _context6.abrupt("return", out);

          case 17:
            _context6.next = 19;
            return askToTypeAddress(pageId, userId);

          case 19:
            return _context6.abrupt("return", _context6.sent);

          case 20:
            _context6.next = 25;
            break;

          case 22:
            _context6.next = 24;
            return askToTypeAddress(pageId, userId);

          case 24:
            return _context6.abrupt("return", _context6.sent);

          case 25:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function confirmLocationAddress(_x4, _x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

exports.confirmLocationAddress = confirmLocationAddress;

var confirmAddressOrAskLocation =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageId, userId, user) {
    var addrData, out, _replyText, replies;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              user: user
            });

          case 2:
            _context7.next = 4;
            return (0, _customersController.getCustomerAddress)(pageId, userId);

          case 4:
            addrData = _context7.sent;

            if (!addrData) {
              _context7.next = 17;
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
            return _context7.abrupt("return", out);

          case 17:
            _context7.next = 19;
            return askForLocation();

          case 19:
            return _context7.abrupt("return", _context7.sent);

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function confirmAddressOrAskLocation(_x7, _x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();

exports.confirmAddressOrAskLocation = confirmAddressOrAskLocation;

var askToTypeAddress =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(pageID, userID) {
    var out;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              waitingForAddress: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Não foi possível localizar um endereço válido. Digite o seu endereço completo por favor.'
            });
            return _context8.abrupt("return", out);

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function askToTypeAddress(_x10, _x11) {
    return _ref8.apply(this, arguments);
  };
}();

exports.askToTypeAddress = askToTypeAddress;

var confirmTypedAddress =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(pageID, userID, message) {
    var pendingOrder, out, _replyText, addrData, replies, _out;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageID,
              userId: userID
            });

          case 2:
            pendingOrder = _context9.sent;
            console.info({
              pendingOrder: pendingOrder
            });

            if (!pendingOrder) {
              _context9.next = 22;
              break;
            }

            if (!(typeof pendingOrder.order.waitingForAddress === 'boolean' && pendingOrder.order.waitingForAddress === true)) {
              _context9.next = 20;
              break;
            }

            _context9.next = 8;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              waitingForAddress: false
            });

          case 8:
            out = new _facebookMessengerBot.Elements();
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
            return _context9.abrupt("return", out);

          case 20:
            _out = new _facebookMessengerBot.Elements();

            _out.add({
              text: 'Não entendi o que você quis dizer. Aqui, vou analisar o status atual.'
            });

          case 22:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function confirmTypedAddress(_x12, _x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();

exports.confirmTypedAddress = confirmTypedAddress;

var showAddress =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageId, userId, addrData) {
    var formattedAddrData, out;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (!(addrData && addrData.address_components)) {
              _context10.next = 8;
              break;
            }

            _context10.next = 3;
            return (0, _customersController.formatAddrData)(addrData);

          case 3:
            formattedAddrData = _context10.sent;
            _context10.next = 6;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              addrData: formattedAddrData
            });

          case 6:
            _context10.next = 10;
            break;

          case 8:
            _context10.next = 10;
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
            return _context10.abrupt("return", out);

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function showAddress(_x15, _x16, _x17) {
    return _ref10.apply(this, arguments);
  };
}();

exports.showAddress = showAddress;

var askForPhone =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Pode nos enviar o seu telefone? Para que possamos fazer a confirmação do pedido.'
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Telefone',
              isPhoneNumber: true,
              data: 'phone_number',
              event: 'PHONE_NUMBER'
            });
            out.setQuickReplies(replies);
            return _context11.abrupt("return", out);

          case 6:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function askForPhone() {
    return _ref11.apply(this, arguments);
  };
}();

exports.askForPhone = askForPhone;

var showPhone =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(pageId, userId, phone) {
    var out;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              phone: phone
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: 'Ok, telefone recebido. Agora vamos ao que interessa, informações do pedido.'
            });
            return _context12.abrupt("return", out);

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function showPhone(_x18, _x19, _x20) {
    return _ref12.apply(this, arguments);
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
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13() {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
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
            return _context13.abrupt("return", out);

          case 9:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function askForQuantity() {
    return _ref13.apply(this, arguments);
  };
}();

exports.askForQuantity = askForQuantity;

var askForQuantityMore =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14() {
    var out, replies;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
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
            return _context14.abrupt("return", out);

          case 9:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function askForQuantityMore() {
    return _ref14.apply(this, arguments);
  };
}();

exports.askForQuantityMore = askForQuantityMore;

var showQuantity =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(pageId, userId, data) {
    var qty, out;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            qty = new String(data).substr(data.length - 1, 1);
            _context15.next = 3;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              qty: qty
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

            return _context15.abrupt("return", out);

          case 6:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function showQuantity(_x21, _x22, _x23) {
    return _ref15.apply(this, arguments);
  };
}();

exports.showQuantity = showQuantity;

var askForSize =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(pageID, userID) {
    var out, pendingOrder, _text, _itemNumber, replies, sizesWithPricing, sizes, i, _data;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            _context16.next = 3;
            return (0, _ordersController.getOrderPending)({
              pageId: pageID,
              userId: userID,
              isComplete: false
            });

          case 3:
            pendingOrder = _context16.sent;
            console.info({
              pendingOrder: pendingOrder
            });

            if (!pendingOrder.order) {
              _context16.next = 20;
              break;
            }

            _text = '';

            if (pendingOrder.order.qty_total === 1) {
              _text = 'Qual o tamanho da pizza?';
            } else {
              _itemNumber = pendingOrder.order.item_complete ? pendingOrder.order.item_complete + 1 : 1;
              _text = 'Agora vou pegar os detalhes da ' + _itemNumber + 'a. pizza.\n';
              _text = _text + 'Qual o tamanho dela?';
            }

            out.add({
              text: _text
            });
            replies = new _facebookMessengerBot.QuickReplies();
            _context16.next = 12;
            return (0, _pricingsController.getPricingSizing)(pageID);

          case 12:
            sizesWithPricing = _context16.sent;
            _context16.next = 15;
            return (0, _sizesController.getSizes)(pageID, sizesWithPricing);

          case 15:
            sizes = _context16.sent;

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
            _context16.next = 21;
            break;

          case 20:
            out.add({
              text: MSG_GENERAL_ERROR
            });

          case 21:
            return _context16.abrupt("return", out);

          case 22:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function askForSize(_x24, _x25) {
    return _ref16.apply(this, arguments);
  };
}();

exports.askForSize = askForSize;

var showSize =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              sizeId: data.id
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + ' Tamanho: ' + data.size
            });
            return _context17.abrupt("return", out);

          case 5:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function showSize(_x26, _x27, _x28) {
    return _ref17.apply(this, arguments);
  };
}();

exports.showSize = showSize;

var askForFlavor =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(pageID) {
    var out, flavorsArray, i, _fl, _data, buttons, _tn, _subtext, j, buttonsOpt;

    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();
            out.setListStyle('compact'); // or 'large'

            _context18.next = 4;
            return (0, _actionsController.getFlavorsAndToppings)(pageID);

          case 4:
            flavorsArray = _context18.sent;

            for (i = 0; i < 4; i++) {
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
                _tn = _fl.toppingsNames;
                _subtext = new String();

                for (j = 0; j < _tn.length; j++) {
                  _subtext = _subtext.concat(_tn[j].topping, ", ");
                }

                out.add({
                  text: _fl.flavor,
                  subtext: _subtext,
                  buttons: buttons
                });
              }
            }

            buttonsOpt = new _facebookMessengerBot.Buttons();
            buttonsOpt.add({
              text: '+ Opções',
              data: "flavors_more",
              event: 'ORDER_FLAVOR'
            });
            out.add({
              buttons: buttonsOpt,
              isOnlyButtons: true
            });
            return _context18.abrupt("return", out);

          case 10:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function askForFlavor(_x29) {
    return _ref18.apply(this, arguments);
  };
}();

exports.askForFlavor = askForFlavor;

var showFlavor =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19(pageId, userId, data) {
    var out;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageId,
              userId: userId,
              flavorId: data.id,
              completeItem: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: '✅ ' + ' Sabor: ' + data.flavor
            });
            return _context19.abrupt("return", out);

          case 5:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function showFlavor(_x30, _x31, _x32) {
    return _ref19.apply(this, arguments);
  };
}();

exports.showFlavor = showFlavor;

var showOrderOrNextItem =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(pageId, userId) {
    var pendingOrder, out, _txt, i, replies;

    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return (0, _ordersController.getOrderPending)({
              pageId: pageId,
              userId: userId,
              isComplete: true
            });

          case 2:
            pendingOrder = _context20.sent;
            console.info({
              pendingOrder: pendingOrder
            });

            if (!(pendingOrder.order.qty_total > 1 && pendingOrder.order.item_complete < pendingOrder.order.qty_total)) {
              _context20.next = 10;
              break;
            }

            _context20.next = 7;
            return askForSize(pageId, userId);

          case 7:
            return _context20.abrupt("return", _context20.sent);

          case 10:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Seguem os detalhes do seu pedido:\n';

            for (i = 0; i < pendingOrder.items.length; i++) {
              _txt = _txt + "".concat(pendingOrder.items[i].qty, " pizza ").concat(pendingOrder.items[i].size, " de ").concat(pendingOrder.items[i].flavor, "\n");
            }

            _txt = _txt + 'Podemos confirmar o pedido?';
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
            return _context20.abrupt("return", out);

          case 20:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, this);
  }));

  return function showOrderOrNextItem(_x33, _x34) {
    return _ref20.apply(this, arguments);
  };
}();

exports.showOrderOrNextItem = showOrderOrNextItem;

var confirmOrder =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(pageID, userID) {
    var out;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return (0, _ordersController.updateOrder)({
              pageId: pageID,
              userId: userID,
              confirmOrder: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            out.add({
              text: "Pedido Confirmado!"
            });
            return _context21.abrupt("return", out);

          case 5:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, this);
  }));

  return function confirmOrder(_x35, _x36) {
    return _ref21.apply(this, arguments);
  };
}(); // const updateFlavor = async (pageId, userId, flavorId) => {
//     const orderData = {
//         userId: userId,
//         pageId: pageId,
//         orderId: null,
//         qty: null,
//         sizeId: null,
//         flavorId: flavorId,
//     }
//     await updateOrder(orderData);
// }
// export const askForFlavor = async (pageID) => {
//     const flavorsArray = await getFlavorsAndToppings(pageID);
//     const buttons = new Buttons();
//     for (let i = 0; i < 2; i++) {
//         if (flavorsArray[i]) {
//             const _data = { id: flavorsArray[i].id, flavor: flavorsArray[i].flavor }
//             buttons.add({ text: flavorsArray[i].flavor, data: _data, event: 'ORDER_FLAVOR' });
//         }
//     }
//     buttons.add({ text: '+ Opções', data: 'flavors_more', event: 'ORDER_FLAVOR' });
//     const out = new Elements();
//     out.setListStyle('compact'); // or 'large'
//     out.add({ text: 'Por favor escolha uma das opções', buttons });
//     return out;
// }


exports.confirmOrder = confirmOrder;
//# sourceMappingURL=botController.js.map