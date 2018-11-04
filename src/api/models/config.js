import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  consultaApiCalendario: { type: Date },
  topping: { type: String, required: true }
}, { timestamps: true });

schema.plugin(paginate);

export default mongoose.model("config", schema);
