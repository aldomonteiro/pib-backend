"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeUserActivePage = exports.changeAccessToken = exports.users_delete = exports.users_update = exports.users_get_one = exports.users_get_all = exports.users_create = exports.users_code = exports.users_auth = void 0;

var _users = _interopRequireDefault(require("../models/users"));

var _axios = _interopRequireDefault(require("axios"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _util = _interopRequireDefault(require("util"));

var _util2 = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var users_auth =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var lastInterface, _req$body, userID, accessToken, userData, _userData$data, id, name, email, picture, location, locationName, pictureUrl, user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.body) {
              _context.next = 27;
              break;
            }

            lastInterface = 'users_auth';
            _context.prev = 2;
            _req$body = req.body, userID = _req$body.userID, accessToken = _req$body.accessToken;
            lastInterface = 'https://graph.facebook.com/v3.2/me?fields=id,name,email,picture,location&access_token=';
            _context.next = 7;
            return _axios.default.get(lastInterface + accessToken);

          case 7:
            userData = _context.sent;

            if (!(userData && userData.status === 200)) {
              _context.next = 19;
              break;
            }

            _userData$data = userData.data, id = _userData$data.id, name = _userData$data.name, email = _userData$data.email, picture = _userData$data.picture, location = _userData$data.location;
            locationName = location ? location.name : null;
            pictureUrl = picture ? picture.data.url : null;
            lastInterface = 'create_or_auth';
            _context.next = 15;
            return create_or_auth({
              userID: id,
              name: name,
              email: email,
              picture: picture,
              locationName: locationName,
              pictureUrl: pictureUrl,
              accessToken: accessToken
            });

          case 15:
            user = _context.sent;

            if (user) {
              res.status(200).json({
                user: user.toAuthJSON()
              });
            } else {
              res.status(500).json({
                message: 'Unknown error'
              });
            }

            _context.next = 21;
            break;

          case 19:
            console.error(userData.status, userData.data);
            res.status(500).json({
              message: userData.data.error.message
            });

          case 21:
            _context.next = 27;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](2);
            console.error(lastInterface, {
              users_auth_error: _context.t0
            });
            res.status(500).json({
              message: _context.t0.message
            });

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 23]]);
  }));

  return function users_auth(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.users_auth = users_auth;

var users_code =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var lastInterface, _code, _redirect_uri, facebookAccessTokenUrl, params, result, access_token, userData, _userData$data2, id, name, email, picture, location, locationName, pictureUrl, user, errorMsg, _errorMsg, errMsg;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            lastInterface = '';
            _context2.prev = 1;
            _code = req.body.code;
            _redirect_uri = req.body.redirect_uri;
            console.info({
              _redirect_uri: _redirect_uri
            });

            _dotenv.default.config();

            facebookAccessTokenUrl = process.env.FACEBOOK_URL_OAUTH_ACCESS_TOKEN;
            params = {
              client_id: process.env.FACEBOOK_APP_ID,
              redirect_uri: _redirect_uri,
              client_secret: process.env.FACEBOOK_SECRET_KEY,
              code: _code
            };
            lastInterface = facebookAccessTokenUrl;
            _context2.next = 11;
            return _axios.default.get(facebookAccessTokenUrl, {
              params: params
            });

          case 11:
            result = _context2.sent;

            if (!(result.status === 200)) {
              _context2.next = 34;
              break;
            }

            access_token = result.data.access_token;
            lastInterface = 'https://graph.facebook.com/v3.2/me?fields=id,name,email,picture,location&access_token=';
            _context2.next = 17;
            return _axios.default.get(lastInterface + access_token);

          case 17:
            userData = _context2.sent;

            if (!(userData && userData.status === 200)) {
              _context2.next = 29;
              break;
            }

            _userData$data2 = userData.data, id = _userData$data2.id, name = _userData$data2.name, email = _userData$data2.email, picture = _userData$data2.picture, location = _userData$data2.location;
            locationName = location ? location.name : null;
            pictureUrl = picture ? picture.data.url : null;
            lastInterface = 'create_or_auth';
            _context2.next = 25;
            return create_or_auth({
              userID: id,
              name: name,
              email: email,
              picture: picture,
              locationName: locationName,
              pictureUrl: pictureUrl,
              accessToken: access_token,
              code: _code
            });

          case 25:
            user = _context2.sent;

            if (user) {
              res.status(200).json({
                user: user.toAuthJSON()
              });
            } else {
              res.status(500).json({
                message: 'Unknown error'
              });
            }

            _context2.next = 32;
            break;

          case 29:
            console.error(userData.data);
            errorMsg = userData.data.error.message;
            res.status(userData.status).json({
              message: errorMsg
            });

          case 32:
            _context2.next = 38;
            break;

          case 34:
            console.error('Failed ' + lastInterface);
            console.error(result.data);
            _errorMsg = result.data.error.message;
            res.status(result.status).json({
              message: _errorMsg
            });

          case 38:
            _context2.next = 46;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t0 = _context2["catch"](1);
            console.error({
              lastInterface: lastInterface
            });
            errMsg = lastInterface;

            if (_context2.t0.response) {
              if (_context2.t0.response.data) {
                console.error(_context2.t0.response.data);
                errMsg = _context2.t0.response.data.error.message;
              } else console.error(_context2.t0.response);
            } else if (_context2.t0.data) {
              console.error(_context2.t0.data);
              errMsg = _context2.t0.data.error.message;
            }

            res.status(500).json({
              message: errMsg
            });

          case 46:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 40]]);
  }));

  return function users_code(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.users_code = users_code;

var create_or_auth =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(userData) {
    var userID, name, email, pictureUrl, accessToken, timeZone, locationName, user, respChangeToken;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            userID = userData.userID, name = userData.name, email = userData.email, pictureUrl = userData.pictureUrl, accessToken = userData.accessToken, timeZone = userData.timeZone, locationName = userData.locationName;
            _context3.next = 4;
            return _users.default.findOne({
              userID: userID
            }).exec();

          case 4:
            user = _context3.sent;

            if (!user) {
              user = new _users.default({
                userID: userID,
                name: name,
                email: email,
                pictureUrl: pictureUrl,
                accessToken: accessToken,
                timeZone: timeZone,
                locationName: locationName
              });
            } else {
              user.accessToken = accessToken;
            }

            user.lastLogin = Date.now();
            user.locationName = locationName;
            user.shortLivedToken = user.accessToken; // only for debug analysis

            _context3.next = 11;
            return changeAccessToken(user.accessToken);

          case 11:
            respChangeToken = _context3.sent;

            if (respChangeToken) {
              if (respChangeToken.hasOwnProperty('data')) {
                if (respChangeToken.data.hasOwnProperty('access_token')) {
                  respChangeToken.access_token = respChangeToken.data.access_token;
                }
              }

              user.hasLongLivedToken = true;
              user.longLivedToken = respChangeToken.access_token; // only for debug analysis

              user.accessToken = respChangeToken.access_token; // the token used in the system
            }

            _context3.next = 15;
            return user.save();

          case 15:
            return _context3.abrupt("return", user);

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](0);
            console.error({
              createOrAuthErr: _context3.t0
            });
            throw _context3.t0;

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 18]]);
  }));

  return function create_or_auth(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var users_create = function users_create(req, res) {
  var queryUser = _users.default.findOne({
    userID: req.body.userID
  });

  var foundUser = queryUser.exec();
  console.log("users_create");
  console.log(foundUser);

  if (foundUser) {
    users_auth(req, res);
  } else {
    var newRecord = new _users.default({
      userID: req.body.userID,
      name: req.body.name,
      email: req.body.email,
      pictureUrl: req.body.pictureUrl,
      accessToken: req.body.accessToken,
      timeZone: req.body.timeZone
    });
    changeAccessToken(newRecord.accessToken).then(function (data) {
      newRecord.hasLongLivedToken = true;
      newRecord.accessToken = data.access_token;
      newRecord.save().then(function (record) {
        return res.status(200).json({
          user: record.toAuthJSON()
        });
      }).catch(function (err) {
        console.error(err);
        res.status(500).json(err);
      });
    }).catch(function (err) {
      console.error(err);
      res.status(500).json(err);
    });
  }
}; // List all users
// TODO: use filters in the query req.query


exports.users_create = users_create;

var users_get_all = function users_get_all(req, res) {
  // Getting the sort from the requisition
  // var sortObj = configSortQuery(req.query.sort);
  // Getting the range from the requisition
  var rangeObj = (0, _util2.configRangeQuery)(req.query.range); // let options = {
  //     offset: rangeObj['offset'],
  //     limit: rangeObj['limit'],
  //     sort: sortObj,
  //     lean: true,
  //     leanWithId: false,
  // };

  var query = {}; // User.paginate(query, options, (err, result) => {

  _users.default.find(function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.errmsg
      });
    } else {
      res.setHeader('Content-Range', _util.default.format("users %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
      res.status(200).json(result);
    }
  });
}; // List one record by filtering by ID


