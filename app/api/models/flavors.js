import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    id: Number,
    flavor: String,
    kind: String,
    toppings: [{ type: Schema.Types.Number }],
    topping_ids: [{ type: Schema.Types.ObjectId, ref: "toppings" }],
  }
);

export default mongoose.model("flavors", schema);
