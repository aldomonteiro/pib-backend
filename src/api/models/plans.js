import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: Number,
        plan: String,
        amount: Number,
        interval: String,
        currency: String,
    },
    { timestamps: true }
);

schema.index({ id: 1 }, { unique: true });

export default mongoose.model('plans', schema);
