"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelOrder = exports.getOrdersCustomerStat = exports.getLastPendingOrders = exports.getLastOrder = exports.getOrderPending = exports.updateOrder = exports.getOrderJson = exports.deleteManyOrders = exports.order_update = exports.order_get_one = exports.order_get_all = exports.ORDERSTATUS_CANCELLED = exports.ORDERSTATUS_REJECTED = exports.ORDERSTATUS_DELIVERED = exports.ORDERSTATUS_PRINTED = exports.ORDERSTATUS_ACCEPTED = exports.ORDERSTATUS_VIEWED = exports.ORDERSTATUS_CONFIRMED = exports.ORDERSTATUS_PENDING = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _util = _interopRequireDefault(require("util"));

var _itemsController = require("./itemsController");

var _customersController = require("./customersController");

var _storesController = require("./storesController");

var _util2 = require("../util/util");

var _luxon = require("luxon");

var _botController = require("../bot/botController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ORDERSTATUS_PENDING = 0;
exports.ORDERSTATUS_PENDING = ORDERSTATUS_PENDING;
var ORDERSTATUS_CONFIRMED = 1;
exports.ORDERSTATUS_CONFIRMED = ORDERSTATUS_CONFIRMED;
var ORDERSTATUS_VIEWED = 2;
exports.ORDERSTATUS_VIEWED = ORDERSTATUS_VIEWED;
var ORDERSTATUS_ACCEPTED = 3;
exports.ORDERSTATUS_ACCEPTED = ORDERSTATUS_ACCEPTED;
var ORDERSTATUS_PRINTED = 4;
exports.ORDERSTATUS_PRINTED = ORDERSTATUS_PRINTED;
var ORDERSTATUS_DELIVERED = 5;
exports.ORDERSTATUS_DELIVERED = ORDERSTATUS_DELIVERED;
var ORDERSTATUS_REJECTED = 8;
exports.ORDERSTATUS_REJECTED = ORDERSTATUS_REJECTED;
var ORDERSTATUS_CANCELLED = 9; // List all orders
// TODO: use filters in the query req.query

exports.ORDERSTATUS_CANCELLED = ORDERSTATUS_CANCELLED;

var order_get_all =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var sortObj, rangeObj, filterObj, queryParam, i, filter, value, dateIni, dateEnd, date, rezonedIni, _rezonedIni, rezonedEnd, _rezonedIni2, _rezonedEnd;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            try {
              sortObj = (0, _util2.configSortQuery)(req.query.sort);
              rangeObj = (0, _util2.configRangeQueryNew)(req.query.range);
              filterObj = (0, _util2.configFilterQueryMultiple)(req.query.filter);
              queryParam = {};

              if (req.currentUser.activePage) {
                queryParam['pageId'] = req.currentUser.activePage;
              }

              queryParam['status'] = {
                $gte: ORDERSTATUS_CONFIRMED
              };

              if (!sortObj) {
                sortObj['createdAt'] = 'DESC';
              }

              if (filterObj && filterObj.filterField && filterObj.filterField.length) {
                for (i = 0; i < filterObj.filterField.length; i++) {
                  filter = filterObj.filterField[i];
                  value = filterObj.filterValues[i];

                  if (Array.isArray(value)) {
                    if (value.length === 2) {
                      dateIni = _luxon.DateTime.fromISO(value[0]).set({
                        hour: 0,
                        minute: 0,
                        second: 0
                      }).setZone('UTC');
                      dateEnd = _luxon.DateTime.fromISO(value[1]).set({
                        hour: 23,
                        minute: 59,
                        second: 59
                      }).setZone('UTC');
                      if (!dateIni.invalid && !dateEnd.invalid) // is date
                        queryParam[filter] = {
                          $gte: dateIni.toISO(),
                          $lt: dateEnd.toISO()
                        };else queryParam[filter] = {
                        $in: value
                      };
                    } else queryParam[filter] = {
                      $in: value
                    };
                  } else {
                    date = _luxon.DateTime.fromISO(value);

                    if (!date.invalid) {
                      // is a date
                      // date comes with the current time, so, I am setting it to midnight.
                      // Mongoose stores data on GMT timezone
                      if (filter.endsWith('_rangestart')) {
                        filter = filter.replace('_rangestart', '');
                        rezonedIni = date.set({
                          hour: 0,
                          minute: 0,
                          second: 0
                        }).setZone('UTC');
                        queryParam[filter] = {
                          $gte: rezonedIni.toISO()
                        };
                      } else if (filter.endsWith('_rangeend')) {
                        filter = filter.replace('_rangeend', '');
                        _rezonedIni = date.set({
                          hour: 0,
                          minute: 0,
                          second: 0
                        }).setZone('UTC');
                        rezonedEnd = _rezonedIni.plus({
                          days: 1
                        });
                        if (queryParam[filter]) queryParam[filter] = {
                          $gte: Object.values(queryParam[filter])[0],
                          $lt: rezonedEnd.toISO()
                        };else queryParam[filter] = {
                          $lt: rezonedEnd.toISO()
                        };
                      } else {
                        _rezonedIni2 = date.set({
                          hour: 0,
                          minute: 0,
                          second: 0
                        }).setZone('UTC');
                        _rezonedEnd = _rezonedIni2.plus({
                          days: 1
                        });
                        queryParam[filter] = {
                          $gte: _rezonedIni2.toISO(),
                          $lt: _rezonedEnd.toISO()
                        };
                      }
                    } else queryParam[filter] = value;
                  }
                }
              }

              _orders.default.find(queryParam).sort(sortObj).exec(
              /*#__PURE__*/
              function () {
                var _ref2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(findError, result) {
                  var _rangeIni, _rangeEnd, _totalCount, ordersArray, asideTotalAmount, asideTotalItems, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _order2, store, _i, order, items, distanceFromStore, formattedDistance, deliverAt, jsonOrder;

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
                          _context.next = 52;
                          break;

                        case 5:
                          _rangeIni = 0;
                          _rangeEnd = result.length;

                          if (rangeObj) {
                            _rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
                            _rangeEnd = rangeObj.offset + rangeObj.limit <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
                          }

                          _totalCount = result.length;
                          ordersArray = [];

                          if (!(result && result.length && result.length > 0)) {
                            _context.next = 50;
                            break;
                          }

                          // workaround to show totalamount and totalitems in the frontend, because
                          // I am only sending part of the list (pagination)
                          asideTotalAmount = 0;
                          asideTotalItems = result.length;
                          _iteratorNormalCompletion = true;
                          _didIteratorError = false;
                          _iteratorError = undefined;
                          _context.prev = 16;

                          for (_iterator = result[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            _order2 = _step.value;
                            asideTotalAmount = asideTotalAmount + _order2.total;
                          } // workaround end: all orders will receive these values.


                          _context.next = 24;
                          break;

                        case 20:
                          _context.prev = 20;
                          _context.t0 = _context["catch"](16);
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
                          _context.next = 34;
                          return (0, _storesController.getStoreData)(result[0].pageId);

                        case 34:
                          store = _context.sent;
                          _i = _rangeIni;

                        case 36:
                          if (!(_i < _rangeEnd)) {
                            _context.next = 50;
                            break;
                          }

                          order = result[_i];
                          _context.next = 40;
                          return (0, _itemsController.getItems)({
                            orderId: order.id,
                            pageId: order.pageId,
                            completeItems: false
                          });

                        case 40:
                          items = _context.sent;
                          distanceFromStore = (0, _util2.distanceBetweenCoordinates)(store.location_lat, store.location_long, order.location_lat, order.location_long);
                          formattedDistance = void 0;

                          if (distanceFromStore < 1) {
                            formattedDistance = (distanceFromStore * 100).toFixed(2) + ' m';
                          } else {
                            formattedDistance = distanceFromStore.toFixed(2) + ' km';
                          }

                          deliverAt = order.deliver_time ? _luxon.DateTime.fromJSDate(order.confirmed_at).plus({
                            minutes: order.deliver_time
                          }) : order.confirmed_at;
                          jsonOrder = {
                            id: order.id,
                            pageId: order.pageId,
                            customerId: order.customerId,
                            userId: order.userId,
                            phone: order.phone,
                            deliverAt: deliverAt,
                            deliver_type: order.deliver_type,
                            deliver_time: order.deliver_time,
                            address: order.address,
                            status: order.status,
                            status2: order.status2,
                            status3: order.status3,
                            qty_total: order.qty_total,
                            total: order.total,
                            createdAt: order.createdAt,
                            items: items,
                            distanceFromStore: formattedDistance,
                            location_lat: order.location_lat,
                            location_long: order.location_long,
                            confirmed_at: order.confirmed_at,
                            deliverd_at: order.delivered_at,
                            payment_type: order.payment_type,
                            payment_change: order.payment_change,
                            comments: order.comments,
                            delivery_fee: order.delivery_fee,
                            surcharge_percent: order.surcharge_percent,
                            surcharge_amount: order.surcharge_amount,
                            asideTotalAmount: asideTotalAmount,
                            asideTotalItems: asideTotalItems
                          };
                          ordersArray.push(jsonOrder);

                        case 47:
                          _i++;
                          _context.next = 36;
                          break;

                        case 50:
                          res.setHeader('Content-Range', _util.default.format('orders %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
                          res.status(200).json(ordersArray);

                        case 52:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, null, [[16, 20, 24, 32], [25,, 27, 31]]);
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
    }, _callee2);
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
    var pageId, jsonOrder;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(req.params && req.params.id)) {
              _context3.next = 13;
              break;
            }

            _context3.prev = 1;
            pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
            _context3.next = 5;
            return getOrderJson(pageId, req.params.id);

          case 5:
            jsonOrder = _context3.sent;
            res.status(200).json(jsonOrder);
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](1);
            console.error({
              orderGetOneError: _context3.t0
            });
            res.status(500).json({
              message: _context3.t0.message
            });

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 9]]);
  }));

  return function order_get_one(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); // UPDATE


