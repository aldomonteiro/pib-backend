"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  category_id: {
    type: Number,
    required: true
  },
  pageId: {
    type: String,
    required: true
  },
  sizes: [{
    size_id: Number,
    price: Number
  }]
}, {
  timestamps: true
});
schema.index({
  pageId: 1,
  kind: 1,
  name: 1
}, {
  unique: true
});
schema.index({
  pageId: 1,
  id: 1
}, {
  unique: true
});

var _default = _mongoose.default.model('products', schema);

exports.default = _default;
//# sourceMappingURL=products.js.map