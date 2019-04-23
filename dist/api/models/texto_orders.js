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
  phone: {
    type: String
  },
  details: {
    type: String
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
  address: {
    type: String
  },
  total: {
    type: Number
  },
  confirmedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  deliverTime: {
    type: Number
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

var _default = _mongoose["default"].model('text_orders', schema);

exports["default"] = _default;
//# sourceMappingURL=texto_orders.js.map