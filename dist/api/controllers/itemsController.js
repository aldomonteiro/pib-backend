"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItemsTotal = exports.getItems = exports.updateStatusSpecificItem = exports.updateItem = void 0;

var _items = _interopRequireDefault(require("../models/items"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _flavorsController = require("./flavorsController");

var _sizesController = require("./sizesController");

var _pricingsController = require("./pricingsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ITEMSTATUS_PENDING = 0;
var ITEMSTATUS_COMPLETED = 1;

var updateItem =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(orderData) {
    var orderId, userId, pageId, qty, sizeId, flavorId, completeItem, split, _searchStatus, item, pricing, _qty, resultLastId, itemId, record;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            orderId = orderData.orderId, userId = orderData.userId, pageId = orderData.pageId, qty = orderData.qty, sizeId = orderData.sizeId, flavorId = orderData.flavorId, completeItem = orderData.completeItem, split = orderData.split;

            if (!(qty || sizeId || flavorId || typeof completeItem === 'boolean')) {
              _context.next = 31;
              break;
            }

            _searchStatus = ITEMSTATUS_PENDING; // Received a completeItem = false from botController, so,
            // the search is for a completed item.

            if (typeof completeItem === 'boolean' && !completeItem) _searchStatus = ITEMSTATUS_COMPLETED;
            _context.next = 6;
            return _items.default.findOne({
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              status: _searchStatus
            }).exec();

          case 6:
            item = _context.sent;

            if (!item) {
              _context.next = 23;
              break;
            }

            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (flavorId) item.flavorId = flavorId;
            if (split) item.split = split;
            if (typeof completeItem === 'boolean') item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;

            if (!(item.sizeId && item.flavorId)) {
              _context.next = 18;
              break;
            }

            _context.next = 16;
            return (0, _pricingsController.getOnePricingByFlavor)(pageId, item.sizeId, item.flavorId);

          case 16:
            pricing = _context.sent;

            if (pricing) {
              _qty = item.qty && item.qty > 0 ? item.qty : 1;
              item.price = pricing.price * _qty;

              if (item.split && item.split > 1) {
                item.price = item.price / item.split;
              }
            }

          case 18:
            if (!(qty || sizeId || flavorId || split || originalSplit || typeof completeItem === 'boolean')) {
              _context.next = 21;
              break;
            }

            _context.next = 21;
            return item.save();

          case 21:
            _context.next = 31;
            break;

          case 23:
            _context.next = 25;
            return _items.default.find({
              pageId: pageId,
              orderId: orderId
            }).select('id').sort('-id').limit(1).exec();

          case 25:
            resultLastId = _context.sent;
            itemId = 1;
            if (resultLastId && resultLastId.length) itemId = resultLastId[0].id + 1;
            record = new _items.default({
              id: itemId,
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              qty: qty,
              sizeId: sizeId,
              flavorId: flavorId,
              status: ITEMSTATUS_PENDING
            });
            _context.next = 31;
            return record.save();

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function updateItem(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateItem = updateItem;

var updateStatusSpecificItem =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(objectId, status) {
    var item;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _items.default.findOne({
              _id: _mongoose.default.Types.ObjectId(objectId)
            }).exec();

          case 2:
            item = _context2.sent;

            if (!item) {
              _context2.next = 7;
              break;
            }

            item.status = status;
            _context2.next = 7;
            return item.save();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateStatusSpecificItem(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Return all items from an orderId+pageId with flavor and size.
 * completeItems=true query aux tables. default is true.
 * completeItems=false do not query aux tables.
 * @param {*} orderData 
 */


exports.updateStatusSpecificItem = updateStatusSpecificItem;

var getItems =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(orderData) {
    var orderId, pageId, completeItems, queryAuxTables, items, i, flavor, size;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId, completeItems = orderData.completeItems;
            queryAuxTables = true;

            if (typeof completeItems !== 'undefined') {
              queryAuxTables = completeItems;
            }

            _context3.next = 5;
            return _items.default.find({
              orderId: orderId,
              pageId: pageId
            }).exec();

          case 5:
            items = _context3.sent;

            if (!(items && items.length)) {
              _context3.next = 27;
              break;
            }

            i = 0;

          case 8:
            if (!(i < items.length)) {
              _context3.next = 24;
              break;
            }

            if (!(items[i].flavorId && items[i].flavorId > 0)) {
              _context3.next = 15;
              break;
            }

            if (!queryAuxTables) {
              _context3.next = 15;
              break;
            }

            _context3.next = 13;
            return (0, _flavorsController.getFlavor)(pageId, items[i].flavorId);

          case 13:
            flavor = _context3.sent;
            if (flavor) items[i].flavor = flavor.flavor;

          case 15:
            if (!(items[i].sizeId && items[i].sizeId > 0)) {
              _context3.next = 21;
              break;
            }

            if (!queryAuxTables) {
              _context3.next = 21;
              break;
            }

            _context3.next = 19;
            return (0, _sizesController.getSize)(pageId, items[i].sizeId);

          case 19:
            size = _context3.sent;
            if (size) items[i].size = size.size;

          case 21:
            i++;
            _context3.next = 8;
            break;

          case 24:
            return _context3.abrupt("return", items);

          case 27:
            return _context3.abrupt("return", null);

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getItems(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Calculate total price of an orderId+pageId
 * @param {*} orderData 
 */


exports.getItems = getItems;

var getItemsTotal =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(orderData) {
    var orderId, pageId, items, _total, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId;
            _context4.next = 3;
            return getItems({
              orderId: orderId,
              pageId: pageId,
              completeItems: false
            });

          case 3:
            items = _context4.sent;
            _total = 0;

            if (!(items && items.length)) {
              _context4.next = 25;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 9;

            for (_iterator = items[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              item = _step.value;
              _total += item.price ? item.price : 0;
            }

            _context4.next = 17;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](9);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 17:
            _context4.prev = 17;
            _context4.prev = 18;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 20:
            _context4.prev = 20;

            if (!_didIteratorError) {
              _context4.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context4.finish(20);

          case 24:
            return _context4.finish(17);

          case 25:
            return _context4.abrupt("return", _total);

          case 26:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function getItemsTotal(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getItemsTotal = getItemsTotal;
//# sourceMappingURL=itemsController.js.map