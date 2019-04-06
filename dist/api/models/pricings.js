"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  categoryId: {
    type: Number,
    required: true
  },
  sizeId: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  pageId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
schema.index({
  pageId: 1,
  categoryId: 1,
  sizeId: 1
}, {
  unique: true
}); // Getter
// schema.path('price').get((num) => (num / 100).toFixed(2));
// // Setter
// schema.path('price').set((num) => num * 100);

schema.plugin(_mongoosePaginate["default"]);

var _default = _mongoose["default"].model('pricings', schema);

exports["default"] = _default;
//# sourceMappingURL=pricings.js.map