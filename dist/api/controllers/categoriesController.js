"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategory = exports.getCategories = exports.deleteManyCategories = exports.category_delete = exports.category_update = exports.category_create = exports.category_get_one = exports.category_get_all = void 0;

var _categories = _interopRequireDefault(require("../models/categories"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all records
var category_get_all = function category_get_all(req, res) {
  // Getting the sort from the requisition
  var sortObj = req.query.sort ? (0, _util2.configSortQuery)(req.query.sort) : {
    name: 'ASC'
  }; // Getting the range from the requisition

  var rangeObj = (0, _util2.configRangeQuery)(req.query.range);
  var queryObj = {};

  if (req.query.filter) {
    var filterObj = (0, _util2.configFilterQueryMultiple)(req.query.filter);

    if (filterObj && filterObj.filterField && filterObj.filterField.length) {
      for (var i = 0; i < filterObj.filterField.length; i++) {
        var filter = filterObj.filterField[i];
        var value = filterObj.filterValues[i];

        if (Array.isArray(value)) {
          queryObj[filter] = {
            $in: value
          };
        } else queryObj[filter] = value;
      }
    }
  }

  if (req.currentUser.activePage) {
    queryObj['pageId'] = req.currentUser.activePage;
  }

  _categories["default"].find(queryObj).sort(sortObj).exec(function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      var _rangeIni = 0;
      var _rangeEnd = result.length;

      if (rangeObj) {
        _rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
        _rangeEnd = rangeObj.offset + rangeObj.limit <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
      }

      var _totalCount = result.length;
      var responseArr = [];

      for (var _i = _rangeIni; _i < _rangeEnd; _i++) {
        responseArr.push(result[_i]);
      }

      res.setHeader('Content-Range', _util["default"].format('categories %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
      res.status(200).json(responseArr);
    }
  });
}; // List one record by filtering by ID


exports.category_get_all = category_get_all;

var category_get_one = function category_get_one(req, res) {
  if (req.params && req.params.id) {
    // Filter based on the currentUser
    var pageId = req.currentUser.activePage;

    _categories["default"].findOne({
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


exports.category_get_one = category_get_one;

var category_create =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var pageID, id, lastId, newRecord;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.body) {
              _context.next = 11;
              break;
            }

            pageID = req.currentUser.activePage ? req.currentUser.activePage : null;
            id = req.body.id;

            if (!(!id || id === 0)) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return _categories["default"].find({
              pageId: pageID
            }).select('id').sort('-id').limit(1).exec();

          case 6:
            lastId = _context.sent;
            id = 1;
            if (lastId && lastId.length) id = lastId[0].id + 1;

          case 9:
            newRecord = new _categories["default"]({
              id: id,
              name: req.body.name,
              price_by_size: req.body.price_by_size,
              is_pizza: req.body.is_pizza,
              pageId: pageID
            });
            newRecord.save().then(function (result) {
              res.status(200).json(result);
            })["catch"](function (err) {
              res.status(500).json({
                message: err.errmsg
              });
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function category_create(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // UPDATE


exports.category_create = category_create;

var category_update = function category_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _categories["default"].findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.name = req.body.name;
        doc.price_by_size = req.body.price_by_size;
        doc.is_pizza = req.body.is_pizza;
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


exports.category_update = category_update;

var category_delete = function category_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _categories["default"].findOneAndRemove({
    pageId: pageId,
    id: req.params.id
  }).then(function (result) {
    res.status(200).json(result);
  })["catch"](function (err) {
    res.status(500).json({
      message: err.errmsg
    });
  });
};
/**
 * Delete all records from a pageID
 * @param {*} pageID
 */


exports.category_delete = category_delete;

var deleteManyCategories =
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
            return _categories["default"].deleteMany({
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

  return function deleteManyCategories(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.deleteManyCategories = deleteManyCategories;

var getCategories =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = _categories["default"].find({
              pageId: pageID
            });
            query.sort('id');
            _context3.next = 4;
            return query.exec();

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getCategories(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getCategories = getCategories;

var getCategory =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID, categoryID) {
    var query;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = _categories["default"].findOne({
              pageId: pageID,
              id: categoryID
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

  return function getCategory(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getCategory = getCategory;
//# sourceMappingURL=categoriesController.js.map