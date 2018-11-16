"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeAccessToken = exports.users_delete = exports.users_update = exports.users_get_one = exports.users_get_all = exports.users_create = exports.users_auth = void 0;

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
    var user, respChangeToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.body) {
              _context.next = 24;
              break;
            }

            _context.prev = 1;
            _context.next = 4;
            return _users.default.findOne({
              userID: req.body.userID
            }).exec();

          case 4:
            user = _context.sent;

            if (!user) {
              user = new _users.default({
                userID: req.body.userID,
                name: req.body.name,
                email: req.body.email,
                pictureUrl: req.body.pictureUrl,
                accessToken: req.body.accessToken,
                timeZone: req.body.timeZone,
                locationName: req.body.locationName
              });
            }

            user.lastLogin = Date.now();
            user.locationName = req.body.locationName;
            user.hasLongLivedToken = true;
            user.shortLivedToken = user.accessToken; // only for debug analysis

            _context.next = 12;
            return changeAccessToken(user.accessToken);

          case 12:
            respChangeToken = _context.sent;
            user.longLivedToken = respChangeToken.access_token; // only for debug analysis

            user.accessToken = respChangeToken.access_token; // the token used in the system

            _context.next = 17;
            return user.save();

          case 17:
            res.status(200).json({
              user: user.toAuthJSON()
            });
            _context.next = 24;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](1);
            console.error({
              users_auth_error: _context.t0
            });
            res.status(500).json({
              message: _context.t0.message
            });

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 20]]);
  }));

  return function users_auth(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.users_auth = users_auth;

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
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(accessToken) {
    var env, facebook_app_id, facebook_secret_key, facebookAccessTokenUrl, params;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
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
            _context2.next = 8;
            return _axios.default.get(facebookAccessTokenUrl, {
              params: params
            }).then(function (res) {
              return res.data;
            });

          case 8:
            return _context2.abrupt("return", _context2.sent);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function changeAccessToken(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.changeAccessToken = changeAccessToken;
//# sourceMappingURL=usersController.js.map