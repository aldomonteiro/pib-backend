"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var schema = new Schema({
  userId: String,
  pageId: String,
  last_answer: String,
  how_know_company: String,
  saw_how_it_works: Boolean,
  restaurant_related: Boolean,
  restaurant_owner: Boolean,
  restaurant_employee: Boolean,
  started_test: Boolean,
  contact_form: String,
  contact_phone: String,
  contact_mail: String,
  free_msg: String,
  final: Boolean
}, {
  timestamps: true
});
schema.index({
  pageId: 1,
  userId: 1
}, {
  unique: true
});

var _default = _mongoose.default.model("mkt_contact", schema);

exports.default = _default;
//# sourceMappingURL=mkt_contact.js.map