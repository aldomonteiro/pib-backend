"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrdersCustomerStat = exports.getLastPendingOrders = exports.getLastOrder = exports.getLastUserOrder = exports.getOrderPending = exports.updateOrder = exports.getOrderJson = exports.deleteManyOrders = exports.order_update = exports.order_get_one = exports.order_get_all = exports.ORDERSTATUS_CANCELLED = exports.ORDERSTATUS_REJECTED = exports.ORDERSTATUS_FINISHED = exports.ORDERSTATUS_DELIVERED = exports.ORDERSTATUS_PRINTED = exports.ORDERSTATUS_ACCEPTED = exports.ORDERSTATUS_VIEWED = exports.ORDERSTATUS_CONFIRMED = exports.ORDERSTATUS_PENDING = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _util = _interopRequireDefault(require("util"));

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
            } // queryParam['status'] = { $gte: ORDERSTATUS_CONFIRMED };


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

            _context.next = 10;
            return fullOrderGetAll(queryParam, sortObj, rangeObj);

          case 10:
            ret = _context.sent;
            res.setHeader('Content-Range', _util["default"].format('orders %d-%d/%d', ret.rangeIni, ret.rangeEnd, ret.totalCount));
            res.status(200).json(ret.ordersArray);
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            console.error({
              orderGetAllErr: _context.t0
            });
            res.status(500).json({
              message: _context.t0.message
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
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
    var _req$body, id, operation, pageId, doc, _updateOrder, rejectionExplanation, store, _store, _store2, question, _store3, _req$body2, newAddress, newDetails, newTotal, updatePostComments, updatedPostComment, closeOrder, formatted, index, _index, jsonOrder;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(req.body && req.body.id)) {
              _context3.next = 101;
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
            _context3.next = 88;
            break;

          case 17:
            if (!(operation === 'VIEW')) {
              _context3.next = 21;
              break;
            }

            doc.status = ORDERSTATUS_VIEWED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context3.next = 88;
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
            _context3.next = 88;
            break;

          case 29:
            if (!(operation === 'PRINT')) {
              _context3.next = 33;
              break;
            }

            doc.status = ORDERSTATUS_PRINTED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context3.next = 88;
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
            _context3.next = 88;
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
            _context3.next = 88;
            break;

          case 49:
            if (!(operation === 'OPEN_QUESTION')) {
              _context3.next = 57;
              break;
            }

            question = req.body.question; // doc.comments = doc.comments + '\n' + question;

            _context3.next = 53;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 53:
            _store3 = _context3.sent;
            sendNotification(_store3.phone, doc.userId, question);
            _context3.next = 88;
            break;

          case 57:
            if (!(operation === 'UPDATE_ORDER_DATA')) {
              _context3.next = 80;
              break;
            }

            _req$body2 = req.body, newAddress = _req$body2.newAddress, newDetails = _req$body2.newDetails, newTotal = _req$body2.newTotal, updatePostComments = _req$body2.updatePostComments, updatedPostComment = _req$body2.updatedPostComment, closeOrder = _req$body2.closeOrder;

            if (!newAddress) {
              _context3.next = 63;
              break;
            }

            doc.address = newAddress;
            _context3.next = 78;
            break;

          case 63:
            if (!newDetails) {
              _context3.next = 67;
              break;
            }

            doc.details = newDetails;
            _context3.next = 78;
            break;

          case 67:
            if (!newTotal) {
              _context3.next = 77;
              break;
            }

            formatted = newTotal.replace(',', '.');

            if (isNaN(Number(formatted))) {
              _context3.next = 73;
              break;
            }

            doc.total = Number(formatted);
            _context3.next = 75;
            break;

          case 73:
            res.status(500).json({
              message: 'pos.orders.messages.invalidTotal'
            });
            return _context3.abrupt("return");

          case 75:
            _context3.next = 78;
            break;

          case 77:
            if (updatePostComments) {
              if (updatePostComments === 'MERGE') {
                doc.details = doc.details ? doc.details + '\n' + updatedPostComment : updatedPostComment;
                index = doc.postComments.indexOf(updatedPostComment);
                doc.postComments.splice(index, 1);
              } else if (updatePostComments === 'DELETE') {
                _index = doc.postComments.indexOf(updatedPostComment);
                doc.postComments.splice(_index, 1);
              }
            } else if (closeOrder) {
              doc.status = ORDERSTATUS_FINISHED;
            }

          case 78:
            _context3.next = 88;
            break;

          case 80:
            if (req.body.status2 === 'ordered') {
              doc.status = ORDERSTATUS_CONFIRMED;
            } else if (req.body.status2 === 'delivered') {
              doc.status = ORDERSTATUS_DELIVERED;
              doc.delivered_at = _luxon.DateTime.local();
            } else if (req.body.status2 === 'cancelled') {
              doc.status = ORDERSTATUS_DELIVERED;
            }

            if (!(doc.status === ORDERSTATUS_DELIVERED)) {
              _context3.next = 88;
              break;
            }

            if (!(doc.source !== 'whatsapp')) {
              _context3.next = 88;
              break;
            }

            if (doc.sent_shipping_notification) {
              _context3.next = 88;
              break;
            }

            console.info('I am going to send to ' + doc.userId + ', about the order number:' + doc.id + ' a shipping notification');
            _context3.next = 87;
            return (0, _botController.sendShippingNotification)(doc.pageId, doc.userId, doc.id);

          case 87:
            doc.sent_shipping_notification = _luxon.DateTime.local();

          case 88:
            if (!_updateOrder) {
              _context3.next = 91;
              break;
            }

            _context3.next = 91;
            return doc.save();

          case 91:
            _context3.next = 93;
            return getOrderJson(pageId, doc.id);

          case 93:
            jsonOrder = _context3.sent;
            res.status(200).json(jsonOrder);
            _context3.next = 101;
            break;

          case 97:
            _context3.prev = 97;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);
            res.status(500).json({
              message: _context3.t0.message
            });

          case 101:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 97]]);
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
}(); // List one record by filtering by ID


