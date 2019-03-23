"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelItems = exports.getItemsTotal = exports.updateItemStatus = exports.reorderItems = exports.deletePendingItem = exports.deleteItem = exports.getItems = exports.updateStatusSpecificItem = exports.updateItem = exports.deleteManyItems = exports.item_get_all = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _luxon = require("luxon");

var _util = _interopRequireDefault(require("util"));

var _orders = _interopRequireDefault(require("../models/orders"));

var _items = _interopRequireDefault(require("../models/items"));

var _flavorsController = require("./flavorsController");

var _sizesController = require("./sizesController");

var _categoriesController = require("./categoriesController");

var _util2 = require("../util/util");

var _ordersController = require("./ordersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ITEMSTATUS_PENDING = 0;
var ITEMSTATUS_COMPLETED = 1; // List all orders
// TODO: use filters in the query req.query

var item_get_all =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var sortObj, rangeObj, filterObj, pageID, queryParamOrder, queryParamItem, _i, filter, value, date, rezonedIni, _date, _rezonedIni, rezonedEnd, orders, ordersArray, items, flavors, i, itemsStats, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, itemStat, _rangeIni, _rangeEnd, _totalCount, resultArray, k, field;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sortObj = (0, _util2.configSortQuery)(req.query.sort);
            rangeObj = (0, _util2.configRangeQueryNew)(req.query.range);
            filterObj = (0, _util2.configFilterQueryMultiple)(req.query.filter);
            pageID = req.currentUser ? req.currentUser.activePage : null;

            if (!pageID) {
              _context.next = 80;
              break;
            }

            queryParamOrder = {};
            queryParamItem = {};
            queryParamOrder['pageId'] = pageID;
            queryParamItem['pageId'] = pageID;
            queryParamOrder['status'] = {
              $gte: _ordersController.ORDERSTATUS_CONFIRMED,
              $lt: _ordersController.ORDERSTATUS_REJECTED
            };

            if (filterObj && filterObj.filterField && filterObj.filterField.length) {
              for (_i = 0; _i < filterObj.filterField.length; _i++) {
                filter = filterObj.filterField[_i];
                value = filterObj.filterValues[_i];

                if (filter.endsWith('_rangestart')) {
                  date = _luxon.DateTime.fromISO(value);
                  filter = filter.replace('_rangestart', '');
                  rezonedIni = date.set({
                    hour: 0,
                    minute: 0,
                    second: 0
                  }).setZone('UTC');
                  queryParamOrder[filter] = {
                    $gte: rezonedIni.toISO()
                  };
                } else if (filter.endsWith('_rangeend')) {
                  _date = _luxon.DateTime.fromISO(value);
                  filter = filter.replace('_rangeend', '');
                  _rezonedIni = _date.set({
                    hour: 0,
                    minute: 0,
                    second: 0
                  }).setZone('UTC');
                  rezonedEnd = _rezonedIni.plus({
                    days: 1
                  });
                  if (queryParamOrder[filter]) queryParamOrder[filter] = {
                    $gte: Object.values(queryParamOrder[filter])[0],
                    $lt: rezonedEnd.toISO()
                  };else queryParamOrder[filter] = {
                    $lt: rezonedEnd.toISO()
                  };
                } else {
                  queryParamItem[filter] = value;
                }
              }
            }

            _context.next = 14;
            return _orders.default.find(queryParamOrder).exec();

          case 14:
            orders = _context.sent;
            ordersArray = orders.map(function (order) {
              return order.id;
            });
            queryParamItem['orderId'] = {
              $in: ordersArray
            };
            queryParamItem['flavorId'] = {
              $gt: 0
            };
            console.info(queryParamOrder);
            console.info(queryParamItem);
            _context.next = 22;
            return _items.default.find(queryParamItem).sort('flavorId').exec();

          case 22:
            items = _context.sent;
            _context.next = 25;
            return (0, _flavorsController.getFlavors)(pageID, queryParamItem['categoryId'], 'id');

          case 25:
            flavors = _context.sent;
            i = 0;
            itemsStats = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 31;
            _iterator = flavors[Symbol.iterator]();

          case 33:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 56;
              break;
            }

            flavor = _step.value;
            itemStat = {
              id: flavor.id,
              flavor: flavor.flavor,
              categoryId: flavor.categoryId,
              itemsSold: 0,
              amountSold: 0,
              firstSale: null,
              lastSale: null
            };

          case 36:
            if (!1) {
              _context.next = 52;
              break;
            }

            if (!(i < items.length)) {
              _context.next = 48;
              break;
            }

            if (!(items[i].flavorId === flavor.id)) {
              _context.next = 45;
              break;
            }

            itemStat.itemsSold = itemStat.itemsSold + 1;
            itemStat.amountSold = itemStat.amountSold + items[i].price;
            if (!itemStat.firstSale || items[i].updatedAt < itemStat.firstSale) itemStat.firstSale = items[i].updatedAt;
            if (!itemStat.lastSale || items[i].updatedAt > itemStat.lastSale) itemStat.lastSale = items[i].updatedAt;
            _context.next = 46;
            break;

          case 45:
            return _context.abrupt("break", 52);

          case 46:
            _context.next = 49;
            break;

          case 48:
            return _context.abrupt("break", 52);

          case 49:
            i++;
            _context.next = 36;
            break;

          case 52:
            itemsStats.push(itemStat);

          case 53:
            _iteratorNormalCompletion = true;
            _context.next = 33;
            break;

          case 56:
            _context.next = 62;
            break;

          case 58:
            _context.prev = 58;
            _context.t0 = _context["catch"](31);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 62:
            _context.prev = 62;
            _context.prev = 63;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 65:
            _context.prev = 65;

            if (!_didIteratorError) {
              _context.next = 68;
              break;
            }

            throw _iteratorError;

          case 68:
            return _context.finish(65);

          case 69:
            return _context.finish(62);

          case 70:
            _rangeIni = 0;
            _rangeEnd = itemsStats.length;

            if (rangeObj) {
              _rangeIni = rangeObj.offset <= itemsStats.length ? rangeObj.offset : itemsStats.length;
              _rangeEnd = rangeObj.offset + rangeObj.limit <= itemsStats.length ? rangeObj.offset + rangeObj.limit : itemsStats.length;
            }

            _totalCount = itemsStats.length;
            resultArray = [];

            if (itemsStats && itemsStats.length > 0) {
              for (k = _rangeIni; k < _rangeEnd; k++) {
                resultArray.push(itemsStats[k]);
              } // https://stackoverflow.com/a/1129270/7948731


              if (sortObj) {
                field = Object.keys(sortObj)[0];
                if (sortObj[field] === 'ASC') resultArray.sort(function (a, b) {
                  return a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0;
                });else resultArray.sort(function (a, b) {
                  return b[field] > a[field] ? 1 : a[field] > b[field] ? -1 : 0;
                });
              }
            } // All lists must have an ID field, if not, React-admin throws a Content-Range error.
            // https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources


            res.setHeader('Content-Range', _util.default.format('items %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
            res.status(200).json(resultArray);
            _context.next = 82;
            break;

          case 80:
            res.setHeader('Content-Range', 'items 0-0/0');
            res.status(200).json([]);

          case 82:
            _context.next = 88;
            break;

          case 84:
            _context.prev = 84;
            _context.t1 = _context["catch"](0);
            console.error({
              itemGetAllErr: _context.t1
            });
            res.status(500).json({
              message: _context.t1.message
            });

          case 88:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 84], [31, 58, 62, 70], [63,, 65, 69]]);
  }));

  return function item_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Delete all records from a pageID
 * @param {*} pageID
 */


