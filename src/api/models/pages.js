import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    accessToken: { type: String, required: true },
    pictureUrl: { type: String },
    userID: { type: String },
    greetingText: { type: String },
    firstResponseText: { type: String },
}, { timestamps: true });

//TODO: store access_token expiring date

schema.plugin(paginate);


export default mongoose.model("pages", schema);
