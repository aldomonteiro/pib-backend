"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beverage_delete = exports.beverage_update = exports.beverage_create = exports.beverage_get_one = exports.beverage_get_all = void 0;

var _beverages = _interopRequireDefault(require("../models/beverages"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// List all records
// TODO: use filters in the query req.query
var beverage_get_all = function beverage_get_all(req, res) {
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
    query = _beverages.default.find({
      pageId: req.currentUser.activePage
    });
  }

  _beverages.default.paginate(query, options, function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      res.setHeader('Content-Range', _util.default.format("beverages %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
      res.status(200).json(result.docs);
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

exports.beverage_delete = beverage_delete;
//# sourceMappingURL=beveragesController.js.map