"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToppingsNames = exports.getToppings = exports.topping_delete = exports.topping_update = exports.topping_create = exports.topping_get_one = exports.topping_get_all = void 0;

var _toppings = _interopRequireDefault(require("../models/toppings"));

var _util = _interopRequireDefault(require("util"));

var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all toppings
// TODO: use filters in the query req.query
var topping_get_all = function topping_get_all(req, res) {
  // Getting the sort from the requisition
  var sortObj = req.query.sort ? (0, _util2.configSortQuery)(req.query.sort) : {
    topping: 'ASC'
  };

  if (req.query.range) {
    var rangeObj = (0, _util2.configRangeQuery)(req.query.range);
    var options = {
      offset: rangeObj['offset'],
      limit: rangeObj['limit'],
      sort: sortObj,
      lean: true,
      leanWithId: false
    };

    _toppings.default.paginate({}, options, function (err, result) {
      if (err) {
        res.status(500).json({
          message: err.errmsg
        });
      } else {
        res.setHeader('Content-Range', _util.default.format("toppings %d-%d/%d", rangeObj['offset'] + 1, rangeObj['limit'], result.total));
        res.status(200).json(result.docs);
      }
    });
  } else {
    _toppings.default.find(function (err, result) {
      if (err) {
        res.status(500).json({
          message: err.errmsg
        });
      } else {
        res.setHeader('Content-Range', _util.default.format("toppings %d-%d/%d", 1, result.length - 1, result.length));
        res.status(200).json(result);
      }
    });
  }
}; // List one record by filtering by ID


exports.topping_get_all = topping_get_all;

var topping_get_one = function topping_get_one(req, res) {
  if (req.params && req.params.id) {
    _toppings.default.findOne({
      id: req.params.id
    }, function (err, doc) {
      if (err) {
        res.status(500).json({
          message: err.errmsg
        });
      } else {
        res.status(200).json({
          id: doc.id,
          topping: doc.topping
        });
      }
    });
  }
}; // CREATE A NEW RECORD


exports.topping_get_one = topping_get_one;

var topping_create = function topping_create(req, res) {
  if (req.body) {
    var newRecord = new _toppings.default({
      id: req.body.id,
      topping: (0, _stringCapitalizeName.default)(req.body.topping)
    });
    newRecord.save().then(function (result) {
      res.status(200).json({
        id: result.id,
        topping: result.topping
      });
    }).catch(function (err) {
      res.status(500).json({
        message: err.errmsg
      });
    });
  }
}; // UPDATE


exports.topping_create = topping_create;

var topping_update = function topping_update(req, res) {
  _toppings.default.findOne({
    id: req.body.id
  }, function (err, doc) {
    if (!err) {
      doc.topping = (0, _stringCapitalizeName.default)(req.body.topping);
      doc.save(function (err, doc) {
        if (err) {
          res.status(500).json({
            message: err.errmsg
          });
        } else {
          res.status(200).json({
            id: doc.id,
            topping: doc.topping
          });
        }
      });
    } else {
      res.status(500).json({
        message: err.errmsg
      });
    }
  });
}; // DELETE


exports.topping_update = topping_update;

var topping_delete = function topping_delete(req, res) {
  _toppings.default.findOneAndRemove({
    id: req.params.id
  }).then(function (result) {
    res.status(200).json({
      id: result.id,
      topping: result.topping
    });
  }).catch(function (err) {
    res.status(500).json({
      message: err.errmsg
    });
  });
};

exports.topping_delete = topping_delete;

var getToppings =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(toppingsArray) {
    var queryTopping;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            queryTopping = _toppings.default.find({
              id: {
                $in: toppingsArray
              }
            });
            queryTopping.sort('topping');
            queryTopping.select('topping');
            _context.next = 5;
            return queryTopping.exec();

          case 5:
            return _context.abrupt("return", _context.sent);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getToppings(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getToppings = getToppings;

var getToppingsNames =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(toppingsArray) {
    var toppingsModel, toppingsNamesArray, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, topObj;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getToppings(toppingsArray);

          case 2:
            toppingsModel = _context2.sent;
            toppingsNamesArray = new Array();
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 7;

            for (_iterator = toppingsModel[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              topObj = _step.value;
              toppingsNamesArray.push(topObj.topping);
            }

            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 15:
            _context2.prev = 15;
            _context2.prev = 16;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 18:
            _context2.prev = 18;

            if (!_didIteratorError) {
              _context2.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context2.finish(18);

          case 22:
            return _context2.finish(15);

          case 23:
            return _context2.abrupt("return", toppingsNamesArray);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));

  return function getToppingsNames(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getToppingsNames = getToppingsNames;
//# sourceMappingURL=toppingsController.js.map