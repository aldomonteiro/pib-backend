"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireDefault(require("mongoose"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Schema = _mongoose.default.Schema;

var schema = new Schema({
  consultaApiCalendario: { type: Date },
  topping: { type: String, required: true } },
{ timestamps: true });

schema.plugin(paginate);var _default =

_mongoose.default.model("config", schema);exports.default = _default;
//# sourceMappingURL=config.js.map