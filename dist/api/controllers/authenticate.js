"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(req, res, next) {
  var header = req.headers.authorization;
  var token; // in pib-frontend App.js
  // options.headers.set('Authorization', `Bearer ${token}`);

  if (header) token = header.split(" ")[1];

  if (token) {
    _jsonwebtoken.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res.status(401).json({
          message: "pos.auth.invalid_token"
        });
      } else {
        _users.default.findOne({
          email: decoded.email
        }).then(function (user) {
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    res.status(401).json({
      message: "No token"
    });
  }
};

exports.default = _default;
//# sourceMappingURL=authenticate.js.map