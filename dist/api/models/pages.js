"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose.default.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  pictureUrl: {
    type: String
  },
  userID: {
    type: String
  },
  activeBot: {
    type: Boolean
  },
  greetingText: {
    type: String
  },
  firstResponseText: {
    type: String
  },
  initialSetupFlavors: {
    type: Number
  },
  initialSetupSizes: {
    type: Number
  },
  initialSetupPricings: {
    type: Number
  },
  initialSetupStores: {
    type: Number
  },
  initialSetupCategories: {
    type: Number
  },
  initialSetupToppings: {
    type: Number
  },
  marketing: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
}); // TODO: store access_token expiring date

var _default = _mongoose.default.model('pages', schema);

exports.default = _default;
//# sourceMappingURL=pages.js.map