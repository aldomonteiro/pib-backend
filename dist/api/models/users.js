"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import paginate from 'mongoose-paginate';
var Schema = _mongoose.default.Schema;
var schema = new Schema({
  userID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  pictureUrl: {
    type: String
  },
  hasLongLivedToken: {
    type: Boolean,
    default: false
  },
  accessToken: {
    type: String
  },
  facebookCode: {
    type: String
  },
  shortLivedToken: {
    type: String
  },
  longLivedToken: {
    type: String
  },
  expireDate: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  activePage: {
    type: String
  },
  timeZone: {
    type: String
  },
  locationName: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
});
schema.post('save', function (doc) {
  console.log("user has been saved: userID:".concat(doc.userID, ", name:").concat(doc.name, ", hasLong:").concat(doc.hasLongLivedToken));
});

schema.methods.generateJWT = function generateJWT() {
  return _jsonwebtoken.default.sign({
    email: this.email,
    role: this.role
  }, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    name: this.name,
    email: this.email,
    activePage: this.activePage,
    accessToken: this.accessToken,
    token: this.generateJWT()
  };
}; // schema.plugin(paginate);


var _default = _mongoose.default.model('users', schema);

exports.default = _default;
//# sourceMappingURL=users.js.map