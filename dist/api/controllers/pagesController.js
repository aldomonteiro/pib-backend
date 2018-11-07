"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllPages = exports.getOnePageData = exports.getOnePage = exports.subscribedApps = exports.page_update = exports.page_resources_delete = exports.page_resources_get_one = exports.page_resources_get_all = void 0;

var _pages = _interopRequireDefault(require("../models/pages"));

var _users = _interopRequireDefault(require("../models/users"));

var _axios = _interopRequireDefault(require("axios"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// List all flavors
// TODO: use filters in the query req.query
var page_resources_get_all =
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

            _pages.default.paginate(query, options,
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
                          res.setHeader('Content-Range', _util.default.format("pages %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
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

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function page_resources_get_all(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // List one record by filtering by ID


exports.page_resources_get_all = page_resources_get_all;

var page_resources_get_one = function page_resources_get_one(req, res) {
  if (req.params && req.params.id) {
    _pages.default.findOne({
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
}; // DELETE


exports.page_resources_get_one = page_resources_get_one;

var page_resources_delete = function page_resources_delete(req, res) {
  _pages.default.findOneAndRemove({
    id: req.params.id
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (err) {
    res.status(500).json({
      message: err.errmsg
    });
  });
}; // Update or create a new page


exports.page_resources_delete = page_resources_delete;

var page_update = function page_update(req, res) {
  console.log("page_update");
  console.log(req.body);
  var pageId = req.body.id; // Find a page by id

  _pages.default.findOne({
    id: pageId
  }, function (err, doc) {
    if (err) {
      // err !== null
      res.status(500).json({
        message: err.errmsg
      });
      return;
    }

    var record;

    if (doc) {
      record = doc;
      if (req.body.greetingText) record.greetingText = req.body.greetingText;
      if (req.body.firstResponseText) record.firstResponseText = req.body.firstResponseText;
      if (req.body.access_token) record.accessToken = req.body.access_token;
      record.userID = req.currentUser.userID;
    } else {
      record = new _pages.default({
        id: pageId,
        name: req.body.name,
        accessToken: req.body.access_token,
        userID: req.currentUser.userID
      });
    }

    record.save(function (err, result) {
      if (err) {
        res.status(500).json({
          message: err.errmsg
        });
      } else {
        subscribedApps(result.id, result.accessToken).then(function (response) {
          res.status(200).json(result);
        }).catch(function (err) {
          var errorMessage;
          if (err.error) errorMessage = err.error;
          if (err.response.data) if (err.response.data.error) errorMessage = err.response.data.error.message;
          console.log("subscribed_apps catch err: ".concat(errorMessage));
          res.status(500).json({
            message: errorMessage
          });
        });
      }
    }); // update ActivePage for the current user

    if (req.currentUser) {
      _users.default.findOne({
        userID: req.currentUser.userID
      }, function (err, docFind) {
        if (err) {
          res.status(500).json({
            message: err.errmsg
          });
          return;
        }

        if (docFind) {
          docFind.activePage = pageId;
          docFind.save(function (err, docSave) {
            if (err) {
              res.status(500).json({
                message: err.errmsg
              });
            }
          });
        }
      });
    }

    if (req.body.greetingText && record && record.accessToken) {
      setFacebookFields(record.id, record.accessToken, req.body.greetingText).then(function (response) {
        console.log('PagesController, response from set fields:', response.result);
      }).catch(function (err) {
        if (err.response && err.response.data && err.response.data.error) console.log("PagesController, error from set fields: ".concat(err.response.data.error.message));else if (err.response) console.log(err.response);
      });
    }
  });
};

exports.page_update = page_update;

var subscribedApps =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(pageId, accessToken) {
    var facebookUrl;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // https://graph.facebook.com/v3.1/{page-id}/subscribed_apps?access_token={}
            facebookUrl = "https://graph.facebook.com/v3.1/".concat(pageId, "/subscribed_apps?access_token=").concat(accessToken);
            _context3.next = 3;
            return _axios.default.post(facebookUrl);

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function subscribedApps(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); // used in botController.js


exports.subscribedApps = subscribedApps;

var getOnePage =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(pageID) {
    var accessToken;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            accessToken = '';
            _context4.next = 3;
            return _pages.default.findOne({
              id: pageID
            }, function (err, result) {
              if (err) {} else {
                accessToken = result.accessToken;
              }
            });

          case 3:
            if (!(accessToken !== '')) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", Promise.resolve(accessToken));

          case 7:
            return _context4.abrupt("return", Promise.reject());

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getOnePage(_x7) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * 
 * @param {*} pageID 
 * @return Page
 */


exports.getOnePage = getOnePage;

var getOnePageData =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(pageID) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _pages.default.findOne({
              id: pageID
            }).exec();

          case 2:
            return _context5.abrupt("return", _context5.sent);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getOnePageData(_x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getOnePageData = getOnePageData;

var getAllPages =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var pageArray;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            pageArray = [];
            _context6.next = 3;
            return _pages.default.find({}, function (err, result) {
              pageArray = result.map(function (doc) {
                return {
                  'pageID': doc.id,
                  'accessToken': doc.accessToken,
                  'name': doc.name
                };
              });
            });

          case 3:
            console.log("into getAllPages: ", Object.keys(pageArray).length);
            return _context6.abrupt("return", Promise.resolve(pageArray));

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getAllPages() {
    return _ref6.apply(this, arguments);
  };
}();

exports.getAllPages = getAllPages;

var setFacebookFields =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(pageId, accessToken, _greeting) {
    var facebookUrl;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            facebookUrl = "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=".concat(accessToken);
            _context7.next = 3;
            return _axios.default.post(facebookUrl, {
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
                  title: 'Cardápio',
                  type: 'postback',
                  payload: JSON.stringify({
                    data: 'CARDAPIO_PAYLOAD',
                    event: 'MAIN-MENU'
                  })
                }, {
                  title: 'Horários',
                  type: 'postback',
                  payload: JSON.stringify({
                    data: 'HORARIO_PAYLOAD',
                    event: 'MAIN-MENU'
                  })
                }, {
                  title: 'Fazer Pedido',
                  type: 'postback',
                  payload: JSON.stringify({
                    data: 'PEDIDO_PAYLOAD',
                    event: 'MAIN-MENU'
                  })
                }]
              }]
            });

          case 3:
            return _context7.abrupt("return", _context7.sent);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function setFacebookFields(_x9, _x10, _x11) {
    return _ref7.apply(this, arguments);
  };
}();
//# sourceMappingURL=pagesController.js.map