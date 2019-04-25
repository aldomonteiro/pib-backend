"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelOrder = exports.getOrdersCustomerStat = exports.getLastPendingOrders = exports.getLastOrder = exports.getLastUserOrder = exports.getOrderPending = exports.updateOrder = exports.getOrderJson = exports.deleteManyOrders = exports.order_update = exports.order_get_one = exports.order_get_all = exports.ORDERSTATUS_CANCELLED = exports.ORDERSTATUS_REJECTED = exports.ORDERSTATUS_FINISHED = exports.ORDERSTATUS_DELIVERED = exports.ORDERSTATUS_PRINTED = exports.ORDERSTATUS_ACCEPTED = exports.ORDERSTATUS_VIEWED = exports.ORDERSTATUS_CONFIRMED = exports.ORDERSTATUS_PENDING = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _util = _interopRequireDefault(require("util"));

var _itemsController = require("./itemsController");

var _customersController = require("./customersController");

var _storesController = require("./storesController");

var _util2 = require("../util/util");

var _luxon = require("luxon");

var _botController = require("../bot/botController");

var _redisController = require("./redisController");

var _socketController = require("./socketController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var ORDERSTATUS_FINISHED = 7;
exports.ORDERSTATUS_FINISHED = ORDERSTATUS_FINISHED;
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
  regeneratorRuntime.mark(function _callee(req, res) {
    var sortObj, rangeObj, filterObj, queryParam, i, filter, value, dateIni, dateEnd, date, rezonedIni, _rezonedIni, rezonedEnd, _rezonedIni2, _rezonedEnd, ret;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
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
              sortObj['status'] = 'ASC';
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

            if (!req.body.simpleOrder) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return simpleOrderGetAll(queryParam, sortObj, rangeObj);

          case 12:
            ret = _context.sent;
            _context.next = 18;
            break;

          case 15:
            _context.next = 17;
            return fullOrderGetAll(queryParam, sortObj, rangeObj);

          case 17:
            ret = _context.sent;

          case 18:
            console.log('ret from fullOrderGetAll:', ret);
            res.setHeader('Content-Range', _util["default"].format('orders %d-%d/%d', ret.rangeIni, ret.rangeEnd, ret.totalCount));
            res.status(200).json(ret.ordersArray);
            _context.next = 27;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](0);
            console.error({
              orderGetAllErr: _context.t0
            });
            res.status(500).json({
              message: _context.t0.message
            });

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 23]]);
  }));

  return function order_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.order_get_all = order_get_all;

var order_get_one =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var pageId, jsonOrder;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(req.params && req.params.id)) {
              _context2.next = 13;
              break;
            }

            _context2.prev = 1;
            pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
            _context2.next = 5;
            return getOrderJson(pageId, req.params.id);

          case 5:
            jsonOrder = _context2.sent;
            res.status(200).json(jsonOrder);
            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](1);
            console.error({
              orderGetOneError: _context2.t0
            });
            res.status(500).json({
              message: _context2.t0.message
            });

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 9]]);
  }));

  return function order_get_one(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); // UPDATE


exports.order_get_one = order_get_one;

