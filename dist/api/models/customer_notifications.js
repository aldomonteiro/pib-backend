"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var schema = new Schema({
  customerId: {
    type: Number,
    required: true
  },
  pageId: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  status: {
    type: Number
  }
}, {
  timestamps: true
});
schema.index({
  pageId: 1,
  customerId: 1
});

var _default = _mongoose["default"].model('customer_notifications', schema);

exports["default"] = _default;
//# sourceMappingURL=customer_notifications.js.map