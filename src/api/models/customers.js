import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: { type: Number, required: true },
        userId: { type: String, required: true },
        pageId: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        profile_pic: { type: String },
        email: { type: String },
        phone: { type: String },
        addr_manual: { type: Boolean, default: false },
        addr_formatted: { type: String },
        addr_street: { type: String },
        addr_streetnumber: { type: String },
        addr_sublocality: { type: String },
        addr_city: { type: String },
        addr_state: { type: String },
        addr_postalcode: { type: String },
        location_lat: { type: Number },
        location_long: { type: Number },
        location_url: { type: String },
    }, { timestamps: true },
);

schema.index({ pageId: 1, id: 1 }, { unique: true });
schema.index({ userId: 1 });

export default mongoose.model("customers", schema);
