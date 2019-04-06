"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialSetup = void 0;

var _flavors2 = _interopRequireDefault(require("../models/flavors"));

var _sizes2 = _interopRequireDefault(require("../models/sizes"));

var _categories = _interopRequireDefault(require("../models/categories"));

var _toppings = _interopRequireDefault(require("../models/toppings"));

var _stores2 = _interopRequireDefault(require("../models/stores"));

var _pricings2 = _interopRequireDefault(require("../models/pricings"));

var _flavorsController = require("./flavorsController");

var _sizesController = require("./sizesController");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _toppingsController = require("./toppingsController");

var _pricingsController = require("./pricingsController");

var _storesController = require("./storesController");

var _pagesController = require("./pagesController");

var _categoriesController = require("./categoriesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var initialSetup =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    var env, basePageID, page, haveToUpdate, basePage;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _dotenv["default"].config();

            env = process.env.NODE_ENV || 'production';
            basePageID = process.env.DEV_PAGE_BASE_ID; // Página do Aldo

            if (env === 'production') basePageID = process.env.PRD_PAGE_BASE_ID; // Pizzaibot

            _context.next = 7;
            return (0, _pagesController.getOnePageData)(pageID);

          case 7:
            page = _context.sent;
            console.info("env:".concat(env, ", basePageID:").concat(basePageID));

            if (!(basePageID !== pageID)) {
              _context.next = 52;
              break;
            }

            // only updates when the page is not the basePage
            haveToUpdate = false;

            if (!page) {
              _context.next = 52;
              break;
            }

            if (page.initialSetupCategories) {
              _context.next = 17;
              break;
            }

            _context.next = 15;
            return insertCategories(pageID, basePageID);

          case 15:
            page.initialSetupCategories = _context.sent;
            haveToUpdate = true;

          case 17:
            if (page.initialSetupFlavors) {
              _context.next = 22;
              break;
            }

            _context.next = 20;
            return insertFlavors(pageID, basePageID);

          case 20:
            page.initialSetupFlavors = _context.sent;
            haveToUpdate = true;

          case 22:
            if (page.initialSetupStores) {
              _context.next = 27;
              break;
            }

            _context.next = 25;
            return insertStores(pageID, page.name, basePageID);

          case 25:
            page.initialSetupStores = _context.sent;
            haveToUpdate = true;

          case 27:
            if (page.initialSetupSizes) {
              _context.next = 32;
              break;
            }

            _context.next = 30;
            return insertSizes(pageID, basePageID);

          case 30:
            page.initialSetupSizes = _context.sent;
            haveToUpdate = true;

          case 32:
            if (page.initialSetupPricings) {
              _context.next = 37;
              break;
            }

            _context.next = 35;
            return insertPricings(pageID, basePageID);

          case 35:
            page.initialSetupPricings = _context.sent;
            haveToUpdate = true;

          case 37:
            if (page.initialSetupToppings) {
              _context.next = 42;
              break;
            }

            _context.next = 40;
            return insertToppings(pageID, basePageID);

          case 40:
            page.initialSetupToppings = _context.sent;
            haveToUpdate = true;

          case 42:
            if (!(!page.greetingText || !page.firstResponseText)) {
              _context.next = 49;
              break;
            }

            _context.next = 45;
            return (0, _pagesController.getOnePageData)(basePageID);

          case 45:
            basePage = _context.sent;
            page.greetingText = basePage.greetingText;
            page.firstResponseText = basePage.firstResponseText;
            haveToUpdate = true;

          case 49:
            if (!haveToUpdate) {
              _context.next = 52;
              break;
            }

            _context.next = 52;
            return page.save();

          case 52:
            return _context.abrupt("return", page);

          case 55:
            _context.prev = 55;
            _context.t0 = _context["catch"](0);
            console.error('Error on initial setup', _context.t0);

          case 58:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 55]]);
  }));

  return function initialSetup(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.initialSetup = initialSetup;

var insertFlavors =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageID, basePageID) {
    var _newRecords, _flavors, docs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, element, newRec;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _newRecords = 0;
            _context2.prev = 1;
            _context2.next = 4;
            return (0, _flavorsController.getFlavors)(basePageID);

          case 4:
            _flavors = _context2.sent;
            docs = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 9;

            for (_iterator = _flavors[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              element = _step.value;
              newRec = new _flavors2["default"]({
                id: element.id,
                flavor: element.flavor,
                categoryId: element.categoryId,
                price_by_size: element.price_by_size,
                price: element.price,
                toppings: element.toppings,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](9);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 17:
            _context2.prev = 17;
            _context2.prev = 18;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 20:
            _context2.prev = 20;

            if (!_didIteratorError) {
              _context2.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context2.finish(20);

          case 24:
            return _context2.finish(17);

          case 25:
            if (!(docs.length > 0)) {
              _context2.next = 29;
              break;
            }

            _context2.next = 28;
            return _flavors2["default"].insertMany(docs);

          case 28:
            // => {
            _newRecords = docs.length;

          case 29:
            _context2.next = 34;
            break;

          case 31:
            _context2.prev = 31;
            _context2.t1 = _context2["catch"](1);
            // ignoring err..
            console.error({
              insertFlavorsErr: _context2.t1
            });

          case 34:
            return _context2.abrupt("return", _newRecords);

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 31], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function insertFlavors(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var insertSizes =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, basePageID) {
    var _newRecords, _sizes, docs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, element, newRec;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _newRecords = 0;
            _context3.prev = 1;
            _context3.next = 4;
            return (0, _sizesController.getSizes)(basePageID);

          case 4:
            _sizes = _context3.sent;
            docs = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 9;

            for (_iterator2 = _sizes[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              element = _step2.value;
              newRec = new _sizes2["default"]({
                id: element.id,
                size: element.size,
                slices: element.slices,
                split: element.split,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context3.next = 17;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](9);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 17:
            _context3.prev = 17;
            _context3.prev = 18;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 20:
            _context3.prev = 20;

            if (!_didIteratorError2) {
              _context3.next = 23;
              break;
            }

            throw _iteratorError2;

          case 23:
            return _context3.finish(20);

          case 24:
            return _context3.finish(17);

          case 25:
            if (!(docs.length > 0)) {
              _context3.next = 29;
              break;
            }

            _context3.next = 28;
            return _sizes2["default"].insertMany(docs);

          case 28:
            _newRecords = docs.length;

          case 29:
            _context3.next = 34;
            break;

          case 31:
            _context3.prev = 31;
            _context3.t1 = _context3["catch"](1);
            // ignoring err..
            console.error({
              insertSizesErr: _context3.t1
            });

          case 34:
            return _context3.abrupt("return", _newRecords);

          case 35:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 31], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function insertSizes(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var insertCategories =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID, basePageID) {
    var _newRecords, _docs, docs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, element, newRec;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _newRecords = 0;
            _context4.prev = 1;
            _context4.next = 4;
            return (0, _categoriesController.getCategories)(basePageID);

          case 4:
            _docs = _context4.sent;
            docs = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context4.prev = 9;

            for (_iterator3 = _docs[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              element = _step3.value;
              newRec = new _categories["default"]({
                id: element.id,
                name: element.name,
                price_by_size: element.price_by_size,
                is_pizza: element.is_pizza,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context4.next = 17;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](9);
            _didIteratorError3 = true;
            _iteratorError3 = _context4.t0;

          case 17:
            _context4.prev = 17;
            _context4.prev = 18;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 20:
            _context4.prev = 20;

            if (!_didIteratorError3) {
              _context4.next = 23;
              break;
            }

            throw _iteratorError3;

          case 23:
            return _context4.finish(20);

          case 24:
            return _context4.finish(17);

          case 25:
            if (!(docs.length > 0)) {
              _context4.next = 29;
              break;
            }

            _context4.next = 28;
            return _categories["default"].insertMany(docs);

          case 28:
            _newRecords = docs.length;

          case 29:
            _context4.next = 34;
            break;

          case 31:
            _context4.prev = 31;
            _context4.t1 = _context4["catch"](1);
            // ignoring err..
            console.error({
              insertBeveragesErr: _context4.t1
            });

          case 34:
            return _context4.abrupt("return", _newRecords);

          case 35:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 31], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function insertCategories(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var insertToppings =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, basePageID) {
    var _newRecords, _docs, docs, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, element, newRec;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _newRecords = 0;
            _context5.prev = 1;
            _context5.next = 4;
            return (0, _toppingsController.getToppingsFull)(basePageID);

          case 4:
            _docs = _context5.sent;
            docs = [];
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context5.prev = 9;

            for (_iterator4 = _docs[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              element = _step4.value;
              newRec = new _toppings["default"]({
                id: element.id,
                topping: element.topping,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context5.next = 17;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](9);
            _didIteratorError4 = true;
            _iteratorError4 = _context5.t0;

          case 17:
            _context5.prev = 17;
            _context5.prev = 18;

            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }

          case 20:
            _context5.prev = 20;

            if (!_didIteratorError4) {
              _context5.next = 23;
              break;
            }

            throw _iteratorError4;

          case 23:
            return _context5.finish(20);

          case 24:
            return _context5.finish(17);

          case 25:
            if (!(docs.length > 0)) {
              _context5.next = 29;
              break;
            }

            _context5.next = 28;
            return _toppings["default"].insertMany(docs);

          case 28:
            _newRecords = docs.length;

          case 29:
            _context5.next = 34;
            break;

          case 31:
            _context5.prev = 31;
            _context5.t1 = _context5["catch"](1);
            // ignoring err..
            console.error({
              insertToppingsErr: _context5.t1
            });

          case 34:
            return _context5.abrupt("return", _newRecords);

          case 35:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 31], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function insertToppings(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var insertPricings =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, basePageID) {
    var _newRecords, _pricings, docs, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, element, newRec;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _newRecords = 0;
            _context6.prev = 1;
            _context6.next = 4;
            return (0, _pricingsController.getPricings)(basePageID);

          case 4:
            _pricings = _context6.sent;
            docs = [];
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context6.prev = 9;

            for (_iterator5 = _pricings[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              element = _step5.value;
              newRec = new _pricings2["default"]({
                id: element.id,
                categoryId: element.categoryId,
                sizeId: element.sizeId,
                price: element.price,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context6.next = 17;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](9);
            _didIteratorError5 = true;
            _iteratorError5 = _context6.t0;

          case 17:
            _context6.prev = 17;
            _context6.prev = 18;

            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }

          case 20:
            _context6.prev = 20;

            if (!_didIteratorError5) {
              _context6.next = 23;
              break;
            }

            throw _iteratorError5;

          case 23:
            return _context6.finish(20);

          case 24:
            return _context6.finish(17);

          case 25:
            if (!(docs.length > 0)) {
              _context6.next = 29;
              break;
            }

            _context6.next = 28;
            return _pricings2["default"].insertMany(docs);

          case 28:
            _newRecords = docs.length;

          case 29:
            _context6.next = 34;
            break;

          case 31:
            _context6.prev = 31;
            _context6.t1 = _context6["catch"](1);
            // ignoring err..
            console.error({
              insertPricingsErr: _context6.t1
            });

          case 34:
            return _context6.abrupt("return", _newRecords);

          case 35:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 31], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function insertPricings(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

var insertStores =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageID, pageName, basePageID) {
    var _newRecords, _stores, docs, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, element, newRec;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _newRecords = 0;
            _context7.prev = 1;
            _context7.next = 4;
            return (0, _storesController.getStores)(basePageID);

          case 4:
            _stores = _context7.sent;
            docs = [];
            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context7.prev = 9;

            for (_iterator6 = _stores[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              element = _step6.value;
              newRec = new _stores2["default"]({
                pageId: pageID,
                name: pageName,
                id: element.id,
                hol_is_open: element.hol_is_open,
                hol_open: element.hol_open,
                hol_close: element.hol_close,
                sun_is_open: element.sun_is_open,
                mon_is_open: element.mon_is_open,
                tue_is_open: element.tue_is_open,
                wed_is_open: element.wed_is_open,
                thu_is_open: element.thu_is_open,
                fri_is_open: element.fri_is_open,
                sat_is_open: element.sat_is_open,
                sun_open: element.sun_open,
                mon_open: element.mon_open,
                tue_open: element.tue_open,
                wed_open: element.wed_open,
                thu_open: element.thu_open,
                fri_open: element.fri_open,
                sat_open: element.sat_open,
                sun_close: element.sun_close,
                mon_close: element.mon_close,
                tue_close: element.tue_close,
                wed_close: element.wed_close,
                thu_close: element.thu_close,
                fri_close: element.fri_close,
                sat_close: element.sat_close,
                delivery_fees: element.delivery_fees,
                catalog_url1: element.catalog_url1,
                catalog_url2: element.catalog_url2,
                payment_types: element.payment_types
              });
              docs.push(newRec);
            }

            _context7.next = 17;
            break;

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](9);
            _didIteratorError6 = true;
            _iteratorError6 = _context7.t0;

          case 17:
            _context7.prev = 17;
            _context7.prev = 18;

            if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
              _iterator6["return"]();
            }

          case 20:
            _context7.prev = 20;

            if (!_didIteratorError6) {
              _context7.next = 23;
              break;
            }

            throw _iteratorError6;

          case 23:
            return _context7.finish(20);

          case 24:
            return _context7.finish(17);

          case 25:
            if (!(docs.length > 0)) {
              _context7.next = 29;
              break;
            }

            _context7.next = 28;
            return _stores2["default"].insertMany(docs);

          case 28:
            _newRecords = docs.length;

          case 29:
            _context7.next = 34;
            break;

          case 31:
            _context7.prev = 31;
            _context7.t1 = _context7["catch"](1);
            // ignoring err..
            console.error({
              insertStoresErr: _context7.t1
            });

          case 34:
            return _context7.abrupt("return", _newRecords);

          case 35:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 31], [9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function insertStores(_x12, _x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
//# sourceMappingURL=systemController.js.map