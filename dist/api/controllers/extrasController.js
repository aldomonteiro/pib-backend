"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extra_delete = exports.extra_update = exports.extra_create = exports.extra_get_one = exports.extra_get_all = void 0;

var _extras = _interopRequireDefault(require("../models/extras"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// List all records
// TODO: use filters in the query req.query
var extra_get_all = function extra_get_all(req, res) {
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
    query = _extras.default.find({
      pageId: req.currentUser.activePage
    });
  }

  _extras.default.paginate(query, options, function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      res.setHeader('Content-Range', _util.default.format("extras %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
      res.status(200).json(result.docs);
    }
  });
}; // List one record by filtering by ID


exports.extra_get_all = extra_get_all;

var extra_get_one = function extra_get_one(req, res) {
  if (req.params && req.params.id) {
    // Filter based on the currentUser
    var pageId = req.currentUser.activePage;

    _extras.default.findOne({
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


exports.extra_get_one = extra_get_one;

var extra_create = function extra_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _extras.default({
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


exports.extra_create = extra_create;

var extra_update = function extra_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _extras.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.kind = req.body.kind;
        doc.size = req.body.name;
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


exports.extra_update = extra_update;

var extra_delete = function extra_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _extras.default.findOneAndRemove({
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

exports.extra_delete = extra_delete;
//# sourceMappingURL=extrasController.js.map