"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var schema = new Schema({
  orderId: {
    type: Number,
    required: true
  },
  itemId: {
    type: Number
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
  categoryId: {
    type: Number
  },
  sizeId: {
    type: Number
  },
  flavorId: {
    type: Number
  },
  beverageId: {
    type: Number
  },
  extraId: {
    type: Number
  },
  qty: {
    type: Number
  },
  split: {
    type: Number
  },
  resource: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  status: {
    type: Number
  }
}, {
  timestamps: true
});
schema.plugin(_mongoosePaginate.default);

var _default = _mongoose.default.model('items', schema);

exports.default = _default;
//# sourceMappingURL=items.js.map