exports.users_get_all = users_get_all;

var users_get_one = function users_get_one(req, res) {
  if (req.params && req.params.id) {
    _users.default.findOne({
      userID: req.params.id
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
}; // UPDATE


exports.users_get_one = users_get_one;

var users_update = function users_update(req, res) {
  var updatedElement = {
    id: req.body.id,
    name: sanitizeName(req.body.name),
    email: req.body.email
  };

  _users.default.findOneAndUpdate({
    id: req.params.id
  }, updatedElement).then(function (oldResult) {
    _users.default.findOne({
      id: req.params.id
    }).then(function (newResult) {
      res.json({
        data: {
          _id: newResult._id,
          id: newResult.id,
          name: newResult.name,
          email: newResult.email
        }
      });
    }).catch(function (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: "Something went wrong. ".concat(err)
      });
      return;
    });
  }).catch(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: "Something went wrong. ".concat(err)
      });
    }
  });
}; // DELETE


exports.users_update = users_update;

var users_delete = function users_delete(req, res) {
  _users.default.findOneAndRemove({
    id: req.params.id
  }).then(function (result) {
    res.json({
      success: true,
      msg: "It has been deleted."
    });
  }).catch(function (err) {
    res.status(404).json({
      success: false,
      msg: 'Nothing to delete.'
    });
  });
};

