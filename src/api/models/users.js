import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema({
  userID: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  pictureUrl: { type: String },
  hasLongLivedToken: { type: Boolean, default: false },
  accessToken: { type: String },
  shortLivedToken: { type: String },
  longLivedToken: { type: String },
  expireDate: { type: Date },
  lastLogin: { type: Date },
  activePage: { type: String },
  timeZone: { type: String },
  locationName: { type: String },
  role: { type: String, default: "user" },
}, { timestamps: true });

schema.post('save', doc => {
  console.log(`user has been saved: userID:${doc.userID}, name:${doc.name}, hasLong:${doc.hasLongLivedToken}`);
});

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    name: this.name,
    email: this.email,
    activePage: this.activePage,
    accessToken: this.accessToken,
    token: this.generateJWT()
  };
};

// schema.plugin(paginate);

export default mongoose.model("users", schema);