var order_update =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$body, id, operation, pageId, doc, _updateOrder, rejectionExplanation, store, _store, _store2, question, _store3, _req$body2, newAddress, newTotal, updatePostComments, closeOrder, formatted, jsonOrder;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(req.body && req.body.id)) {
              _context3.next = 98;
              break;
            }

            _context3.prev = 1;
            console.dir(req.body);
            _req$body = req.body, id = _req$body.id, operation = _req$body.operation;
            pageId = req.currentUser.activePage;
            _context3.next = 7;
            return _orders["default"].findOne({
              pageId: pageId,
              id: id
            });

          case 7:
            doc = _context3.sent;
            _updateOrder = true;

            if (!(operation === 'REJECT')) {
              _context3.next = 17;
              break;
            }

            rejectionExplanation = req.body.rejectionExplanation;
            doc.status = ORDERSTATUS_REJECTED;
            doc.sent_reject_notification = _luxon.DateTime.local();
            doc.rejection_reason = rejectionExplanation;
            (0, _botController.sendRejectionNotification)(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            _context3.next = 85;
            break;

          case 17:
            if (!(operation === 'VIEW')) {
              _context3.next = 21;
              break;
            }

            doc.status = ORDERSTATUS_VIEWED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context3.next = 85;
            break;

          case 21:
            if (!(operation === 'ACCEPT')) {
              _context3.next = 29;
              break;
            }

            doc.status = ORDERSTATUS_ACCEPTED;
            _context3.next = 25;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 25:
            store = _context3.sent;
            sendNotification(store.phone, doc.userId, store.accept_notification);
            _context3.next = 85;
            break;

          case 29:
            if (!(operation === 'PRINT')) {
              _context3.next = 33;
              break;
            }

            doc.status = ORDERSTATUS_PRINTED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context3.next = 85;
            break;

          case 33:
            if (!(operation === 'DELIVER')) {
              _context3.next = 41;
              break;
            }

            doc.status = ORDERSTATUS_DELIVERED;
            _context3.next = 37;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 37:
            _store = _context3.sent;
            sendNotification(_store.phone, doc.userId, _store.deliver_notification);
            _context3.next = 85;
            break;

          case 41:
            if (!(operation === 'MISSING_ADDRESS')) {
              _context3.next = 49;
              break;
            }

            _updateOrder = false;
            _context3.next = 45;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 45:
            _store2 = _context3.sent;
            sendNotification(_store2.phone, doc.userId, _store2.missing_address_notification);
            _context3.next = 85;
            break;

          case 49:
            if (!(operation === 'OPEN_QUESTION')) {
              _context3.next = 58;
              break;
            }

            question = req.body.question;
            doc.comments = doc.comments + '\n' + question;
            _context3.next = 54;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 54:
            _store3 = _context3.sent;
            sendNotification(_store3.phone, doc.userId, question);
            _context3.next = 85;
            break;

          case 58:
            if (!(operation === 'UPDATE_ORDER_DATA')) {
              _context3.next = 77;
              break;
            }

            _req$body2 = req.body, newAddress = _req$body2.newAddress, newTotal = _req$body2.newTotal, updatePostComments = _req$body2.updatePostComments, closeOrder = _req$body2.closeOrder;

            if (!newAddress) {
              _context3.next = 64;
              break;
            }

            doc.address = newAddress;
            _context3.next = 75;
            break;

          case 64:
            if (!newTotal) {
              _context3.next = 74;
              break;
            }

            formatted = newTotal.replace(',', '.');

            if (isNaN(Number(formatted))) {
              _context3.next = 70;
              break;
            }

            doc.total = Number(formatted);
            _context3.next = 72;
            break;

          case 70:
            res.status(500).json({
              message: 'pos.orders.messages.invalidTotal'
            });
            return _context3.abrupt("return");

          case 72:
            _context3.next = 75;
            break;

          case 74:
            if (updatePostComments) {
              if (updatePostComments === 'MERGE') {
                doc.comments = doc.comments + '\n' + doc.postComments;
                doc.postComments = null;
              } else if (updatePostComments === 'DELETE') {
                doc.postComments = null;
              }
            } else if (closeOrder) {
              doc.status = ORDERSTATUS_FINISHED;
            }

          case 75:
            _context3.next = 85;
            break;

          case 77:
            if (req.body.status2 === 'ordered') {
              doc.status = ORDERSTATUS_CONFIRMED;
            } else if (req.body.status2 === 'delivered') {
              doc.status = ORDERSTATUS_DELIVERED;
              doc.delivered_at = _luxon.DateTime.local();
            } else if (req.body.status2 === 'cancelled') {
              doc.status = ORDERSTATUS_DELIVERED;
            }

            if (!(doc.status === ORDERSTATUS_DELIVERED)) {
              _context3.next = 85;
              break;
            }

            if (!(doc.source !== 'whatsapp')) {
              _context3.next = 85;
              break;
            }

            if (doc.sent_shipping_notification) {
              _context3.next = 85;
              break;
            }

            console.info('I am going to send to ' + doc.userId + ', about the order number:' + doc.id + ' a shipping notification');
            _context3.next = 84;
            return (0, _botController.sendShippingNotification)(doc.pageId, doc.userId, doc.id);

          case 84:
            doc.sent_shipping_notification = _luxon.DateTime.local();

          case 85:
            if (!_updateOrder) {
              _context3.next = 88;
              break;
            }

            _context3.next = 88;
            return doc.save();

          case 88:
            _context3.next = 90;
            return getOrderJson(pageId, doc.id);

          case 90:
            jsonOrder = _context3.sent;
            res.status(200).json(jsonOrder);
            _context3.next = 98;
            break;

          case 94:
            _context3.prev = 94;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);
            res.status(500).json({
              message: _context3.t0.message
            });

          case 98:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 94]]);
  }));

  return function order_update(_x5, _x6) {
    return _ref3.apply(this, arguments);
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
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _orders["default"].deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function deleteManyOrders(_x7) {
    return _ref4.apply(this, arguments);
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
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageId, orderId) {
    var order, customer, items, store, distanceFromStore, deliverAt, jsonItems, jsonOrder;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _orders["default"].findOne({
              pageId: pageId,
              id: orderId
            });

          case 3:
            order = _context5.sent;
            _context5.next = 6;
            return (0, _customersController.getCustomerById)(pageId, order.customerId);

          case 6:
            customer = _context5.sent;
            _context5.next = 9;
            return (0, _itemsController.getItems)({
              pageId: pageId,
              orderId: orderId,
              completeItems: true
            });

          case 9:
            items = _context5.sent;
            _context5.next = 12;
            return (0, _storesController.getStoreData)(order.pageId);

          case 12:
            store = _context5.sent;
            distanceFromStore = (0, _util2.distanceBetweenCoordinates)(store.location_lat, store.location_long, order.location_lat, order.location_long);
            deliverAt = order.deliver_time ? _luxon.DateTime.fromJSDate(order.confirmed_at).plus({
              minutes: order.deliver_time
            }) : order.updatedAt;
            jsonItems = [];

            if (items && items.length > 0) {
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
            }

            jsonOrder = {
              id: order.id,
              customerId: order.customerId,
              customerName: customer.first_name + ' ' + customer.last_name,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              deliverAt: deliverAt,
              confirmed_at: order.confirmed_at,
              delivered_at: order.delivered_at,
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
              payment_type: order.payment_type,
              payment_change: order.payment_change,
              comments: order.comments,
              postComments: order.postComments,
              delivery_fee: order.delivery_fee,
              surcharge_percent: order.surcharge_percent,
              surcharge_amount: order.surcharge_amount
            };
            return _context5.abrupt("return", jsonOrder);

          case 21:
            _context5.prev = 21;
            _context5.t0 = _context5["catch"](0);
            console.error({
              getOrderJsonErr: _context5.t0
            });
            throw new Error(_context5.t0.message);

          case 25:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 21]]);
  }));

  return function getOrderJson(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getOrderJson = getOrderJson;

var updateOrder =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(orderData) {
    var pageId, userId, source, deliverType, deliverTime, qty, qty_total, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, waitingFor, waitingForData, undo, currentItem, sizeId, calcTotal, originalSplit, split, currentItemSplit, eraseSplit, noBeverage, paymentType, paymentChange, backToConfirmation, comments, postComments, categoryId, surcharge_percent, surcharge_amount, storeAddress, customerID, customerData, first_name, last_name, profile_pic, order, currentStatus, _updateOrder2, calcDistance, storeData, distanceFromStore, total, resultLastId, orderId, record;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            pageId = orderData.pageId, userId = orderData.userId, source = orderData.source, deliverType = orderData.deliverType, deliverTime = orderData.deliverTime, qty = orderData.qty, qty_total = orderData.qty_total, location = orderData.location, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, completeItem = orderData.completeItem, confirmOrder = orderData.confirmOrder, waitingForAddress = orderData.waitingForAddress, waitingFor = orderData.waitingFor, waitingForData = orderData.waitingForData, undo = orderData.undo, currentItem = orderData.currentItem, sizeId = orderData.sizeId, calcTotal = orderData.calcTotal, originalSplit = orderData.originalSplit, split = orderData.split, currentItemSplit = orderData.currentItemSplit, eraseSplit = orderData.eraseSplit, noBeverage = orderData.noBeverage, paymentType = orderData.paymentType, paymentChange = orderData.paymentChange, backToConfirmation = orderData.backToConfirmation, comments = orderData.comments, postComments = orderData.postComments, categoryId = orderData.categoryId, surcharge_percent = orderData.surcharge_percent, surcharge_amount = orderData.surcharge_amount, storeAddress = orderData.storeAddress;
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
            _context6.next = 12;
            return (0, _customersController.updateCustomer)(customerData);

          case 12:
            customerID = _context6.sent;
            _context6.next = 15;
            return _orders["default"].findOne({
              pageId: pageId,
              userId: userId,
              status: {
                $lt: ORDERSTATUS_DELIVERED
              }
            }).exec();

          case 15:
            order = _context6.sent;

            if (!order) {
              _context6.next = 73;
              break;
            }

            currentStatus = order.status;
            orderData.orderId = order.id;
            _updateOrder2 = false;
            calcDistance = {
              calc: false,
              lat: 0,
              "long": 0
            };

            if (location) {
              order.location_lat = location.lat;
              order.location_long = location["long"];
              order.location_url = location.url;
              _updateOrder2 = true;
              calcDistance.calc = true;
              calcDistance.lat = location.lat;
              calcDistance["long"] = location["long"];
            }

            if (addrData) {
              order.address = addrData.formattedAddress;

              if (addrData.location_lat && addrData.location_long) {
                order.location_lat = addrData.location_lat;
                order.location_long = addrData.location_long;
                calcDistance.calc = true;
                calcDistance.lat = addrData.location_lat;
                calcDistance["long"] = addrData.location_long;
              }

              _updateOrder2 = true;
            }

            if (!calcDistance.calc) {
              _context6.next = 28;
              break;
            }

            _context6.next = 26;
            return (0, _storesController.getStoreData)(pageId);

          case 26:
            storeData = _context6.sent;

            if (storeData.location_lat && storeData.location_long) {
              distanceFromStore = (0, _util2.distanceBetweenCoordinates)(storeData.location_lat, storeData.location_long, calcDistance.lat, calcDistance["long"]);
              order.distance_from_store = distanceFromStore;
              order.delivery_fee = (0, _storesController.calcDeliveryFee)(storeData.delivery_fees, distanceFromStore);
            }

          case 28:
            if (currentItem) {
              order.currentItem = currentItem;
              _updateOrder2 = true;
            }

            if (source) {
              order.source = source;
              _updateOrder2 = true;
            }

            if (qty) {
              order.qty = qty;
              _updateOrder2 = true; // order has total quantity.
              // items are always 1. this variable will be passed to updateItem

              orderData.qty = 1;
            }

            if (deliverType) {
              order.deliver_type = deliverType;
              _updateOrder2 = true;
            }

            if (deliverTime) {
              order.deliver_time = deliverTime;
              _updateOrder2 = true;
            }

            if (qty_total) {
              order.qty_total = qty_total;
              _updateOrder2 = true;
            }

            if (originalSplit) {
              // split increments the items number (+originalSplit)
              //  and removes 1 (that was the original quantity asked by the user)
              order.qty_total = order.qty_total + originalSplit - 1; // saving the originalSplit in the order and...

              order.originalSplit = originalSplit; // ...always saving the split as originalSplit in item.
              // because the split in the order will be decreased until 1

              orderData.split = originalSplit;
              _updateOrder2 = true;
            } // starts from 1 until originalSplit


            if (currentItemSplit) {
              order.currentItemSplit = currentItemSplit;
              _updateOrder2 = true;
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
              _updateOrder2 = true;
            }

            if (customerID > 0) {
              order.customerId = customerID;
              _updateOrder2 = true;
            }

            if (phone) {
              order.phone = phone;
              _updateOrder2 = true;
            }

            if (sizeId) {
              order.currentItemSize = sizeId;
              _updateOrder2 = true;
            }

            if (surcharge_percent) {
              order.surcharge_percent = surcharge_percent / 100;
              _updateOrder2 = true;
            }

            if (surcharge_amount) {
              order.surcharge_amount = surcharge_amount;
              _updateOrder2 = true;
            }

            if (storeAddress) {
              order.store_address = storeAddress;
              _updateOrder2 = true;
            }
            /** EraseSize only in the item, because, user can navigate through categories
             * of the same size.
             */
            // if (eraseSize) {
            //     order.currentItemSize = null;
            // }


            if (completeItem) {
              if (order.item_complete) order.item_complete = order.item_complete + 1;else order.item_complete = 1;
              _updateOrder2 = true;
            }

            if (confirmOrder) {
              if (order.status < ORDERSTATUS_CONFIRMED) {
                order.status = ORDERSTATUS_CONFIRMED;
                order.confirmed_at = _luxon.DateTime.local();
                _updateOrder2 = true;
              }
            } else {
              // when updateorder with flavor, I dont have neither split nor originalSplit
              // but, if the order has an originalSplit, I am going to send it to the item.
              // This code should run only if I am not confirming the order.
              if (order.originalSplit && order.originalSplit > 1) {
                orderData.split = order.originalSplit;
                _updateOrder2 = true;
              }
            }

            if (typeof waitingForAddress === 'boolean') {
              order.waitingForAddress = waitingForAddress;
              _updateOrder2 = true;
            }

            if (waitingFor) {
              order.waitingFor = waitingFor;
              _updateOrder2 = true;
              if (!undo) order.undo = null;
            }

            if (waitingForData) {
              order.waitingForData = waitingForData;
              _updateOrder2 = true;
            }

            if (undo) {
              order.undo = undo;
              _updateOrder2 = true;
            }

            if (backToConfirmation) {
              order.backToConfirmation = backToConfirmation;
              _updateOrder2 = true;
            }

            if (comments) {
              order.comments = comments;
              _updateOrder2 = true;
            }

            if (postComments) {
              order.postComments = postComments;
              _updateOrder2 = true;
            }

            if (!(typeof calcTotal === 'boolean')) {
              _context6.next = 61;
              break;
            }

            _context6.next = 56;
            return (0, _itemsController.getItemsTotal)({
              orderId: order.id,
              pageId: order.pageId
            });

          case 56:
            total = _context6.sent;
            if (order.delivery_fee > 0) total += order.delivery_fee;
            if (order.surcharge_percent > 0) total += total * order.surcharge_percent;
            if (order.surcharge_amount > 0) total += order.surcharge_amount;

            if (total > 0 && total !== order.total) {
              order.total = total;
              _updateOrder2 = true;
            }

          case 61:
            if (typeof noBeverage === 'boolean') {
              order.no_beverage = noBeverage;
              _updateOrder2 = true;
            }

            if (paymentType) {
              order.payment_type = paymentType;
              _updateOrder2 = true;
            }

            if (paymentChange) {
              order.payment_change = paymentChange;
              _updateOrder2 = true;
            }

            if (categoryId) {
              order.currentItemCategory = categoryId;
              _updateOrder2 = true;
            }

            if (!_updateOrder2) {
              _context6.next = 68;
              break;
            }

            _context6.next = 68;
            return order.save();

          case 68:
            _context6.next = 70;
            return (0, _itemsController.updateItem)(orderData);

          case 70:
            if (confirmOrder || comments || postComments) {
              // every time new comments are stores I am passing the confirmOrder parameter. So,
              // here I check if this order was not already confirmed.
              if (confirmOrder && currentStatus < ORDERSTATUS_CONFIRMED) (0, _redisController.emitEvent)(pageId, 'new-order', {
                id: order.id,
                confirmed_at: order.confirmed_at
              });else if (comments || postComments) (0, _redisController.emitEvent)(pageId, 'new-comment', {
                id: order.id,
                updatedAt: _luxon.DateTime.local()
              });
            }

            _context6.next = 84;
            break;

          case 73:
            _context6.next = 75;
            return _orders["default"].find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 75:
            resultLastId = _context6.sent;
            orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;
            record = new _orders["default"]({
              id: orderId,
              pageId: pageId,
              userId: userId,
              waitingFor: waitingFor,
              comments: comments,
              status: ORDERSTATUS_PENDING
            });
            _context6.next = 81;
            return record.save();

          case 81:
            orderData.orderId = record.id;
            _context6.next = 84;
            return (0, _itemsController.updateItem)(orderData);

          case 84:
            _context6.next = 90;
            break;

          case 86:
            _context6.prev = 86;
            _context6.t0 = _context6["catch"](0);
            console.error({
              updateOrderError: _context6.t0
            });
            throw _context6.t0;

          case 90:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 86]]);
  }));

  return function updateOrder(_x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.updateOrder = updateOrder;

var fullOrderGetAll =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(queryObj, sortObj, rangeObj) {
    var ret, result, asideTotalAmount, asideTotalItems, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _order2, store, i, order, items, distanceFromStore, formattedDistance, refDate, deliverAt, jsonOrder;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            ret = {
              rangeIni: 0,
              rangeEnd: 0,
              totalCount: 0,
              ordersArray: []
            };
            _context7.next = 4;
            return _orders["default"].find(queryObj).sort(sortObj).exec();

          case 4:
            result = _context7.sent;
            ret.rangeIni = 0;
            ret.rangeEnd = result.length;

            if (rangeObj) {
              ret.rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
              ret.rangeEnd = rangeObj.offset + rangeObj.limit <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
            }

            ret.totalCount = result.length;
            ret.ordersArray = [];

            if (!(result && result.length && result.length > 0)) {
              _context7.next = 51;
              break;
            }

            // workaround to show totalamount and totalitems in the frontend, because
            // I am only sending part of the list (pagination)
            asideTotalAmount = 0;
            asideTotalItems = result.length;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context7.prev = 16;

            for (_iterator = result[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _order2 = _step.value;
              asideTotalAmount = asideTotalAmount + _order2.total;
            } // workaround end: all orders will receive these values.


            _context7.next = 24;
            break;

          case 20:
            _context7.prev = 20;
            _context7.t0 = _context7["catch"](16);
            _didIteratorError = true;
            _iteratorError = _context7.t0;

          case 24:
            _context7.prev = 24;
            _context7.prev = 25;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 27:
            _context7.prev = 27;

            if (!_didIteratorError) {
              _context7.next = 30;
              break;
            }

            throw _iteratorError;

          case 30:
            return _context7.finish(27);

          case 31:
            return _context7.finish(24);

          case 32:
            _context7.next = 34;
            return (0, _storesController.getStoreData)(result[0].pageId);

          case 34:
            store = _context7.sent;
            i = ret.rangeIni;

          case 36:
            if (!(i < ret.rangeEnd)) {
              _context7.next = 51;
              break;
            }

            order = result[i];
            _context7.next = 40;
            return (0, _itemsController.getItems)({
              orderId: order.id,
              pageId: order.pageId,
              completeItems: false
            });

          case 40:
            items = _context7.sent;
            distanceFromStore = (0, _util2.distanceBetweenCoordinates)(store.location_lat, store.location_long, order.location_lat, order.location_long);
            formattedDistance = void 0;

            if (distanceFromStore < 1) {
              formattedDistance = (distanceFromStore * 100).toFixed(2) + ' m';
            } else {
              formattedDistance = distanceFromStore.toFixed(2) + ' km';
            }

            refDate = order.confirmed_at || order.createdAt;
            deliverAt = order.deliver_time ? _luxon.DateTime.fromJSDate(refDate).plus({
              minutes: order.deliver_time
            }) : refDate;
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
              updatedAt: order.updatedAt,
              items: items,
              distanceFromStore: formattedDistance,
              location_lat: order.location_lat,
              location_long: order.location_long,
              confirmed_at: order.confirmed_at,
              deliverd_at: order.delivered_at,
              payment_type: order.payment_type,
              payment_change: order.payment_change,
              comments: order.comments,
              postComments: order.postComments,
              delivery_fee: order.delivery_fee,
              surcharge_percent: order.surcharge_percent,
              surcharge_amount: order.surcharge_amount,
              asideTotalAmount: asideTotalAmount,
              asideTotalItems: asideTotalItems
            };
            ret.ordersArray.push(jsonOrder);

          case 48:
            i++;
            _context7.next = 36;
            break;

          case 51:
            return _context7.abrupt("return", ret);

          case 54:
            _context7.prev = 54;
            _context7.t1 = _context7["catch"](0);

          case 56:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 54], [16, 20, 24, 32], [25,, 27, 31]]);
  }));

  return function fullOrderGetAll(_x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();

var simpleOrderGetAll =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(query, sort, rangeObj) {
    var ret;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            ret = {
              rangeIni: 0,
              rangeEnd: 0,
              totalCount: 0,
              ordersArray: []
            };

            _orders["default"].find(query).sort(sort).exec(
            /*#__PURE__*/
            function () {
              var _ref9 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8(findError, result) {
                var asideTotalAmount, asideTotalItems, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _order3, store, i, order, items, distanceFromStore, formattedDistance, deliverAt, jsonOrder;

                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!findError) {
                          _context8.next = 5;
                          break;
                        }

                        console.error({
                          findError: findError
                        });
                        throw new Error(findError.message);

                      case 5:
                        ret.rangeIni = 0;
                        ret.rangeEnd = result.length;

                        if (rangeObj) {
                          ret.rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
                          ret.rangeEnd = rangeObj.offset + rangeObj.limit <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
                        }

                        ret.totalCount = result.length;
                        ret.ordersArray = [];

                        if (!(result && result.length && result.length > 0)) {
                          _context8.next = 50;
                          break;
                        }

                        // workaround to show totalamount and totalitems in the frontend, because
                        // I am only sending part of the list (pagination)
                        asideTotalAmount = 0;
                        asideTotalItems = result.length;
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context8.prev = 16;

                        for (_iterator2 = result[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                          _order3 = _step2.value;
                          asideTotalAmount = asideTotalAmount + _order3.total;
                        } // workaround end: all orders will receive these values.


                        _context8.next = 24;
                        break;

                      case 20:
                        _context8.prev = 20;
                        _context8.t0 = _context8["catch"](16);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context8.t0;

                      case 24:
                        _context8.prev = 24;
                        _context8.prev = 25;

                        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                          _iterator2["return"]();
                        }

                      case 27:
                        _context8.prev = 27;

                        if (!_didIteratorError2) {
                          _context8.next = 30;
                          break;
                        }

                        throw _iteratorError2;

                      case 30:
                        return _context8.finish(27);

                      case 31:
                        return _context8.finish(24);

                      case 32:
                        _context8.next = 34;
                        return (0, _storesController.getStoreData)(result[0].pageId);

                      case 34:
                        store = _context8.sent;
                        i = ret.rangeIni;

                      case 36:
                        if (!(i < ret.rangeEnd)) {
                          _context8.next = 50;
                          break;
                        }

                        order = result[i];
                        _context8.next = 40;
                        return (0, _itemsController.getItems)({
                          orderId: order.id,
                          pageId: order.pageId,
                          completeItems: false
                        });

                      case 40:
                        items = _context8.sent;
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
                        ret.ordersArray.push(jsonOrder);

                      case 47:
                        i++;
                        _context8.next = 36;
                        break;

                      case 50:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, null, [[16, 20, 24, 32], [25,, 27, 31]]);
              }));

              return function (_x17, _x18) {
                return _ref9.apply(this, arguments);
              };
            }());

            return _context9.abrupt("return", ret);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function simpleOrderGetAll(_x14, _x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var getOrderPending =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(orderData) {
    var userId, pageId, isComplete, _order, _items, completeOrder, headerOrder;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId, isComplete = orderData.isComplete;
            _context10.next = 3;
            return _orders["default"].findOne({
              userId: userId,
              pageId: pageId,
              status: {
                $lt: ORDERSTATUS_DELIVERED
              }
            }).exec();

          case 3:
            _order = _context10.sent;

            if (!_order) {
              _context10.next = 17;
              break;
            }

            if (!(isComplete && isComplete === true)) {
              _context10.next = 13;
              break;
            }

            _context10.next = 8;
            return (0, _itemsController.getItems)({
              orderId: _order.id,
              pageId: pageId,
              completeItems: isComplete
            });

          case 8:
            _items = _context10.sent;
            completeOrder = {
              order: _order,
              items: _items
            };
            return _context10.abrupt("return", completeOrder);

          case 13:
            headerOrder = {
              order: _order
            };
            return _context10.abrupt("return", headerOrder);

          case 15:
            _context10.next = 18;
            break;

          case 17:
            return _context10.abrupt("return", null);

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function getOrderPending(_x19) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getOrderPending = getOrderPending;

var getLastUserOrder =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(orderData) {
    var userId, pageId, resultLast;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId;
            _context11.next = 3;
            return _orders["default"].find({
              pageId: pageId,
              userId: userId,
              status: {
                $lt: ORDERSTATUS_REJECTED
              }
            }).sort('-id').limit(1).exec();

          case 3:
            resultLast = _context11.sent;

            if (!(resultLast && resultLast.length)) {
              _context11.next = 8;
              break;
            }

            return _context11.abrupt("return", resultLast[0]);

          case 8:
            return _context11.abrupt("return", null);

          case 9:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function getLastUserOrder(_x20) {
    return _ref11.apply(this, arguments);
  };
}();

exports.getLastUserOrder = getLastUserOrder;

var getLastOrder =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(pageID) {
    var resultLastId;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _orders["default"].find({
              pageId: pageID,
              status: {
                $gte: ORDERSTATUS_CONFIRMED
              }
            }).select('id').sort('-confirmed_at').limit(1).exec();

          case 2:
            resultLastId = _context12.sent;

            if (!(resultLastId && resultLastId.length)) {
              _context12.next = 7;
              break;
            }

            return _context12.abrupt("return", resultLastId[0].id);

          case 7:
            return _context12.abrupt("return", 0);

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function getLastOrder(_x21) {
    return _ref12.apply(this, arguments);
  };
}();

exports.getLastOrder = getLastOrder;

var getLastPendingOrders =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(pageID) {
    var orders;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _orders["default"].find({
              pageId: pageID,
              status: ORDERSTATUS_CONFIRMED
            }).select('id confirmed_at').sort('-confirmed_at').exec();

          case 2:
            orders = _context13.sent;

            if (!(orders && orders.length)) {
              _context13.next = 7;
              break;
            }

            return _context13.abrupt("return", orders);

          case 7:
            return _context13.abrupt("return", []);

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function getLastPendingOrders(_x22) {
    return _ref13.apply(this, arguments);
  };
}();

exports.getLastPendingOrders = getLastPendingOrders;

var getOrdersCustomerStat =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(orderData) {
    var pageId, customerId, orders, total_spent, nb_orders, first_order, last_order, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, order;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            pageId = orderData.pageId, customerId = orderData.customerId;
            _context14.next = 3;
            return _orders["default"].find({
              pageId: pageId,
              customerId: customerId
            }).select('createdAt total').sort('createdAt').exec();

          case 3:
            orders = _context14.sent;
            total_spent = 0;
            nb_orders = 0;
            first_order = Date.now();
            last_order = null;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context14.prev = 11;

            for (_iterator3 = orders[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              order = _step3.value;
              total_spent += order.total;
              nb_orders += 1;

              if (first_order >= order.createdAt) {
                first_order = order.createdAt;
              }

              if (last_order <= order.createdAt) {
                last_order = order.createdAt;
              }
            }

            _context14.next = 19;
            break;

          case 15:
            _context14.prev = 15;
            _context14.t0 = _context14["catch"](11);
            _didIteratorError3 = true;
            _iteratorError3 = _context14.t0;

          case 19:
            _context14.prev = 19;
            _context14.prev = 20;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 22:
            _context14.prev = 22;

            if (!_didIteratorError3) {
              _context14.next = 25;
              break;
            }

            throw _iteratorError3;

          case 25:
            return _context14.finish(22);

          case 26:
            return _context14.finish(19);

          case 27:
            return _context14.abrupt("return", {
              total_spent: total_spent,
              nb_orders: nb_orders,
              first_order: first_order,
              last_order: last_order
            });

          case 28:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[11, 15, 19, 27], [20,, 22, 26]]);
  }));

  return function getOrdersCustomerStat(_x23) {
    return _ref14.apply(this, arguments);
  };
}();

