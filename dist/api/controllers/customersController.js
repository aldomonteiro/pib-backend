"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatAddrData = exports.customer_update = exports.getAddressLocation = exports.getCustomerAddress = exports.checkCustomerAddress = exports.customer_get_one = exports.customer_get_all = void 0;

var _customers = _interopRequireDefault(require("../models/customers"));

var _axios = _interopRequireDefault(require("axios"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all customers
// TODO: use filters in the query req.query
var customer_get_all =
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
              query = _customers.default.find({
                pageId: req.currentUser.activePage
              });
            }

            _customers.default.paginate(query, options,
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(err, result) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (err) {
                          res.status(500).json({
                            message: err.errmsg
                          });
                        } else {
                          res.setHeader('Content-Range', _util.default.format("customers %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
                          res.status(200).json(result.docs);
                        }

                      case 1:
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

  return function customer_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.customer_get_all = customer_get_all;

var customer_get_one = function customer_get_one(req, res) {
  if (req.params && req.params.id) {
    var pageId = req.currentUser.activePage ? req.currentUser.activePage : null;

    _customers.default.findOne({
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
};

exports.customer_get_one = customer_get_one;

var checkCustomerAddress =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID, userID, location) {
    var addressData;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getCustomerAddress(pageID, userID);

          case 2:
            addressData = _context3.sent;

            if (!addressData) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", addressData);

          case 7:
            _context3.next = 9;
            return getAddressLocation(location);

          case 9:
            addressData = _context3.sent;

            if (!(addressData.status === 200)) {
              _context3.next = 14;
              break;
            }

            return _context3.abrupt("return", addressData);

          case 14:
            return _context3.abrupt("return", null);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function checkCustomerAddress(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

exports.checkCustomerAddress = checkCustomerAddress;

var getCustomerAddress =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID, userID) {
    var customer, addressData;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _customers.default.findOne({
              pageId: pageID,
              userId: userID
            }).exec();

          case 2:
            customer = _context4.sent;

            if (!customer) {
              _context4.next = 19;
              break;
            }

            if (!(customer.addr_formatted || customer.addr_street)) {
              _context4.next = 16;
              break;
            }

            addressData = {};
            addressData.formattedAddress = customer.addr_formatted;
            addressData.street = customer.addr_street;
            addressData.street_number = customer.addr_streetnumber;
            addressData.sublocality = customer.addr_sublocality;
            addressData.state = customer.addr_state;
            addressData.city = customer.addr_city;
            addressData.postal_code = customer.addr_postalcode;
            return _context4.abrupt("return", addressData);

          case 16:
            return _context4.abrupt("return", null);

          case 17:
            _context4.next = 20;
            break;

          case 19:
            return _context4.abrupt("return", null);

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getCustomerAddress(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getCustomerAddress = getCustomerAddress;

var getAddressLocation =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(location) {
    var arr, response, response2, response3, response4, response5;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            arr = [1, 2, 3, 4];
            arr = (0, _util2.shuffle)(arr); // select the apis randomically

            _context5.next = 4;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[0]]);

          case 4:
            response = _context5.sent;
            console.info({
              response: response
            });

            if (!(response.status === 200)) {
              _context5.next = 59;
              break;
            }

            if (!(response.data.error_message && response.data.status === 'OVER_QUERY_LIMIT')) {
              _context5.next = 56;
              break;
            }

            _context5.next = 10;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[1]]);

          case 10:
            response2 = _context5.sent;

            if (!(response2.status === 200)) {
              _context5.next = 53;
              break;
            }

            if (!(response2.data.error_message && response2.data.status === 'OVER_QUERY_LIMIT')) {
              _context5.next = 50;
              break;
            }

            _context5.next = 15;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[2]]);

          case 15:
            response3 = _context5.sent;

            if (!(response3.status === 200)) {
              _context5.next = 47;
              break;
            }

            if (!(response3.data.error_message && response3.data.status === 'OVER_QUERY_LIMIT')) {
              _context5.next = 44;
              break;
            }

            _context5.next = 20;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[3]]);

          case 20:
            response4 = _context5.sent;

            if (!(response4.status === 200)) {
              _context5.next = 41;
              break;
            }

            if (!(response4.data.error_message && response4.data.status === 'OVER_QUERY_LIMIT')) {
              _context5.next = 38;
              break;
            }

            _context5.next = 25;
            return googleMapsAPI(location, process.env.MY_GOOGLE_MAPS_APIKEY);

          case 25:
            response5 = _context5.sent;

            if (!(response5.status === 200)) {
              _context5.next = 35;
              break;
            }

            if (!(response5.data.error_message && response5.data.status === 'OVER_QUERY_LIMIT')) {
              _context5.next = 32;
              break;
            }

            console.error(response5.status, response5.statusText);
            return _context5.abrupt("return", null);

          case 32:
            return _context5.abrupt("return", response5.data.results);

          case 33:
            _context5.next = 36;
            break;

          case 35:
            return _context5.abrupt("return", null);

          case 36:
            _context5.next = 39;
            break;

          case 38:
            return _context5.abrupt("return", response4.data.results);

          case 39:
            _context5.next = 42;
            break;

          case 41:
            return _context5.abrupt("return", null);

          case 42:
            _context5.next = 45;
            break;

          case 44:
            return _context5.abrupt("return", response3.data.results);

          case 45:
            _context5.next = 48;
            break;

          case 47:
            return _context5.abrupt("return", null);

          case 48:
            _context5.next = 51;
            break;

          case 50:
            return _context5.abrupt("return", response2.data.results);

          case 51:
            _context5.next = 54;
            break;

          case 53:
            return _context5.abrupt("return", null);

          case 54:
            _context5.next = 57;
            break;

          case 56:
            return _context5.abrupt("return", response.data.results);

          case 57:
            _context5.next = 60;
            break;

          case 59:
            return _context5.abrupt("return", null);

          case 60:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getAddressLocation(_x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getAddressLocation = getAddressLocation;

var googleMapsAPI =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(location, API_KEY) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.info('using:' + API_KEY);
            _context6.next = 3;
            return _axios.default.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                'latlng': location.lat + ',' + location.long,
                'key': API_KEY
              }
            });

          case 3:
            return _context6.abrupt("return", _context6.sent);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function googleMapsAPI(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var customer_update =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(custData) {
    var customerID, customer, first_name, last_name, phone, profile_pic, location, addrData, updateDb, resultLastId, lastId, newRecord;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            customerID = 0;
            _context7.next = 3;
            return _customers.default.findOne({
              pageId: custData.pageId,
              userId: custData.userId
            }).exec();

          case 3:
            customer = _context7.sent;

            if (!(customer && customer.id)) {
              _context7.next = 17;
              break;
            }

            customerID = customer.id;
            first_name = custData.first_name, last_name = custData.last_name, phone = custData.phone, profile_pic = custData.profile_pic, location = custData.location, addrData = custData.addrData;
            updateDb = false;

            if (first_name || last_name || profile_pic) {
              customer.first_name = first_name;
              customer.last_name = last_name;
              customer.profile_pic = profile_pic;
              updateDb = true;
            }

            if (phone) {
              customer.phone = phone;
              updateDb = true;
            }

            if (location) {
              customer.location_lat = location.lat;
              customer.location_long = location.long;
              customer.location_url = location.url;
              updateDb = true;
            }

            if (addrData) {
              if (addrData.manual_address) customer.addr_manual = true;else customer.addr_manual = false;
              customer.addr_formatted = addrData.formattedAddress;
              customer.addr_street = addrData.street;
              customer.addr_sublocality = addrData.sublocality;
              customer.addr_streetnumber = addrData.street_number;
              customer.addr_state = addrData.state;
              customer.addr_city = addrData.city;
              customer.addr_postalcode = addrData.postal_code;
              updateDb = true;
            }

            if (!updateDb) {
              _context7.next = 15;
              break;
            }

            _context7.next = 15;
            return customer.save();

          case 15:
            _context7.next = 24;
            break;

          case 17:
            resultLastId = _customers.default.find({
              pageId: custData.pageId
            }).select('id').sort('-id').limit(1).exec();
            lastId = 0;
            if (resultLastId && resultLastId.length) lastId = resultLastId[0];
            newRecord = new _customers.default({
              id: lastId + 1,
              userId: custData.userId,
              pageId: custData.pageId,
              first_name: custData.first_name,
              last_name: custData.last_name,
              profile_pic: custData.profile_pic,
              email: custData.email,
              phone: custData.phone,
              addr_formatted: custData.addr ? custData.addr.formattedAddress : null,
              addr_street: custData.addr ? custData.addr.street : null,
              addr_sublocality: custData.addr ? custData.addr.sublocality : null,
              addr_streetnumber: custData.addr ? custData.addr.street_number : null,
              addr_state: custData.addr ? custData.addr.state : null,
              addr_city: custData.addr ? custData.addr.city : null,
              addr_postalcode: custData.addr ? custData.addr.postal_code : null,
              location_lat: custData.location ? custData.location.lat : null,
              location_long: custData.location ? custData.location.long : null,
              location_url: custData.location ? custData.location.url : null
            });
            _context7.next = 23;
            return newRecord.save();

          case 23:
            customerID = newRecord.id;

          case 24:
            return _context7.abrupt("return", customerID);

          case 25:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function customer_update(_x13) {
    return _ref7.apply(this, arguments);
  };
}();

exports.customer_update = customer_update;

var formatAddrData =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(addrData) {
    var formattedAddressData, addComps;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            formattedAddressData = {};
            formattedAddressData.formattedAddress = addrData.formatted_address;
            addComps = addrData.address_components;
            addComps.forEach(function (element) {
              element.types.forEach(function (type) {
                if (type === 'street_number') {
                  formattedAddressData.street_number = element.long_name;
                } else if (type === 'route') {
                  formattedAddressData.street = element.long_name;
                } else if (type === 'sublocality' || type === 'sublocality_level_1') {
                  formattedAddressData.sublocality = element.long_name;
                } else if (type === 'administrative_area_level_2') {
                  formattedAddressData.city = element.long_name;
                } else if (type === 'administrative_area_level_1') {
                  formattedAddressData.state = element.long_name;
                } else if (type === 'postal_code') {
                  formattedAddressData.postal_code = element.long_name;
                }
              });
            });
            return _context8.abrupt("return", formattedAddressData);

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function formatAddrData(_x14) {
    return _ref8.apply(this, arguments);
  };
}();

exports.formatAddrData = formatAddrData;
//# sourceMappingURL=customersController.js.map