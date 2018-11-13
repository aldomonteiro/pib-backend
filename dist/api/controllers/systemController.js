"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialSetup = void 0;

var _flavors2 = _interopRequireDefault(require("../models/flavors"));

var _sizes2 = _interopRequireDefault(require("../models/sizes"));

var _stores2 = _interopRequireDefault(require("../models/stores"));

var _pricings2 = _interopRequireDefault(require("../models/pricings"));

var _flavorsController = require("./flavorsController");

var _sizesController = require("./sizesController");

var _pricingsController = require("./pricingsController");

var _storesController = require("./storesController");

var _pagesController = require("./pagesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var basePageID = "237290183773790"; // Página do Aldo

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

            if (updatedPage.initialSetupFlavors) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return insertFlavors(pageID);

          case 8:
            updatedPage.initialSetupFlavors = _context.sent;
            haveToUpdate = true;

          case 10:
            if (updatedPage.initialSetupStores) {
              _context.next = 15;
              break;
            }

            _context.next = 13;
            return insertStores(pageID, updatedPage.name);

          case 13:
            updatedPage.initialSetupStores = _context.sent;
            haveToUpdate = true;

          case 15:
            if (updatedPage.initialSetupSizes) {
              _context.next = 20;
              break;
            }

            _context.next = 18;
            return insertSizes(pageID);

          case 18:
            updatedPage.initialSetupSizes = _context.sent;
            haveToUpdate = true;

          case 20:
            if (updatedPage.initialSetupPricings) {
              _context.next = 25;
              break;
            }

            _context.next = 23;
            return insertPricings(pageID);

          case 23:
            updatedPage.initialSetupPricings = _context.sent;
            haveToUpdate = true;

          case 25:
            if (!(!updatedPage.greetingText || !updatedPage.firstResponseText)) {
              _context.next = 32;
              break;
            }

            _context.next = 28;
            return (0, _pagesController.getOnePageData)(basePageID);

          case 28:
            basePage = _context.sent;
            updatedPage.greetingText = basePage.greetingText;
            updatedPage.firstResponseText = basePage.firstResponseText;
            haveToUpdate = true;

          case 32:
            if (!haveToUpdate) {
              _context.next = 35;
              break;
            }

            _context.next = 35;
            return updatedPage.save();

          case 35:
            _context.next = 40;
            break;

          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](0);
            console.error("Error on initial setup", _context.t0);

          case 40:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 37]]);
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
    var _newRecords, _flavors, docs;

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

            _flavors.forEach(function (element) {
              var newRec = new _flavors2.default({
                id: element.id,
                flavor: element.flavor,
                kind: element.kind,
                toppings: element.toppings,
                pageId: pageID
              });
              docs.push(newRec);
            });

            _context2.next = 8;
            return _flavors2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting flavors', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " flavors inserted"));
              }
            });

          case 8:
            return _context2.abrupt("return", _newRecords);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
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
    var _newRecords, _sizes, docs;

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

            _sizes.forEach(function (element) {
              var newRec = new _sizes2.default({
                id: element.id,
                size: element.size,
                slices: element.slices,
                split: element.split,
                pageId: pageID
              });
              docs.push(newRec);
            });

            _context3.next = 8;
            return _sizes2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting sizes', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " sizes inserted"));
              }
            });

          case 8:
            return _context3.abrupt("return", _newRecords);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function insertSizes(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var insertPricings =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    var _newRecords, _pricings, docs;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _newRecords = 0;
            _context4.next = 3;
            return (0, _pricingsController.getPricings)(basePageID);

          case 3:
            _pricings = _context4.sent;
            docs = new Array();

            _pricings.forEach(function (element) {
              var newRec = new _pricings2.default({
                id: element.id,
                kind: element.kind,
                sizeId: element.sizeId,
                price: element.price,
                pageId: pageID
              });
              docs.push(newRec);
            });

            _context4.next = 8;
            return _pricings2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting pricings', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(pageID, ": ").concat(_newRecords, " pricings inserted"));
              }
            });

          case 8:
            return _context4.abrupt("return", _newRecords);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function insertPricings(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var insertStores =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, pageName) {
    var _newRecords, _stores, docs;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _newRecords = 0;
            _context5.next = 3;
            return (0, _storesController.getStores)(basePageID);

          case 3:
            _stores = _context5.sent;
            docs = new Array();

            _stores.forEach(function (element) {
              var newRec = new _stores2.default({
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
            });

            _context5.next = 8;
            return _stores2.default.insertMany(docs, function (err, result) {
              if (err) {
                console.error('Error while inserting stores', err);
                throw err;
              } else {
                _newRecords = result.length;
                console.info("".concat(_newRecords, " stores inserted"));
              }
            });

          case 8:
            return _context5.abrupt("return", _newRecords);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function insertStores(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();
//# sourceMappingURL=systemController.js.map