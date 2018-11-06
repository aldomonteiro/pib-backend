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
  id: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  pageId: {
    type: String,
    required: true
  },
  status: {
    type: Number
  },
  location_lat: {
    type: Number
  },
  location_long: {
    type: Number
  },
  location_url: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  qty_total: {
    type: Number
  },
  item_complete: {
    type: Number
  },
  waitingForAddress: {
    type: Boolean
  }
}, {
  timestamps: true
});
schema.plugin(_mongoosePaginate.default);

var _default = _mongoose.default.model("orders", schema);

exports.default = _default;
//# sourceMappingURL=orders.js.map