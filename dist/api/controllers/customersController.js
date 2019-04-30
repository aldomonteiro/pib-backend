"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyUserStopAuto = exports.formatAddrData = exports.updateCustomer = exports.getAddressLocation = exports.getCustomerAddress = exports.getCustomerById = exports.checkCustomerAddress = exports.deleteManyCustomers = exports.customer_update = exports.customer_get_one = exports.customer_get_all = void 0;

var _customers = _interopRequireDefault(require("../models/customers"));

var _axios = _interopRequireDefault(require("axios"));

var _util = _interopRequireDefault(require("util"));

var _stringCapitalizeName = _interopRequireDefault(require("string-capitalize-name"));

var _util2 = require("../util/util");

var _ordersController = require("./ordersController");

var _redisController = require("./redisController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all customers
var customer_get_all =
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
            try {
              // Getting the sort from the requisition
              sortObj = (0, _util2.configSortQuery)(req.query.sort); // Getting the range from the requisition

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

              if (req.currentUser.activePage) {
                queryObj["pageId"] = req.currentUser.activePage;
              }

              _customers["default"].find(queryObj).sort(sortObj).exec(function (err, result) {
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
                  var resultArray = new Array();

                  for (var _i = _rangeIni; _i < _rangeEnd; _i++) {
                    resultArray.push(result[_i]);
                  }

                  res.setHeader('Content-Range', _util["default"].format("customers %d-%d/%d", _rangeIni, _rangeEnd, _totalCount));
                  res.status(200).json(resultArray);
                }
              });
            } catch (customerGetAllErr) {
              console.error({
                customerGetAllErr: customerGetAllErr
              });
              res.status(500).json({
                message: err.message
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function customer_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.customer_get_all = customer_get_all;

var customer_get_one =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var pageId, customerId, queryParams, customer, _ref3, total_spent, nb_orders, first_order, last_order, jsonCustomer;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(req.params && req.params.id)) {
              _context2.next = 28;
              break;
            }

            _context2.prev = 1;
            pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
            customerId = req.params.id;
            queryParams = {};
            queryParams['id'] = customerId;

            if (pageId) {
              queryParams['pageId'] = pageId;
            }

            _context2.next = 9;
            return _customers["default"].findOne(queryParams).exec();

          case 9:
            customer = _context2.sent;

            if (!customer) {
              _context2.next = 22;
              break;
            }

            _context2.next = 13;
            return (0, _ordersController.getOrdersCustomerStat)({
              pageId: pageId,
              customerId: customerId
            });

          case 13:
            _ref3 = _context2.sent;
            total_spent = _ref3.total_spent;
            nb_orders = _ref3.nb_orders;
            first_order = _ref3.first_order;
            last_order = _ref3.last_order;
            jsonCustomer = {
              id: customer.id,
              pageId: customer.pageId,
              first_name: customer.first_name,
              last_name: customer.last_name,
              profile_pic: customer.profile_pic,
              phone: customer.phone,
              addr_formatted: customer.addr_formatted,
              addr_city: customer.addr_city,
              addr_postalcode: customer.addr_postalcode,
              createdAt: customer.createdAt,
              updatedAt: customer.updatedAt,
              total_spent: total_spent,
              nb_orders: nb_orders,
              first_order: first_order,
              last_order: last_order
            };
            res.status(200).json(jsonCustomer);
            _context2.next = 23;
            break;

          case 22:
            res.status(500).json({
              message: 'pos.customer.messages.no_customer_found'
            });

          case 23:
            _context2.next = 28;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](1);
            res.status(500).json({
              message: _context2.t0.message
            });

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 25]]);
  }));

  return function customer_get_one(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.customer_get_one = customer_get_one;

var customer_update = function customer_update(req, res) {
  if (req.body && req.body.id) {
    var pageId = req.currentUser.activePage;

    _customers["default"].findOne({
      pageId: pageId,
      id: req.body.id
    }, function (err, doc) {
      if (!err) {
        doc.first_name = (0, _stringCapitalizeName["default"])(req.body.first_name);
        doc.last_name = (0, _stringCapitalizeName["default"])(req.body.last_name);
        doc.addr_city = (0, _stringCapitalizeName["default"])(req.body.city);
        doc.addr_postalcode = req.body.addr_postalcode;
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
};
/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */


exports.customer_update = customer_update;

var deleteManyCustomers =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageID) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _customers["default"].deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function deleteManyCustomers(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

exports.deleteManyCustomers = deleteManyCustomers;

var checkCustomerAddress =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID, userID, location) {
    var addressData;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getCustomerAddress(pageID, userID);

          case 2:
            addressData = _context4.sent;

            if (!addressData) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", addressData);

          case 7:
            _context4.next = 9;
            return getAddressLocation(location);

          case 9:
            addressData = _context4.sent;

            if (!(addressData.status === 200)) {
              _context4.next = 14;
              break;
            }

            return _context4.abrupt("return", addressData);

          case 14:
            return _context4.abrupt("return", null);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function checkCustomerAddress(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.checkCustomerAddress = checkCustomerAddress;

var getCustomerById =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID, id) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _customers["default"].findOne({
              pageId: pageID,
              id: id
            }).exec();

          case 2:
            return _context5.abrupt("return", _context5.sent);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getCustomerById(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getCustomerById = getCustomerById;

var getCustomerAddress =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(pageID, userID) {
    var customer, addressData;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _customers["default"].findOne({
              pageId: pageID,
              userId: userID
            }).exec();

          case 2:
            customer = _context6.sent;

            if (!customer) {
              _context6.next = 21;
              break;
            }

            if (!(customer.addr_formatted || customer.addr_street)) {
              _context6.next = 18;
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
            addressData.location_lat = customer.location_lat;
            addressData.location_long = customer.location_long;
            return _context6.abrupt("return", addressData);

          case 18:
            return _context6.abrupt("return", null);

          case 19:
            _context6.next = 22;
            break;

          case 21:
            return _context6.abrupt("return", null);

          case 22:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getCustomerAddress(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getCustomerAddress = getCustomerAddress;

var getAddressLocation =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(location) {
    var arr, response, response2, response3, response4, response5;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            arr = [1, 2, 3, 4];
            arr = (0, _util2.shuffle)(arr); // select the apis randomically

            _context7.next = 4;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[0]]);

          case 4:
            response = _context7.sent;
            console.info({
              response: response
            });

            if (!(response.status === 200)) {
              _context7.next = 59;
              break;
            }

            if (!(response.data.error_message && response.data.status === 'OVER_QUERY_LIMIT')) {
              _context7.next = 56;
              break;
            }

            _context7.next = 10;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[1]]);

          case 10:
            response2 = _context7.sent;

            if (!(response2.status === 200)) {
              _context7.next = 53;
              break;
            }

            if (!(response2.data.error_message && response2.data.status === 'OVER_QUERY_LIMIT')) {
              _context7.next = 50;
              break;
            }

            _context7.next = 15;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[2]]);

          case 15:
            response3 = _context7.sent;

            if (!(response3.status === 200)) {
              _context7.next = 47;
              break;
            }

            if (!(response3.data.error_message && response3.data.status === 'OVER_QUERY_LIMIT')) {
              _context7.next = 44;
              break;
            }

            _context7.next = 20;
            return googleMapsAPI(location, process.env['GOOGLE_MAPS_APIKEY' + arr[3]]);

          case 20:
            response4 = _context7.sent;

            if (!(response4.status === 200)) {
              _context7.next = 41;
              break;
            }

            if (!(response4.data.error_message && response4.data.status === 'OVER_QUERY_LIMIT')) {
              _context7.next = 38;
              break;
            }

            _context7.next = 25;
            return googleMapsAPI(location, process.env.MY_GOOGLE_MAPS_APIKEY);

          case 25:
            response5 = _context7.sent;

            if (!(response5.status === 200)) {
              _context7.next = 35;
              break;
            }

            if (!(response5.data.error_message && response5.data.status === 'OVER_QUERY_LIMIT')) {
              _context7.next = 32;
              break;
            }

            console.error(response5.status, response5.statusText);
            return _context7.abrupt("return", null);

          case 32:
            return _context7.abrupt("return", response5.data.results);

          case 33:
            _context7.next = 36;
            break;

          case 35:
            return _context7.abrupt("return", null);

          case 36:
            _context7.next = 39;
            break;

          case 38:
            return _context7.abrupt("return", response4.data.results);

          case 39:
            _context7.next = 42;
            break;

          case 41:
            return _context7.abrupt("return", null);

          case 42:
            _context7.next = 45;
            break;

          case 44:
            return _context7.abrupt("return", response3.data.results);

          case 45:
            _context7.next = 48;
            break;

          case 47:
            return _context7.abrupt("return", null);

          case 48:
            _context7.next = 51;
            break;

          case 50:
            return _context7.abrupt("return", response2.data.results);

          case 51:
            _context7.next = 54;
            break;

          case 53:
            return _context7.abrupt("return", null);

          case 54:
            _context7.next = 57;
            break;

          case 56:
            return _context7.abrupt("return", response.data.results);

          case 57:
            _context7.next = 60;
            break;

          case 59:
            return _context7.abrupt("return", null);

          case 60:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getAddressLocation(_x13) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getAddressLocation = getAddressLocation;

var googleMapsAPI =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(location, API_KEY) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.info('using:' + API_KEY);
            _context8.next = 3;
            return _axios["default"].get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                latlng: location.lat + ',' + location["long"],
                key: API_KEY
              }
            });

          case 3:
            return _context8.abrupt("return", _context8.sent);

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function googleMapsAPI(_x14, _x15) {
    return _ref9.apply(this, arguments);
  };
}();

