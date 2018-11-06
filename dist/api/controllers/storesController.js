"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpeningTimes = exports.store_delete = exports.store_update = exports.store_create = exports.store_get_one = exports.store_get_all = void 0;

var _stores = _interopRequireDefault(require("../models/stores"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all records
// TODO: use filters in the query req.query
var store_get_all = function store_get_all(req, res) {
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
    query = _stores.default.find({
      pageId: req.currentUser.activePage
    });
  }

  _stores.default.paginate(query, options, function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      res.setHeader('Content-Range', _util.default.format("stores %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
      res.status(200).json(result.docs);
    }
  });
}; // List one record by filtering by ID


exports.store_get_all = store_get_all;

var store_get_one = function store_get_one(req, res) {
  if (req.params && req.params.id) {
    // Filter based on the currentUser
    var pageId = req.currentUser.activePage;

    _stores.default.findOne({
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


exports.store_get_one = store_get_one;

var store_create = function store_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _stores.default({
      id: req.body.id,
      pageId: pageId,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      phone: req.body.phone,
      sun_is_open: req.body.sun_is_open,
      sun_open: req.body.sun_open,
      sun_close: req.body.sun_close,
      mon_is_open: req.body.mon_is_open,
      mon_open: req.body.mon_open,
      mon_close: req.body.mon_close,
      tue_is_open: req.body.tue_is_open,
      tue_open: req.body.tue_open,
      tue_close: req.body.tue_close,
      wed_is_open: req.body.wed_is_open,
      wed_open: req.body.wed_open,
      wed_close: req.body.wed_close,
      thu_is_open: req.body.thu_is_open,
      thu_open: req.body.thu_open,
      thu_close: req.body.thu_close,
      fri_is_open: req.body.fri_is_open,
      fri_open: req.body.fri_open,
      fri_close: req.body.fri_close,
      sat_is_open: req.body.sat_is_open,
      sat_open: req.body.sat_open,
      sat_close: req.body.sat_close,
      hol_is_open: req.body.hol_is_open,
      hol_open: req.body.hol_open,
      hol_close: req.body.hol_close
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


exports.store_create = store_create;

var store_update = function store_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _stores.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.name = req.body.name;
        doc.address = req.body.address;
        doc.city = req.body.city;
        doc.state = req.body.state;
        doc.phone = req.body.phone; // Opening times

        doc.sun_is_open = req.body.sun_is_open;
        doc.sun_open = req.body.sun_open;
        doc.sun_close = req.body.sun_close;
        doc.mon_is_open = req.body.mon_is_open;
        doc.mon_open = req.body.mon_open;
        doc.mon_close = req.body.mon_close;
        doc.tue_is_open = req.body.tue_is_open;
        doc.tue_open = req.body.tue_open;
        doc.tue_close = req.body.tue_close;
        doc.wed_is_open = req.body.wed_is_open;
        doc.wed_open = req.body.wed_open;
        doc.wed_close = req.body.wed_close;
        doc.thu_is_open = req.body.thu_is_open;
        doc.thu_open = req.body.thu_open;
        doc.thu_close = req.body.thu_close;
        doc.fri_is_open = req.body.fri_is_open;
        doc.fri_open = req.body.fri_open;
        doc.fri_close = req.body.fri_close;
        doc.sat_is_open = req.body.sat_is_open;
        doc.sat_open = req.body.sat_open;
        doc.sat_close = req.body.sat_close;
        doc.hol_is_open = req.body.hol_is_open;
        doc.hol_open = req.body.hol_open;
        doc.hol_close = req.body.hol_close;
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


exports.store_update = store_update;

var store_delete = function store_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _stores.default.findOneAndRemove({
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

exports.store_delete = store_delete;

var getOpeningTimes =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    var query, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // TODO: if is there more than one Store?
            query = _stores.default.findOne({
              pageId: pageID
            });
            _context.next = 3;
            return query.exec();

          case 3:
            result = _context.sent;
            console.log(result);
            return _context.abrupt("return", result);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getOpeningTimes(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getOpeningTimes = getOpeningTimes;
//# sourceMappingURL=storesController.js.map