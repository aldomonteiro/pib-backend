import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    store: { type: Schema.ObjectId, ref: 'stores' },
    store_id: { type: Number },
    pageId: { type: String, required: true },
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

schema.index({ store_id: 1, pageId: 1 });

export default mongoose.model("openingtimes", schema);
