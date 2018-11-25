import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema({
  id: { type: Number, required: true },
  customerId: { type: Number },
  userId: { type: String, required: true },
  pageId: { type: String, required: true },
  status: { type: Number },
  location_lat: { type: Number },
  location_long: { type: Number },
  location_url: { type: String },
  phone: { type: String },
  address: { type: String },
  qty_total: { type: Number },
  item_complete: { type: Number },
  currentItemSize: { type: Number },
  waitingForAddress: { type: Boolean },
  waitingFor: { type: String },
  total: { type: Number },
}, { timestamps: true });

schema.plugin(paginate);

export default mongoose.model("orders", schema);
