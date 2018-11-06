"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderPending = exports.updateOrder = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _itemsController = require("./itemsController");

var _customersController = require("./customersController");

var _rxjs = require("rxjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ORDERSTATUS_PENDING = 0;
var ORDERSTATUS_CONFIRMED = 1;
var ORDERSTATUS_CANCELLED = 2;
var ORDERSTATUS_DELIVERED = 3;

var updateOrder =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(orderData) {
    var pageId, userId, qty, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, first_name, last_name, profile_pic, order, _updateOrder, resultLastId, orderId, record, saved;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            pageId = orderData.pageId, userId = orderData.userId, qty = orderData.qty, location = orderData.location, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, completeItem = orderData.completeItem, confirmOrder = orderData.confirmOrder, waitingForAddress = orderData.waitingForAddress;

            if (!user) {
              _context.next = 8;
              break;
            }

            first_name = user.first_name, last_name = user.last_name, profile_pic = user.profile_pic;
            _context.next = 6;
            return (0, _customersController.customer_update)({
              pageId: pageId,
              userId: userId,
              first_name: first_name,
              last_name: last_name,
              profile_pic: profile_pic
            });

          case 6:
            _context.next = 21;
            break;

          case 8:
            if (!phone) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return (0, _customersController.customer_update)({
              pageId: pageId,
              userId: userId,
              phone: phone
            });

          case 11:
            _context.next = 21;
            break;

          case 13:
            if (!location) {
              _context.next = 18;
              break;
            }

            _context.next = 16;
            return (0, _customersController.customer_update)({
              pageId: pageId,
              userId: userId,
              location: location
            });

          case 16:
            _context.next = 21;
            break;

          case 18:
            if (!addrData) {
              _context.next = 21;
              break;
            }

            _context.next = 21;
            return (0, _customersController.customer_update)({
              pageId: pageId,
              userId: userId,
              addrData: addrData
            });

          case 21:
            _context.next = 23;
            return _orders.default.findOne({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 23:
            order = _context.sent;

            if (!order) {
              _context.next = 41;
              break;
            }

            orderData.orderId = order.id;
            _updateOrder = false;

            if (location) {
              order.location_lat = location.lat;
              order.location_long = location.long;
              order.location_url = location.url;
              _updateOrder = true;
            }

            if (qty) {
              order.qty_total = qty;
              _updateOrder = true; // order has total quantity.
              // items are always 1. this variable will be passed to updateItem

              orderData.qty = 1;
            }

            if (phone) {
              order.phone = phone;
              _updateOrder = true;
            }

            if (addrData) {
              order.address = addrData.formattedAddress;
              _updateOrder = true;
            }

            if (completeItem) {
              if (order.item_complete) order.item_complete = order.item_complete + 1;else order.item_complete = 1;
              _updateOrder = true;
            }

            if (confirmOrder) {
              order.status = ORDERSTATUS_CONFIRMED;
              _updateOrder = true;
            }

            if (typeof waitingForAddress === 'boolean') {
              order.waitingForAddress = waitingForAddress;
              _updateOrder = true;
            }

            if (!_updateOrder) {
              _context.next = 37;
              break;
            }

            _context.next = 37;
            return order.save();

          case 37:
            _context.next = 39;
            return (0, _itemsController.updateItem)(orderData);

          case 39:
            _context.next = 54;
            break;

          case 41:
            _context.next = 43;
            return _orders.default.find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 43:
            resultLastId = _context.sent;
            orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;
            console.info({
              resultLastId: resultLastId
            });
            record = new _orders.default({
              id: orderId,
              pageId: pageId,
              userId: userId,
              qty_total: qty ? qty : 0,
              location_lat: location ? location.lat : null,
              location_long: location ? location.long : null,
              location_url: location ? location.url : null,
              waitingForAddress: typeof waitingForAddress === 'boolean' ? waitingForAddress : false,
              status: ORDERSTATUS_PENDING
            });
            _context.next = 50;
            return record.save();

          case 50:
            saved = _context.sent;
            orderData.orderId = saved.id;
            _context.next = 54;
            return (0, _itemsController.updateItem)(orderData);

          case 54:
            _context.next = 61;
            break;

          case 56:
            _context.prev = 56;
            _context.t0 = _context["catch"](0);
            console.error("Error while updating order");
            console.error(_context.t0);
            (0, _rxjs.throwError)(_context.t0);

          case 61:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 56]]);
  }));

  return function updateOrder(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateOrder = updateOrder;

var getOrderPending =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(orderData) {
    var userId, pageId, isComplete, _order, _items, completeOrder, headerOrder;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId, isComplete = orderData.isComplete;
            _context2.next = 3;
            return _orders.default.findOne({
              userId: userId,
              pageId: pageId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 3:
            _order = _context2.sent;

            if (!_order) {
              _context2.next = 17;
              break;
            }

            if (!(isComplete && isComplete === true)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 8;
            return (0, _itemsController.getItems)({
              orderId: _order.id,
              pageId: pageId
            });

          case 8:
            _items = _context2.sent;
            completeOrder = {
              order: _order,
              items: _items
            };
            return _context2.abrupt("return", completeOrder);

          case 13:
            headerOrder = {
              order: _order
            };
            return _context2.abrupt("return", headerOrder);

          case 15:
            _context2.next = 18;
            break;

          case 17:
            return _context2.abrupt("return", null);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getOrderPending(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getOrderPending = getOrderPending;
//# sourceMappingURL=ordersController.js.map