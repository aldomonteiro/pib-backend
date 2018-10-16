import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    store: { type: Schema.ObjectId, ref: 'stores' },
    pageId: { type: String, required: true },
    // Holydays
    hol_is_open: { type: Boolean },
    hol_open: { type: String, required: true },
    hol_close: { type: String, required: true },
    // Weekdays
    sun_is_open: { type: Boolean },
    mon_is_open: { type: Boolean },
    tue_is_open: { type: Boolean },
    wed_is_open: { type: Boolean },
    thu_is_open: { type: Boolean },
    fri_is_open: { type: Boolean },
    sat_is_open: { type: Boolean },
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

schema.index({ pageId: 1 }, { unique: true });

schema.plugin(paginate);

export default mongoose.model("openingtimes", schema);
