import mongoose, { Schema } from "mongoose";
import paginate from 'mongoose-paginate';

const schema = new Schema(
  {
    id: { type: Number, required: true },
    pageId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
  }, { timestamps: true },
);

schema.plugin(paginate);


export default mongoose.model("stores", schema);