exports.item_get_all = item_get_all;

var deleteManyItems =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageID) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _items.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function deleteManyItems(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.deleteManyItems = deleteManyItems;

var updateItem =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(orderData) {
    var orderId, currentItem, userId, pageId, qty, sizeId, flavorId, categoryId, price, completeItem, split, eraseSize, item, _split, _price, resultLastId, itemId, record;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            orderId = orderData.orderId, currentItem = orderData.currentItem, userId = orderData.userId, pageId = orderData.pageId, qty = orderData.qty, sizeId = orderData.sizeId, flavorId = orderData.flavorId, categoryId = orderData.categoryId, price = orderData.price, completeItem = orderData.completeItem, split = orderData.split, eraseSize = orderData.eraseSize;

            if (!(sizeId || flavorId || categoryId || typeof completeItem === 'boolean' || eraseSize)) {
              _context3.next = 30;
              break;
            }

            _context3.next = 4;
            return _items.default.findOne({
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              flavorId: null,
              status: ITEMSTATUS_PENDING
            }).exec();

          case 4:
            item = _context3.sent;

            if (!item) {
              _context3.next = 22;
              break;
            }

            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (eraseSize) item.sizeId = null;
            if (flavorId) item.flavorId = flavorId;
            if (categoryId) item.categoryId = categoryId;
            if (price) item.price = price;
            if (currentItem) item.itemId = currentItem;
            if (split) item.split = split;
            if (typeof completeItem === 'boolean') item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;
            _split = split || item.split;
            _price = price || item.price;

            if (_split && _split > 1 && _price) {
              item.price = _price / _split;
            }

            _context3.next = 20;
            return item.save();

          case 20:
            _context3.next = 30;
            break;

          case 22:
            _context3.next = 24;
            return _items.default.find({
              pageId: pageId,
              orderId: orderId
            }).select('id').sort('-id').limit(1).exec();

          case 24:
            resultLastId = _context3.sent;
            itemId = 1;
            if (resultLastId && resultLastId.length) itemId = resultLastId[0].id + 1;
            record = new _items.default({
              id: itemId,
              orderId: orderId,
              itemId: currentItem,
              userId: userId,
              pageId: pageId,
              qty: qty || 1,
              split: split || 1,
              sizeId: sizeId,
              flavorId: flavorId,
              categoryId: categoryId,
              price: price,
              status: ITEMSTATUS_PENDING
            });
            _context3.next = 30;
            return record.save();

          case 30:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updateItem(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateItem = updateItem;

var updateStatusSpecificItem =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(objectId, status) {
    var item;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _items.default.findOne({
              _id: _mongoose.default.Types.ObjectId(objectId)
            }).exec();

          case 2:
            item = _context4.sent;

            if (!item) {
              _context4.next = 7;
              break;
            }

            item.status = status;
            _context4.next = 7;
            return item.save();

          case 7:
            return _context4.abrupt("return", item);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateStatusSpecificItem(_x5, _x6) {
    return _ref4.apply(this, arguments);
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
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(orderData) {
    var orderId, pageId, completeItems, queryAuxTables, items, flavors, sizes, categories, i, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, flavor, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, size, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, category;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId, completeItems = orderData.completeItems;
            queryAuxTables = false;

            if (typeof completeItems !== 'undefined') {
              queryAuxTables = completeItems;
            }

            _context5.next = 5;
            return _items.default.find({
              orderId: orderId,
              pageId: pageId
            }).exec();

          case 5:
            items = _context5.sent;
            flavors = [];
            sizes = [];
            categories = [];

            if (!queryAuxTables) {
              _context5.next = 19;
              break;
            }

            _context5.next = 12;
            return (0, _flavorsController.getFlavors)(pageId);

          case 12:
            flavors = _context5.sent;
            _context5.next = 15;
            return (0, _sizesController.getSizes)(pageId);

          case 15:
            sizes = _context5.sent;
            _context5.next = 18;
            return (0, _categoriesController.getCategories)(pageId);

          case 18:
            categories = _context5.sent;

          case 19:
            if (!(items && items.length)) {
              _context5.next = 115;
              break;
            }

            i = 0;

          case 21:
            if (!(i < items.length)) {
              _context5.next = 112;
              break;
            }

            if (!(items[i].flavorId && items[i].flavorId > 0)) {
              _context5.next = 51;
              break;
            }

            if (!queryAuxTables) {
              _context5.next = 51;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 27;
            _iterator2 = flavors[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context5.next = 37;
              break;
            }

            flavor = _step2.value;

            if (!(flavor.id === items[i].flavorId)) {
              _context5.next = 34;
              break;
            }

            items[i].flavor = flavor.flavor;
            return _context5.abrupt("break", 37);

          case 34:
            _iteratorNormalCompletion2 = true;
            _context5.next = 29;
            break;

          case 37:
            _context5.next = 43;
            break;

          case 39:
            _context5.prev = 39;
            _context5.t0 = _context5["catch"](27);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t0;

          case 43:
            _context5.prev = 43;
            _context5.prev = 44;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 46:
            _context5.prev = 46;

            if (!_didIteratorError2) {
              _context5.next = 49;
              break;
            }

            throw _iteratorError2;

          case 49:
            return _context5.finish(46);

          case 50:
            return _context5.finish(43);

          case 51:
            if (!(items[i].sizeId && items[i].sizeId > 0)) {
              _context5.next = 80;
              break;
            }

            if (!queryAuxTables) {
              _context5.next = 80;
              break;
            }

            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context5.prev = 56;
            _iterator3 = sizes[Symbol.iterator]();

          case 58:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context5.next = 66;
              break;
            }

            size = _step3.value;

            if (!(size.id === items[i].sizeId)) {
              _context5.next = 63;
              break;
            }

            items[i].size = size.size;
            return _context5.abrupt("break", 66);

          case 63:
            _iteratorNormalCompletion3 = true;
            _context5.next = 58;
            break;

          case 66:
            _context5.next = 72;
            break;

          case 68:
            _context5.prev = 68;
            _context5.t1 = _context5["catch"](56);
            _didIteratorError3 = true;
            _iteratorError3 = _context5.t1;

          case 72:
            _context5.prev = 72;
            _context5.prev = 73;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 75:
            _context5.prev = 75;

            if (!_didIteratorError3) {
              _context5.next = 78;
              break;
            }

            throw _iteratorError3;

          case 78:
            return _context5.finish(75);

          case 79:
            return _context5.finish(72);

          case 80:
            if (!(items[i].categoryId && items[i].categoryId > 0)) {
              _context5.next = 109;
              break;
            }

            if (!queryAuxTables) {
              _context5.next = 109;
              break;
            }

            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context5.prev = 85;
            _iterator4 = categories[Symbol.iterator]();

          case 87:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context5.next = 95;
              break;
            }

            category = _step4.value;

            if (!(category.id === items[i].categoryId)) {
              _context5.next = 92;
              break;
            }

            items[i].category = category.name;
            return _context5.abrupt("break", 95);

          case 92:
            _iteratorNormalCompletion4 = true;
            _context5.next = 87;
            break;

          case 95:
            _context5.next = 101;
            break;

          case 97:
            _context5.prev = 97;
            _context5.t2 = _context5["catch"](85);
            _didIteratorError4 = true;
            _iteratorError4 = _context5.t2;

          case 101:
            _context5.prev = 101;
            _context5.prev = 102;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 104:
            _context5.prev = 104;

            if (!_didIteratorError4) {
              _context5.next = 107;
              break;
            }

            throw _iteratorError4;

          case 107:
            return _context5.finish(104);

          case 108:
            return _context5.finish(101);

          case 109:
            i++;
            _context5.next = 21;
            break;

          case 112:
            return _context5.abrupt("return", items);

          case 115:
            return _context5.abrupt("return", null);

          case 116:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[27, 39, 43, 51], [44,, 46, 50], [56, 68, 72, 80], [73,, 75, 79], [85, 97, 101, 109], [102,, 104, 108]]);
  }));

  return function getItems(_x7) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} pageId
 * @param {*} userId
 * @param {*} itemId
 */