var updateCustomer =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(custData) {
    var customer, first_name, last_name, phone, profile_pic, location, addrData, updateDb, resultLastId, lastId, newRecord;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _customers["default"].findOne({
              pageId: custData.pageId,
              userId: custData.userId
            }).exec();

          case 2:
            customer = _context9.sent;

            if (!(customer && customer.id)) {
              _context9.next = 16;
              break;
            }

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
              customer.location_long = location["long"];
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
              _context9.next = 13;
              break;
            }

            _context9.next = 13;
            return customer.save();

          case 13:
            return _context9.abrupt("return", customer);

          case 16:
            _context9.next = 18;
            return _customers["default"].find({
              pageId: custData.pageId
            }).select('id').sort('-id').limit(1).exec();

          case 18:
            resultLastId = _context9.sent;
            lastId = 1;
            if (resultLastId && resultLastId.length) lastId = resultLastId[0].id + 1;
            newRecord = new _customers["default"]({
              id: lastId,
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
              location_long: custData.location ? custData.location["long"] : null,
              location_url: custData.location ? custData.location.url : null
            });
            _context9.next = 24;
            return newRecord.save();

          case 24:
            return _context9.abrupt("return", newRecord);

          case 25:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function updateCustomer(_x16) {
    return _ref10.apply(this, arguments);
  };
}();

exports.updateCustomer = updateCustomer;

var formatAddrData =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(addrData) {
    var formattedAddressData, addComps;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
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
            return _context10.abrupt("return", formattedAddressData);

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function formatAddrData(_x17) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Using Redis, communicate with server-webapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} user
 */


exports.formatAddrData = formatAddrData;

var notifyUserStopAuto =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(pageId, userId, user) {
    var formattedUserId, data;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            try {
              formattedUserId = userId.indexOf('@') > -1 ? userId.split('@')[0] : userId;
              data = {
                id: formattedUserId,
                first_name: user.first_name
              };
              (0, _redisController.emitEvent)(pageId, 'talk-to-human', data);
            } catch (error) {
              console.error(error);
            }

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function notifyUserStopAuto(_x18, _x19, _x20) {
    return _ref12.apply(this, arguments);
  };
}();

exports.notifyUserStopAuto = notifyUserStopAuto;
//# sourceMappingURL=customersController.js.map