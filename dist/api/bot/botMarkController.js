"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.m_returnedCustomer = exports.m_contactMail = exports.m_contactPhone = exports.m_isValidPhone = exports.m_typePhone = exports.m_returnContact = exports.m_confirmOpenQuestion = exports.m_openQuestion = exports.m_startTrial = exports.m_afterOrderConfirmation = exports.m_askTestTypePizzaria = exports.m_askForBeginTest = exports.m_askForTestType = exports.m_showPrices = exports.m_howItWorks5 = exports.m_howItWorks4 = exports.m_howItWorks3 = exports.m_howItWorks2 = exports.m_howItWorks = exports.m_askForOptions = exports.m_askForOwnership = exports.m_askForRestaurant = exports.m_askHowGetHere = exports.m_checkLastQuestion = void 0;

var _facebookMessengerBot = require("facebook-messenger-bot");

var _mkt_contact_controller = require("../controllers/mkt_contact_controller");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _event = 'PIZZAIBOT_MARKETING';

var m_checkLastQuestion =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID, userID) {
    var mktContact;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: pageID,
              userID: userID
            });

          case 2:
            mktContact = _context.sent;

            if (!mktContact) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", mktContact.last_answer);

          case 7:
            return _context.abrupt("return", null);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function m_checkLastQuestion(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.m_checkLastQuestion = m_checkLastQuestion;

var m_askHowGetHere =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Vou te ajudar com as suas dúvidas, tá bom? \
    Mas, antes de mais nada, preciso saber de uma coisa: \
    Como você ficou conhecendo o Pizzaibot?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Vi pizzaria usar",
              data: "howget_pizzaria",
              event: _event
            });
            replies.add({
              text: "Anúncio Facebook",
              data: "howget_facebookad",
              event: _event
            });
            replies.add({
              text: "Vocês me procuraram!",
              data: "howget_activemarketing",
              event: _event
            });
            replies.add({
              text: "Não lembro",
              data: "howget_dontremember",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context2.abrupt("return", out);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function m_askHowGetHere(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.m_askHowGetHere = m_askHowGetHere;

var m_askForRestaurant =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data,
              how_know_company: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Você possui ou trabalha em um restaurante ou pizzaria?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Sim",
              data: "restaurant_yes",
              event: _event
            });
            replies.add({
              text: "Não",
              data: "restaurant_no",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context3.abrupt("return", out);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function m_askForRestaurant(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

exports.m_askForRestaurant = m_askForRestaurant;

var m_askForOwnership =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              restaurant_related: true,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Muito bom, então, com toda certeza eu posso ser útil para você!\n';
            _txt = _txt + 'Você é o dono(a) do restaurante/pizzaria ou trabalha para ele direta ou indiretamente?\n';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Sou dono(a)",
              data: "owner_yes",
              event: _event
            });
            replies.add({
              text: "Trabalho para",
              data: "employee_yes",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context4.abrupt("return", out);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function m_askForOwnership(_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();

exports.m_askForOwnership = m_askForOwnership;

var m_askForOptions =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(data, pageID, userID, relation) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(relation === 'owner')) {
              _context5.next = 5;
              break;
            }

            _context5.next = 3;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data,
              restaurant_owner: true
            });

          case 3:
            _context5.next = 12;
            break;

          case 5:
            if (!(relation === 'employee')) {
              _context5.next = 10;
              break;
            }

            _context5.next = 8;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data,
              restaurant_employee: true
            });

          case 8:
            _context5.next = 12;
            break;

          case 10:
            _context5.next = 12;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 12:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Então vou te mostrar algumas coisas que posso te ajudar agora\n';
            _txt = _txt + 'Clique em uma das opções disponíveis que eu acompanho contigo\n';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Como funciona?",
              data: "options_howitworks",
              event: _event
            });
            replies.add({
              text: "Quanto custa?",
              data: "options_howmuch",
              event: _event
            });
            replies.add({
              text: "Quero testar!",
              data: "options_wanttest",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context5.abrupt("return", out);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function m_askForOptions(_x12, _x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.m_askForOptions = m_askForOptions;

var m_howItWorks =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data,
              saw_how_it_works: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'O primeiro passo é acessar o site do sistema: https://admin.pizzaibot.com. \
    Lá, você vai clicar em "Conectar com o Facebook", permitir acesso do sistema ao Facebook e \
    acessar a administração do nosso sistema.';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Entendi, e depois?",
              data: "howitworks_2",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context6.abrupt("return", out);

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function m_howItWorks(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.m_howItWorks = m_howItWorks;

var m_howItWorks2 =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'A primeira tela da administração mostra todas as páginas do Facebook que você é administrador. \
    Você escolhe a página do Restaurante/Pizzaria que será conectado ao Bot e clica no botão "Confirmar"';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Ok, e aí?",
              data: "howitworks_3",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context7.abrupt("return", out);

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function m_howItWorks2(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.m_howItWorks2 = m_howItWorks2;

var m_howItWorks3 =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Depois disso você precisará revisar os sabores do seu Cardápio, Bebidas, Preços e Horários de Funcionamento. \
    Você verá que já temos algumas informações de exemplo cadastradas, você pode removê-las ou usá-las.';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Certo, e o que mais?",
              data: "howitworks_4",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context8.abrupt("return", out);

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function m_howItWorks3(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.m_howItWorks3 = m_howItWorks3;

var m_howItWorks4 =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Quando as informações do seu cardápio estiverem concluídas, basta você acessar o menu "Páginas" no lado esquerdo da tela, \
    editar a página que você selecionou para revisar os cadastros e clicar no botão "Ativar Bot".';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Olha só, e então?",
              data: "howitworks_5",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context9.abrupt("return", out);

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function m_howItWorks4(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

exports.m_howItWorks4 = m_howItWorks4;

var m_howItWorks5 =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'A partir desse momento, o Messenger ligado a sua página do Facebook já vai estar automatizado, \
    quando algum cliente enviar alguma mensagem para a sua página, quem vai responder será o Pizzaibot.';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Quero testar!",
              data: "options_wanttest",
              event: _event
            });
            replies.add({
              text: "Ainda tenho dúvidas!",
              data: "orderConfirmation_question",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context10.abrupt("return", out);

          case 10:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function m_howItWorks5(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.m_howItWorks5 = m_howItWorks5;

var m_showPrices =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(data, pageID, userID) {
    var out, _txt, replies, mktContact;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'No nosso site temos alguns detalhes dos valores: \
    https://www.pizzaibot.com/planos, acessa lá e veja nossos valores atualizados.';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Quero testar!",
              data: "options_wanttest",
              event: _event
            });
            _context11.next = 9;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: pageID,
              userID: userID
            });

          case 9:
            mktContact = _context11.sent;

            if (mktContact && !mktContact.saw_how_it_works) {
              replies.add({
                text: "Como funciona?",
                data: "options_howitworks",
                event: _event
              });
            }

            replies.add({
              text: "Ainda tenho dúvidas!",
              data: "orderConfirmation_question",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context11.abrupt("return", out);

          case 14:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function m_showPrices(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.m_showPrices = m_showPrices;

var m_askForTestType =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Muito bem, temos 2 opções: testar como cliente e testar como pizzaria.\n';
            _txt = _txt + 'Escolhe uma delas por favor!\n';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Testar como cliente",
              data: "testtype_customer",
              event: _event
            });
            replies.add({
              text: "Testar como pizzaria",
              data: "testtype_pizzaria",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context12.abrupt("return", out);

          case 11:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function m_askForTestType(_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();

exports.m_askForTestType = m_askForTestType;

var m_askForBeginTest =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              started_test: true,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Ok, agora vou te mostrar as opções que o bot mostra para um cliente,';
            _txt = _txt + 'assim você poderá ver como os seus clientes vão usar a ferramenta. É só clicar em Começar!\n';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Começar",
              data: "testtypecustomer_begin",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context13.abrupt("return", out);

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function m_askForBeginTest(_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * Show after anser testtype_pizzaria
 * @param {*} data 
 * @param {*} pageID 
 * @param {*} userID 
 */


exports.m_askForBeginTest = m_askForBeginTest;

var m_askTestTypePizzaria =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(data, pageID, userID) {
    var out, _txt, replies, mktContact;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Para utilizar essa opção você precisa se cadastrar na administração do sistema \
    e habilitar o Bot para alguma página (Se você preferir, pode criar uma página teste no Facebook \
    e usá-la para os seus testes - você poderá simular ser cliente dessa página.';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Quero usar!",
              data: "orderConfirmation_start",
              event: _event
            });
            _context14.next = 9;
            return (0, _mkt_contact_controller.getMktContact)({
              pageID: pageID,
              userID: userID
            });

          case 9:
            mktContact = _context14.sent;

            if (mktContact && !mktContact.saw_how_it_works) {
              replies.add({
                text: "Como funciona?",
                data: "options_howitworks",
                event: _event
              });
            }

            out.setQuickReplies(replies);
            return _context14.abrupt("return", out);

          case 13:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function m_askTestTypePizzaria(_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}();

exports.m_askTestTypePizzaria = m_askTestTypePizzaria;

var m_afterOrderConfirmation =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Olha que legal, você chegou até o final de um pedido teste.. Eu não vou te mandar uma pizza não tá? 😃 \n';
            _txt = _txt + 'Nós temos um site disponível aonde você pode acompanhar os pedidos realizados, tal como esse que você fez.\n';
            _txt = _txt + 'E agora?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Quero usar!",
              data: "orderConfirmation_start",
              event: _event
            });
            replies.add({
              text: "Ainda tenho dúvidas!",
              data: "orderConfirmation_question",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context15.abrupt("return", out);

          case 12:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function m_afterOrderConfirmation(_x43, _x44, _x45) {
    return _ref15.apply(this, arguments);
  };
}();

exports.m_afterOrderConfirmation = m_afterOrderConfirmation;

var m_startTrial =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(data, pageID, userID) {
    var out, buttons, _txt;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data,
              final: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            buttons = new _facebookMessengerBot.Buttons();
            buttons.add({
              text: 'admin.pizzaibot.com',
              url: 'https://admin.pizzaibot.com'
            });
            _txt = 'Fico feliz pela sua decisão. Basta acessar o site abaixo, clicar na opção "Continuar com o Facebook"  e configurar as informações da sua loja.';
            out.add({
              text: _txt,
              buttons: buttons
            });
            return _context16.abrupt("return", out);

          case 8:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function m_startTrial(_x46, _x47, _x48) {
    return _ref16.apply(this, arguments);
  };
}();

exports.m_startTrial = m_startTrial;

var m_openQuestion =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(data, pageID, userID) {
    var out, _txt;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'É uma pena que não consegui responder todas as suas dúvidas. Menos um ponto para mim. 😞\n';
            _txt = _txt + ' Pode escrever aqui então o que não ficou claro que vou mandar para um humano responder.';
            out.add({
              text: _txt
            });
            return _context17.abrupt("return", out);

          case 7:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function m_openQuestion(_x49, _x50, _x51) {
    return _ref17.apply(this, arguments);
  };
}();

exports.m_openQuestion = m_openQuestion;

var m_confirmOpenQuestion =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(data, pageID, userID, text) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              text: text,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Ok, recebi a sua dúvida. \
    Saiba que os humanos nem sempre estão disponíveis, mas a gente vai te responder o mais rápido possível. \
    Qual a melhor forma de te responder?';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Ligar Fone",
              data: "finalquestion_phone",
              event: _event
            });
            replies.add({
              text: "Whatsapp",
              data: "finalquestion_whatsapp",
              event: _event
            });
            replies.add({
              text: "E-mail",
              data: "finalquestion_mail",
              event: _event
            });
            replies.add({
              text: "Messenger",
              data: "finalquestion_messenger",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context18.abrupt("return", out);

          case 12:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function m_confirmOpenQuestion(_x52, _x53, _x54, _x55) {
    return _ref18.apply(this, arguments);
  };
}();

exports.m_confirmOpenQuestion = m_confirmOpenQuestion;

var m_returnContact =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19(data, pageID, userID, type) {
    var out, _txt, _txt2, replies, _txt3;

    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            out = new _facebookMessengerBot.Elements();

            if (!(type === 'messenger')) {
              _context19.next = 8;
              break;
            }

            _context19.next = 4;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              contact_form: type,
              last_answer: data,
              final: true
            });

          case 4:
            _txt = 'Muito bem, logo logo nosso melhor humano vai te chamar aqui no Messenger para tirar a sua dúvida tá bom? Um grande abraço.';
            out.add({
              text: _txt
            });
            _context19.next = 24;
            break;

          case 8:
            if (!(type === 'phone' || type === 'whatsapp')) {
              _context19.next = 19;
              break;
            }

            _context19.next = 11;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              contact_form: type,
              last_answer: data
            });

          case 11:
            _txt2 = 'Então, por favor, pode me enviar o seu telefone para que nosso humano entre em contato?';
            out.add({
              text: _txt2
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: 'Telefone',
              isPhoneNumber: true,
              data: 'phone_number',
              event: _event
            });
            replies.add({
              text: 'Digitar o telefone',
              data: 'type_phone',
              event: _event
            });
            out.setQuickReplies(replies);
            _context19.next = 24;
            break;

          case 19:
            if (!(type === 'email')) {
              _context19.next = 24;
              break;
            }

            _context19.next = 22;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              contact_form: type,
              last_answer: data
            });

          case 22:
            _txt3 = 'Então, por favor, pode digitar o seu e-mail para que nosso humano entre em contato?';
            out.add({
              text: _txt3
            });

          case 24:
            return _context19.abrupt("return", out);

          case 25:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function m_returnContact(_x56, _x57, _x58, _x59) {
    return _ref19.apply(this, arguments);
  };
}();

exports.m_returnContact = m_returnContact;

var m_typePhone =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(data, pageID, userID, validation) {
    var out, _txt, _txt4;

    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data
            });

          case 2:
            out = new _facebookMessengerBot.Elements();

            if (data === 'retype_phone') {
              _txt = 'Parece que há algum problema com o número que você digitou.';
              if (validation === 'INCOMPLETE_PHONE') _txt = _txt + 'Parece que faltou o DDD. Digite novamente por favor. Informe somente o DDD e o número.';else _txt = _txt + 'Digite novamente por favor. Informe somente o DDD e o número.';
              out.add({
                text: _txt
              });
            } else {
              _txt4 = 'Por favor, pode digitar o seu telefone:';
              out.add({
                text: _txt4
              });
            }

            return _context20.abrupt("return", out);

          case 5:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function m_typePhone(_x60, _x61, _x62, _x63) {
    return _ref20.apply(this, arguments);
  };
}();

