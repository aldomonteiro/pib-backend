"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendPassThreadControl = exports.getAllPages = exports.getOnePageData = exports.getOnePageToken = exports.debugToken = exports.unsubscribedApps = exports.subscribedApps = exports.page_update = exports.page_resources_delete = exports.page_resources_get_one = exports.page_resources_get_all = void 0;

var _pages = _interopRequireDefault(require("../models/pages"));

var _users = _interopRequireDefault(require("../models/users"));

var _axios = _interopRequireDefault(require("axios"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

var _systemController = require("./systemController");

var _flavorsController = require("./flavorsController");

var _categoriesController = require("./categoriesController");

var _customersController = require("./customersController");

var _extrasController = require("./extrasController");

var _itemsController = require("./itemsController");

var _ordersController = require("./ordersController");

var _pricingsController = require("./pricingsController");

var _sizesController = require("./sizesController");

var _toppingsController = require("./toppingsController");

var _storesController = require("./storesController");

var _usersController = require("./usersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all flavors
// TODO: use filters in the query req.query
var page_resources_get_all =
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
            // Getting the sort from the requisition
            sortObj = req.query.sort ? (0, _util2.configSortQuery)(req.query.sort) : {
              name: 'ASC'
            }; // Getting the range from the requisition

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
              if (req.currentUser.role !== 'admin') queryObj['id'] = req.currentUser.activePage;
            }

            _pages["default"].find(queryObj).sort(sortObj).exec(function (err, result) {
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
                var resultArray = [];

                for (var _i = _rangeIni; _i < _rangeEnd; _i++) {
                  resultArray.push(result[_i]);
                }

                res.setHeader('Content-Range', _util["default"].format('pages %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
                res.status(200).json(resultArray);
              }
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function page_resources_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.page_resources_get_all = page_resources_get_all;

var page_resources_get_one = function page_resources_get_one(req, res) {
  if (req.params && req.params.id) {
    _pages["default"].findOne({
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
/**
 * Deactivate Bot and delete all related records
 * @param {*} req 
 * @param {*} res 
 */


exports.page_resources_get_one = page_resources_get_one;

var page_resources_delete =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var lastResult, pageID, _ref3, accessToken;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            console.info('page_resources_delete:', req.params);
            pageID = req.params.id;
            _context2.next = 5;
            return getOnePageToken(pageID);

          case 5:
            _ref3 = _context2.sent;
            accessToken = _ref3.accessToken;
            _context2.next = 9;
            return deleteFacebookFields(pageID, accessToken);

          case 9:
            lastResult = _context2.sent;
            _context2.next = 12;
            return (0, _itemsController.deleteManyItems)(pageID);

          case 12:
            lastResult = _context2.sent;
            _context2.next = 15;
            return (0, _ordersController.deleteManyOrders)(pageID);

          case 15:
            lastResult = _context2.sent;
            _context2.next = 18;
            return (0, _customersController.deleteManyCustomers)(pageID);

          case 18:
            lastResult = _context2.sent;
            _context2.next = 21;
            return (0, _extrasController.deleteManyExtras)(pageID);

          case 21:
            lastResult = _context2.sent;
            _context2.next = 24;
            return (0, _flavorsController.deleteManyFlavors)(pageID);

          case 24:
            lastResult = _context2.sent;
            _context2.next = 27;
            return (0, _pricingsController.deleteManyPricings)(pageID);

          case 27:
            lastResult = _context2.sent;
            _context2.next = 30;
            return (0, _sizesController.deleteManySizes)(pageID);

          case 30:
            lastResult = _context2.sent;
            _context2.next = 33;
            return (0, _storesController.deleteManyStores)(pageID);

          case 33:
            lastResult = _context2.sent;
            _context2.next = 36;
            return (0, _toppingsController.deleteManyToppings)(pageID);

          case 36:
            lastResult = _context2.sent;
            _context2.next = 39;
            return (0, _categoriesController.deleteManyCategories)(pageID);

          case 39:
            lastResult = _context2.sent;
            _context2.next = 42;
            return unsubscribedApps(pageID, accessToken);

          case 42:
            lastResult = _context2.sent;
            _context2.next = 45;
            return (0, _usersController.removeUserActivePage)(req.currentUser.userID);

          case 45:
            lastResult = _context2.sent;

            if (!lastResult) {
              console.error("User ".concat(userID, " was not found and removeUserActivePage failed"));
            }

            _context2.next = 49;
            return _pages["default"].findOneAndDelete({
              id: pageID
            }).exec();

          case 49:
            lastResult = _context2.sent;
            res.status(200).json(lastResult);
            _context2.next = 58;
            break;

          case 53:
            _context2.prev = 53;
            _context2.t0 = _context2["catch"](0);
            console.info(lastResult);
            console.error(_context2.t0);
            res.status(500).json({
              message: _context2.t0.message
            });

          case 58:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 53]]);
  }));

  return function page_resources_delete(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); // Update or create a new page


exports.page_resources_delete = page_resources_delete;

var page_update =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var pageID, _req$body, operation, picture, pictureUrl, page, isNew, user;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            pageID = req.body.id;
            _req$body = req.body, operation = _req$body.operation, picture = _req$body.picture;
            pictureUrl = picture ? picture.pictureUrl : null;
            _context3.next = 6;
            return _pages["default"].findOne({
              id: pageID
            }).exec();

          case 6:
            page = _context3.sent;

            if (!(page && operation === 'ACTIVATE')) {
              _context3.next = 18;
              break;
            }

            _context3.next = 10;
            return setFacebookFields(pageID, page.accessToken, page.greetingText);

          case 10:
            _context3.next = 12;
            return subscribedApps(pageID, page.accessToken);

          case 12:
            page.activeBot = true;
            _context3.next = 15;
            return page.save();

          case 15:
            res.status(200).json(page);
            _context3.next = 51;
            break;

          case 18:
            if (!(page && operation === 'DEACTIVATE')) {
              _context3.next = 29;
              break;
            }

            _context3.next = 21;
            return deleteFacebookFields(pageID, page.accessToken);

          case 21:
            _context3.next = 23;
            return unsubscribedApps(pageID, page.accessToken);

          case 23:
            page.activeBot = false;
            _context3.next = 26;
            return page.save();

          case 26:
            res.status(200).json(page);
            _context3.next = 51;
            break;

          case 29:
            isNew = false;

            if (!page) {
              page = new _pages["default"]({
                id: pageID,
                name: req.body.name,
                userID: req.currentUser.userID,
                activeBot: false,
                pictureUrl: pictureUrl
              });
              isNew = true;
            }

            if (req.body.access_token) page.accessToken = req.body.access_token;
            if (req.body.greetingText) page.greetingText = req.body.greetingText;
            if (req.body.firstResponseText) page.firstResponseText = req.body.firstResponseText;
            if (req.body.orderExample) page.orderExample = req.body.orderExample;
            if (pictureUrl) page.pictureUrl = pictureUrl; // update ActivePage for the current user

            if (!req.currentUser) {
              _context3.next = 45;
              break;
            }

            page.userID = req.currentUser.userID;
            _context3.next = 40;
            return _users["default"].findOne({
              userID: req.currentUser.userID
            }).exec();

          case 40:
            user = _context3.sent;

            if (!user) {
              _context3.next = 45;
              break;
            }

            user.activePage = pageID;
            _context3.next = 45;
            return user.save();

          case 45:
            _context3.next = 47;
            return page.save();

          case 47:
            _context3.next = 49;
            return (0, _systemController.initialSetup)(pageID);

          case 49:
            page = _context3.sent;
            // }
            res.status(200).json(page);

          case 51:
            _context3.next = 57;
            break;

          case 53:
            _context3.prev = 53;
            _context3.t0 = _context3["catch"](0);
            console.error({
              pageUpdateError: _context3.t0
            });
            res.status(500).json({
              message: _context3.t0.message
            });

          case 57:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 53]]);
  }));

  return function page_update(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Subscribe the app to the page
 * @param {*} pageId 
 * @param {*} accessToken 
 */


exports.page_update = page_update;

var subscribedApps =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageId, accessToken) {
    var facebookUrl;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // https://graph.facebook.com/v3.1/{page-id}/subscribed_apps?access_token={}
            facebookUrl = "https://graph.facebook.com/v3.1/".concat(pageId, "/subscribed_apps?access_token=").concat(accessToken);
            _context4.next = 3;
            return _axios["default"].post(facebookUrl);

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function subscribedApps(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} pageId 
 * @param {*} accessToken 
 */


exports.subscribedApps = subscribedApps;

var unsubscribedApps =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageId, accessToken) {
    var facebookUrl, result, result1;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            facebookUrl = "https://graph.facebook.com/v3.1/".concat(pageId, "/subscribed_apps?access_token=").concat(accessToken);
            _context5.next = 3;
            return _axios["default"].get(facebookUrl);

          case 3:
            result = _context5.sent;

            if (!(result.status === 200 && result.data && result.data.data && result.data.data.length > 0)) {
              _context5.next = 13;
              break;
            }

            console.info('unsubscribedApps found app:', result);
            _context5.next = 8;
            return _axios["default"]["delete"](facebookUrl);

          case 8:
            result1 = _context5.sent;
            console.info('unsubscribedApps deleted app:', result1);
            return _context5.abrupt("return", result1);

          case 13:
            return _context5.abrupt("return", null);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function unsubscribedApps(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

exports.unsubscribedApps = unsubscribedApps;

var debugToken =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(accessToken) {
    var facebookUrl;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            facebookUrl = "https://graph.facebook.com/v3.1/debug_token?input_token=".concat(accessToken);
            _context6.next = 3;
            return _axios["default"].get(facebookUrl);

          case 3:
            return _context6.abrupt("return", _context6.sent);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function debugToken(_x11) {
    return _ref7.apply(this, arguments);
  };
}(); // used in botController.js


exports.debugToken = debugToken;

var getOnePageToken =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageID) {
    var page;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _pages["default"].findOne({
              id: pageID
            }).exec();

          case 2:
            page = _context7.sent;

            if (!(page && page.accessToken)) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt("return", Promise.resolve({
              accessToken: page.accessToken,
              name: page.name,
              marketing: page.marketing
            }));

          case 7:
            return _context7.abrupt("return", Promise.reject());

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getOnePageToken(_x12) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} pageID 
 * @return Page
 */


exports.getOnePageToken = getOnePageToken;

var getOnePageData =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(pageID) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _pages["default"].findOne({
              id: pageID
            }).exec();

          case 2:
            return _context8.abrupt("return", _context8.sent);

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getOnePageData(_x13) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getOnePageData = getOnePageData;

var getAllPages =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var pageArray;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            pageArray = [];
            _context9.next = 3;
            return _pages["default"].find({}, function (err, result) {
              pageArray = result.map(function (doc) {
                return {
                  'pageID': doc.id,
                  'accessToken': doc.accessToken,
                  'name': doc.name
                };
              });
            });

          case 3:
            console.log('into getAllPages: ', Object.keys(pageArray).length);
            return _context9.abrupt("return", Promise.resolve(pageArray));

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function getAllPages() {
    return _ref10.apply(this, arguments);
  };
}();