exports.order_get_one = order_get_one;

var order_update =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body, id, operation, pageId, doc, rejectionExplanation, jsonOrder;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(req.body && req.body.id)) {
              _context4.next = 56;
              break;
            }

            _context4.prev = 1;
            _req$body = req.body, id = _req$body.id, operation = _req$body.operation;
            pageId = req.currentUser.activePage;
            _context4.next = 6;
            return _orders.default.findOne({
              pageId: pageId,
              id: id
            });

          case 6:
            doc = _context4.sent;

            if (!(operation === 'REJECT')) {
              _context4.next = 15;
              break;
            }

            rejectionExplanation = req.body.rejectionExplanation;
            doc.status = ORDERSTATUS_REJECTED;
            doc.sent_reject_notification = _luxon.DateTime.local();
            doc.rejection_reason = rejectionExplanation;
            (0, _botController.sendRejectionNotification)(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            _context4.next = 44;
            break;

          case 15:
            if (!(operation === 'VIEW')) {
              _context4.next = 19;
              break;
            }

            doc.status = ORDERSTATUS_VIEWED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context4.next = 44;
            break;

          case 19:
            if (!(operation === 'ACCEPT')) {
              _context4.next = 23;
              break;
            }

            doc.status = ORDERSTATUS_ACCEPTED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context4.next = 44;
            break;

          case 23:
            if (!(operation === 'PRINT')) {
              _context4.next = 27;
              break;
            }

            doc.status = ORDERSTATUS_PRINTED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context4.next = 44;
            break;

          case 27:
            if (!(operation === 'DELIVER')) {
              _context4.next = 36;
              break;
            }

            doc.status = ORDERSTATUS_DELIVERED;

            if (!(doc.source !== 'whatsapp')) {
              _context4.next = 34;
              break;
            }

            if (doc.sent_shipping_notification) {
              _context4.next = 34;
              break;
            }

            _context4.next = 33;
            return (0, _botController.sendShippingNotification)(doc.pageId, doc.userId, doc.id);

          case 33:
            doc.sent_shipping_notification = _luxon.DateTime.local();

          case 34:
            _context4.next = 44;
            break;

          case 36:
            if (req.body.status2 === 'ordered') {
              doc.status = ORDERSTATUS_CONFIRMED;
            } else if (req.body.status2 === 'delivered') {
              doc.status = ORDERSTATUS_DELIVERED;
              doc.delivered_at = _luxon.DateTime.local();
            } else if (req.body.status2 === 'cancelled') {
              doc.status = ORDERSTATUS_DELIVERED;
            }

            if (!(doc.status === ORDERSTATUS_DELIVERED)) {
              _context4.next = 44;
              break;
            }

            if (!(doc.source !== 'whatsapp')) {
              _context4.next = 44;
              break;
            }

            if (doc.sent_shipping_notification) {
              _context4.next = 44;
              break;
            }

            console.info("I am going to send to " + doc.userId + ", about the order number:" + doc.id + " a shipping notification");
            _context4.next = 43;
            return (0, _botController.sendShippingNotification)(doc.pageId, doc.userId, doc.id);

          case 43:
            doc.sent_shipping_notification = _luxon.DateTime.local();

          case 44:
            _context4.next = 46;
            return doc.save();

          case 46:
            _context4.next = 48;
            return getOrderJson(pageId, doc.id);

          case 48:
            jsonOrder = _context4.sent;
            res.status(200).json(jsonOrder);
            _context4.next = 56;
            break;

          case 52:
            _context4.prev = 52;
            _context4.t0 = _context4["catch"](1);
            console.error(_context4.t0);
            res.status(500).json({
              message: _context4.t0.message
            });

          case 56:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 52]]);
  }));

  return function order_update(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */


exports.order_update = order_update;

var deleteManyOrders =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _orders.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context5.abrupt("return", _context5.sent);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function deleteManyOrders(_x9) {
    return _ref5.apply(this, arguments);
  };
}(); // export const sendShippingNotification = async order => {
//     const { accessToken } = await getOnePageToken(order.pageId);
//     const _txt = 'O seu pedido número ' + order.id + ' acabou de sair para entrega. Bom apetite!';
//     const out = new Elements();
//     out.add({ text: _txt });
//     await Bot.send_message_tag(accessToken, order.userId, out);
// }
// List one record by filtering by ID


