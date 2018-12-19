"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialSetup = void 0;

var _flavors2 = _interopRequireDefault(require("../models/flavors"));

var _sizes2 = _interopRequireDefault(require("../models/sizes"));

var _beverages = _interopRequireDefault(require("../models/beverages"));

var _stores2 = _interopRequireDefault(require("../models/stores"));

var _pricings2 = _interopRequireDefault(require("../models/pricings"));

var _flavorsController = require("./flavorsController");

var _sizesController = require("./sizesController");

var _beveragesController = require("./beveragesController");

var _pricingsController = require("./pricingsController");

var _storesController = require("./storesController");

var _pagesController = require("./pagesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var env = process.env.NODE_ENV || 'production';
var basePageID = process.env.DEV_PAGE_BASE_ID; // Página do Aldo

if (env === 'production') basePageID = process.env.PRD_PAGE_BASE_ID; // Pizzaibot

var initialSetup =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    var updatedPage, haveToUpdate, basePage;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _pagesController.getOnePageData)(pageID);

          case 3:
            updatedPage = _context.sent;
            haveToUpdate = false;

            if (!updatedPage) {
              _context.next = 42;
              break;
            }

            if (updatedPage.initialSetupFlavors) {
              _context.next = 11;
              break;
            }

            _context.next = 9;
            return insertFlavors(pageID);

          case 9:
            updatedPage.initialSetupFlavors = _context.sent;
            haveToUpdate = true;

          case 11:
            if (updatedPage.initialSetupStores) {
              _context.next = 16;
              break;
            }

            _context.next = 14;
            return insertStores(pageID, updatedPage.name);

          case 14:
            updatedPage.initialSetupStores = _context.sent;
            haveToUpdate = true;

          case 16:
            if (updatedPage.initialSetupSizes) {
              _context.next = 21;
              break;
            }

            _context.next = 19;
            return insertSizes(pageID);

          case 19:
            updatedPage.initialSetupSizes = _context.sent;
            haveToUpdate = true;

          case 21:
            if (updatedPage.initialSetupPricings) {
              _context.next = 26;
              break;
            }

            _context.next = 24;
            return insertPricings(pageID);

          case 24:
            updatedPage.initialSetupPricings = _context.sent;
            haveToUpdate = true;

          case 26:
            if (updatedPage.initialSetupBeverages) {
              _context.next = 31;
              break;
            }

            _context.next = 29;
            return insertBeverages(pageID);

          case 29:
            updatedPage.initialSetupBeverages = _context.sent;
            haveToUpdate = true;

          case 31:
            if (!(!updatedPage.greetingText || !updatedPage.firstResponseText)) {
              _context.next = 38;
              break;
            }

            _context.next = 34;
            return (0, _pagesController.getOnePageData)(basePageID);

          case 34:
            basePage = _context.sent;
            updatedPage.greetingText = basePage.greetingText;
            updatedPage.firstResponseText = basePage.firstResponseText;
            haveToUpdate = true;

          case 38:
            if (!haveToUpdate) {
              _context.next = 41;
              break;
            }

            _context.next = 41;
            return updatedPage.save();

          case 41:
            return _context.abrupt("return", updatedPage);

          case 42:
            _context.next = 47;
            break;

          case 44:
            _context.prev = 44;
            _context.t0 = _context["catch"](0);
            console.error("Error on initial setup", _context.t0);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 44]]);
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
  regeneratorRuntime.mark(function _callee2(pageID) {
    var _newRecords, _flavors, docs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, element, newRec;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _newRecords = 0;
            _context2.next = 3;
            return (0, _flavorsController.getFlavors)(basePageID);

          case 3:
            _flavors = _context2.sent;
            docs = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 8;

            for (_iterator = _flavors[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              element = _step.value;
              newRec = new _flavors2.default({
                id: element.id,
                flavor: element.flavor,
                kind: element.kind,
                toppings: element.toppings,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 16:
            _context2.prev = 16;
            _context2.prev = 17;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 19:
            _context2.prev = 19;

            if (!_didIteratorError) {
              _context2.next = 22;
              break;
            }

            throw _iteratorError;

          case 22:
            return _context2.finish(19);

          case 23:
            return _context2.finish(16);

          case 24:
            if (!(docs.length > 0)) {
              _context2.next = 27;
              break;
            }

            _context2.next = 27;
            return _flavors2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting flavors', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " flavors inserted"));
              }
            });

          case 27:
            return _context2.abrupt("return", _newRecords);

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));

  return function insertFlavors(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var insertSizes =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID) {
    var _newRecords, _sizes, docs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, element, newRec;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _newRecords = 0;
            _context3.next = 3;
            return (0, _sizesController.getSizes)(basePageID);

          case 3:
            _sizes = _context3.sent;
            docs = new Array();
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 8;

            for (_iterator2 = _sizes[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              element = _step2.value;
              newRec = new _sizes2.default({
                id: element.id,
                size: element.size,
                slices: element.slices,
                split: element.split,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](8);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 16:
            _context3.prev = 16;
            _context3.prev = 17;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 19:
            _context3.prev = 19;

            if (!_didIteratorError2) {
              _context3.next = 22;
              break;
            }

            throw _iteratorError2;

          case 22:
            return _context3.finish(19);

          case 23:
            return _context3.finish(16);

          case 24:
            if (!(docs.length > 0)) {
              _context3.next = 27;
              break;
            }

            _context3.next = 27;
            return _sizes2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting sizes', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " sizes inserted"));
              }
            });

          case 27:
            return _context3.abrupt("return", _newRecords);

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));

  return function insertSizes(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var insertBeverages =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    var _newRecords, _docs, docs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, element, newRec;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _newRecords = 0;
            _context4.next = 3;
            return (0, _beveragesController.getBeverages)(basePageID);

          case 3:
            _docs = _context4.sent;
            docs = new Array();
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context4.prev = 8;

            for (_iterator3 = _docs[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              element = _step3.value;
              newRec = new _beverages.default({
                id: element.id,
                kind: element.kind,
                name: element.name,
                price: element.price,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context4.next = 16;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](8);
            _didIteratorError3 = true;
            _iteratorError3 = _context4.t0;

          case 16:
            _context4.prev = 16;
            _context4.prev = 17;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 19:
            _context4.prev = 19;

            if (!_didIteratorError3) {
              _context4.next = 22;
              break;
            }

            throw _iteratorError3;

          case 22:
            return _context4.finish(19);

          case 23:
            return _context4.finish(16);

          case 24:
            if (!(docs.length > 0)) {
              _context4.next = 27;
              break;
            }

            _context4.next = 27;
            return _beverages.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting beverages', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " beverages inserted"));
              }
            });

          case 27:
            return _context4.abrupt("return", _newRecords);

          case 28:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));

  return function insertBeverages(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var insertPricings =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID) {
    var _newRecords, _pricings, docs, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, element, newRec;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _newRecords = 0;
            _context5.next = 3;
            return (0, _pricingsController.getPricings)(basePageID);

          case 3:
            _pricings = _context5.sent;
            docs = new Array();
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context5.prev = 8;

            for (_iterator4 = _pricings[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              element = _step4.value;
              newRec = new _pricings2.default({
                id: element.id,
                kind: element.kind,
                sizeId: element.sizeId,
                price: element.price,
                pageId: pageID
              });
              docs.push(newRec);
            }

            _context5.next = 16;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](8);
            _didIteratorError4 = true;
            _iteratorError4 = _context5.t0;

          case 16:
            _context5.prev = 16;
            _context5.prev = 17;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 19:
            _context5.prev = 19;

            if (!_didIteratorError4) {
              _context5.next = 22;
              break;
            }

            throw _iteratorError4;

          case 22:
            return _context5.finish(19);

          case 23:
            return _context5.finish(16);

          case 24:
            if (!(docs.length > 0)) {
              _context5.next = 27;
              break;
            }

            _context5.next = 27;
            return _pricings2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting pricings', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " pricings inserted"));
              }
            });

          case 27:
            return _context5.abrupt("return", _newRecords);

          case 28:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));

  return function insertPricings(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var insertStores =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, pageName) {
    var _newRecords, _stores, docs, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, element, newRec;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _newRecords = 0;
            _context6.next = 3;
            return (0, _storesController.getStores)(basePageID);

          case 3:
            _stores = _context6.sent;
            docs = new Array();
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context6.prev = 8;

            for (_iterator5 = _stores[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              element = _step5.value;
              newRec = new _stores2.default({
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
                sat_close: element.sat_close
              });
              docs.push(newRec);
            }

            _context6.next = 16;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](8);
            _didIteratorError5 = true;
            _iteratorError5 = _context6.t0;

          case 16:
            _context6.prev = 16;
            _context6.prev = 17;

            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }

          case 19:
            _context6.prev = 19;

            if (!_didIteratorError5) {
              _context6.next = 22;
              break;
            }

            throw _iteratorError5;

          case 22:
            return _context6.finish(19);

          case 23:
            return _context6.finish(16);

          case 24:
            if (!(docs.length > 0)) {
              _context6.next = 27;
              break;
            }

            _context6.next = 27;
            return _stores2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting stores', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(_newRecords, " stores inserted"));
              }
            });

          case 27:
            return _context6.abrupt("return", _newRecords);

          case 28:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));

  return function insertStores(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();
//# sourceMappingURL=systemController.js.map