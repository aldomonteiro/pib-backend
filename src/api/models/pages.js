import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    accessToken: { type: String, required: true },
    pictureUrl: { type: String },
    userID: { type: String },
    activeBot: { type: Boolean },
    greetingText: { type: String },
    firstResponseText: { type: String },
    orderExample: { type: String },
    initialSetupFlavors: { type: Number },
    initialSetupSizes: { type: Number },
    initialSetupPricings: { type: Number },
    initialSetupStores: { type: Number },
    initialSetupCategories: { type: Number },
    initialSetupToppings: { type: Number },
    marketing: { type: Boolean, default: false },
}, { timestamps: true });

// TODO: store access_token expiring date

export default mongoose.model('pages', schema);
