import mongoose, { Schema } from "mongoose";
import paginate from 'mongoose-paginate';

const schema = new Schema(
  {
    id: Number,
    flavor: String,
    kind: String,
    toppings: [{ type: Schema.Types.Number }],
    pageId: String,
  },
  { timestamps: true }
);

schema.plugin(paginate);

export default mongoose.model("flavors", schema);
