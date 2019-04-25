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
  userId: {
    type: String,
    required: true
  },
  pageId: {
    type: String,
    required: true
  },
  customerId: {
    type: Number
  },
  status: {
    type: Number
  },
  status2: {
    type: String
  },
  status3: {
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
  qty: {
    type: Number
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
  currentItemCategory: {
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
  waitingForData: Schema.Types.Mixed,
  undo: {
    type: String
  },
  total: {
    type: Number
  },
  sent_shipping_notification: {
    type: Date
  },
  sent_reject_notification: {
    type: Date
  },
  no_beverage: {
    type: Boolean
  },
  payment_type: {
    type: String
  },
  payment_change: {
    type: String
  },
  confirmed_at: {
    type: Date
  },
  delivered_at: {
    type: Date
  },
  comments: {
    type: String
  },
  postComments: {
    type: String
  },
  rejection_reason: {
    type: String
  },
  backToConfirmation: {
    type: String
  },
  deliver_type: {
    type: String
  },
  deliver_time: {
    type: Number
  },
  source: {
    type: String
  },
  distance_from_store: {
    type: Number,
    "default": 0
  },
  delivery_fee: {
    type: Number,
    "default": 0
  },
  surcharge_percent: {
    type: Number,
    "default": 0
  },
  surcharge_amount: {
    type: Number,
    "default": 0
  },
  store_address: {
    type: String
  }
}, {
  timestamps: true
});
schema.pre('save', function (next) {
  switch (this.status) {
    case 0:
      this.status2 = 'pending';
      this.status3 = 'pending';
      break;

    case 1:
      this.status2 = 'confirmed';
      this.status3 = 'pending';
      break;

    case 2:
      this.status2 = 'viewed';
      this.status3 = 'pending';
      break;

    case 3:
      this.status2 = 'accepted';
      this.status3 = 'pending';
      break;

    case 4:
      this.status2 = 'printed';
      this.status3 = 'pending';
      break;

    case 5:
      this.status2 = 'delivered';
      this.status3 = 'delivered';
      break;

    case 7:
      this.status2 = 'finished';
      this.status3 = 'finished';
      break;

    case 8:
      this.status2 = 'rejected';
      this.status3 = 'cancelled';
      break;

    case 9:
      this.status2 = 'cancelled';
      this.status3 = 'cancelled';
      break;

    default:
      break;
  }

  next();
});

var _default = _mongoose["default"].model('orders', schema);

exports["default"] = _default;
//# sourceMappingURL=orders.js.map