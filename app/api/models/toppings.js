import mongoose, { Schema } from "mongoose";
import paginate from 'mongoose-paginate';

const schema = new Schema({
  id: { type: Number, required: true },
  topping: { type: String, required: true }
}, { timestamps: true });

schema.plugin(paginate);

export default mongoose.model("toppings", schema);