exports.getOrdersCustomerStat = getOrdersCustomerStat;

var cancelOrder =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(orderData) {
    var pageId, userId;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            pageId = orderData.pageId, userId = orderData.userId;
            _context16.next = 3;
            return _orders["default"].findOneAndRemove({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_PENDING
            },
            /*#__PURE__*/
            function () {
              var _ref16 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee15(err, res) {
                var orderId;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        if (err) {
                          _context15.next = 11;
                          break;
                        }

                        if (!res) {
                          _context15.next = 7;
                          break;
                        }

                        orderId = res.id;
                        _context15.next = 5;
                        return (0, _itemsController.cancelItems)(pageId, orderId);

                      case 5:
                        _context15.next = 9;
                        break;

                      case 7:
                        console.error('Items from this order shall be deleted manually');
                        console.info(res);

                      case 9:
                        _context15.next = 13;
                        break;

                      case 11:
                        console.error('Order.findOneAndDelete');
                        console.error(err);

                      case 13:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              }));

              return function (_x25, _x26) {
                return _ref16.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function cancelOrder(_x24) {
    return _ref15.apply(this, arguments);
  };
}();

exports.cancelOrder = cancelOrder;

var sendNotification = function sendNotification(whatsAppId, userId, message) {
  (0, _socketController.emitEventWhats)(whatsAppId, 'notify', {
    userId: userId,
    message: message
  });
};
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
//# sourceMappingURL=ordersController.js.map