"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItems = exports.updateStatusSpecificItem = exports.updateItem = void 0;

var _items = _interopRequireDefault(require("../models/items"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _flavorsController = require("./flavorsController");

var _sizesController = require("./sizesController");

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
    var orderId, userId, pageId, qty, sizeId, flavorId, completeItem, _searchStatus, item, record;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            orderId = orderData.orderId, userId = orderData.userId, pageId = orderData.pageId, qty = orderData.qty, sizeId = orderData.sizeId, flavorId = orderData.flavorId, completeItem = orderData.completeItem;

            if (!(qty || sizeId || flavorId || typeof completeItem === 'boolean')) {
              _context.next = 20;
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
              _context.next = 17;
              break;
            }

            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (flavorId) item.flavorId = flavorId;
            if (typeof completeItem === 'boolean') item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;

            if (!(qty || sizeId || flavorId || typeof completeItem === 'boolean')) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return item.save();

          case 15:
            _context.next = 20;
            break;

          case 17:
            record = new _items.default({
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              qty: qty,
              sizeId: sizeId,
              flavorId: flavorId,
              status: ITEMSTATUS_PENDING
            });
            _context.next = 20;
            return record.save();

          case 20:
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

exports.updateStatusSpecificItem = updateStatusSpecificItem;

var getItems =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(orderData) {
    var orderId, pageId, items, i, flavor, size;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId;
            _context3.next = 3;
            return _items.default.find({
              orderId: orderId,
              pageId: pageId
            }).exec();

          case 3:
            items = _context3.sent;

            if (!(items && items.length)) {
              _context3.next = 23;
              break;
            }

            i = 0;

          case 6:
            if (!(i < items.length)) {
              _context3.next = 20;
              break;
            }

            if (!(items[i].flavorId && items[i].flavorId > 0)) {
              _context3.next = 12;
              break;
            }

            _context3.next = 10;
            return (0, _flavorsController.getFlavor)(pageId, items[i].flavorId);

          case 10:
            flavor = _context3.sent;
            if (flavor) items[i].flavor = flavor.flavor;

          case 12:
            if (!(items[i].sizeId && items[i].sizeId > 0)) {
              _context3.next = 17;
              break;
            }

            _context3.next = 15;
            return (0, _sizesController.getSize)(pageId, items[i].sizeId);

          case 15:
            size = _context3.sent;
            if (size) items[i].size = size.size;

          case 17:
            i++;
            _context3.next = 6;
            break;

          case 20:
            return _context3.abrupt("return", items);

          case 23:
            return _context3.abrupt("return", null);

          case 24:
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

exports.getItems = getItems;
//# sourceMappingURL=itemsController.js.map