exports.getAllPages = getAllPages;

var setFacebookFields =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(pageId, accessToken, _greeting) {
    var facebookUrl;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            facebookUrl = "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=".concat(accessToken);
            _context10.next = 3;
            return _axios["default"].post(facebookUrl, {
              headers: {
                'Content-Type': 'application/json'
              },
              get_started: {
                payload: 'GET_STARTED'
              },
              greeting: [{
                locale: 'default',
                text: _greeting
              }, {
                locale: 'pt_BR',
                text: _greeting
              }, {
                locale: 'en_US',
                text: _greeting
              }],
              persistent_menu: [{
                locale: 'default',
                composer_input_disabled: false,
                call_to_actions: [{
                  title: '❓ Informações',
                  type: 'nested',
                  call_to_actions: [{
                    title: '🍕 Cardápio',
                    type: 'postback',
                    payload: JSON.stringify({
                      data: 'CARDAPIO_PAYLOAD',
                      event: 'MAIN-MENU'
                    })
                  }, {
                    title: '🕒 Horários',
                    type: 'postback',
                    payload: JSON.stringify({
                      data: 'HORARIO_PAYLOAD',
                      event: 'MAIN-MENU'
                    })
                  }]
                }, {
                  title: '📨 Fazer Pedido',
                  type: 'postback',
                  payload: JSON.stringify({
                    data: 'PEDIDO_PAYLOAD',
                    event: 'MAIN-MENU'
                  })
                }, {
                  type: 'web_url',
                  title: 'Powered by Pizzaibot',
                  url: 'm.me/pizzaibot',
                  webview_height_ratio: 'full'
                }]
              }]
            });

          case 3:
            return _context10.abrupt("return", _context10.sent);

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function setFacebookFields(_x14, _x15, _x16) {
    return _ref11.apply(this, arguments);
  };
}();

