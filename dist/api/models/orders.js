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
  customerId: {
    type: Number
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
  status2: {
    type: String
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
  currentItem: {
    type: Number
  },
  currentItemSize: {
    type: Number
  },
  currentItemSplit: {
    type: Number
  },
  originalSplit: {
    type: Number
  },
  waitingForAddress: {
    type: Boolean
  },
  waitingFor: {
    type: String
  },
  total: {
    type: Number
  },
  sent_shipping_notification: {
    type: Date
  }
}, {
  timestamps: true
});
schema.pre('save', function (next) {
  switch (this.status) {
    case 0:
      this.status2 = 'pending';
      break;

    case 1:
      this.status2 = 'ordered';
      break;

    case 2:
      this.status2 = 'delivered';
      break;

    case 9:
      this.status2 = 'cancelled';
      break;

    default:
      break;
  }

  next();
});

var _default = _mongoose.default.model("orders", schema);

exports.default = _default;
//# sourceMappingURL=orders.js.map