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
    var _req$body, id, operation, pageId, doc, _updateOrder, rejectionExplanation, store, notif, _store, _notif, _store2, _notif2, question, _store3, _notif3, _req$body2, newAddress, newDetails, newTotal, totalNotification, updatePostComments, updatedPostComment, closeOrder, formatted, _store4, _notif4, message, index, _index, jsonOrder;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(req.body && req.body.id)) {
              _context3.next = 111;
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
            _context3.next = 98;
            break;

          case 17:
            if (!(operation === 'VIEW')) {
              _context3.next = 21;
              break;
            }

            doc.status = ORDERSTATUS_VIEWED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context3.next = 98;
            break;

          case 21:
            if (!(operation === 'ACCEPT')) {
              _context3.next = 30;
              break;
            }

            doc.status = ORDERSTATUS_ACCEPTED;
            _context3.next = 25;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 25:
            store = _context3.sent;
            notif = store.accept_notification;

            if (notif) {
              doc.comments = (0, _util2.addTimedMessage)(doc.comments, notif);
              sendNotification(store.phone, doc.userId, notif);
            }

            _context3.next = 98;
            break;

          case 30:
            if (!(operation === 'PRINT')) {
              _context3.next = 34;
              break;
            }

            doc.status = ORDERSTATUS_PRINTED; // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);

            _context3.next = 98;
            break;

          case 34:
            if (!(operation === 'DELIVER')) {
              _context3.next = 43;
              break;
            }

            doc.status = ORDERSTATUS_DELIVERED;
            _context3.next = 38;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 38:
            _store = _context3.sent;
            _notif = _store.deliver_notification;

            if (_notif) {
              doc.comments = (0, _util2.addTimedMessage)(doc.comments, _notif);
              sendNotification(_store.phone, doc.userId, _notif);
            }

            _context3.next = 98;
            break;

          case 43:
            if (!(operation === 'MISSING_ADDRESS')) {
              _context3.next = 52;
              break;
            }

            _updateOrder = false;
            _context3.next = 47;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 47:
            _store2 = _context3.sent;
            _notif2 = _store2.missing_address_notification;

            if (_notif2) {
              _updateOrder = true;
              doc.comments = (0, _util2.addTimedMessage)(doc.comments, _notif2);
              sendNotification(_store2.phone, doc.userId, _notif2);
            }

            _context3.next = 98;
            break;

          case 52:
            if (!(operation === 'OPEN_QUESTION')) {
              _context3.next = 61;
              break;
            }

            question = req.body.question; // doc.comments = doc.comments + '\n' + question;

            _context3.next = 56;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 56:
            _store3 = _context3.sent;
            _notif3 = question;

            if (_notif3) {
              _updateOrder = true;
              doc.comments = (0, _util2.addTimedMessage)(doc.comments, _notif3);
              sendNotification(_store3.phone, doc.userId, _notif3);
            }

            _context3.next = 98;
            break;

          case 61:
            if (!(operation === 'UPDATE_ORDER_DATA')) {
              _context3.next = 90;
              break;
            }

            _req$body2 = req.body, newAddress = _req$body2.newAddress, newDetails = _req$body2.newDetails, newTotal = _req$body2.newTotal, totalNotification = _req$body2.totalNotification, updatePostComments = _req$body2.updatePostComments, updatedPostComment = _req$body2.updatedPostComment, closeOrder = _req$body2.closeOrder;

            if (!newAddress) {
              _context3.next = 67;
              break;
            }

            doc.address = newAddress;
            _context3.next = 88;
            break;

          case 67:
            if (!newDetails) {
              _context3.next = 71;
              break;
            }

            doc.details = newDetails;
            _context3.next = 88;
            break;

          case 71:
            if (!newTotal) {
              _context3.next = 87;
              break;
            }

            formatted = newTotal.toString().replace(',', '.');

            if (isNaN(Number(formatted))) {
              _context3.next = 83;
              break;
            }

            doc.total = Number(formatted);

            if (!totalNotification) {
              _context3.next = 81;
              break;
            }

            _context3.next = 78;
            return (0, _storesController.getStoreData)(doc.pageId);

          case 78:
            _store4 = _context3.sent;
            _notif4 = _store4.total_notification;

            if (_notif4) {
              message = _notif4.toString().replace('$TOTAL', (0, _util2.formatAsCurrency)(doc.total));
              _updateOrder = true;
              doc.comments = (0, _util2.addTimedMessage)(doc.comments, message);
              sendNotification(_store4.phone, doc.userId, message);
            }

          case 81:
            _context3.next = 85;
            break;

          case 83:
            res.status(500).json({
              message: 'pos.orders.messages.invalidTotal'
            });
            return _context3.abrupt("return");

          case 85:
            _context3.next = 88;
            break;

          case 87:
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

          case 88:
            _context3.next = 98;
            break;

          case 90:
            if (req.body.status2 === 'ordered') {
              doc.status = ORDERSTATUS_CONFIRMED;
            } else if (req.body.status2 === 'delivered') {
              doc.status = ORDERSTATUS_DELIVERED;
              doc.delivered_at = _luxon.DateTime.local();
            } else if (req.body.status2 === 'cancelled') {
              doc.status = ORDERSTATUS_DELIVERED;
            }

            if (!(doc.status === ORDERSTATUS_DELIVERED)) {
              _context3.next = 98;
              break;
            }

            if (!(doc.source !== 'whatsapp')) {
              _context3.next = 98;
              break;
            }

            if (doc.sent_shipping_notification) {
              _context3.next = 98;
              break;
            }

            console.info('I am going to send to ' + doc.userId + ', about the order number:' + doc.id + ' a shipping notification');
            _context3.next = 97;
            return (0, _botController.sendShippingNotification)(doc.pageId, doc.userId, doc.id);

          case 97:
            doc.sent_shipping_notification = _luxon.DateTime.local();

          case 98:
            if (!_updateOrder) {
              _context3.next = 101;
              break;
            }

            _context3.next = 101;
            return doc.save();

          case 101:
            _context3.next = 103;
            return getOrderJson(pageId, doc.id);

          case 103:
            jsonOrder = _context3.sent;
            res.status(200).json(jsonOrder);
            _context3.next = 111;
            break;

          case 107:
            _context3.prev = 107;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);
            res.status(500).json({
              message: _context3.t0.message
            });

          case 111:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 107]]);
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

            if (!order) {
              _context5.next = 11;
              break;
            }

            _context5.next = 7;
            return (0, _customersController.getCustomerById)(pageId, order.customerId);

          case 7:
            customer = _context5.sent;
            return _context5.abrupt("return", getOrderData(order, customer));

          case 11:
            return _context5.abrupt("return", null);

          case 12:
            _context5.next = 18;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](0);
            console.error({
              getOrderJsonErr: _context5.t0
            });
            throw new Error(_context5.t0.message);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 14]]);
  }));

  return function getOrderJson(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getOrderJson = getOrderJson;

var getOrderData = function getOrderData(order, customer, totalAmount, totalItems) {
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
    changed_at: order.changed_at,
    status: order.status,
    status2: order.status2,
    phone: cleaned,
    address: order.address,
    total: order.total,
    details: order.details,
    comments: order.comments,
    postComments: order.postComments,
    asideTotalAmount: totalAmount,
    asideTotalItems: totalItems
  };
  return jsonOrder;
};

