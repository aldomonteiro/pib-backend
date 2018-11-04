import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: Number,
    size: String,
    slices: Number,
    split: Number,
    pageId: String,
  },
  { timestamps: true }
);

schema.plugin(paginate);

export default mongoose.model("sizes", schema);
