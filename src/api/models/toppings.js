import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema({
  id: { type: Number, required: true },
  topping: { type: String, required: true }
}, { timestamps: true });

schema.plugin(paginate);

export default mongoose.model("toppings", schema);