exports.m_typePhone = m_typePhone;

var m_isValidPhone =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21(phone) {
    var validation;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            validation = phone.replace(/\s|-/g, "").match(/^[0-9\+]{8,13}$/);
            console.info(validation);

            if (validation) {
              _context21.next = 6;
              break;
            }

            return _context21.abrupt("return", 'INVALID_PHONE');

          case 6:
            if (!(validation.input.length <= 9)) {
              _context21.next = 10;
              break;
            }

            return _context21.abrupt("return", 'INCOMPLETE_PHONE');

          case 10:
            return _context21.abrupt("return", 'OK_PHONE');

          case 11:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function m_isValidPhone(_x64) {
    return _ref21.apply(this, arguments);
  };
}();

exports.m_isValidPhone = m_isValidPhone;

var m_contactPhone =
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee22(data, pageID, userID, phone) {
    var out, _txt;

    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              contact_phone: phone,
              last_answer: data,
              final: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Ok, muito obrigado. O nosso melhor humano vai entrar em contato contigo o mais breve possível. Um grande abraço da equipe Pizzaibot!';
            out.add({
              text: _txt
            });
            return _context22.abrupt("return", out);

          case 6:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function m_contactPhone(_x65, _x66, _x67, _x68) {
    return _ref22.apply(this, arguments);
  };
}();

