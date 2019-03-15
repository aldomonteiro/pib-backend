"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpeningTimes = exports.openingtimes_delete = exports.openingtimes_update = exports.openingtimes_create = exports.openingtimes_get_one = exports.openingtimes_get_all = void 0;

var _openingtimes = _interopRequireDefault(require("../models/openingtimes"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all records
// TODO: use filters in the query req.query
var openingtimes_get_all = function openingtimes_get_all(req, res) {
  console.log(">>>> openingtimesController openingtimes_get_all <<<<");
  console.log(req.query);
  console.log(">>>> openingtimesController openingtimes_get_all <<<<"); // Getting the sort from the requisition

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
    query = _openingtimes.default.find({
      pageId: req.currentUser.activePage
    });
  }

  _openingtimes.default.paginate(query, options, function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      res.setHeader('Content-Range', _util.default.format("openingtimes %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
      res.status(200).json(result.docs);
    }
  });
}; // List one record by filtering by ID


exports.openingtimes_get_all = openingtimes_get_all;

var openingtimes_get_one = function openingtimes_get_one(req, res) {
  if (req.params && req.params.id) {
    // Filter based on the currentUser
    var pageId = req.currentUser.activePage;

    _openingtimes.default.findOne({
      pageId: pageId,
      store_id: req.params.store_id
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


exports.openingtimes_get_one = openingtimes_get_one;

var openingtimes_create = function openingtimes_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _openingtimes.default({
      store_id: req.body.store_id,
      pageId: pageId,
      sun_open: req.body.sun_open,
      sun_close: req.body.sun_close,
      mon_open: req.body.mon_open,
      mon_close: req.body.mon_close,
      tue_open: req.body.tue_open,
      tue_close: req.body.tue_close,
      wed_open: req.body.tue_open,
      // wed_open
      wed_close: req.body.tue_close,
      // wed_close
      thu_open: req.body.tue_open,
      thu_close: req.body.tue_close,
      fri_open: req.body.tue_open,
      fri_close: req.body.tue_close,
      sat_open: req.body.tue_open,
      sat_close: req.body.tue_close,
      hol_open: req.body.tue_open,
      hol_close: req.body.tue_close
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


exports.openingtimes_create = openingtimes_create;

var openingtimes_update = function openingtimes_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _openingtimes.default.findOne({
      pageId: pageId,
      store_id: req.body.store_id
    }, function (err, doc) {
      if (!err) {
        doc.sun_open = req.body.sun_open;
        doc.sun_close = req.body.sun_close;
        doc.mon_open = req.body.mon_open;
        doc.mon_close = req.body.mon_close;
        doc.tue_open = req.body.tue_open;
        doc.tue_close = req.body.tue_close;
        doc.wed_open = req.body.tue_open; // wed_open

        doc.wed_close = req.body.tue_close; // wed_close

        doc.thu_open = req.body.tue_open;
        doc.thu_close = req.body.tue_close;
        doc.fri_open = req.body.tue_open;
        doc.fri_close = req.body.tue_close;
        doc.sat_open = req.body.tue_open;
        doc.sat_close = req.body.tue_close;
        doc.hol_open = req.body.tue_open;
        doc.hol_close = req.body.tue_close;
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


exports.openingtimes_update = openingtimes_update;

var openingtimes_delete = function openingtimes_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _openingtimes.default.findOneAndRemove({
    pageId: pageId,
    store_id: req.params.store_id
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (err) {
    res.status(500).json({
      message: err.errmsg
    });
  });
};

exports.openingtimes_delete = openingtimes_delete;

var getOpeningTimes =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // TODO: if is there more than one Store?
            query = _openingtimes.default.findOne({
              pageId: pageID
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
    }, _callee);
  }));

  return function getOpeningTimes(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getOpeningTimes = getOpeningTimes;
//# sourceMappingURL=openingTimesController.js.map