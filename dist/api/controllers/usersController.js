"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeAccessToken = exports.users_create = exports.users_auth = void 0;

var _users = _interopRequireDefault(require("../models/users"));

var _axios = _interopRequireDefault(require("axios"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var users_auth = function users_auth(req, res) {
  if (req.body) {
    _users.default.findOne({
      userID: req.body.userID
    }, function (err, foundUser) {
      if (err) {
        res.status(500).json(err);
        return;
      }

      if (foundUser) {
        foundUser.lastLogin = Date.now();
        foundUser.locationName = req.body.locationName; // if (!foundUser.hasLongLivedToken) {

        changeAccessToken(foundUser.accessToken).then(function (data) {
          foundUser.hasLongLivedToken = true;
          foundUser.accessToken = data.access_token;
          foundUser.save();
          res.status(200).json({
            user: foundUser.toAuthJSON()
          });
        }).catch(function (err) {
          return console.log(err.response.data);
        }); // } else {
        //     foundUser.save();
        //     res.status(200).json({ user: foundUser.toAuthJSON() });
        // }
      } else {
        var newRecord = new _users.default({
          userID: req.body.userID,
          name: req.body.name,
          email: req.body.email,
          pictureUrl: req.body.pictureUrl,
          accessToken: req.body.accessToken,
          timeZone: req.body.timeZone,
          locationName: req.body.locationName
        });
        changeAccessToken(newRecord.accessToken).then(function (data) {
          newRecord.hasLongLivedToken = true;
          newRecord.accessToken = data.access_token;
          newRecord.save().then(function (record) {
            return res.status(200).json({
              user: record.toAuthJSON()
            });
          }).catch(function (err) {
            return res.status(500).json(err);
          });
        }).catch(function (err) {
          return res.status(500).json(err);
        });
      }
    });
  }
};

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
        return res.status(500).json(err);
      });
    }).catch(function (err) {
      return res.status(500).json(err);
    });
  }
}; //oauth/access_token?grant_type=fb_exchange_token&client_id=267537643995936&client_secret=1b5307cb418218dc1b0d38568be37340&fb_exchange_token=EAADzUvY8AyABALCKnnO0nQKYa5GqwNwIiOn3ZCiUrvCZCiTHFzBZB0GNim12elB7j4WTqZCpQ4q6doZC9ZAmc3K4u1Dz8cCu3vZA8SRy7OqAewcXbPS00XVhAWWLrNkEqevdN9EGNRu2iGpMjTiQ4cxBrrbFmlATwqZCuP0wiRTaOEDcnh66KZABaVHrykAnaAAqNp5On1TvWHQZDZD


exports.users_create = users_create;

var changeAccessToken =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(accessToken) {
    var facebookAccessTokenUrl, params;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _dotenv.default.config();

            facebookAccessTokenUrl = process.env.FACEBOOK_URL_OAUTH_ACCESS_TOKEN;
            params = {
              grant_type: 'fb_exchange_token',
              client_id: process.env.FACEBOOK_APP_ID,
              client_secret: process.env.FACEBOOK_SECRET_KEY,
              fb_exchange_token: accessToken
            };
            _context.next = 5;
            return _axios.default.get(facebookAccessTokenUrl, {
              params: params
            }).then(function (res) {
              return res.data;
            });

          case 5:
            return _context.abrupt("return", _context.sent);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function changeAccessToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.changeAccessToken = changeAccessToken;
//# sourceMappingURL=usersController.js.map