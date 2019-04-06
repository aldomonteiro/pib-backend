"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var schema = new Schema({
  orderId: {
    type: Number,
    required: true
  },
  id: {
    type: Number
  },
  userId: {
    type: String
  },
  pageId: {
    type: String
  },
  step: {
    type: String
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("flow", schema);

exports["default"] = _default;
//# sourceMappingURL=flow.js.map