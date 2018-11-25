"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderPending = exports.updateOrder = exports.order_get_one = exports.order_get_all = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _util = _interopRequireDefault(require("util"));

var _itemsController = require("./itemsController");

var _customersController = require("./customersController");

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ORDERSTATUS_PENDING = 0;
var ORDERSTATUS_CONFIRMED = 1;
var ORDERSTATUS_CANCELLED = 2;
var ORDERSTATUS_DELIVERED = 3; // List all orders
// TODO: use filters in the query req.query

var order_get_all =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var sortObj, rangeObj, options, query, pageID;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Getting the sort from the requisition
            sortObj = (0, _util2.configSortQuery)(req.query.sort); // Getting the range from the requisition

            rangeObj = (0, _util2.configRangeQuery)(req.query.range);
            options = {
              offset: rangeObj['offset'],
              limit: rangeObj['limit'],
              sort: sortObj,
              lean: true,
              leanWithId: false
            };
            query = {};
            pageID = null;

            if (req.currentUser.activePage) {
              pageID = req.currentUser.activePage;
              query = _orders.default.find({
                pageId: pageID
              });
            }

            _orders.default.paginate(query, options,
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(err, result) {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, items;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!err) {
                          _context.next = 4;
                          break;
                        }

                        res.status(500).json({
                          message: err.errmsg
                        });
                        _context.next = 34;
                        break;

                      case 4:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 7;
                        _iterator = result.docs[Symbol.iterator]();

                      case 9:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                          _context.next = 18;
                          break;
                        }

                        order = _step.value;
                        _context.next = 13;
                        return (0, _itemsController.getItems)({
                          orderId: order.id,
                          pageId: order.pageId
                        });

                      case 13:
                        items = _context.sent;
                        order.items = items;

                      case 15:
                        _iteratorNormalCompletion = true;
                        _context.next = 9;
                        break;

                      case 18:
                        _context.next = 24;
                        break;

                      case 20:
                        _context.prev = 20;
                        _context.t0 = _context["catch"](7);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                      case 24:
                        _context.prev = 24;
                        _context.prev = 25;

                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                          _iterator.return();
                        }

                      case 27:
                        _context.prev = 27;

                        if (!_didIteratorError) {
                          _context.next = 30;
                          break;
                        }

                        throw _iteratorError;

                      case 30:
                        return _context.finish(27);

                      case 31:
                        return _context.finish(24);

                      case 32:
                        res.setHeader('Content-Range', _util.default.format("orders %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
                        res.status(200).json(result.docs);

                      case 34:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this, [[7, 20, 24, 32], [25,, 27, 31]]);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function order_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.order_get_all = order_get_all;

var order_get_one = function order_get_one(req, res) {
  if (req.params && req.params.id) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    _orders.default.findOne({
      pageId: pageId,
      id: req.params.id
    }, function (err, doc) {
      if (err) {
        res.status(500).json({
          message: err.errMsg
        });
      } else {
        res.status(200).json(doc);
      }
    });
  }
};

exports.order_get_one = order_get_one;

var updateOrder =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(orderData) {
    var pageId, userId, qty, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, waitingFor, sizeId, customerID, customerData, first_name, last_name, profile_pic, order, _updateOrder, resultLastId, orderId, record, saved;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            pageId = orderData.pageId, userId = orderData.userId, qty = orderData.qty, location = orderData.location, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, completeItem = orderData.completeItem, confirmOrder = orderData.confirmOrder, waitingForAddress = orderData.waitingForAddress, waitingFor = orderData.waitingFor, sizeId = orderData.sizeId;
            customerID = 0;
            customerData = {};
            customerData.pageId = pageId;
            customerData.userId = userId;

            if (user) {
              first_name = user.first_name, last_name = user.last_name, profile_pic = user.profile_pic;
              customerData.first_name = first_name;
              customerData.last_name = last_name;
              customerData.profile_pic = profile_pic;
            }

            customerData.phone = phone;
            customerData.location = location;
            customerData.addrData = addrData;
            _context3.next = 12;
            return (0, _customersController.customer_update)(customerData);

          case 12:
            customerID = _context3.sent;
            _context3.next = 15;
            return _orders.default.findOne({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 15:
            order = _context3.sent;

            if (!order) {
              _context3.next = 36;
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

            if (customerID > 0) {
              order.customerId = customerID;
              _updateOrder = true;
            }

            if (phone) {
              order.phone = phone;
              _updateOrder = true;
            }

            if (addrData) {
              order.address = addrData.formattedAddress;
              _updateOrder = true;
            }

            if (sizeId) {
              order.currentItemSize = sizeId;
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

            if (waitingFor) {
              order.waitingFor = waitingFor;
              _updateOrder = true;
            }

            if (!_updateOrder) {
              _context3.next = 32;
              break;
            }

            _context3.next = 32;
            return order.save();

          case 32:
            _context3.next = 34;
            return (0, _itemsController.updateItem)(orderData);

          case 34:
            _context3.next = 49;
            break;

          case 36:
            _context3.next = 38;
            return _orders.default.find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 38:
            resultLastId = _context3.sent;
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
            _context3.next = 45;
            return record.save();

          case 45:
            saved = _context3.sent;
            orderData.orderId = saved.id;
            _context3.next = 49;
            return (0, _itemsController.updateItem)(orderData);

          case 49:
            _context3.next = 55;
            break;

          case 51:
            _context3.prev = 51;
            _context3.t0 = _context3["catch"](0);
            console.error({
              updateOrderError: _context3.t0
            });
            throw error;

          case 55:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 51]]);
  }));

  return function updateOrder(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateOrder = updateOrder;

var getOrderPending =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(orderData) {
    var userId, pageId, isComplete, _order, _items, completeOrder, headerOrder;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId, isComplete = orderData.isComplete;
            _context4.next = 3;
            return _orders.default.findOne({
              userId: userId,
              pageId: pageId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 3:
            _order = _context4.sent;

            if (!_order) {
              _context4.next = 17;
              break;
            }

            if (!(isComplete && isComplete === true)) {
              _context4.next = 13;
              break;
            }

            _context4.next = 8;
            return (0, _itemsController.getItems)({
              orderId: _order.id,
              pageId: pageId
            });

          case 8:
            _items = _context4.sent;
            completeOrder = {
              order: _order,
              items: _items
            };
            return _context4.abrupt("return", completeOrder);

          case 13:
            headerOrder = {
              order: _order
            };
            return _context4.abrupt("return", headerOrder);

          case 15:
            _context4.next = 18;
            break;

          case 17:
            return _context4.abrupt("return", null);

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getOrderPending(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getOrderPending = getOrderPending;
//# sourceMappingURL=ordersController.js.map