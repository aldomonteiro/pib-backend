import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema({
  orderId: { type: Number, required: true },
  id: { type: Number },
  userId: { type: String },
  pageId: { type: String },
  sizeId: { type: Number },
  flavorId: { type: Number },
  beverageId: { type: Number },
  extraId: { type: Number },
  qty: { type: Number },
  split: { type: Number },
  resource: { type: String },
  description: { type: String },
  price: { type: Number },
  status: { type: Number },
}, { timestamps: true });

schema.plugin(paginate);

export default mongoose.model("items", schema);