exports.getItems = getItems;

var deleteItem =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, orderID, itemID) {
    var result;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _items.default.deleteMany({
              pageId: pageID,
              orderId: orderID,
              itemId: itemID
            }).exec();

          case 3:
            result = _context6.sent;
            return _context6.abrupt("return", result);

          case 7:
            _context6.prev = 7;
            _context6.t0 = _context6["catch"](0);
            console.error(_context6.t0);
            return _context6.abrupt("return", null);

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 7]]);
  }));

  return function deleteItem(_x8, _x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteItem = deleteItem;

var deletePendingItem =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageID, orderID) {
    var result;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _items.default.deleteMany({
              pageId: pageID,
              orderId: orderID,
              status: ITEMSTATUS_PENDING
            }).exec();

          case 3:
            result = _context7.sent;
            return _context7.abrupt("return", result);

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](0);
            console.error(_context7.t0);
            return _context7.abrupt("return", null);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 7]]);
  }));

  return function deletePendingItem(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

exports.deletePendingItem = deletePendingItem;

var reorderItems =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(pageID, orderID) {
    var items, seq, changedId, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, item, currentId;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _items.default.find({
              pageId: pageID,
              orderId: orderID
            }).sort({
              itemId: 1
            }).exec();

          case 3:
            items = _context8.sent;
            seq = 1;
            changedId = 0;
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context8.prev = 9;
            _iterator5 = items[Symbol.iterator]();

          case 11:
            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
              _context8.next = 23;
              break;
            }

            item = _step5.value;
            currentId = item.itemId;

            if (!(currentId !== changedId)) {
              _context8.next = 20;
              break;
            }

            if (!(currentId !== seq)) {
              _context8.next = 18;
              break;
            }

            _context8.next = 18;
            return _items.default.updateMany({
              pageId: pageID,
              orderId: orderID,
              itemId: currentId
            }, {
              $set: {
                itemId: seq
              }
            }).exec();

          case 18:
            changedId = currentId;
            seq++;

          case 20:
            _iteratorNormalCompletion5 = true;
            _context8.next = 11;
            break;

          case 23:
            _context8.next = 29;
            break;

          case 25:
            _context8.prev = 25;
            _context8.t0 = _context8["catch"](9);
            _didIteratorError5 = true;
            _iteratorError5 = _context8.t0;

          case 29:
            _context8.prev = 29;
            _context8.prev = 30;

            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }

          case 32:
            _context8.prev = 32;

            if (!_didIteratorError5) {
              _context8.next = 35;
              break;
            }

            throw _iteratorError5;

          case 35:
            return _context8.finish(32);

          case 36:
            return _context8.finish(29);

          case 37:
            return _context8.abrupt("return", seq);

          case 40:
            _context8.prev = 40;
            _context8.t1 = _context8["catch"](0);
            console.error(_context8.t1);
            return _context8.abrupt("return", null);

          case 44:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 40], [9, 25, 29, 37], [30,, 32, 36]]);
  }));

  return function reorderItems(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Updates all items with same itemID, setting their status as COMPLETED. It is used
 * when an item has split, and the status is PENDING whle the user is choosing all the flavors.
 * @param {*} pageID
 * @param {*} orderID
 * @param {*} itemID
 */


exports.reorderItems = reorderItems;

var updateItemStatus =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(pageID, orderID, itemID) {
    var result;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _items.default.updateMany({
              pageId: pageID,
              orderId: orderID,
              itemId: itemID
            }, {
              $set: {
                status: ITEMSTATUS_COMPLETED
              }
            }).exec();

          case 3:
            result = _context9.sent;
            console.info(result);
            return _context9.abrupt("return", result);

          case 8:
            _context9.prev = 8;
            _context9.t0 = _context9["catch"](0);
            console.error(_context9.t0);
            return _context9.abrupt("return", null);

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 8]]);
  }));

  return function updateItemStatus(_x15, _x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Calculate total price of an orderId+pageId
 * @param {*} orderData
 */


exports.updateItemStatus = updateItemStatus;

var getItemsTotal =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(orderData) {
    var orderId, pageId, items, _total, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId;
            _context10.next = 3;
            return getItems({
              orderId: orderId,
              pageId: pageId,
              completeItems: false
            });

          case 3:
            items = _context10.sent;
            _total = 0;

            if (!(items && items.length)) {
              _context10.next = 25;
              break;
            }

            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context10.prev = 9;

            for (_iterator6 = items[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              item = _step6.value;
              _total += item.price ? item.price : 0;
            }

            _context10.next = 17;
            break;

          case 13:
            _context10.prev = 13;
            _context10.t0 = _context10["catch"](9);
            _didIteratorError6 = true;
            _iteratorError6 = _context10.t0;

          case 17:
            _context10.prev = 17;
            _context10.prev = 18;

            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }

          case 20:
            _context10.prev = 20;

            if (!_didIteratorError6) {
              _context10.next = 23;
              break;
            }

            throw _iteratorError6;

          case 23:
            return _context10.finish(20);

          case 24:
            return _context10.finish(17);

          case 25:
            return _context10.abrupt("return", _total);

          case 26:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function getItemsTotal(_x18) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getItemsTotal = getItemsTotal;

var cancelItems =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(pageId, orderId) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _items.default.deleteMany({
              pageId: pageId,
              orderId: orderId
            }, function (err) {
              if (err) {
                console.error("Items.deleteMany orderId: ".concat(orderId));
                console.error(err);
              }
            });

          case 2:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function cancelItems(_x19, _x20) {
    return _ref11.apply(this, arguments);
  };
}();

exports.cancelItems = cancelItems;
//# sourceMappingURL=itemsController.js.map