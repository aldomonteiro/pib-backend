"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputCardapioReplyMsg = exports.getFlavorsAndToppingsCardapio = exports.askForCategoryCardapio = exports.getCardapio = void 0;

var _pricingsController = require("../controllers/pricingsController");

var _categoriesController = require("../controllers/categoriesController");

var _flavorsController = require("../controllers/flavorsController");

var _toppingsController = require("../controllers/toppingsController");

var _storesController = require("../controllers/storesController");

var _botController = require("./botController");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getCardapio =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID, categoryID) {
    var category, flavorArray, pricingArray, replyText, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pricing;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _categoriesController.getCategory)(pageID, categoryID);

          case 2:
            category = _context.sent;
            _context.next = 5;
            return getFlavorsAndToppingsCardapio(pageID, categoryID);

          case 5:
            flavorArray = _context.sent;
            pricingArray = [];

            if (!(category && category.price_by_size)) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return (0, _pricingsController.getPricingsWithSize)(pageID);

          case 10:
            pricingArray = _context.sent;

          case 11:
            if (!(flavorArray && category)) {
              _context.next = 38;
              break;
            }

            replyText = "Seguem nossas op\xE7\xF5es de ".concat(category.name, ":\n");

            if (!(category && category.price_by_size)) {
              _context.next = 33;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 17;

            for (_iterator = pricingArray[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              pricing = _step.value;
              if (pricing.categoryId === category.id) replyText = replyText + "".concat(pricing.size, " - R$ ").concat(pricing.price, "\n");
            }

            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](17);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 25:
            _context.prev = 25;
            _context.prev = 26;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 28:
            _context.prev = 28;

            if (!_didIteratorError) {
              _context.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context.finish(28);

          case 32:
            return _context.finish(25);

          case 33:
            _context.t1 = replyText + '\n';
            _context.next = 36;
            return inputCardapioReplyMsg(flavorArray, category.price_by_size);

          case 36:
            _context.t2 = _context.sent;
            replyText = _context.t1 + _context.t2;

          case 38:
            return _context.abrupt("return", replyText);

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[17, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function getCardapio(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * If there is an image in the Store Customizing, send it.
 * @param {*} pageId
 */


exports.getCardapio = getCardapio;

var askForCategoryCardapio =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageId) {
    var storeData, _images, img, _img, reply, categories, _txt, _options, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, _data, _buttons, buttons;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _storesController.getStoreData)(pageId);

          case 2:
            storeData = _context2.sent;

            if (!(storeData.catalog_url1 || storeData.catalog_url2)) {
              _context2.next = 15;
              break;
            }

            _images = [];

            if (storeData.catalog_url1) {
              img = {
                imageUrl: storeData.catalog_url1,
                imageCaption: 'Cardápio'
              };

              _images.push(img);
            }

            if (storeData.catalog_url2) {
              _img = {
                imageUrl: storeData.catalog_url2,
                imageCaption: 'Cardápio'
              };

              _images.push(_img);
            }

            _context2.next = 9;
            return (0, _botController.sendMainMenu)();

          case 9:
            reply = _context2.sent;
            reply.extraType = 'image';
            reply.images = _images;
            return _context2.abrupt("return", reply);

          case 15:
            _context2.next = 17;
            return (0, _categoriesController.getCategories)(pageId);

          case 17:
            categories = _context2.sent;
            _txt = 'Selecione uma categoria:';
            _options = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 23;

            for (_iterator2 = categories[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              item = _step2.value;
              _data = {
                id: item.id,
                name: item.name
              };
              _buttons = {
                text: 'Detalhes',
                data: _data,
                event: 'ORDER_CATEGORY_CARDAPIO'
              };

              _options.push({
                text: item.name,
                subtext: item.name,
                buttons: _buttons
              });
            }

            _context2.next = 31;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t0 = _context2["catch"](23);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 31:
            _context2.prev = 31;
            _context2.prev = 32;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 34:
            _context2.prev = 34;

            if (!_didIteratorError2) {
              _context2.next = 37;
              break;
            }

            throw _iteratorError2;

          case 37:
            return _context2.finish(34);

          case 38:
            return _context2.finish(31);

          case 39:
            buttons = {
              text: 'Voltar',
              data: 'main_menu',
              event: 'MAIN_MENU'
            };

            _options.push({
              text: 'Voltar p/ Inicio',
              subtext: 'Voltar p/ Inicio',
              buttons: buttons
            });

            return _context2.abrupt("return", {
              type: 'list',
              text: _txt,
              options: _options
            });

          case 42:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[23, 27, 31, 39], [32,, 34, 38]]);
  }));

  return function askForCategoryCardapio(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.askForCategoryCardapio = askForCategoryCardapio;

var getFlavorsAndToppingsCardapio =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, categoryID) {
    var flavorArray, allToppings, flavorsWithToppings, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, flavor, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, tId, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, topping;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _flavorsController.getFlavors)(pageID);

          case 3:
            flavorArray = _context3.sent;
            _context3.next = 6;
            return (0, _toppingsController.getToppingsFull)(pageID);

          case 6:
            allToppings = _context3.sent;
            flavorsWithToppings = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context3.prev = 11;
            _iterator3 = flavorArray[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context3.next = 65;
              break;
            }

            flavor = _step3.value;

            if (!(categoryID && flavor.categoryId === categoryID)) {
              _context3.next = 62;
              break;
            }

            flavor.toppingsNames = [];

            if (!(flavor.toppings && flavor.toppings.length > 0)) {
              _context3.next = 61;
              break;
            }

            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context3.prev = 21;
            _iterator4 = flavor.toppings[Symbol.iterator]();

          case 23:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context3.next = 47;
              break;
            }

            tId = _step4.value;
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context3.prev = 28;

            for (_iterator5 = allToppings[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              topping = _step5.value;

              if (topping.id === tId) {
                flavor.toppingsNames.push(topping.topping);
              }
            }

            _context3.next = 36;
            break;

          case 32:
            _context3.prev = 32;
            _context3.t0 = _context3["catch"](28);
            _didIteratorError5 = true;
            _iteratorError5 = _context3.t0;

          case 36:
            _context3.prev = 36;
            _context3.prev = 37;

            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }

          case 39:
            _context3.prev = 39;

            if (!_didIteratorError5) {
              _context3.next = 42;
              break;
            }

            throw _iteratorError5;

          case 42:
            return _context3.finish(39);

          case 43:
            return _context3.finish(36);

          case 44:
            _iteratorNormalCompletion4 = true;
            _context3.next = 23;
            break;

          case 47:
            _context3.next = 53;
            break;

          case 49:
            _context3.prev = 49;
            _context3.t1 = _context3["catch"](21);
            _didIteratorError4 = true;
            _iteratorError4 = _context3.t1;

          case 53:
            _context3.prev = 53;
            _context3.prev = 54;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 56:
            _context3.prev = 56;

            if (!_didIteratorError4) {
              _context3.next = 59;
              break;
            }

            throw _iteratorError4;

          case 59:
            return _context3.finish(56);

          case 60:
            return _context3.finish(53);

          case 61:
            flavorsWithToppings.push(flavor);

          case 62:
            _iteratorNormalCompletion3 = true;
            _context3.next = 13;
            break;

          case 65:
            _context3.next = 71;
            break;

          case 67:
            _context3.prev = 67;
            _context3.t2 = _context3["catch"](11);
            _didIteratorError3 = true;
            _iteratorError3 = _context3.t2;

          case 71:
            _context3.prev = 71;
            _context3.prev = 72;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 74:
            _context3.prev = 74;

            if (!_didIteratorError3) {
              _context3.next = 77;
              break;
            }

            throw _iteratorError3;

          case 77:
            return _context3.finish(74);

          case 78:
            return _context3.finish(71);

          case 79:
            return _context3.abrupt("return", flavorsWithToppings);

          case 82:
            _context3.prev = 82;
            _context3.t3 = _context3["catch"](0);
            console.error({
              flavorsAndToppingsCardapioErr: _context3.t3
            });

          case 85:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 82], [11, 67, 71, 79], [21, 49, 53, 61], [28, 32, 36, 44], [37,, 39, 43], [54,, 56, 60], [72,, 74, 78]]);
  }));

  return function getFlavorsAndToppingsCardapio(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getFlavorsAndToppingsCardapio = getFlavorsAndToppingsCardapio;

var inputCardapioReplyMsg =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(flavorArray, priceBySize) {
    var replyMsg, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, flavor;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.info(flavorArray);
            replyMsg = '';

            if (!flavorArray) {
              _context4.next = 22;
              break;
            }

            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context4.prev = 6;

            for (_iterator6 = flavorArray[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              flavor = _step6.value;
              replyMsg = replyMsg + flavor.flavor;
              if (!priceBySize) replyMsg = replyMsg + ' - RS ' + flavor.price;
              replyMsg = replyMsg + '\n';
              if (flavor.toppingsNames && flavor.toppingsNames.length > 0) replyMsg = replyMsg + '𝐈𝐧𝐠𝐫𝐞𝐝𝐢𝐞𝐧𝐭𝐞𝐬: ' + flavor.toppingsNames.join(', ') + '\n';
            }

            _context4.next = 14;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](6);
            _didIteratorError6 = true;
            _iteratorError6 = _context4.t0;

          case 14:
            _context4.prev = 14;
            _context4.prev = 15;

            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }

          case 17:
            _context4.prev = 17;

            if (!_didIteratorError6) {
              _context4.next = 20;
              break;
            }

            throw _iteratorError6;

          case 20:
            return _context4.finish(17);

          case 21:
            return _context4.finish(14);

          case 22:
            return _context4.abrupt("return", replyMsg);

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[6, 10, 14, 22], [15,, 17, 21]]);
  }));

  return function inputCardapioReplyMsg(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.inputCardapioReplyMsg = inputCardapioReplyMsg;
//# sourceMappingURL=show_cardapio.js.map