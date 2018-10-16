import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    accessToken: { type: String, required: true },
    pictureUrl: { type: String },
    userID: { type: String }
}, { timestamps: true });

//TODO: store access_token expiring date

export default mongoose.model("pages", schema);
