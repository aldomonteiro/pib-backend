"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPricingSizing = exports.pricing_delete = exports.pricing_update = exports.pricing_create = exports.pricing_get_one = exports.pricing_get_all = void 0;

var _pricings = _interopRequireDefault(require("../models/pricings"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

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
      res.setHeader('Content-Range', _util.default.format("pricings %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
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

var pricing_create = function pricing_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _pricings.default({
      id: req.body.id,
      kind: req.body.kind,
      sizeId: req.body.sizeId,
      price: req.body.price,
      // TODO: how to handle float?
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


exports.pricing_create = pricing_create;

var pricing_update = function pricing_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _pricings.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.kind = req.body.kind;
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

exports.pricing_delete = pricing_delete;

var getPricingSizing =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageId) {
    var query;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = _pricings.default.distinct('sizeId', {
              pageId: pageId
            });
            _context.next = 3;
            return query.exec();

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getPricingSizing(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getPricingSizing = getPricingSizing;
//# sourceMappingURL=pricingsController.js.map