exports.deleteManyOrders = deleteManyOrders;

var getOrderJson =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageId, orderId) {
    var order, customer, items, store, distanceFromStore, deliverAt, jsonItems, jsonOrder;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _orders.default.findOne({
              pageId: pageId,
              id: orderId
            });

          case 3:
            order = _context6.sent;
            _context6.next = 6;
            return (0, _customersController.getCustomerById)(pageId, order.customerId);

          case 6:
            customer = _context6.sent;
            _context6.next = 9;
            return (0, _itemsController.getItems)({
              pageId: pageId,
              orderId: orderId,
              completeItems: true
            });

          case 9:
            items = _context6.sent;
            _context6.next = 12;
            return (0, _storesController.getStoreData)(order.pageId);

          case 12:
            store = _context6.sent;
            distanceFromStore = (0, _util2.distanceBetweenCoordinates)(store.location_lat, store.location_long, order.location_lat, order.location_long);
            deliverAt = order.deliver_time ? _luxon.DateTime.fromJSDate(order.confirmed_at).plus({
              minutes: order.deliver_time
            }) : order.confirmed_at;
            jsonItems = [];
            items.forEach(function (item) {
              var jsonItem = {
                id: item.id,
                flavorId: item.flavorId,
                sizeId: item.sizeId,
                beverageId: item.beverageId,
                beverage: item.beverage,
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
              customerName: customer.first_name + ' ' + customer.last_name,
              createdAt: order.createdAt,
              deliverAt: deliverAt,
              deliver_type: order.deliver_type,
              deliver_time: order.deliver_time,
              qty_total: order.qty_total,
              status: order.status,
              status2: order.status2,
              status3: order.status3,
              phone: order.phone,
              address: order.address,
              total: order.total,
              items: jsonItems,
              distanceFromStore: distanceFromStore,
              location_lat: order.location_lat,
              location_long: order.location_long,
              confirmed_at: order.confirmed_at,
              deliverd_at: order.delivered_at,
              payment_type: order.payment_type,
              payment_change: order.payment_change,
              comments: order.comments,
              delivery_fee: order.delivery_fee,
              surcharge_percent: order.surcharge_percent,
              surcharge_amount: order.surcharge_amount
            };
            return _context6.abrupt("return", jsonOrder);

          case 21:
            _context6.prev = 21;
            _context6.t0 = _context6["catch"](0);
            console.error({
              getOrderJsonErr: _context6.t0
            });
            throw new Error(_context6.t0.message);

          case 25:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 21]]);
  }));

  return function getOrderJson(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getOrderJson = getOrderJson;

var updateOrder =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(orderData) {
    var pageId, userId, source, deliverType, deliverTime, qty, qty_total, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, waitingFor, waitingForData, undo, currentItem, sizeId, calcTotal, originalSplit, split, currentItemSplit, eraseSplit, noBeverage, paymentType, paymentChange, backToConfirmation, comments, categoryId, surcharge_percent, surcharge_amount, storeAddress, customerID, customerData, first_name, last_name, profile_pic, order, _updateOrder, calcDistance, storeData, distanceFromStore, total, resultLastId, orderId, record;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            pageId = orderData.pageId, userId = orderData.userId, source = orderData.source, deliverType = orderData.deliverType, deliverTime = orderData.deliverTime, qty = orderData.qty, qty_total = orderData.qty_total, location = orderData.location, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, completeItem = orderData.completeItem, confirmOrder = orderData.confirmOrder, waitingForAddress = orderData.waitingForAddress, waitingFor = orderData.waitingFor, waitingForData = orderData.waitingForData, undo = orderData.undo, currentItem = orderData.currentItem, sizeId = orderData.sizeId, calcTotal = orderData.calcTotal, originalSplit = orderData.originalSplit, split = orderData.split, currentItemSplit = orderData.currentItemSplit, eraseSplit = orderData.eraseSplit, noBeverage = orderData.noBeverage, paymentType = orderData.paymentType, paymentChange = orderData.paymentChange, backToConfirmation = orderData.backToConfirmation, comments = orderData.comments, categoryId = orderData.categoryId, surcharge_percent = orderData.surcharge_percent, surcharge_amount = orderData.surcharge_amount, storeAddress = orderData.storeAddress;
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
            _context7.next = 12;
            return (0, _customersController.updateCustomer)(customerData);

          case 12:
            customerID = _context7.sent;
            _context7.next = 15;
            return _orders.default.findOne({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 15:
            order = _context7.sent;

            if (!order) {
              _context7.next = 70;
              break;
            }

            orderData.orderId = order.id;
            _updateOrder = false;
            calcDistance = {
              calc: false,
              lat: 0,
              long: 0
            };

            if (location) {
              order.location_lat = location.lat;
              order.location_long = location.long;
              order.location_url = location.url;
              _updateOrder = true;
              calcDistance.calc = true;
              calcDistance.lat = location.lat;
              calcDistance.long = location.long;
            }

            if (addrData) {
              order.address = addrData.formattedAddress;

              if (addrData.location_lat && addrData.location_long) {
                order.location_lat = addrData.location_lat;
                order.location_long = addrData.location_long;
                calcDistance.calc = true;
                calcDistance.lat = addrData.location_lat;
                calcDistance.long = addrData.location_long;
              }

              _updateOrder = true;
            }

            if (!calcDistance.calc) {
              _context7.next = 27;
              break;
            }

            _context7.next = 25;
            return (0, _storesController.getStoreData)(pageId);

          case 25:
            storeData = _context7.sent;

            if (storeData.location_lat && storeData.location_long) {
              distanceFromStore = (0, _util2.distanceBetweenCoordinates)(storeData.location_lat, storeData.location_long, calcDistance.lat, calcDistance.long);
              order.distance_from_store = distanceFromStore;
              order.delivery_fee = (0, _storesController.calcDeliveryFee)(storeData.delivery_fees, distanceFromStore);
            }

          case 27:
            if (currentItem) {
              order.currentItem = currentItem;
              _updateOrder = true;
            }

            if (source) {
              order.source = source;
              _updateOrder = true;
            }

            if (qty) {
              order.qty = qty;
              _updateOrder = true; // order has total quantity.
              // items are always 1. this variable will be passed to updateItem

              orderData.qty = 1;
            }

            if (deliverType) {
              order.deliver_type = deliverType;
              _updateOrder = true;
            }

            if (deliverTime) {
              order.deliver_time = deliverTime;
              _updateOrder = true;
            }

            if (qty_total) {
              order.qty_total = qty_total;
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
            } // starts from 1 until originalSplit


            if (currentItemSplit) {
              order.currentItemSplit = currentItemSplit;
              _updateOrder = true;
            } // originalSplit is passed as parameter only once: when user choose the
            // split division. split is passed as the same value as originalSplit, so, here
            // I am changing the quantity to assure the item will receive correct data.
            // originalSplit changes the quantity, so, it can't be passed more than once.


            if (split) {
              orderData.sizeId = order.currentItemSize;
              orderData.qty = 1;
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

            if (sizeId) {
              order.currentItemSize = sizeId;
              _updateOrder = true;
            }

            if (surcharge_percent) {
              order.surcharge_percent = surcharge_percent / 100;
              _updateOrder = true;
            }

            if (surcharge_amount) {
              order.surcharge_amount = surcharge_amount;
              _updateOrder = true;
            }

            if (storeAddress) {
              order.store_address = storeAddress;
              _updateOrder = true;
            }
            /** EraseSize only in the item, because, user can navigate through categories
             * of the same size.
             */
            // if (eraseSize) {
            //     order.currentItemSize = null;
            // }


            if (completeItem) {
              if (order.item_complete) order.item_complete = order.item_complete + 1;else order.item_complete = 1;
              _updateOrder = true;
            }

            if (confirmOrder) {
              order.status = ORDERSTATUS_CONFIRMED;
              order.confirmed_at = _luxon.DateTime.local();
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
              if (!undo) order.undo = null;
            }

            if (waitingForData) {
              order.waitingForData = waitingForData;
              _updateOrder = true;
            }

            if (undo) {
              order.undo = undo;
              _updateOrder = true;
            }

            if (backToConfirmation) {
              order.backToConfirmation = backToConfirmation;
              _updateOrder = true;
            }

            if (comments) {
              order.comments = comments;
              _updateOrder = true;
            }

            if (!(typeof calcTotal === 'boolean')) {
              _context7.next = 59;
              break;
            }

            _context7.next = 54;
            return (0, _itemsController.getItemsTotal)({
              orderId: order.id,
              pageId: order.pageId
            });

          case 54:
            total = _context7.sent;
            if (order.delivery_fee > 0) total += order.delivery_fee;
            if (order.surcharge_percent > 0) total += total * order.surcharge_percent;
            if (order.surcharge_amount > 0) total += order.surcharge_amount;

            if (total > 0 && total !== order.total) {
              order.total = total;
              _updateOrder = true;
            }

          case 59:
            if (typeof noBeverage === 'boolean') {
              order.no_beverage = noBeverage;
              _updateOrder = true;
            }

            if (paymentType) {
              order.payment_type = paymentType;
              _updateOrder = true;
            }

            if (paymentChange) {
              order.payment_change = paymentChange;
              _updateOrder = true;
            }

            if (categoryId) {
              order.currentItemCategory = categoryId;
              _updateOrder = true;
            }

            if (!_updateOrder) {
              _context7.next = 66;
              break;
            }

            _context7.next = 66;
            return order.save();

          case 66:
            _context7.next = 68;
            return (0, _itemsController.updateItem)(orderData);

          case 68:
            _context7.next = 81;
            break;

          case 70:
            _context7.next = 72;
            return _orders.default.find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 72:
            resultLastId = _context7.sent;
            orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;
            record = new _orders.default({
              id: orderId,
              pageId: pageId,
              userId: userId,
              qty_total: qty || 0,
              location_lat: location ? location.lat : null,
              location_long: location ? location.long : null,
              location_url: location ? location.url : null,
              waitingForAddress: typeof waitingForAddress === 'boolean' ? waitingForAddress : false,
              deliver_type: deliverType,
              status: ORDERSTATUS_PENDING
            });
            _context7.next = 78;
            return record.save();

          case 78:
            orderData.orderId = record.id;
            _context7.next = 81;
            return (0, _itemsController.updateItem)(orderData);

          case 81:
            _context7.next = 87;
            break;

          case 83:
            _context7.prev = 83;
            _context7.t0 = _context7["catch"](0);
            console.error({
              updateOrderError: _context7.t0
            });
            throw _context7.t0;

          case 87:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 83]]);
  }));

  return function updateOrder(_x12) {
    return _ref7.apply(this, arguments);
  };
}();