exports.deleteManyOrders = deleteManyOrders;

var getOrderJson =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageId, orderId) {
    var order, customer;
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
            return _context5.abrupt("return", getOrderData(order, customer));

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error({
              getOrderJsonErr: _context5.t0
            });
            throw new Error(_context5.t0.message);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));

  return function getOrderJson(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getOrderJson = getOrderJson;

var getOrderData = function getOrderData(order, customer) {
  var cleaned = ('' + order.phone).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{2})(\d{2})(\d{4})(\d{4})$/);

  if (match) {
    cleaned = "+".concat(match[1], " (").concat(match[2], ") ").concat(match[3], "-").concat(match[4]);
  }

  var jsonOrder = {
    id: order.id,
    customerId: order.customerId,
    customerName: customer ? customer.first_name + ' ' + (customer.last_name || '') : null,
    profile_pic: customer ? customer.profile_pic : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    confirmed_at: order.confirmed_at,
    changed_at: order.changed_at,
    status: order.status,
    status2: order.status2,
    phone: cleaned,
    address: order.address,
    total: order.total,
    details: order.details,
    comments: order.comments,
    postComments: order.postComments
  };
  return jsonOrder;
};

var updateOrder =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(orderData) {
    var pageId, userId, user, phone, addrData, confirmOrder, waitingFor, comments, postComments, mergeComments, customerData, first_name, last_name, profile_pic, customer, order, _updateOrder2, orderJson, resultLastId, orderId, _comments, _order2, _orderJson;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            pageId = orderData.pageId, userId = orderData.userId, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, confirmOrder = orderData.confirmOrder, waitingFor = orderData.waitingFor, comments = orderData.comments, postComments = orderData.postComments, mergeComments = orderData.mergeComments;
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
            customerData.addrData = addrData;
            _context6.next = 10;
            return (0, _customersController.updateCustomer)(customerData);

          case 10:
            customer = _context6.sent;
            _context6.next = 13;
            return getLastUserOrder({
              pageId: pageId,
              userId: userId,
              status: ORDERSTATUS_FINISHED
            });

          case 13:
            order = _context6.sent;

            if (!order) {
              _context6.next = 31;
              break;
            }

            orderData.orderId = order.id;
            _updateOrder2 = false;

            if (addrData) {
              order.address = addrData.formattedAddress;

              if (addrData.location_lat && addrData.location_long) {
                order.location_lat = addrData.location_lat;
                order.location_long = addrData.location_long;
              }

              _updateOrder2 = true;
            }

            if (customer > 0) {
              order.customerId = customer.id;
              _updateOrder2 = true;
            }

            if (phone) {
              order.phone = phone;
              _updateOrder2 = true;
            }

            if (confirmOrder) {
              if (order.status < ORDERSTATUS_CONFIRMED) {
                order.status = ORDERSTATUS_CONFIRMED;
                order.confirmed_at = _luxon.DateTime.local();
                _updateOrder2 = true;
              }
            }

            if (waitingFor) {
              order.waitingFor = waitingFor;
              _updateOrder2 = true;
            }

            if (comments) {
              order.comments = comments;
              _updateOrder2 = true;
            }

            if (postComments) {
              if (!order.postComments) order.postComments = []; // let arrPostComments = postComments.split('\n');
              // order.postComments = order.postComments.concat(arrPostComments);

              order.postComments.push(postComments);
              if (mergeComments) order.comments = order.comments ? order.comments + '\n' + postComments : postComments;
              _updateOrder2 = true;
            }

            if (!_updateOrder2) {
              _context6.next = 28;
              break;
            }

            // changed_at keeps the last time the user sent a message.
            order.changed_at = _luxon.DateTime.local();
            _context6.next = 28;
            return order.save();

          case 28:
            if (confirmOrder || comments || postComments) {
              // every time new comments are stored I am passing the confirmOrder parameter. So,
              // here I check if this order was not already confirmed.
              // if (confirmOrder && currentStatus < ORDERSTATUS_CONFIRMED) {
              //     // emitEvent(pageId, 'new-order', order);
              // } else 
              if (comments || postComments) {
                orderJson = getOrderData(order, customer);
                (0, _redisController.emitEvent)(pageId, 'new-comment', orderJson);
              }
            }

            _context6.next = 42;
            break;

          case 31:
            _context6.next = 33;
            return _orders["default"].find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 33:
            resultLastId = _context6.sent;
            orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;
            if (mergeComments && postComments) _comments = comments ? comments + '\n' + postComments : postComments;else _comments = comments; // First message goes to details, not to postComments

            _order2 = new _orders["default"]({
              id: orderId,
              pageId: pageId,
              userId: userId,
              customerId: customer.id,
              phone: phone,
              waitingFor: waitingFor,
              comments: _comments,
              details: postComments,
              status: ORDERSTATUS_PENDING
            });
            _context6.next = 40;
            return _order2.save();

          case 40:
            _orderJson = getOrderData(_order2, customer);
            (0, _redisController.emitEvent)(pageId, 'new-order', _orderJson);

          case 42:
            _context6.next = 48;
            break;

          case 44:
            _context6.prev = 44;
            _context6.t0 = _context6["catch"](0);
            console.error({
              updateOrderError: _context6.t0
            });
            throw _context6.t0;

          case 48:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 44]]);
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
    var ret, result, savedCustomers, i, order, customer, jsonOrder;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            ret = {
              rangeIni: 0,
              rangeEnd: 0,
              totalCount: 0,
              ordersArray: []
            };
            _context7.prev = 1;
            _context7.next = 4;
            return _orders["default"].find(queryObj).sort(sortObj).exec();

          case 4:
            result = _context7.sent;
            ret.rangeIni = 0;
            ret.rangeEnd = result ? result.length : 0;
            ret.totalCount = result ? result.length : 0;

            if (rangeObj) {
              ret.rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
              ret.rangeEnd = rangeObj.offset + rangeObj.limit <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
            }

            ret.ordersArray = [];

            if (!(result && result.length && result.length > 0)) {
              _context7.next = 25;
              break;
            }

            // workaround to show totalamount and totalitems in the frontend, because
            // I am only sending part of the list (pagination)
            // let asideTotalAmount = 0;
            // let asideTotalItems = result.length;
            // for (const order of result) {
            //     asideTotalAmount = asideTotalAmount + order.total;
            // }
            // workaround end: all orders will receive these values.
            // instant cache to not query the database anytime.
            savedCustomers = {};
            i = ret.rangeIni;

          case 13:
            if (!(i < ret.rangeEnd)) {
              _context7.next = 25;
              break;
            }

            order = result[i];

            if (savedCustomers[order.customerId]) {
              _context7.next = 20;
              break;
            }

            _context7.next = 18;
            return (0, _customersController.getCustomerById)(order.pageId, order.customerId);

          case 18:
            customer = _context7.sent;
            savedCustomers[order.customerId] = customer;

          case 20:
            jsonOrder = getOrderData(order, savedCustomers[order.customerId]);
            ret.ordersArray.push(jsonOrder);

          case 22:
            i++;
            _context7.next = 13;
            break;

          case 25:
            return _context7.abrupt("return", ret);

          case 28:
            _context7.prev = 28;
            _context7.t0 = _context7["catch"](1);
            console.error(_context7.t0);
            return _context7.abrupt("return", ret);

          case 32:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 28]]);
  }));

  return function fullOrderGetAll(_x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();

var getOrderPending =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(orderData) {
    var userId, pageId, _order, headerOrder;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId;
            _context8.next = 3;
            return _orders["default"].findOne({
              userId: userId,
              pageId: pageId,
              status: {
                $lt: ORDERSTATUS_FINISHED
              }
            }).exec();

          case 3:
            _order = _context8.sent;

            if (!_order) {
              _context8.next = 9;
              break;
            }

            headerOrder = {
              order: _order
            };
            return _context8.abrupt("return", headerOrder);

          case 9:
            return _context8.abrupt("return", null);

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getOrderPending(_x14) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getOrderPending = getOrderPending;

var getLastUserOrder =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(orderData) {
    var userId, pageId, status, resultLast;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            userId = orderData.userId, pageId = orderData.pageId, status = orderData.status;
            _context9.next = 3;
            return _orders["default"].find({
              pageId: pageId,
              userId: userId,
              status: {
                $lt: status
              }
            }).sort('-id').limit(1).exec();

          case 3:
            resultLast = _context9.sent;

            if (!(resultLast && resultLast.length)) {
              _context9.next = 8;
              break;
            }

            return _context9.abrupt("return", resultLast[0]);

          case 8:
            return _context9.abrupt("return", null);

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function getLastUserOrder(_x15) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getLastUserOrder = getLastUserOrder;

var getLastOrder =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageID) {
    var resultLastId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _orders["default"].find({
              pageId: pageID,
              status: {
                $gte: ORDERSTATUS_CONFIRMED
              }
            }).select('id').sort('-confirmed_at').limit(1).exec();

          case 2:
            resultLastId = _context10.sent;

            if (!(resultLastId && resultLastId.length)) {
              _context10.next = 7;
              break;
            }

            return _context10.abrupt("return", resultLastId[0].id);

          case 7:
            return _context10.abrupt("return", 0);

          case 8:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function getLastOrder(_x16) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getLastOrder = getLastOrder;

var getLastPendingOrders =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(pageID) {
    var orders;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _orders["default"].find({
              pageId: pageID,
              status: ORDERSTATUS_CONFIRMED
            }).select('id confirmed_at').sort('-confirmed_at').exec();

          case 2:
            orders = _context11.sent;

            if (!(orders && orders.length)) {
              _context11.next = 7;
              break;
            }

            return _context11.abrupt("return", orders);

          case 7:
            return _context11.abrupt("return", []);

          case 8:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function getLastPendingOrders(_x17) {
    return _ref11.apply(this, arguments);
  };
}();

exports.getLastPendingOrders = getLastPendingOrders;

var getOrdersCustomerStat =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(orderData) {
    var pageId, customerId, orders, total_spent, nb_orders, first_order, last_order, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order;

    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            pageId = orderData.pageId, customerId = orderData.customerId;
            _context12.next = 3;
            return _orders["default"].find({
              pageId: pageId,
              customerId: customerId
            }).select('createdAt total').sort('createdAt').exec();

          case 3:
            orders = _context12.sent;
            total_spent = 0;
            nb_orders = 0;
            first_order = Date.now();
            last_order = null;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context12.prev = 11;

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

            _context12.next = 19;
            break;

          case 15:
            _context12.prev = 15;
            _context12.t0 = _context12["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context12.t0;

          case 19:
            _context12.prev = 19;
            _context12.prev = 20;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 22:
            _context12.prev = 22;

            if (!_didIteratorError) {
              _context12.next = 25;
              break;
            }

            throw _iteratorError;

          case 25:
            return _context12.finish(22);

          case 26:
            return _context12.finish(19);

          case 27:
            return _context12.abrupt("return", {
              total_spent: total_spent,
              nb_orders: nb_orders,
              first_order: first_order,
              last_order: last_order
            });

          case 28:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[11, 15, 19, 27], [20,, 22, 26]]);
  }));

  return function getOrdersCustomerStat(_x18) {
    return _ref12.apply(this, arguments);
  };
}();

exports.getOrdersCustomerStat = getOrdersCustomerStat;

var sendNotification = function sendNotification(whatsAppId, userId, message) {
  (0, _socketController.emitEventWhats)(whatsAppId, 'notify', {
    userId: userId,
    message: message
  });
};
//# sourceMappingURL=simpleOrdersController.js.map