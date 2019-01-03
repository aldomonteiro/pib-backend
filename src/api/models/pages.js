import mongoose from "mongoose";
import paginate from 'mongoose-paginate';

const schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    accessToken: { type: String, required: true },
    pictureUrl: { type: String },
    userID: { type: String },
    activeBot: { type: Boolean },
    greetingText: { type: String },
    firstResponseText: { type: String },
    initialSetupFlavors: { type: Number },
    initialSetupSizes: { type: Number },
    initialSetupPricings: { type: Number },
    initialSetupStores: { type: Number },
    initialSetupBeverages: { type: Number },
    initialSetupToppings: { type: Number },
    marketing: { type: Boolean, default: false }
}, { timestamps: true });

//TODO: store access_token expiring date

schema.plugin(paginate);


export default mongoose.model("pages", schema);