exports.updateOrder = updateOrder;

var getOrderPending =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(orderData) {
    var userId, pageId, isComplete, _order, _items, completeOrder, headerOrder;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId, isComplete = orderData.isComplete;
            _context8.next = 3;
            return _orders.default.findOne({
              userId: userId,
              pageId: pageId,
              status: ORDERSTATUS_PENDING
            }).exec();

          case 3:
            _order = _context8.sent;

            if (!_order) {
              _context8.next = 17;
              break;
            }

            if (!(isComplete && isComplete === true)) {
              _context8.next = 13;
              break;
            }

            _context8.next = 8;
            return (0, _itemsController.getItems)({
              orderId: _order.id,
              pageId: pageId,
              completeItems: isComplete
            });

          case 8:
            _items = _context8.sent;
            completeOrder = {
              order: _order,
              items: _items
            };
            return _context8.abrupt("return", completeOrder);

          case 13:
            headerOrder = {
              order: _order
            };
            return _context8.abrupt("return", headerOrder);

          case 15:
            _context8.next = 18;
            break;

          case 17:
            return _context8.abrupt("return", null);

          case 18:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getOrderPending(_x13) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getOrderPending = getOrderPending;

var getLastOrder =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(pageID) {
    var resultLastId;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _orders.default.find({
              pageId: pageID,
              status: {
                $gte: ORDERSTATUS_CONFIRMED
              }
            }).select('id').sort('-confirmed_at').limit(1).exec();

          case 2:
            resultLastId = _context9.sent;

            if (!(resultLastId && resultLastId.length)) {
              _context9.next = 7;
              break;
            }

            return _context9.abrupt("return", resultLastId[0].id);

          case 7:
            return _context9.abrupt("return", 0);

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function getLastOrder(_x14) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getLastOrder = getLastOrder;

var getLastPendingOrders =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageID) {
    var orders;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _orders.default.find({
              pageId: pageID,
              status: ORDERSTATUS_CONFIRMED
            }).select('id confirmed_at').sort('-confirmed_at').exec();

          case 2:
            orders = _context10.sent;

            if (!(orders && orders.length)) {
              _context10.next = 7;
              break;
            }

            return _context10.abrupt("return", orders);

          case 7:
            return _context10.abrupt("return", []);

          case 8:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function getLastPendingOrders(_x15) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getLastPendingOrders = getLastPendingOrders;

var getOrdersCustomerStat =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(orderData) {
    var pageId, customerId, orders, total_spent, nb_orders, first_order, last_order, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, order;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            pageId = orderData.pageId, customerId = orderData.customerId;
            _context11.next = 3;
            return _orders.default.find({
              pageId: pageId,
              customerId: customerId
            }).select('createdAt total').sort('createdAt').exec();

          case 3:
            orders = _context11.sent;
            total_spent = 0;
            nb_orders = 0;
            first_order = Date.now();
            last_order = null;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context11.prev = 11;

            for (_iterator2 = orders[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              order = _step2.value;
              total_spent += order.total;
              nb_orders += 1;

              if (first_order >= order.createdAt) {
                first_order = order.createdAt;
              }

              if (last_order <= order.createdAt) {
                last_order = order.createdAt;
              }
            }

            _context11.next = 19;
            break;

          case 15:
            _context11.prev = 15;
            _context11.t0 = _context11["catch"](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context11.t0;

          case 19:
            _context11.prev = 19;
            _context11.prev = 20;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 22:
            _context11.prev = 22;

            if (!_didIteratorError2) {
              _context11.next = 25;
              break;
            }

            throw _iteratorError2;

          case 25:
            return _context11.finish(22);

          case 26:
            return _context11.finish(19);

          case 27:
            return _context11.abrupt("return", {
              total_spent: total_spent,
              nb_orders: nb_orders,
              first_order: first_order,
              last_order: last_order
            });

          case 28:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[11, 15, 19, 27], [20,, 22, 26]]);
  }));

  return function getOrdersCustomerStat(_x16) {
    return _ref11.apply(this, arguments);
  };
}();

