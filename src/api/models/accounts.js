import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: Number,
        planId: Number,
        userId: String,
        pageId: String,
        name: String,
        expiry: String,
        cvc: Number,
        issuer: String,
    },
    { timestamps: true }
);

schema.index({ pageId: 1, id: 1 }, { unique: true });

export default mongoose.model('accounts', schema);
