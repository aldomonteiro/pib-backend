"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.validateBotOrder = exports.inputHorarioReplyMsg = exports.getOpenAndClose = exports.inputCardapioReplyMsg = exports.getFlavorsAndToppings = void 0;var _flavorsController = require("../controllers/flavorsController");
var _toppingsController = require("../controllers/toppingsController");
var _storesController = require("../controllers/storesController");function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

var QTY_1 = [1, "um", "uma"];

var getFlavorsAndToppings = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pageID) {var flavorArray, i, flavor, toppingArray;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;_context.next = 3;return (

              (0, _flavorsController.getFlavors)(pageID));case 3:flavorArray = _context.sent;
            i = 0;case 5:if (!(i < flavorArray.length)) {_context.next = 14;break;}
            flavor = flavorArray[i];_context.next = 9;return (
              (0, _toppingsController.getToppings)(flavor.toppings));case 9:toppingArray = _context.sent;
            flavorArray[i].toppingsNames = toppingArray;case 11:i++;_context.next = 5;break;case 14:return _context.abrupt("return",

            flavorArray);case 17:_context.prev = 17;_context.t0 = _context["catch"](0);

            console.log("err on getFlavorsAndToppings");
            console.log(_context.t0);case 21:case "end":return _context.stop();}}}, _callee, this, [[0, 17]]);}));return function getFlavorsAndToppings(_x) {return _ref.apply(this, arguments);};}();exports.getFlavorsAndToppings = getFlavorsAndToppings;



var inputCardapioReplyMsg = function inputCardapioReplyMsg(flavorArray) {
  var replyMsg = '';
  if (flavorArray) {
    for (var i = 0; i < flavorArray.length; i++) {
      var flavor = flavorArray[i];
      replyMsg = replyMsg + '*' + flavor.flavor + '*' + '\n';
      var toppingArray = flavor.toppingsNames;
      if (toppingArray) {
        for (var k = 0; k < toppingArray.length; k++) {
          var toppingObj = toppingArray[k];
          if (k < toppingArray.length - 1)
          replyMsg = replyMsg + toppingObj.topping + ', ';else
          {
            replyMsg = replyMsg.replace(/, $/, ' e '); // replace the last comma
            replyMsg = replyMsg + toppingObj.topping;
          }
        }
        replyMsg = replyMsg + '\n';
      }
    }
  }
  return replyMsg;
};exports.inputCardapioReplyMsg = inputCardapioReplyMsg;

var getOpenAndClose = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(pageID) {var weekDay, openingTimes, openAndClose;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            // TODO: timezone from the store
            weekDay = new Date().getDay();_context2.next = 3;return (

              (0, _storesController.getOpeningTimes)(pageID));case 3:openingTimes = _context2.sent;if (!

            openingTimes) {_context2.next = 8;break;}
            openAndClose = { isOpen: false, openTime: null, closeTime: null };
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
            } else
            if (weekDay === 7) {
              openAndClose.isOpen = openingTimes.sun_is_open;
              openAndClose.openTime = openingTimes.sun_open;
              openAndClose.closeTime = openingTimes.sun_close;
            }return _context2.abrupt("return",
            openAndClose);case 8:return _context2.abrupt("return",

            null);case 9:case "end":return _context2.stop();}}}, _callee2, this);}));return function getOpenAndClose(_x2) {return _ref2.apply(this, arguments);};}();exports.getOpenAndClose = getOpenAndClose;


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

/**
    * validateBotOrder
    * @param {*} pageID 
    * @param {*} entities 
    * @return
    */exports.inputHorarioReplyMsg = inputHorarioReplyMsg;
var validateBotOrder = /*#__PURE__*/function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(pageID, entities) {var quantidade, tamanho, produto, sabor, validated, replyText, order_flavor, order_qty, order_size, order_prod, order_flav;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            quantidade = entities.quantidade, tamanho = entities.tamanho, produto = entities.produto, sabor = entities.sabor;
            validated = basicValidation(quantidade, tamanho, produto, sabor);
            replyText = new String();if (!(
            validated === 0)) {_context3.next = 10;break;}_context3.next = 6;return (
              (0, _flavorsController.getFlavorByName)(pageID, sabor[0]));case 6:order_flavor = _context3.sent;

            if (order_flavor) {
              order_qty = quantidade[0];
              order_size = tamanho[0];
              order_prod = produto.length > 0 ? produto[0] : 'pizza';
              order_flav = order_flavor.flavor;

              replyText = 'Ok, o seu pedido é : \n';
              replyText = replyText.concat(order_qty, ' ', order_prod, ' ', order_size, ' de ', order_flav, '\n');
              replyText = replyText.concat('Para confirmar, digite SIM. Se tem algum problema, diga pra mim o que está errado');
            } else {
              replyText = 'Não temos o sabor ' + sabor[0];
            }_context3.next = 11;break;case 10:
            if (validated === 1) {
              replyText = 'A quantidade solicitada não bate, vou questionar se está faltando algo...';
            } else {
              replyText = 'Algum problema com tamanho ou sabor...';
            }case 11:return _context3.abrupt("return",
            replyText);case 12:case "end":return _context3.stop();}}}, _callee3, this);}));return function validateBotOrder(_x3, _x4) {return _ref3.apply(this, arguments);};}();


/**
                                                                                                                                                                                   * basicValidation
                                                                                                                                                                                   * @param {*} quantidade 
                                                                                                                                                                                   * @param {*} tamanho 
                                                                                                                                                                                   * @param {*} produto 
                                                                                                                                                                                   * @param {*} sabor 
                                                                                                                                                                                   * @returns
                                                                                                                                                                                   *      0 - if the validation passed
                                                                                                                                                                                   *      1 - if quantidade validation failed
                                                                                                                                                                                   *      2 - if tamanho validation failed
                                                                                                                                                                                   *      3 - if produto validation failed
                                                                                                                                                                                   *      4 - if sabor validation failed
                                                                                                                                                                                   */exports.validateBotOrder = validateBotOrder;
var basicValidation = function basicValidation(quantidade, tamanho, produto, sabor) {
  // 1 pizza, 1 sabor, 1 quantidade
  if (quantidade.length === 1) {// && QTY_1.includes(quantidade[1])) {
    if (tamanho.length === 1) {
      if (sabor.length === 1) {
        return 0;
      }
    }
  }
  return 5;
};
//# sourceMappingURL=actionsController.js.map