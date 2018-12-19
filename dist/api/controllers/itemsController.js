"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItemsTotal = exports.getItems = exports.updateStatusSpecificItem = exports.updateItem = exports.deleteManyItems = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _items = _interopRequireDefault(require("../models/items"));

var _flavorsController = require("./flavorsController");

var _pricingsController = require("./pricingsController");

var _sizesController = require("./sizesController");

var _beveragesController = require("./beveragesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ITEMSTATUS_PENDING = 0;
var ITEMSTATUS_COMPLETED = 1;
/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */

var deleteManyItems =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _items.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function deleteManyItems(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.deleteManyItems = deleteManyItems;

var updateItem =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(orderData) {
    var orderId, userId, pageId, qty, sizeId, flavorId, beverageId, beveragePrice, completeItem, split, originalSplit, _searchStatus, item, pricing, _qty, resultLastId, itemId, price, record;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            orderId = orderData.orderId, userId = orderData.userId, pageId = orderData.pageId, qty = orderData.qty, sizeId = orderData.sizeId, flavorId = orderData.flavorId, beverageId = orderData.beverageId, beveragePrice = orderData.beveragePrice, completeItem = orderData.completeItem, split = orderData.split, originalSplit = orderData.originalSplit;

            if (!(qty || sizeId || flavorId || beverageId || typeof completeItem === 'boolean')) {
              _context2.next = 34;
              break;
            }

            _searchStatus = ITEMSTATUS_PENDING; // Received a completeItem = false from botController, so,
            // the search is for a completed item.

            if (typeof completeItem === 'boolean' && !completeItem) _searchStatus = ITEMSTATUS_COMPLETED;
            _context2.next = 6;
            return _items.default.findOne({
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              status: _searchStatus
            }).exec();

          case 6:
            item = _context2.sent;

            if (!item) {
              _context2.next = 24;
              break;
            }

            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (flavorId) item.flavorId = flavorId;

            if (beverageId) {
              item.qty = 1;
              item.beverageId = beverageId;
              item.price = beveragePrice;
            }

            if (split) item.split = split;
            if (typeof completeItem === 'boolean') item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;

            if (!(item.sizeId && item.flavorId)) {
              _context2.next = 19;
              break;
            }

            _context2.next = 17;
            return (0, _pricingsController.getOnePricingByFlavor)(pageId, item.sizeId, item.flavorId);

          case 17:
            pricing = _context2.sent;

            if (pricing) {
              _qty = item.qty && item.qty > 0 ? item.qty : 1;
              item.price = pricing.price * _qty;

              if (item.split && item.split > 1) {
                item.price = item.price / item.split;
              }
            }

          case 19:
            if (!(qty || sizeId || flavorId || split || beverageId || originalSplit || typeof completeItem === 'boolean')) {
              _context2.next = 22;
              break;
            }

            _context2.next = 22;
            return item.save();

          case 22:
            _context2.next = 34;
            break;

          case 24:
            _context2.next = 26;
            return _items.default.find({
              pageId: pageId,
              orderId: orderId
            }).select('id').sort('-id').limit(1).exec();

          case 26:
            resultLastId = _context2.sent;
            itemId = 1;
            if (resultLastId && resultLastId.length) itemId = resultLastId[0].id + 1;
            price = 0;

            if (beverageId && beveragePrice) {
              price = beveragePrice;
            }

            record = new _items.default({
              id: itemId,
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              qty: qty,
              sizeId: sizeId,
              flavorId: flavorId,
              beverageId: beverageId,
              price: price,
              status: ITEMSTATUS_PENDING
            });
            _context2.next = 34;
            return record.save();

          case 34:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateItem(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateItem = updateItem;

var updateStatusSpecificItem =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(objectId, status) {
    var item;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _items.default.findOne({
              _id: _mongoose.default.Types.ObjectId(objectId)
            }).exec();

          case 2:
            item = _context3.sent;

            if (!item) {
              _context3.next = 7;
              break;
            }

            item.status = status;
            _context3.next = 7;
            return item.save();

          case 7:
            return _context3.abrupt("return", item);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function updateStatusSpecificItem(_x3, _x4) {
    return _ref3.apply(this, arguments);
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
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(orderData) {
    var orderId, pageId, completeItems, queryAuxTables, items, i, flavor, size, beverage;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId, completeItems = orderData.completeItems;
            queryAuxTables = true;

            if (typeof completeItems !== 'undefined') {
              queryAuxTables = completeItems;
            }

            _context4.next = 5;
            return _items.default.find({
              orderId: orderId,
              pageId: pageId
            }).exec();

          case 5:
            items = _context4.sent;

            if (!(items && items.length)) {
              _context4.next = 33;
              break;
            }

            i = 0;

          case 8:
            if (!(i < items.length)) {
              _context4.next = 30;
              break;
            }

            if (!(items[i].flavorId && items[i].flavorId > 0)) {
              _context4.next = 15;
              break;
            }

            if (!queryAuxTables) {
              _context4.next = 15;
              break;
            }

            _context4.next = 13;
            return (0, _flavorsController.getFlavor)(pageId, items[i].flavorId);

          case 13:
            flavor = _context4.sent;
            if (flavor) items[i].flavor = flavor.flavor;

          case 15:
            if (!(items[i].sizeId && items[i].sizeId > 0)) {
              _context4.next = 21;
              break;
            }

            if (!queryAuxTables) {
              _context4.next = 21;
              break;
            }

            _context4.next = 19;
            return (0, _sizesController.getSize)(pageId, items[i].sizeId);

          case 19:
            size = _context4.sent;
            if (size) items[i].size = size.size;

          case 21:
            if (!(items[i].beverageId && items[i].beverageId > 0)) {
              _context4.next = 27;
              break;
            }

            if (!queryAuxTables) {
              _context4.next = 27;
              break;
            }

            _context4.next = 25;
            return (0, _beveragesController.getBeverage)(pageId, items[i].beverageId);

          case 25:
            beverage = _context4.sent;
            if (beverage) items[i].beverage = beverage.name;

          case 27:
            i++;
            _context4.next = 8;
            break;

          case 30:
            return _context4.abrupt("return", items);

          case 33:
            return _context4.abrupt("return", null);

          case 34:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getItems(_x5) {
    return _ref4.apply(this, arguments);
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
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(orderData) {
    var orderId, pageId, items, _total, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId;
            _context5.next = 3;
            return getItems({
              orderId: orderId,
              pageId: pageId,
              completeItems: false
            });

          case 3:
            items = _context5.sent;
            _total = 0;

            if (!(items && items.length)) {
              _context5.next = 25;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 9;

            for (_iterator = items[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              item = _step.value;
              _total += item.price ? item.price : 0;
            }

            _context5.next = 17;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](9);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 17:
            _context5.prev = 17;
            _context5.prev = 18;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 20:
            _context5.prev = 20;

            if (!_didIteratorError) {
              _context5.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context5.finish(20);

          case 24:
            return _context5.finish(17);

          case 25:
            return _context5.abrupt("return", _total);

          case 26:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function getItemsTotal(_x6) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getItemsTotal = getItemsTotal;
//# sourceMappingURL=itemsController.js.map