exports.getOrdersCustomerStat = getOrdersCustomerStat;

var cancelOrder =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(orderData) {
    var pageId, userId;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            pageId = orderData.pageId, userId = orderData.userId;
            _context13.next = 3;
            return _orders.default.findOneAndRemove({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_PENDING
            },
            /*#__PURE__*/
            function () {
              var _ref13 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee12(err, res) {
                var orderId;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        if (err) {
                          _context12.next = 11;
                          break;
                        }

                        if (!res) {
                          _context12.next = 7;
                          break;
                        }

                        orderId = res.id;
                        _context12.next = 5;
                        return (0, _itemsController.cancelItems)(pageId, orderId);

                      case 5:
                        _context12.next = 9;
                        break;

                      case 7:
                        console.error('Items from this order shall be deleted manually');
                        console.info(res);

                      case 9:
                        _context12.next = 13;
                        break;

                      case 11:
                        console.error('Order.findOneAndDelete');
                        console.error(err);

                      case 13:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x18, _x19) {
                return _ref13.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function cancelOrder(_x17) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * Trying to reduce the number of calls to getFlavors and getSizes.
 * @param {*} flavors
 * @param {*} sizes
 * @param {*} orderData
 */
// const getPerformaticItems = async (flavors, sizes, orderData) => {
//     orderData.completeItems = false;
//     let items = await getItems(orderData);
//     for (let i = 0; i < items.length; i++) {
//         let item = items[i];
//         if (flavors[item.flavorId]) {
//             item.flavor = flavors[item.flavorId];
//         } else {
//             const flavor = await getFlavor(orderData.pageId, item.flavorId);
//             if (flavor) {
//                 item.flavor = flavors[flavor.id] = flavor.flavor;
//             }
//         }
//         if (sizes[item.sizeId]) {
//             item.size = sizes[item.sizeId];
//         } else {
//             const size = await getSize(orderData.pageId, item.sizeId);
//             if (size) {
//                 item.size = sizes[size.id] = size.size;
//             }
//         }
//     }
//     return items;
// }


exports.cancelOrder = cancelOrder;
//# sourceMappingURL=ordersController.js.map