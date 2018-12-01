"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrdersCustomerStat = exports.getOrderPending = exports.updateOrder = exports.order_get_one = exports.order_get_all = void 0;

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
    var sortObj, rangeObj, filterObj, queryParam;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            try {
              console.info(req.query.filter);
              sortObj = (0, _util2.configSortQuery)(req.query.sort);
              rangeObj = (0, _util2.configRangeQueryNew)(req.query.range);
              filterObj = (0, _util2.configFilterQuery)(req.query.filter);
              queryParam = {};

              if (req.currentUser.activePage) {
                queryParam['pageId'] = req.currentUser.activePage;
              }

              if (filterObj) {
                if (typeof filterObj.filterValues === 'Array') {
                  queryParam[filterObj.filterField] = {
                    $in: filterObj.filterValues
                  };
                } else {
                  queryParam[filterObj.filterField] = filterObj.filterValues;
                }
              }

              _orders.default.find(queryParam).sort(sortObj).exec(
              /*#__PURE__*/
              function () {
                var _ref2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(findError, result) {
                  var _rangeIni, _rangeEnd, _totalCount, ordersArray, i, order, items, jsonOrder;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!findError) {
                            _context.next = 5;
                            break;
                          }

                          console.error({
                            findError: findError
                          });
                          res.status(500).json({
                            message: findError.message
                          });
                          _context.next = 23;
                          break;

                        case 5:
                          _rangeIni = 0;
                          _rangeEnd = result.length;

                          if (rangeObj) {
                            _rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
                            _rangeEnd = rangeObj.offset + rangeObj.limit <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
                          }

                          _totalCount = result.length;
                          ordersArray = new Array();
                          i = _rangeIni;

                        case 11:
                          if (!(i < _rangeEnd)) {
                            _context.next = 21;
                            break;
                          }

                          order = result[i];
                          _context.next = 15;
                          return (0, _itemsController.getItems)({
                            orderId: order.id,
                            pageId: order.pageId
                          });

                        case 15:
                          items = _context.sent;
                          jsonOrder = {
                            id: order.id,
                            pageId: order.pageId,
                            customerId: order.customerId,
                            userId: order.userId,
                            status: order.status,
                            status2: order.status2,
                            qty_total: order.qty_total,
                            total: order.total,
                            createdAt: order.createdAt,
                            items: items
                          };
                          ordersArray.push(jsonOrder);

                        case 18:
                          i++;
                          _context.next = 11;
                          break;

                        case 21:
                          res.setHeader('Content-Range', _util.default.format("orders %d-%d/%d", _rangeIni, _rangeEnd, _totalCount));
                          res.status(200).json(ordersArray);

                        case 23:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function (_x3, _x4) {
                  return _ref2.apply(this, arguments);
                };
              }());
            } catch (orderGetAllErr) {
              console.error({
                orderGetAllErr: orderGetAllErr
              });
              res.status(500).json({
                message: orderGetAllErr.message
              });
            }

          case 1:
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

