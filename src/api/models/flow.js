import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
    orderId: { type: Number, required: true },
    id: { type: Number },
    userId: { type: String },
    pageId: { type: String },
    step: { type: String },
}, { timestamps: true });

export default mongoose.model("flow", schema);
