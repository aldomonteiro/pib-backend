import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  id: { type: Number, required: true },
  topping: { type: String, required: true }
});

export default mongoose.model("toppings", schema);
