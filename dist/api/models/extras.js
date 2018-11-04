"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Schema = _mongoose.default.Schema;

var schema = new Schema(
{
  pageId: { type: String, required: true },
  id: { type: Number, required: true },
  kind: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true } },
{ timestamps: true });


schema.index({ pageId: 1, kind: 1, name: 1 }, { unique: true });

schema.plugin(_mongoosePaginate.default);var _default =

_mongoose.default.model("extras", schema);exports.default = _default;
//# sourceMappingURL=extras.js.map