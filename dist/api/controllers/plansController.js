"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plan_delete = exports.plan_update = exports.plan_create = exports.plan_get_one = exports.topping_get_all = void 0;

var _plans = _interopRequireDefault(require("../models/plans"));

var _util = _interopRequireDefault(require("util"));

var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all toppings
var topping_get_all =
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
            sortObj = req.query.sort ? (0, _util2.configSortQuery)(req.query.sort) : {
              plan: 'ASC'
            }; // Getting the range from the requisition

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

            _plans.default.find(queryObj).sort(sortObj).exec(function (err, result) {
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
                var plansArray = [];

                for (var _i = _rangeIni; _i < _rangeEnd; _i++) {
                  plansArray.push(result[_i]);
                }

                res.setHeader('Content-Range', _util.default.format('plans %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
                res.status(200).json(plansArray);
              }
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function topping_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.topping_get_all = topping_get_all;

var plan_get_one = function plan_get_one(req, res) {
  if (req.params && req.params.id) {
    _plans.default.findOne({
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


exports.plan_get_one = plan_get_one;

var plan_create = function plan_create(req, res) {
  if (req.body) {
    var newRecord = new _plans.default({
      id: req.body.id,
      plan: (0, _stringCapitalizeName.default)(req.body.plan),
      amount: req.body.amount,
      interval: req.body.interval,
      currency: req.body.currency
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
  }
}; // UPDATE


exports.plan_create = plan_create;

var plan_update = function plan_update(req, res) {
  _plans.default.findOne({
    id: req.body.id
  }, function (err, result) {
    if (!err) {
      result.plan = (0, _stringCapitalizeName.default)(req.body.plan);
      result.ammount = req.body.ammount;
      result.interval = req.body.interval;
      result.currency = req.body.currency;
      result.save(function (err, doc) {
        if (err) {
          res.status(500).json({
            message: err.errmsg
          });
        } else {
          res.status(200).json(doc);
        }
      });
    } else {
      res.status(500).json({
        message: err.errmsg
      });
    }
  });
}; // DELETE


exports.plan_update = plan_update;

var plan_delete = function plan_delete(req, res) {
  _plans.default.findOneAndRemove({
    id: req.params.id
  }).then(function (result) {
    res.status(200).json({
      id: result.id,
      plan: result.plan
    });
  }).catch(function (err) {
    res.status(500).json({
      message: err.errmsg
    });
  });
};

exports.plan_delete = plan_delete;
//# sourceMappingURL=plansController.js.map