import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: Number,
    flavor: String,
    kind: String,
    toppings: [{ type: Number }],
    pageId: String,
  },
  { timestamps: true }
);

schema.index({ pageId: 1, id: 1 }, { unique: true });

schema.plugin(paginate);

export default mongoose.model("flavors", schema);