var deleteFacebookFields =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(pageId, accessToken) {
    var facebookUrl, result, result1;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            facebookUrl = "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=".concat(accessToken);
            _context11.next = 3;
            return _axios["default"].get(facebookUrl, {
              headers: {
                'Content-Type': 'application/json'
              },
              fields: ['get_started', 'persistent_menu', 'greeting']
            });

          case 3:
            result = _context11.sent;

            if (!(result.status === 200 && result.data && result.data.data && result.data.data.length > 0)) {
              _context11.next = 13;
              break;
            }

            console.info('deleteFacebookFields found fields:', result);
            _context11.next = 8;
            return _axios["default"]["delete"](facebookUrl, {
              headers: {
                'Content-Type': 'application/json'
              },
              params: {
                fields: ['get_started', 'persistent_menu', 'greeting']
              }
            });

          case 8:
            result1 = _context11.sent;
            console.info('deleteFacebookFields deleted fields:', result1);
            return _context11.abrupt("return", result1);

          case 13:
            console.info('deleteFacebookFields did not found fields:', result);
            return _context11.abrupt("return", null);

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function deleteFacebookFields(_x17, _x18) {
    return _ref12.apply(this, arguments);
  };
}();

var sendPassThreadControl =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(pageID, userID, source) {
    var page, facebookUrl, result;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (!(source === 'whatsapp')) {
              _context12.next = 3;
              break;
            }

            _context12.next = 18;
            break;

          case 3:
            _context12.next = 5;
            return getOnePageData(pageID);

          case 5:
            page = _context12.sent;
            facebookUrl = "https://graph.facebook.com/v2.6/me/pass_thread_control?access_token=".concat(page.accessToken);
            _context12.prev = 7;
            _context12.next = 10;
            return _axios["default"].post(facebookUrl, {
              headers: {
                'Content-Type': 'application/json'
              },
              recipient: {
                id: userID
              },
              target_app_id: '263902037430900',
              metadata: 'pass thread control to inbox'
            });

          case 10:
            result = _context12.sent;
            return _context12.abrupt("return", result.status);

          case 14:
            _context12.prev = 14;
            _context12.t0 = _context12["catch"](7);
            console.error({
              passThreadError: _context12.t0
            });
            return _context12.abrupt("return", null);

          case 18:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[7, 14]]);
  }));

  return function sendPassThreadControl(_x19, _x20, _x21) {
    return _ref13.apply(this, arguments);
  };
}(); // export const page_update = async (req, res) => {
//     console.info("page_update");
//     const pageId = req.body.id;
//     const record = await Page.findOne({ id: pageId }).exec();
//     if (!record) {
//         record = new Page({
//             id: pageId,
//             name: req.body.name,
//             accessToken: req.body.access_token,
//             userID: req.currentUser.userID,
//         });
//         isNew = true;
//     }
//     // Find a page by id
//     await Page.findOne({ id: pageId }, async (err, doc) => {
//         if (err) { // err !== null
//             res.status(500).json({ message: err.errmsg });
//             return;
//         }
//         let record;
//         let isNew = false;
//         if (doc) {
//             record = doc;
//             if (req.body.greetingText)
//                 record.greetingText = req.body.greetingText;
//             if (req.body.firstResponseText)
//                 record.firstResponseText = req.body.firstResponseText;
//             if (req.body.access_token)
//                 record.accessToken = req.body.access_token;
//             record.userID = req.currentUser.userID;
//         } else {
//             record = new Page({
//                 id: pageId,
//                 name: req.body.name,
//                 accessToken: req.body.access_token,
//                 userID: req.currentUser.userID,
//             });
//             isNew = true;
//         }
//         await record.save();
//         const response = await subscribedApps(record.id, record.accessToken);
//         // await record.save((err, result) => {
//         //     if (err) {
//         //         res.status(500).json({ message: err.errmsg });
//         //     } else {
//         //         subscribedApps(result.id, result.accessToken)
//         //             .then(response => {
//         //                 res.status(200).json(result);
//         //             }).catch((err) => {
//         //                 var errorMessage;
//         //                 if (err.error) errorMessage = err.error;
//         //                 if (err.response.data)
//         //                     if (err.response.data.error)
//         //                         errorMessage = err.response.data.error.message;
//         //                 console.log(`subscribed_apps catch err: ${errorMessage}`);
//         //                 res.status(500).json({ message: errorMessage });
//         //             });
//         //     }
//     });
//     // update ActivePage for the current user
//     if (req.currentUser) {
//         await User.findOne({ userID: req.currentUser.userID }, (err, docFind) => {
//             if (err) {
//                 res.status(500).json({ message: err.errmsg });
//                 return;
//             }
//             if (docFind) {
//                 docFind.activePage = pageId;
//                 docFind.save((err, docSave) => {
//                     if (err) {
//                         res.status(500).json({ message: err.errmsg });
//                     }
//                 })
//             }
//         });
//     }
//     if (isNew) {
//         record = await initialSetup(pageId);
//         req.body.greetingText = record.greetingText
//     }
//     if (req.body.greetingText && record && record.accessToken) {
//         setFacebookFields(record.id, record.accessToken, req.body.greetingText).then(response => {
//             console.log('PagesController, response from set fields:', response.result);
//         }).catch(err => {
//             if (err.response && err.response.data && err.response.data.error)
//                 console.log(`PagesController, error from set fields: ${err.response.data.error.message}`);
//             else if (err.response)
//                 console.log(err.response);
//         });
//     }
//     const responseDebug = await debugToken(record.accessToken);
//     console.info('debugToken', responseDebug);
// });
// }


exports.sendPassThreadControl = sendPassThreadControl;
//# sourceMappingURL=pagesController.js.map