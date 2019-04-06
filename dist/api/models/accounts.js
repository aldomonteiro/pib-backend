"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var schema = new Schema({
  id: Number,
  planId: Number,
  userId: String,
  pageId: String,
  name: String,
  expiry: String,
  cvc: Number,
  issuer: String
}, {
  timestamps: true
});
schema.index({
  pageId: 1,
  id: 1
}, {
  unique: true
});

var _default = _mongoose["default"].model('accounts', schema);

exports["default"] = _default;
//# sourceMappingURL=accounts.js.map