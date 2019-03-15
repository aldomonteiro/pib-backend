"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPricingsWithSize = exports.getOnePricingByFlavor = exports.getOnePricing = exports.getPricings = exports.getPricingSizing = exports.deleteManyPricings = exports.pricing_delete = exports.pricing_update = exports.pricing_create = exports.pricing_get_one = exports.pricing_get_all = void 0;

var _pricings = _interopRequireDefault(require("../models/pricings"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

var _sizesController = require("./sizesController");

var _flavorsController = require("./flavorsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all records
// TODO: use filters in the query req.query
var pricing_get_all = function pricing_get_all(req, res) {
  // Getting the sort from the requisition
  var sortObj = (0, _util2.configSortQuery)(req.query.sort); // Getting the range from the requisition

  var rangeObj = (0, _util2.configRangeQuery)(req.query.range);
  var options = {
    offset: rangeObj['offset'],
    limit: rangeObj['limit'],
    sort: sortObj,
    lean: true,
    leanWithId: false
  };
  var query = {};

  if (req.currentUser.activePage) {
    query = _pricings.default.find({
      pageId: req.currentUser.activePage
    });
  }

  _pricings.default.paginate(query, options, function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      res.setHeader('Content-Range', _util.default.format('pricings %d-%d/%d', rangeObj['offset'], rangeObj['limit'], result.total));
      res.status(200).json(result.docs);
    }
  });
}; // List one record by filtering by ID


exports.pricing_get_all = pricing_get_all;

var pricing_get_one = function pricing_get_one(req, res) {
  if (req.params && req.params.id) {
    // Filter based on the currentUser
    var pageId = req.currentUser.activePage;

    _pricings.default.findOne({
      pageId: pageId,
      id: req.params.id
    }, function (err, doc) {
      if (err) {
        res.status(500).json({
          message: err.errmsg
        });
      } else {
        res.status(200).json(doc);
      }
    });
  }
}; // CREATE A NEW RECORD


exports.pricing_get_one = pricing_get_one;

var pricing_create =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var pageId, id, lastId, newRecord;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.body) {
              _context.next = 11;
              break;
            }

            pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
            id = req.body.id;

            if (!(!id || id === 0)) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return _pricings.default.find({
              pageId: pageId
            }).select('id').sort('-id').limit(1).exec();

          case 6:
            lastId = _context.sent;
            id = 1;
            if (lastId && lastId.length) id = lastId[0].id + 1;

          case 9:
            newRecord = new _pricings.default({
              id: id,
              categoryId: req.body.categoryId,
              sizeId: req.body.sizeId,
              price: req.body.price,
              pageId: pageId
            });
            newRecord.save().then(function (result) {
              res.status(200).json(result);
            }).catch(function (err) {
              if (err.code === 11000) {
                res.status(500).json({
                  message: 'pos.messages.duplicatedKey'
                });
              } else {
                res.status(500).json({
                  message: err.errmsg
                });
              }
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function pricing_create(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // UPDATE


exports.pricing_create = pricing_create;

var pricing_update = function pricing_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _pricings.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.categoryId = req.body.categoryId;
        doc.sizeId = req.body.sizeId;
        doc.price = req.body.price;
        doc.save(function (err, result) {
          if (err) {
            res.status(500).json({
              message: err.errmsg
            });
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        res.status(500).json({
          message: err.errmsg
        });
      }
    });
  }
}; // DELETE


exports.pricing_update = pricing_update;

var pricing_delete = function pricing_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _pricings.default.findOneAndRemove({
    pageId: pageId,
    id: req.params.id
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (err) {
    res.status(500).json({
      message: err.errmsg
    });
  });
};
/**
 * Delete all records from a pageID
 * @param {*} pageID
 */


exports.pricing_delete = pricing_delete;

var deleteManyPricings =
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
            return _pricings.default.deleteMany({
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

  return function deleteManyPricings(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.deleteManyPricings = deleteManyPricings;

var getPricingSizing =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, categoryID) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!categoryID) {
              _context3.next = 6;
              break;
            }

            _context3.next = 3;
            return _pricings.default.distinct('sizeId', {
              pageId: pageID,
              categoryId: categoryID
            }).exec();

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 6:
            _context3.next = 8;
            return _pricings.default.distinct('sizeId', {
              pageId: pageID
            }).exec();

          case 8:
            return _context3.abrupt("return", _context3.sent);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getPricingSizing(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getPricingSizing = getPricingSizing;

var getPricings =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = _pricings.default.find({
              pageId: pageID
            });
            _context4.next = 3;
            return query.exec();

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getPricings(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getPricings = getPricings;

var getOnePricing =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, categoryId, sizeID) {
    var query;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = _pricings.default.findOne({
              pageId: pageID,
              categoryId: categoryId,
              sizeId: sizeID
            });
            _context5.next = 3;
            return query.exec();

          case 3:
            return _context5.abrupt("return", _context5.sent);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getOnePricing(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getOnePricing = getOnePricing;

var getOnePricingByFlavor =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, sizeID, flavorID) {
    var flavor;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _flavorsController.getFlavor)(pageID, flavorID);

          case 2:
            flavor = _context6.sent;

            if (!flavor) {
              _context6.next = 9;
              break;
            }

            _context6.next = 6;
            return getOnePricing(pageID, flavor.categoryId, sizeID);

          case 6:
            return _context6.abrupt("return", _context6.sent);

          case 9:
            return _context6.abrupt("return", null);

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getOnePricingByFlavor(_x10, _x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getOnePricingByFlavor = getOnePricingByFlavor;

var getPricingsWithSize =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageID) {
    var query, pricings, sizes, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pricing, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, size;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            query = _pricings.default.find({
              pageId: pageID
            });
            query.sort('categoryId');
            _context7.next = 4;
            return query.exec();

          case 4:
            pricings = _context7.sent;
            _context7.next = 7;
            return (0, _sizesController.getSizes)(pageID);

          case 7:
            sizes = _context7.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context7.prev = 11;
            _iterator = pricings[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context7.next = 37;
              break;
            }

            pricing = _step.value;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context7.prev = 18;

            for (_iterator2 = sizes[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              size = _step2.value;

              if (size.id === pricing.sizeId) {
                pricing.size = size.size;
              }
            }

            _context7.next = 26;
            break;

          case 22:
            _context7.prev = 22;
            _context7.t0 = _context7["catch"](18);
            _didIteratorError2 = true;
            _iteratorError2 = _context7.t0;

          case 26:
            _context7.prev = 26;
            _context7.prev = 27;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 29:
            _context7.prev = 29;

            if (!_didIteratorError2) {
              _context7.next = 32;
              break;
            }

            throw _iteratorError2;

          case 32:
            return _context7.finish(29);

          case 33:
            return _context7.finish(26);

          case 34:
            _iteratorNormalCompletion = true;
            _context7.next = 13;
            break;

          case 37:
            _context7.next = 43;
            break;

          case 39:
            _context7.prev = 39;
            _context7.t1 = _context7["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context7.t1;

          case 43:
            _context7.prev = 43;
            _context7.prev = 44;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 46:
            _context7.prev = 46;

            if (!_didIteratorError) {
              _context7.next = 49;
              break;
            }

            throw _iteratorError;

          case 49:
            return _context7.finish(46);

          case 50:
            return _context7.finish(43);

          case 51:
            return _context7.abrupt("return", pricings);

          case 52:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[11, 39, 43, 51], [18, 22, 26, 34], [27,, 29, 33], [44,, 46, 50]]);
  }));

  return function getPricingsWithSize(_x13) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getPricingsWithSize = getPricingsWithSize;
//# sourceMappingURL=pricingsController.js.map