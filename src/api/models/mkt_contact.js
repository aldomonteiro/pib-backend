import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: String,
    pageId: String,
    last_answer: String,
    how_know_company: String,
    saw_how_it_works: Boolean,
    restaurant_related: Boolean,
    restaurant_owner: Boolean,
    restaurant_employee: Boolean,
    started_test: Boolean,
    contact_form: String,
    contact_phone: String,
    contact_mail: String,
    free_msg: String,
    final: Boolean,
  },
  { timestamps: true }
);

schema.index({ pageId: 1, userId: 1 }, { unique: true });

export default mongoose.model("mkt_contact", schema);