exports.users_delete = users_delete;

var changeAccessToken =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(accessToken) {
    var env, facebook_app_id, facebook_secret_key, facebookAccessTokenUrl, params;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            _dotenv.default.config();

            env = process.env.NODE_ENV || 'production';
            facebook_secret_key = '';

            if (env === 'production') {
              facebook_app_id = process.env.FACEBOOK_APP_ID;
              facebook_secret_key = process.env.FACEBOOK_SECRET_KEY;
            } else {
              facebook_app_id = process.env.DEV_FACEBOOK_APP_ID;
              facebook_secret_key = process.env.DEV_FACEBOOK_SECRET_KEY;
            }

            facebookAccessTokenUrl = process.env.FACEBOOK_URL_OAUTH_ACCESS_TOKEN;
            params = {
              grant_type: 'fb_exchange_token',
              client_id: facebook_app_id,
              client_secret: facebook_secret_key,
              fb_exchange_token: accessToken
            };
            _context4.next = 9;
            return _axios.default.get(facebookAccessTokenUrl, {
              params: params
            });

          case 9:
            return _context4.abrupt("return", _context4.sent);

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            console.error({
              changeAccessToken: changeAccessToken
            });
            return _context4.abrupt("return", null);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 12]]);
  }));

  return function changeAccessToken(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.changeAccessToken = changeAccessToken;

var removeUserActivePage =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(userID) {
    var user;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _users.default.findOne({
              userID: userID
            }).exec();

          case 3:
            user = _context5.sent;

            if (!user) {
              _context5.next = 9;
              break;
            }

            user.activePage = null;
            _context5.next = 8;
            return user.save();

          case 8:
            return _context5.abrupt("return", true);

          case 9:
            return _context5.abrupt("return", false);

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);
            throw _context5.t0;

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 12]]);
  }));

  return function removeUserActivePage(_x7) {
    return _ref5.apply(this, arguments);
  };
}();

exports.removeUserActivePage = removeUserActivePage;
//# sourceMappingURL=usersController.js.map