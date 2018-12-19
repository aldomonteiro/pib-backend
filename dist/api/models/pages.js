"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
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
  initialSetupBeverages: {
    type: Number
  }
}, {
  timestamps: true
}); //TODO: store access_token expiring date

schema.plugin(_mongoosePaginate.default);

var _default = _mongoose.default.model("pages", schema);

exports.default = _default;
//# sourceMappingURL=pages.js.map