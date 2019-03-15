"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBeverage = exports.getBeverages = exports.deleteManyBeverages = exports.beverage_delete = exports.beverage_update = exports.beverage_create = exports.beverage_get_one = exports.beverage_get_all = void 0;

var _beverages = _interopRequireDefault(require("../models/beverages"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all records
var beverage_get_all = function beverage_get_all(req, res) {
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

  _beverages.default.find(queryObj).sort(sortObj).exec(function (err, result) {
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

      res.setHeader('Content-Range', _util.default.format('beverages %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
      res.status(200).json(responseArr);
    }
  });
}; // List one record by filtering by ID


exports.beverage_get_all = beverage_get_all;

var beverage_get_one = function beverage_get_one(req, res) {
  if (req.params && req.params.id) {
    // Filter based on the currentUser
    var pageId = req.currentUser.activePage;

    _beverages.default.findOne({
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


exports.beverage_get_one = beverage_get_one;

var beverage_create = function beverage_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _beverages.default({
      id: req.body.id,
      kind: req.body.kind,
      name: req.body.name,
      price: req.body.price,
      pageId: pageId
    });
    newRecord.save().then(function (result) {
      res.status(200).json(result);
    }).catch(function (err) {
      res.status(500).json({
        message: err.errmsg
      });
    });
  }
}; // UPDATE


exports.beverage_create = beverage_create;

var beverage_update = function beverage_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _beverages.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.kind = req.body.kind;
        doc.name = req.body.name;
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


exports.beverage_update = beverage_update;

var beverage_delete = function beverage_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _beverages.default.findOneAndRemove({
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


exports.beverage_delete = beverage_delete;

var deleteManyBeverages =
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
            return _beverages.default.deleteMany({
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

  return function deleteManyBeverages(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.deleteManyBeverages = deleteManyBeverages;

var getBeverages =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            query = _beverages.default.find({
              pageId: pageID
            });
            query.sort('name kind');
            _context2.next = 4;
            return query.exec();

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getBeverages(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getBeverages = getBeverages;

var getBeverage =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, beverageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = _beverages.default.findOne({
              pageId: pageID,
              id: beverageID
            }); // query.select('id name kind price');

            _context3.next = 3;
            return query.exec();

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getBeverage(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getBeverage = getBeverage;
//# sourceMappingURL=beveragesController.js.map