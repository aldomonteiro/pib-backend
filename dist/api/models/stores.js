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
  pageId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  phone: {
    type: String
  },
  delivery_fee: {
    type: Number
  },
  location_lat: {
    type: Number
  },
  location_long: {
    type: Number
  },
  delivery_time: {
    type: Number
  },
  pickup_time: {
    type: Number
  },
  // Holydays
  hol_is_open: {
    type: Boolean,
    "default": true
  },
  hol_open: {
    type: String,
    required: true
  },
  hol_close: {
    type: String,
    required: true
  },
  // Weekdays
  sun_is_open: {
    type: Boolean,
    "default": true
  },
  mon_is_open: {
    type: Boolean,
    "default": true
  },
  tue_is_open: {
    type: Boolean,
    "default": true
  },
  wed_is_open: {
    type: Boolean,
    "default": true
  },
  thu_is_open: {
    type: Boolean,
    "default": true
  },
  fri_is_open: {
    type: Boolean,
    "default": true
  },
  sat_is_open: {
    type: Boolean,
    "default": true
  },
  sun_open: {
    type: String,
    required: true
  },
  mon_open: {
    type: String,
    required: true
  },
  tue_open: {
    type: String,
    required: true
  },
  wed_open: {
    type: String,
    required: true
  },
  thu_open: {
    type: String,
    required: true
  },
  fri_open: {
    type: String,
    required: true
  },
  sat_open: {
    type: String,
    required: true
  },
  sun_close: {
    type: String,
    required: true
  },
  mon_close: {
    type: String,
    required: true
  },
  tue_close: {
    type: String,
    required: true
  },
  wed_close: {
    type: String,
    required: true
  },
  thu_close: {
    type: String,
    required: true
  },
  fri_close: {
    type: String,
    required: true
  },
  sat_close: {
    type: String,
    required: true
  },
  printer: {
    type: String
  },
  delivery_fees: [{
    from: {
      type: Number
    },
    to: {
      type: Number
    },
    fee: {
      type: Number
    }
  }],
  catalog_url1: {
    type: String
  },
  catalog_url2: {
    type: String
  },
  payment_types: [{
    payment_type: {
      type: String
    },
    surcharge_percent: {
      type: Number
    },
    surcharge_amount: {
      type: Number
    }
  }],
  missing_address_notification: {
    type: String
  },
  accept_notification: {
    type: String
  },
  deliver_notification: {
    type: String
  },
  total_notification: {
    type: String
  },
  default_messages: [{
    default_message: {
      type: String
    }
  }],
  autoreply_notification: {
    type: String
  },
  autoreply_delay: {
    type: Number,
    "default": 10
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
schema.index({
  phone: 1
}, {
  unique: true
});
schema.plugin(_mongoosePaginate["default"]);

var _default = _mongoose["default"].model('stores', schema);

exports["default"] = _default;
//# sourceMappingURL=stores.js.map