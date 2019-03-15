"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelItems = exports.getItemsTotal = exports.updateItemStatus = exports.reorderItems = exports.deletePendingItem = exports.deleteItem = exports.getItems = exports.updateStatusSpecificItem = exports.updateItem = exports.deleteManyItems = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _items = _interopRequireDefault(require("../models/items"));

var _flavorsController = require("./flavorsController");

var _pricingsController = require("./pricingsController");

var _sizesController = require("./sizesController");

var _categoriesController = require("./categoriesController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ITEMSTATUS_PENDING = 0;
var ITEMSTATUS_COMPLETED = 1;
/**
 * Delete all records from a pageID
 * @param {*} pageID
 */

var deleteManyItems =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _items.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function deleteManyItems(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.deleteManyItems = deleteManyItems;

var updateItem =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(orderData) {
    var orderId, currentItem, userId, pageId, qty, sizeId, flavorId, categoryId, price, completeItem, split, eraseSize, item, _split, _price, resultLastId, itemId, record;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            orderId = orderData.orderId, currentItem = orderData.currentItem, userId = orderData.userId, pageId = orderData.pageId, qty = orderData.qty, sizeId = orderData.sizeId, flavorId = orderData.flavorId, categoryId = orderData.categoryId, price = orderData.price, completeItem = orderData.completeItem, split = orderData.split, eraseSize = orderData.eraseSize;

            if (!(sizeId || flavorId || categoryId || typeof completeItem === 'boolean' || eraseSize)) {
              _context2.next = 30;
              break;
            }

            _context2.next = 4;
            return _items.default.findOne({
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              flavorId: null,
              status: ITEMSTATUS_PENDING
            }).exec();

          case 4:
            item = _context2.sent;

            if (!item) {
              _context2.next = 22;
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

            _context2.next = 20;
            return item.save();

          case 20:
            _context2.next = 30;
            break;

          case 22:
            _context2.next = 24;
            return _items.default.find({
              pageId: pageId,
              orderId: orderId
            }).select('id').sort('-id').limit(1).exec();

          case 24:
            resultLastId = _context2.sent;
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
            _context2.next = 30;
            return record.save();

          case 30:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateItem(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateItem = updateItem;

var updateStatusSpecificItem =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(objectId, status) {
    var item;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _items.default.findOne({
              _id: _mongoose.default.Types.ObjectId(objectId)
            }).exec();

          case 2:
            item = _context3.sent;

            if (!item) {
              _context3.next = 7;
              break;
            }

            item.status = status;
            _context3.next = 7;
            return item.save();

          case 7:
            return _context3.abrupt("return", item);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updateStatusSpecificItem(_x3, _x4) {
    return _ref3.apply(this, arguments);
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
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(orderData) {
    var orderId, pageId, completeItems, queryAuxTables, items, flavors, sizes, categories, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, flavor, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, size, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, category;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId, completeItems = orderData.completeItems;
            queryAuxTables = false;

            if (typeof completeItems !== 'undefined') {
              queryAuxTables = completeItems;
            }

            _context4.next = 5;
            return _items.default.find({
              orderId: orderId,
              pageId: pageId
            }).exec();

          case 5:
            items = _context4.sent;
            flavors = [];
            sizes = [];
            categories = [];

            if (!queryAuxTables) {
              _context4.next = 19;
              break;
            }

            _context4.next = 12;
            return (0, _flavorsController.getFlavors)(pageId);

          case 12:
            flavors = _context4.sent;
            _context4.next = 15;
            return (0, _sizesController.getSizes)(pageId);

          case 15:
            sizes = _context4.sent;
            _context4.next = 18;
            return (0, _categoriesController.getCategories)(pageId);

          case 18:
            categories = _context4.sent;

          case 19:
            if (!(items && items.length)) {
              _context4.next = 115;
              break;
            }

            i = 0;

          case 21:
            if (!(i < items.length)) {
              _context4.next = 112;
              break;
            }

            if (!(items[i].flavorId && items[i].flavorId > 0)) {
              _context4.next = 51;
              break;
            }

            if (!queryAuxTables) {
              _context4.next = 51;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 27;
            _iterator = flavors[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context4.next = 37;
              break;
            }

            flavor = _step.value;

            if (!(flavor.id === items[i].flavorId)) {
              _context4.next = 34;
              break;
            }

            items[i].flavor = flavor.flavor;
            return _context4.abrupt("break", 37);

          case 34:
            _iteratorNormalCompletion = true;
            _context4.next = 29;
            break;

          case 37:
            _context4.next = 43;
            break;

          case 39:
            _context4.prev = 39;
            _context4.t0 = _context4["catch"](27);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 43:
            _context4.prev = 43;
            _context4.prev = 44;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 46:
            _context4.prev = 46;

            if (!_didIteratorError) {
              _context4.next = 49;
              break;
            }

            throw _iteratorError;

          case 49:
            return _context4.finish(46);

          case 50:
            return _context4.finish(43);

          case 51:
            if (!(items[i].sizeId && items[i].sizeId > 0)) {
              _context4.next = 80;
              break;
            }

            if (!queryAuxTables) {
              _context4.next = 80;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context4.prev = 56;
            _iterator2 = sizes[Symbol.iterator]();

          case 58:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context4.next = 66;
              break;
            }

            size = _step2.value;

            if (!(size.id === items[i].sizeId)) {
              _context4.next = 63;
              break;
            }

            items[i].size = size.size;
            return _context4.abrupt("break", 66);

          case 63:
            _iteratorNormalCompletion2 = true;
            _context4.next = 58;
            break;

          case 66:
            _context4.next = 72;
            break;

          case 68:
            _context4.prev = 68;
            _context4.t1 = _context4["catch"](56);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t1;

          case 72:
            _context4.prev = 72;
            _context4.prev = 73;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 75:
            _context4.prev = 75;

            if (!_didIteratorError2) {
              _context4.next = 78;
              break;
            }

            throw _iteratorError2;

          case 78:
            return _context4.finish(75);

          case 79:
            return _context4.finish(72);

          case 80:
            if (!(items[i].categoryId && items[i].categoryId > 0)) {
              _context4.next = 109;
              break;
            }

            if (!queryAuxTables) {
              _context4.next = 109;
              break;
            }

            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context4.prev = 85;
            _iterator3 = categories[Symbol.iterator]();

          case 87:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context4.next = 95;
              break;
            }

            category = _step3.value;

            if (!(category.id === items[i].categoryId)) {
              _context4.next = 92;
              break;
            }

            items[i].category = category.name;
            return _context4.abrupt("break", 95);

          case 92:
            _iteratorNormalCompletion3 = true;
            _context4.next = 87;
            break;

          case 95:
            _context4.next = 101;
            break;

          case 97:
            _context4.prev = 97;
            _context4.t2 = _context4["catch"](85);
            _didIteratorError3 = true;
            _iteratorError3 = _context4.t2;

          case 101:
            _context4.prev = 101;
            _context4.prev = 102;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 104:
            _context4.prev = 104;

            if (!_didIteratorError3) {
              _context4.next = 107;
              break;
            }

            throw _iteratorError3;

          case 107:
            return _context4.finish(104);

          case 108:
            return _context4.finish(101);

          case 109:
            i++;
            _context4.next = 21;
            break;

          case 112:
            return _context4.abrupt("return", items);

          case 115:
            return _context4.abrupt("return", null);

          case 116:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[27, 39, 43, 51], [44,, 46, 50], [56, 68, 72, 80], [73,, 75, 79], [85, 97, 101, 109], [102,, 104, 108]]);
  }));

  return function getItems(_x5) {
    return _ref4.apply(this, arguments);
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
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, orderID, itemID) {
    var result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _items.default.deleteMany({
              pageId: pageID,
              orderId: orderID,
              itemId: itemID
            }).exec();

          case 3:
            result = _context5.sent;
            return _context5.abrupt("return", result);

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);
            return _context5.abrupt("return", null);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function deleteItem(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.deleteItem = deleteItem;

var deletePendingItem =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, orderID) {
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
              status: ITEMSTATUS_PENDING
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

  return function deletePendingItem(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deletePendingItem = deletePendingItem;

var reorderItems =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageID, orderID) {
    var items, seq, changedId, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, item, currentId;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _items.default.find({
              pageId: pageID,
              orderId: orderID
            }).sort({
              itemId: 1
            }).exec();

          case 3:
            items = _context7.sent;
            seq = 1;
            changedId = 0;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context7.prev = 9;
            _iterator4 = items[Symbol.iterator]();

          case 11:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context7.next = 23;
              break;
            }

            item = _step4.value;
            currentId = item.itemId;

            if (!(currentId !== changedId)) {
              _context7.next = 20;
              break;
            }

            if (!(currentId !== seq)) {
              _context7.next = 18;
              break;
            }

            _context7.next = 18;
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
            _iteratorNormalCompletion4 = true;
            _context7.next = 11;
            break;

          case 23:
            _context7.next = 29;
            break;

          case 25:
            _context7.prev = 25;
            _context7.t0 = _context7["catch"](9);
            _didIteratorError4 = true;
            _iteratorError4 = _context7.t0;

          case 29:
            _context7.prev = 29;
            _context7.prev = 30;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 32:
            _context7.prev = 32;

            if (!_didIteratorError4) {
              _context7.next = 35;
              break;
            }

            throw _iteratorError4;

          case 35:
            return _context7.finish(32);

          case 36:
            return _context7.finish(29);

          case 37:
            return _context7.abrupt("return", seq);

          case 40:
            _context7.prev = 40;
            _context7.t1 = _context7["catch"](0);
            console.error(_context7.t1);
            return _context7.abrupt("return", null);

          case 44:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 40], [9, 25, 29, 37], [30,, 32, 36]]);
  }));

  return function reorderItems(_x11, _x12) {
    return _ref7.apply(this, arguments);
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
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(pageID, orderID, itemID) {
    var result;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
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
            result = _context8.sent;
            console.info(result);
            return _context8.abrupt("return", result);

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            console.error(_context8.t0);
            return _context8.abrupt("return", null);

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));

  return function updateItemStatus(_x13, _x14, _x15) {
    return _ref8.apply(this, arguments);
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
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(orderData) {
    var orderId, pageId, items, _total, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, item;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            orderId = orderData.orderId, pageId = orderData.pageId;
            _context9.next = 3;
            return getItems({
              orderId: orderId,
              pageId: pageId,
              completeItems: false
            });

          case 3:
            items = _context9.sent;
            _total = 0;

            if (!(items && items.length)) {
              _context9.next = 25;
              break;
            }

            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context9.prev = 9;

            for (_iterator5 = items[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              item = _step5.value;
              _total += item.price ? item.price : 0;
            }

            _context9.next = 17;
            break;

          case 13:
            _context9.prev = 13;
            _context9.t0 = _context9["catch"](9);
            _didIteratorError5 = true;
            _iteratorError5 = _context9.t0;

          case 17:
            _context9.prev = 17;
            _context9.prev = 18;

            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }

          case 20:
            _context9.prev = 20;

            if (!_didIteratorError5) {
              _context9.next = 23;
              break;
            }

            throw _iteratorError5;

          case 23:
            return _context9.finish(20);

          case 24:
            return _context9.finish(17);

          case 25:
            return _context9.abrupt("return", _total);

          case 26:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function getItemsTotal(_x16) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getItemsTotal = getItemsTotal;

var cancelItems =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageId, orderId) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
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
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function cancelItems(_x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}();

exports.cancelItems = cancelItems;
//# sourceMappingURL=itemsController.js.map