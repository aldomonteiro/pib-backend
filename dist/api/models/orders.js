"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Schema = _mongoose.default.Schema;

var schema = new Schema({
  id: { type: Number, required: true },
  customerId: { type: Number, required: true },
  pageId: { type: String, required: true } },

{ timestamps: true });

schema.plugin(_mongoosePaginate.default);var _default =

_mongoose.default.model("orders", schema);exports.default = _default;
//# sourceMappingURL=orders.js.map