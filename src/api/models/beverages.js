import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: { type: Number, required: true },
    kind: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    pageId: { type: String, required: true },
  }, { timestamps: true },
);

schema.index({ pageId: 1, kind: 1, name: 1 }, { unique: true });

schema.plugin(paginate);

export default mongoose.model("beverages", schema);