exports.m_contactPhone = m_contactPhone;

var m_contactMail =
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23(data, pageID, userID, text) {
    var out, _txt;

    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              contact_mail: text,
              last_answer: data,
              final: true
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Ok, muito obrigado. O nosso melhor humano vai entrar em contato contigo o mais breve possível. Um grande abraço da equipe Pizzaibot!';
            out.add({
              text: _txt
            });
            return _context23.abrupt("return", out);

          case 6:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function m_contactMail(_x69, _x70, _x71, _x72) {
    return _ref23.apply(this, arguments);
  };
}();

exports.m_contactMail = m_contactMail;

var m_returnedCustomer =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee24(data, pageID, userID) {
    var out, _txt, replies;

    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return (0, _mkt_contact_controller.updateMktContact)({
              pageID: pageID,
              userID: userID,
              last_answer: data,
              final: false
            });

          case 2:
            out = new _facebookMessengerBot.Elements();
            _txt = 'Olá de novo! Vi que você já passou por aqui, mas talvez queira rever algo certo? Então seguem as principais opções:';
            out.add({
              text: _txt
            });
            replies = new _facebookMessengerBot.QuickReplies();
            replies.add({
              text: "Como funciona?",
              data: "options_howitworks",
              event: _event
            });
            replies.add({
              text: "Quanto custa?",
              data: "options_howmuch",
              event: _event
            });
            replies.add({
              text: "Quero testar!",
              data: "options_wanttest",
              event: _event
            });
            out.setQuickReplies(replies);
            return _context24.abrupt("return", out);

          case 11:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function m_returnedCustomer(_x73, _x74, _x75) {
    return _ref24.apply(this, arguments);
  };
}();

exports.m_returnedCustomer = m_returnedCustomer;
//# sourceMappingURL=botMarkController.js.map