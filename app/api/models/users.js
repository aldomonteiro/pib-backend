import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  userID: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  pictureUrl: { type: String },
  hasLongLivedToken: { type: Boolean, default: false },
  accessToken: { type: String },
  expireDate: { type: Date },
  lastLogin: { type: Date },
  activePage: { type: String }
}, { timestamps: true });

schema.post('save', doc => {
  console.log(`user has benn saved: userID:${doc.userID}, name:${doc.name}, hasLong:${doc.hasLongLivedToken}`);
});

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
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

export default mongoose.model("users", schema);