var order_get_one =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var pageId, order, items, jsonItems, jsonOrder;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(req.params && req.params.id)) {
              _context3.next = 19;
              break;
            }

            _context3.prev = 1;
            pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
            _context3.next = 5;
            return _orders.default.findOne({
              pageId: pageId,
              id: req.params.id
            });

          case 5:
            order = _context3.sent;
            _context3.next = 8;
            return (0, _itemsController.getItems)({
              orderId: order.id,
              pageId: pageId
            });

          case 8:
            items = _context3.sent;
            jsonItems = [];
            items.forEach(function (item) {
              var jsonItem = {
                id: item.id,
                flavorId: item.flavorId,
                sizeId: item.sizeId,
                price: item.price,
                qty: item.qty,
                split: item.split,
                flavor: item.flavor,
                size: item.size
              };
              jsonItems.push(jsonItem);
            });
            jsonOrder = {
              id: order.id,
              customerId: order.customerId,
              createdAt: order.createdAt,
              qty_total: order.qty_total,
              status: order.status,
              status2: order.status2,
              total: order.total,
              items: jsonItems
            };
            res.status(200).json(jsonOrder);
            _context3.next = 19;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](1);
            console.error({
              orderGetOneError: _context3.t0
            });
            res.status(500).json({
              message: _context3.t0.message
            });

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 15]]);
  }));

  return function order_get_one(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.order_get_one = order_get_one;

var updateOrder =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(orderData) {
    var pageId, userId, qty, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, waitingFor, currentItem, sizeId, calcTotal, split, originalSplit, eraseSplit, customerID, customerData, first_name, last_name, profile_pic, order, _updateOrder, total, resultLastId, orderId, record;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            pageId = orderData.pageId, userId = orderData.userId, qty = orderData.qty, location = orderData.location, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, completeItem = orderData.completeItem, confirmOrder = orderData.confirmOrder, waitingForAddress = orderData.waitingForAddress, waitingFor = orderData.waitingFor, currentItem = orderData.currentItem, sizeId = orderData.sizeId, calcTotal = orderData.calcTotal, split = orderData.split, originalSplit = orderData.originalSplit, eraseSplit = orderData.eraseSplit;
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
            _context4.next = 12;
            return (0, _customersController.customer_update)(customerData);

          case 12:
            customerID = _context4.sent;
            _context4.next = 15;
            return _orders.default.findOne({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 15:
            order = _context4.sent;

            if (!order) {
              _context4.next = 45;
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

            if (currentItem) {
              order.currentItem = currentItem;
              _updateOrder = true;
            }

            if (qty) {
              order.qty_total = qty;
              _updateOrder = true; // order has total quantity.
              // items are always 1. this variable will be passed to updateItem

              orderData.qty = 1;
            } // when I have a split, I am forcing size and qty


            if (typeof split === 'number') {
              order.currentItemSplit = split;
              orderData.sizeId = order.currentItemSize;
              orderData.qty = 1;
              _updateOrder = true;
            }

            if (originalSplit) {
              // split increments the items number (+originalSplit)
              //  and removes 1 (that was the original quantity asked by the user)
              order.qty_total = order.qty_total + originalSplit - 1; // saving the originalSplit in the order and... 

              order.originalSplit = originalSplit; // ...always saving the split as originalSplit in item.
              // because the split in the order will be decreased until 1

              orderData.split = originalSplit;
              _updateOrder = true;
            } // eraseSplit is sent when I am gonna ask the user
            // about the next pizza.


            if (eraseSplit) {
              order.originalSplit = null;
              order.currentItemSplit = null;
              _updateOrder = true;
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
            } else {
              // when updateorder with flavor, I dont have neither split nor originalSplit
              // but, if the order has an originalSplit, I am going to send it to the item.
              // This code should run only if I am not confirming the order.
              if (order.originalSplit && order.originalSplit > 1) {
                orderData.split = order.originalSplit;
                _updateOrder = true;
              }
            }

            if (typeof waitingForAddress === 'boolean') {
              order.waitingForAddress = waitingForAddress;
              _updateOrder = true;
            }

            if (waitingFor) {
              order.waitingFor = waitingFor;
              _updateOrder = true;
            }

            if (!(typeof calcTotal === 'boolean')) {
              _context4.next = 38;
              break;
            }

            _context4.next = 36;
            return (0, _itemsController.getItemsTotal)({
              orderId: order.id,
              pageId: order.pageId
            });

          case 36:
            total = _context4.sent;

            if (total > 0 && total !== order.total) {
              order.total = total;
              _updateOrder = true;
            }

          case 38:
            if (!_updateOrder) {
              _context4.next = 41;
              break;
            }

            _context4.next = 41;
            return order.save();

          case 41:
            _context4.next = 43;
            return (0, _itemsController.updateItem)(orderData);

          case 43:
            _context4.next = 56;
            break;

          case 45:
            _context4.next = 47;
            return _orders.default.find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 47:
            resultLastId = _context4.sent;
            orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;
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
            _context4.next = 53;
            return record.save();

          case 53:
            orderData.orderId = record.id;
            _context4.next = 56;
            return (0, _itemsController.updateItem)(orderData);

          case 56:
            _context4.next = 62;
            break;

          case 58:
            _context4.prev = 58;
            _context4.t0 = _context4["catch"](0);
            console.error({
              updateOrderError: _context4.t0
            });
            throw _context4.t0;

          case 62:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 58]]);
  }));

  return function updateOrder(_x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateOrder = updateOrder;

var getOrderPending =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(orderData) {
    var userId, pageId, isComplete, _order, _items, completeOrder, headerOrder;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId, isComplete = orderData.isComplete;
            _context5.next = 3;
            return _orders.default.findOne({
              userId: userId,
              pageId: pageId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 3:
            _order = _context5.sent;

            if (!_order) {
              _context5.next = 17;
              break;
            }

            if (!(isComplete && isComplete === true)) {
              _context5.next = 13;
              break;
            }

            _context5.next = 8;
            return (0, _itemsController.getItems)({
              orderId: _order.id,
              pageId: pageId
            });

          case 8:
            _items = _context5.sent;
            completeOrder = {
              order: _order,
              items: _items
            };
            return _context5.abrupt("return", completeOrder);

          case 13:
            headerOrder = {
              order: _order
            };
            return _context5.abrupt("return", headerOrder);

          case 15:
            _context5.next = 18;
            break;

          case 17:
            return _context5.abrupt("return", null);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getOrderPending(_x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getOrderPending = getOrderPending;

var getOrdersCustomerStat =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(orderData) {
    var pageId, customerId, orders, total_spent, nb_orders, first_order, last_order, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            pageId = orderData.pageId, customerId = orderData.customerId;
            _context6.next = 3;
            return _orders.default.find({
              pageId: pageId,
              customerId: customerId
            }).select('createdAt total').sort('createdAt').exec();

          case 3:
            orders = _context6.sent;
            total_spent = 0;
            nb_orders = 0;
            first_order = Date.now();
            last_order = null;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context6.prev = 11;

            for (_iterator = orders[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              order = _step.value;
              total_spent += order.total;
              nb_orders += 1;

              if (first_order >= order.createdAt) {
                first_order = order.createdAt;
              }

              if (last_order <= order.createdAt) {
                last_order = order.createdAt;
              }
            }

            _context6.next = 19;
            break;

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context6.t0;

          case 19:
            _context6.prev = 19;
            _context6.prev = 20;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 22:
            _context6.prev = 22;

            if (!_didIteratorError) {
              _context6.next = 25;
              break;
            }

            throw _iteratorError;

          case 25:
            return _context6.finish(22);

          case 26:
            return _context6.finish(19);

          case 27:
            return _context6.abrupt("return", {
              total_spent: total_spent,
              nb_orders: nb_orders,
              first_order: first_order,
              last_order: last_order
            });

          case 28:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[11, 15, 19, 27], [20,, 22, 26]]);
  }));

  return function getOrdersCustomerStat(_x9) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getOrdersCustomerStat = getOrdersCustomerStat;
//# sourceMappingURL=ordersController.js.map