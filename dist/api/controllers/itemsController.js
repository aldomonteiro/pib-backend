"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItems = exports.updateItem = void 0;

var _items = _interopRequireDefault(require("../models/items"));

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
    var orderId, userId, pageId, qty, sizeId, flavorId, completeItem, item, record;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            orderId = orderData.orderId, userId = orderData.userId, pageId = orderData.pageId, qty = orderData.qty, sizeId = orderData.sizeId, flavorId = orderData.flavorId, completeItem = orderData.completeItem;

            if (!(qty || sizeId || flavorId)) {
              _context.next = 18;
              break;
            }

            _context.next = 4;
            return _items.default.findOne({
              orderId: orderId,
              status: ITEMSTATUS_PENDING
            }).exec();

          case 4:
            item = _context.sent;

            if (!item) {
              _context.next = 15;
              break;
            }

            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (flavorId) item.flavorId = flavorId;
            if (completeItem) item.status = ITEMSTATUS_COMPLETED;

            if (!(qty || sizeId || flavorId || completeItem)) {
              _context.next = 13;
              break;
            }

            _context.next = 13;
            return item.save();

          case 13:
            _context.next = 18;
            break;

          case 15:
            record = new _items.default({
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              qty: qty,
              sizeId: sizeId,
              flavorId: flavorId,
              status: ITEMSTATUS_PENDING
            });
            _context.next = 18;
            return record.save();

          case 18:
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

var getItems =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(orderData) {
    var orderId, pageId, items, i, flavor, size;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId;
            _context2.next = 3;
            return _items.default.find({
              orderId: orderId,
              pageId: pageId
            }).exec();

          case 3:
            items = _context2.sent;

            if (!(items && items.length)) {
              _context2.next = 21;
              break;
            }

            i = 0;

          case 6:
            if (!(i < items.length)) {
              _context2.next = 18;
              break;
            }

            _context2.next = 9;
            return (0, _flavorsController.getFlavor)(pageId, items[i].flavorId);

          case 9:
            flavor = _context2.sent;
            items[i].flavor = flavor.flavor;
            _context2.next = 13;
            return (0, _sizesController.getSize)(pageId, items[i].sizeId);

          case 13:
            size = _context2.sent;
            items[i].size = size.size;

          case 15:
            i++;
            _context2.next = 6;
            break;

          case 18:
            return _context2.abrupt("return", items);

          case 21:
            return _context2.abrupt("return", null);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getItems(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getItems = getItems;
//# sourceMappingURL=itemsController.js.map