var updateOrder =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(orderData) {
    var pageId, _userId, user, phone, addrData, confirmOrder, waitingFor, comments, postComments, mergeComments, sentAutoReply, autoReplyMsg, customerData, first_name, last_name, profile_pic, customer, order, _updateOrder2, orderJson, resultLastId, orderId, _comments, _order2, _orderJson;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            pageId = orderData.pageId, _userId = orderData.userId, user = orderData.user, phone = orderData.phone, addrData = orderData.addrData, confirmOrder = orderData.confirmOrder, waitingFor = orderData.waitingFor, comments = orderData.comments, postComments = orderData.postComments, mergeComments = orderData.mergeComments, sentAutoReply = orderData.sentAutoReply, autoReplyMsg = orderData.autoReplyMsg;
            customerData = {};
            customerData.pageId = pageId;
            customerData.userId = _userId;

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
              userId: _userId,
              status: ORDERSTATUS_FINISHED
            });

          case 13:
            order = _context6.sent;

            if (!order) {
              _context6.next = 33;
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
              if (mergeComments) // order.comments = order.comments ? order.comments + '\n' + hours + comments : hours + comments;
                order.comments = (0, _util2.addTimedMessage)(order.comments, comments);else order.comments = comments;
              _updateOrder2 = true;
            }

            if (postComments) {
              // This store is setup to send auto reply, but it wasn't send yet.
              // So, I am gonna put all comments into comments, not postComments.
              if (autoReplyMsg && !order.sent_autoreply) {
                order.details = order.details ? order.details + '\n' + postComments : postComments;
              } else {
                if (!order.postComments) order.postComments = []; // let arrPostComments = postComments.split('\n');
                // order.postComments = order.postComments.concat(arrPostComments);

                order.postComments.push(postComments);
              }

              if (mergeComments) // order.comments =  order.comments ? order.comments + '\n' + hours + postComments : hours + postComments;
                order.comments = (0, _util2.addTimedMessage)(order.comments, postComments);
              _updateOrder2 = true;
            }

            if (sentAutoReply) {
              order.sent_autoreply = sentAutoReply;
              _updateOrder2 = true;
            }

            if (!_updateOrder2) {
              _context6.next = 29;
              break;
            }

            // changed_at keeps the last time the user sent a message.
            order.changed_at = _luxon.DateTime.local();
            _context6.next = 29;
            return order.save();

          case 29:
            if (confirmOrder || comments || postComments) {
              // every time new comments are stored I am passing the confirmOrder parameter. So,
              // here I check if this order was not already confirmed.
              // if (confirmOrder && currentStatus < ORDERSTATUS_CONFIRMED) {
              //     // emitEvent(pageId, 'new-order', order);
              // } else 
              if (comments || postComments) {
                orderJson = getOrderData(order, customer);
                (0, _redisController.emitEventBotWebapp)(pageId, 'new-comment', orderJson);
              }
            }

            return _context6.abrupt("return", order);

          case 33:
            _context6.next = 35;
            return _orders["default"].find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 35:
            resultLastId = _context6.sent;
            orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;
            if (mergeComments && postComments) // _comments = comments ? comments + '\n' + hours + postComments : hours + postComments;
              _comments = (0, _util2.addTimedMessage)(comments, postComments);else _comments = (0, _util2.addTimedMessage)(null, comments); // First message goes to details, not to postComments

            _order2 = new _orders["default"]({
              id: orderId,
              pageId: pageId,
              userId: _userId,
              customerId: customer.id,
              phone: phone,
              waitingFor: waitingFor,
              comments: _comments,
              details: postComments,
              status: ORDERSTATUS_PENDING
            });
            _context6.next = 42;
            return _order2.save();

          case 42:
            _orderJson = getOrderData(_order2, customer);
            (0, _redisController.emitEventBotWebapp)(pageId, 'new-order', _orderJson);
            return _context6.abrupt("return", _order2);

          case 45:
            _context6.next = 51;
            break;

          case 47:
            _context6.prev = 47;
            _context6.t0 = _context6["catch"](0);
            console.error({
              updateOrderError: _context6.t0
            });
            throw _context6.t0;

          case 51:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 47]]);
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
    var ret, result, asideTotalAmount, asideTotalItems, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _order3, savedCustomers, i, order, customer, jsonOrder;

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
              _context7.next = 46;
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
              _order3 = _step.value;
              asideTotalAmount += _order3.total;
            } // workaround end: all orders will receive these values.
            // instant cache to not query the database anytime.


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
            savedCustomers = {};
            i = ret.rangeIni;

          case 34:
            if (!(i < ret.rangeEnd)) {
              _context7.next = 46;
              break;
            }

            order = result[i];

            if (savedCustomers[order.customerId]) {
              _context7.next = 41;
              break;
            }

            _context7.next = 39;
            return (0, _customersController.getCustomerById)(order.pageId, order.customerId);

          case 39:
            customer = _context7.sent;
            savedCustomers[order.customerId] = customer;

          case 41:
            jsonOrder = getOrderData(order, savedCustomers[order.customerId], asideTotalAmount, asideTotalItems);
            ret.ordersArray.push(jsonOrder);

          case 43:
            i++;
            _context7.next = 34;
            break;

          case 46:
            return _context7.abrupt("return", ret);

          case 49:
            _context7.prev = 49;
            _context7.t1 = _context7["catch"](1);
            console.error(_context7.t1);
            return _context7.abrupt("return", ret);

          case 53:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 49], [16, 20, 24, 32], [25,, 27, 31]]);
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
    var pageId, customerId, orders, total_spent, nb_orders, first_order, last_order, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, order;

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
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context12.prev = 11;

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

            _context12.next = 19;
            break;

          case 15:
            _context12.prev = 15;
            _context12.t0 = _context12["catch"](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context12.t0;

          case 19:
            _context12.prev = 19;
            _context12.prev = 20;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 22:
            _context12.prev = 22;

            if (!_didIteratorError2) {
              _context12.next = 25;
              break;
            }

            throw _iteratorError2;

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

var sendDelayedMsg =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(pageID, userID, message) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            sendNotification(whatsAppId, userId, message);

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function sendDelayedMsg(_x19, _x20, _x21) {
    return _ref13.apply(this, arguments);
  };
}();
//# sourceMappingURL=simpleOrdersController.js.map