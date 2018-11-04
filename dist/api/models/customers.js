"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Schema = _mongoose.default.Schema;

var schema = new Schema(
{
  id: { type: Number, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  pictureUrl: { type: String },
  location: { type: String },
  pageId: { type: String } },
{ timestamps: true });


schema.index({ pageId: 1, id: 1 }, { unique: true });

schema.plugin(_mongoosePaginate.default);var _default =

_mongoose.default.model("customers", schema);exports.default = _default;
//# sourceMappingURL=customers.js.map