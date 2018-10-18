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
    // Holydays
    hol_is_open: { type: Boolean, default: true },
    hol_open: { type: String, required: true },
    hol_close: { type: String, required: true },
    // Weekdays
    sun_is_open: { type: Boolean, default: true },
    mon_is_open: { type: Boolean, default: true },
    tue_is_open: { type: Boolean, default: true },
    wed_is_open: { type: Boolean, default: true },
    thu_is_open: { type: Boolean, default: true },
    fri_is_open: { type: Boolean, default: true },
    sat_is_open: { type: Boolean, default: true },
    sun_open: { type: String, required: true },
    mon_open: { type: String, required: true },
    tue_open: { type: String, required: true },
    wed_open: { type: String, required: true },
    thu_open: { type: String, required: true },
    fri_open: { type: String, required: true },
    sat_open: { type: String, required: true },
    sun_close: { type: String, required: true },
    mon_close: { type: String, required: true },
    tue_close: { type: String, required: true },
    wed_close: { type: String, required: true },
    thu_close: { type: String, required: true },
    fri_close: { type: String, required: true },
    sat_close: { type: String, required: true },
  }, { timestamps: true },
);

schema.plugin(paginate);


export default mongoose.model("stores", schema);
