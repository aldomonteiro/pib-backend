"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSizes = exports.getSize = exports.deleteManySizes = exports.size_delete = exports.size_update = exports.size_create = exports.size_get_one = exports.size_get_all = void 0;

var _sizes = _interopRequireDefault(require("../models/sizes"));

var _util = _interopRequireDefault(require("util"));

var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all sizes
// TODO: use filters in the query req.query
var size_get_all =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var sortObj, rangeObj, queryObj, filterObj, i, filter, value;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Getting the sort from the requisition
            sortObj = (0, _util2.configSortQuery)(req.query.sort); // Getting the range from the requisition

            rangeObj = (0, _util2.configRangeQuery)(req.query.range);
            queryObj = {};

            if (req.query.filter) {
              filterObj = (0, _util2.configFilterQueryMultiple)(req.query.filter);

              if (filterObj && filterObj.filterField && filterObj.filterField.length) {
                for (i = 0; i < filterObj.filterField.length; i++) {
                  filter = filterObj.filterField[i];
                  value = filterObj.filterValues[i];

                  if (Array.isArray(value)) {
                    queryObj[filter] = {
                      $in: value
                    };
                  } else queryObj[filter] = value;
                }
              }
            }

            if (req.currentUser.activePage) {
              queryObj["pageId"] = req.currentUser.activePage;
            }

            _sizes.default.find(queryObj).sort(sortObj).exec(function (err, result) {
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
                var sizesArray = new Array();

                for (var _i = _rangeIni; _i < _rangeEnd; _i++) {
                  sizesArray.push(result[_i]);
                }

                res.setHeader('Content-Range', _util.default.format("sizes %d-%d/%d", _rangeIni, _rangeEnd, _totalCount));
                res.status(200).json(sizesArray);
              }
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function size_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.size_get_all = size_get_all;

var size_get_one = function size_get_one(req, res) {
  if (req.params && req.params.id) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    _sizes.default.findOne({
      pageId: pageId,
      id: req.params.id
    }, function (err, doc) {
      if (err) {
        res.status(500).json({
          message: err.errMsg
        });
      } else {
        res.status(200).json(doc);
      }
    });
  }
}; // CREATE A NEW RECORD


exports.size_get_one = size_get_one;

var size_create = function size_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _sizes.default({
      id: req.body.id,
      size: (0, _stringCapitalizeName.default)(req.body.size),
      slices: req.body.slices,
      split: req.body.split,
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


exports.size_create = size_create;

var size_update = function size_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _sizes.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.size = (0, _stringCapitalizeName.default)(req.body.size);
        doc.split = req.body.split;
        doc.slices = req.body.slices;
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


exports.size_update = size_update;

var size_delete = function size_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _sizes.default.findOneAndRemove({
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


exports.size_delete = size_delete;

var deleteManySizes =
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
            return _sizes.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function deleteManySizes(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.deleteManySizes = deleteManySizes;

var getSize =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, sizeID) {
    var query;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = _sizes.default.findOne({
              pageId: pageID,
              id: sizeID
            });
            query.select('id size slices split');
            _context3.next = 4;
            return query.exec();

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getSize(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getSize = getSize;

var getSizes = function getSizes(pageID, sizeIdArray) {
  if (sizeIdArray && sizeIdArray.length > 0) return _sizes.default.find({
    pageId: pageID,
    id: sizeIdArray
  }).exec();else return _sizes.default.find({
    pageId: pageID
  }).exec();
};

exports.getSizes = getSizes;
//# sourceMappingURL=sizesController.js.map