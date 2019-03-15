"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTodayOpeningTime = exports.getStoreByPhone = exports.getStoreData = exports.getStores = exports.store_delete = exports.deleteManyStores = exports.store_update = exports.store_create = exports.store_get_one = exports.store_get_all = void 0;

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
      delivery_fee: req.body.delivery_fee,
      location_lat: req.location_lat,
      location_long: req.location_long,
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
  console.info('store_update req.body:', req.body);

  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;
    var _req$body = req.body,
        id = _req$body.id,
        operation = _req$body.operation,
        deliveryTime = _req$body.deliveryTime,
        pickupTime = _req$body.pickupTime;

    if (operation) {
      _stores.default.findOne({
        pageId: pageId,
        id: id
      }, function (err, doc) {
        if (!err) {
          if (operation === 'UPDATE_DELIVERY_TIME' && deliveryTime) doc.delivery_time = deliveryTime;
          if (operation === 'UPDATE_PICKUP_TIME' && pickupTime) doc.pickup_time = pickupTime;
          doc.save(function (err, result) {
            if (err) {
              res.status(500).json({
                message: err.errmsg
              });
            } else {
              res.status(200).json(result);
            }
          });
        }
      });
    } else {
      _stores.default.findOne({
        pageId: pageId,
        id: id
      }, function (err, doc) {
        if (!err) {
          doc.name = req.body.name;
          doc.address = req.body.address;
          doc.city = req.body.city;
          doc.state = req.body.state;
          doc.phone = req.body.phone;
          doc.delivery_fee = req.body.delivery_fee;
          doc.location_lat = req.body.location_lat;
          doc.location_long = req.body.location_long; // Opening times

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
          doc.printer = req.body.printer;
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
  }
};
/**
 * Delete all records from a pageID
 * @param {*} pageID
 */


exports.store_update = store_update;

var deleteManyStores =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _stores.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function deleteManyStores(_x) {
    return _ref.apply(this, arguments);
  };
}(); // DELETE


exports.deleteManyStores = deleteManyStores;

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

var getStores =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(pageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // TODO: if is there more than one Store?
            query = _stores.default.find({
              pageId: pageID
            });
            _context2.next = 3;
            return query.exec();

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getStores(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getStores = getStores;

var getStoreData =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID) {
    var query;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // TODO: if is there more than one Store?
            query = _stores.default.findOne({
              pageId: pageID
            });
            _context3.next = 3;
            return query.exec();

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getStoreData(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Used by WhatsappController
 * @param {*} phone
 */


exports.getStoreData = getStoreData;

var getStoreByPhone =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(phone) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _stores.default.findOne({
              phone: phone
            }).exec();

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getStoreByPhone(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getStoreByPhone = getStoreByPhone;

var getTodayOpeningTime =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID) {
    var _store, _today, _tomorrow, todayOpenAt, todayCloseAt, tomorrowOpenAt, tomorrowCloseAt, todayIsOpen, tomorrowIsOpen, _openAtHours, _closeAtHours, _openAtHoursTom, _closeAtHoursTom;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getStoreData(pageID);

          case 2:
            _store = _context5.sent;
            _today = new Date();
            _tomorrow = new Date();
            _tomorrow.get;

            _tomorrow.setDate(_today.getDate() + 1);

            tomorrowCloseAt = '';
            tomorrowIsOpen = false;

            if (_today.getDay() === 1) {
              todayIsOpen = _store.sun_is_open;
              todayOpenAt = _store.sun_open;
              todayCloseAt = _store.sun_close;
              tomorrowIsOpen = _store.mon_is_open;
              tomorrowOpenAt = _store.mon_open;
              tomorrowCloseAt = _store.mon_close;
            } else if (_today.getDay() === 2) {
              todayIsOpen = _store.mon_is_open;
              todayOpenAt = _store.mon_open;
              todayCloseAt = _store.mon_close;
              tomorrowIsOpen = _store.tue_is_open;
              tomorrowOpenAt = _store.tue_open;
              tomorrowCloseAt = _store.tue_close;
            } else if (_today.getDay() === 3) {
              todayIsOpen = _store.tue_is_open;
              todayOpenAt = _store.tue_open;
              todayCloseAt = _store.tue_close;
              tomorrowIsOpen = _store.wed_is_open;
              tomorrowOpenAt = _store.wed_open;
              tomorrowCloseAt = _store.wed_close;
            } else if (_today.getDay() === 4) {
              todayIsOpen = _store.wed_is_open;
              todayOpenAt = _store.wed_open;
              todayCloseAt = _store.wed_close;
              tomorrowIsOpen = _store.thu_is_open;
              tomorrowOpenAt = _store.thu_open;
              tomorrowCloseAt = _store.thu_close;
            } else if (_today.getDay() === 5) {
              todayIsOpen = _store.thu_is_open;
              todayOpenAt = _store.thu_open;
              todayCloseAt = _store.thu_close;
              tomorrowIsOpen = _store.fri_is_open;
              tomorrowOpenAt = _store.fri_open;
              tomorrowCloseAt = _store.fri_close;
            } else if (_today.getDay() === 6) {
              todayIsOpen = _store.fri_is_open;
              todayOpenAt = _store.fri_open;
              todayCloseAt = _store.fri_close;
              tomorrowIsOpen = _store.sat_is_open;
              tomorrowOpenAt = _store.sat_open;
              tomorrowCloseAt = _store.sat_close;
            } else if (_today.getDay() === 7) {
              todayIsOpen = _store.sat_is_open;
              todayOpenAt = _store.sat_open;
              todayCloseAt = _store.sat_close;
              tomorrowIsOpen = _store.sun_is_open;
              tomorrowOpenAt = _store.sun_open;
              tomorrowCloseAt = _store.sun_close;
            }

            _openAtHours = new Date(todayOpenAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            _closeAtHours = new Date(todayCloseAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            _openAtHoursTom = new Date(tomorrowOpenAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            _closeAtHoursTom = new Date(tomorrowCloseAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            return _context5.abrupt("return", {
              todayIsOpen: todayIsOpen,
              todayOpenAt: _openAtHours,
              todayCloseAt: _closeAtHours,
              tomorrowIsOpen: tomorrowIsOpen,
              tomorrowOpenAt: _openAtHoursTom,
              tomorrowCloseAt: _closeAtHoursTom
            });

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getTodayOpeningTime(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getTodayOpeningTime = getTodayOpeningTime;
//# sourceMappingURL=storesController.js.map