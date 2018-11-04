"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongoosePaginate = _interopRequireDefault(require("mongoose-paginate"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Schema = _mongoose.default.Schema;

var schema = new Schema(
{
  id: Number,
  flavor: String,
  kind: String,
  toppings: [{ type: Number }],
  pageId: String },

{ timestamps: true });


schema.plugin(_mongoosePaginate.default);var _default =

_mongoose.default.model("flavors", schema);exports.default = _default;
//# sourceMappingURL=flavors.js.map