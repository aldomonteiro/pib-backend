"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlavorByName = exports.getFlavor = exports.getFlavors = exports.deleteManyFlavors = exports.flavor_delete = exports.flavor_update = exports.flavor_create = exports.flavor_get_one = exports.flavor_get_all = void 0;

var _flavors = _interopRequireDefault(require("../models/flavors"));

var _util = _interopRequireDefault(require("util"));

var _stringSimilarity = _interopRequireDefault(require("string-similarity"));

var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));

var _util2 = require("../util/util");

var _toppingsController = require("./toppingsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all flavors
// TODO: use filters in the query req.query
var flavor_get_all =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var sortObj, rangeObj, options, query;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Getting the sort from the requisition
            sortObj = (0, _util2.configSortQuery)(req.query.sort); // Getting the range from the requisition

            rangeObj = (0, _util2.configRangeQuery)(req.query.range);
            options = {
              offset: rangeObj['offset'],
              limit: rangeObj['limit'],
              sort: sortObj,
              lean: true,
              leanWithId: false
            };
            query = {};

            if (req.currentUser.activePage) {
              query = _flavors.default.find({
                pageId: req.currentUser.activePage
              });
            }

            _flavors.default.paginate(query, options,
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(err, result) {
                var i, tn, k;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!err) {
                          _context.next = 4;
                          break;
                        }

                        res.status(500).json({
                          message: err.errmsg
                        });
                        _context.next = 15;
                        break;

                      case 4:
                        res.setHeader('Content-Range', _util.default.format("flavors %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
                        i = 0;

                      case 6:
                        if (!(i < result.docs.length)) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 9;
                        return (0, _toppingsController.getToppings)(result.docs[i].toppings);

                      case 9:
                        tn = _context.sent;

                        for (k = 0; k < tn.length; k++) {
                          result.docs[i].tn = result.docs[i].tn ? result.docs[i].tn + ' ' + tn[k].topping : tn[k].topping;
                        }

                      case 11:
                        i++;
                        _context.next = 6;
                        break;

                      case 14:
                        res.status(200).json(result.docs);

                      case 15:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function flavor_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.flavor_get_all = flavor_get_all;

var flavor_get_one = function flavor_get_one(req, res) {
  if (req.params && req.params.id) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    _flavors.default.findOne({
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


exports.flavor_get_one = flavor_get_one;

var flavor_create = function flavor_create(req, res) {
  if (req.body) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
    var newRecord = new _flavors.default({
      id: req.body.id,
      flavor: (0, _stringCapitalizeName.default)(req.body.flavor),
      kind: req.body.kind,
      pageId: pageId,
      toppings: req.body.toppings
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


exports.flavor_create = flavor_create;

var flavor_update = function flavor_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _flavors.default.findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.flavor = (0, _stringCapitalizeName.default)(req.body.flavor);
        doc.kind = req.body.kind;
        doc.toppings = req.body.toppings;
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


exports.flavor_update = flavor_update;

var flavor_delete = function flavor_delete(req, res) {
  var pageId = req.currentUser.activePage;

  _flavors.default.findOneAndRemove({
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


exports.flavor_delete = flavor_delete;

var deleteManyFlavors =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _flavors.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function deleteManyFlavors(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.deleteManyFlavors = deleteManyFlavors;

var getFlavors =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    var queryFlavor;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            queryFlavor = _flavors.default.find({
              pageId: pageID
            });
            queryFlavor.sort('flavor');
            queryFlavor.select('id flavor kind toppings');
            _context4.next = 5;
            return queryFlavor.exec();

          case 5:
            return _context4.abrupt("return", _context4.sent);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getFlavors(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getFlavors = getFlavors;

var getFlavor =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, flavorID) {
    var queryFlavor;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            queryFlavor = _flavors.default.findOne({
              pageId: pageID,
              id: flavorID
            });
            queryFlavor.select('id flavor kind');
            _context5.next = 4;
            return queryFlavor.exec();

          case 4:
            return _context5.abrupt("return", _context5.sent);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getFlavor(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getFlavor = getFlavor;

var getFlavorByName =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, flavorName) {
    var flavors, flavorsNames, i, stringResult, key;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getFlavors(pageID);

          case 2:
            flavors = _context6.sent;
            flavorsNames = new Array();

            for (i = 0; i < flavors.length; i++) {
              flavorsNames.push(flavors[i].flavor);
            }

            stringResult = _stringSimilarity.default.findBestMatch(flavorName, flavorsNames);
            /* stringSimilarity searching for 'Escarola e bacon', result:
            { ratings:
                [ { target: 'Quatro queijos', rating: 0.09090909090909091 },
                  { target: 'Frango com Catupiry', rating: 0.16 },
                  { target: 'Escarola', rating: 0.7777777777777778 },
                  { target: 'Escarola com bacon', rating: 0.9166666666666666 } ],
               bestMatch: { target: 'Escarola com bacon', rating: 0.9166666666666666 } }
                */

            if (!(stringResult.bestMatch.rating > 0.6)) {
              _context6.next = 12;
              break;
            }

            key = flavorsNames.indexOf(stringResult.bestMatch.target);
            console.log(stringResult, flavorsNames, key, flavors);
            return _context6.abrupt("return", flavors[key]);

          case 12:
            return _context6.abrupt("return", null);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getFlavorByName(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getFlavorByName = getFlavorByName;
//# sourceMappingURL=flavorsController.js.map