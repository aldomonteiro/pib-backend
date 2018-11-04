"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getSizes = exports.size_delete = exports.size_update = exports.size_create = exports.size_get_one = exports.size_get_all = void 0;var _sizes = _interopRequireDefault(require("../models/sizes"));
var _util = _interopRequireDefault(require("util"));
var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));
var _util2 = require("../util/util");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

// List all sizes
// TODO: use filters in the query req.query
var size_get_all = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {var sortObj, rangeObj, options, queryObj, arr, query;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            // Getting the sort from the requisition
            sortObj = (0, _util2.configSortQuery)(req.query.sort);
            // Getting the range from the requisition
            rangeObj = (0, _util2.configRangeQuery)(req.query.range);

            options = {
              offset: rangeObj['offset'],
              limit: rangeObj['limit'],
              sort: sortObj,
              lean: true,
              leanWithId: false };


            queryObj = {};
            if (req.query.filter) {
              arr = JSON.parse(req.query.filter);
              queryObj[arr[0]] = arr[1];
            }
            if (req.currentUser.activePage) {
              queryObj["pageId"] = req.currentUser.activePage;
            }
            query = {};
            if (req.query.filter || req.currentUser.activePage) {
              query = _sizes.default.find(queryObj);
            }

            _sizes.default.paginate(query, options, /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, result) {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                        if (err) {
                          res.status(500).json({ message: err.errmsg });
                        } else {
                          res.setHeader('Content-Range', _util.default.format("sizes %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
                          res.status(200).json(result.docs);
                        }case 1:case "end":return _context.stop();}}}, _callee, this);}));return function (_x3, _x4) {return _ref2.apply(this, arguments);};}());case 9:case "end":return _context2.stop();}}}, _callee2, this);}));return function size_get_all(_x, _x2) {return _ref.apply(this, arguments);};}();



// List one record by filtering by ID
exports.size_get_all = size_get_all;var size_get_one = function size_get_one(req, res) {
  if (req.params && req.params.id) {

    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    _sizes.default.findOne({ pageId: pageId, id: req.params.id }, function (err, doc) {
      if (err) {
        res.status(500).json({ message: err.errMsg });
      } else
      {
        res.status(200).json(doc);
      }
    });
  }
};

// CREATE A NEW RECORD
exports.size_get_one = size_get_one;var size_create = function size_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    var newRecord = new _sizes.default({
      id: req.body.id,
      size: (0, _stringCapitalizeName.default)(req.body.size),
      slices: req.body.slices,
      split: req.body.split,
      pageId: pageId });


    newRecord.save().
    then(function (result) {
      res.status(200).json(result);
    }).
    catch(function (err) {
      res.status(500).json({ message: err.errmsg });
    });
  }
};

// UPDATE
exports.size_create = size_create;var size_update = function size_update(req, res) {
  if (req.body && req.body.id) {

    var pageId = req.currentUser.activePage;

    _sizes.default.findOne({ pageId: pageId, id: req.body.id }, function (err, doc) {
      if (!err) {
        doc.size = (0, _stringCapitalizeName.default)(req.body.size);
        doc.split = req.body.split;
        doc.slices = req.body.slices;
        doc.save(function (err, result) {
          if (err) {
            res.status(500).json({ message: err.errmsg });
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        res.status(500).json({ message: err.errmsg });
      }
    });
  }
};

// DELETE
exports.size_update = size_update;var size_delete = function size_delete(req, res) {

  var pageId = req.currentUser.activePage;

  _sizes.default.findOneAndRemove({ pageId: pageId, id: req.params.id }).
  then(function (result) {
    res.status(200).json(result);
  }).
  catch(function (err) {
    res.status(500).json({ message: err.errmsg });
  });
};exports.size_delete = size_delete;

var getSizes = function getSizes(pageID, sizeIdArray) {
  return _sizes.default.find({ pageId: pageID, id: sizeIdArray }).exec();
};exports.getSizes = getSizes;
//# sourceMappingURL=sizesController.js.map