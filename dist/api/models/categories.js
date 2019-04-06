"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pageId: {
    type: String,
    required: true
  },
  price_by_size: {
    type: Boolean
  },
  is_pizza: {
    type: Boolean
  }
}, {
  timestamps: true
});
schema.index({
  pageId: 1,
  id: 1
}, {
  unique: true
});

var _default = _mongoose["default"].model('categories', schema);

exports["default"] = _default;
//# sourceMappingURL=categories.js.map