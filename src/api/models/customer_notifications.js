import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        customerId: { type: Number, required: true },
        pageId: { type: String },
        userId: { type: String, required: true },
        status: { type: Number },
    }, { timestamps: true },
);

schema.index({ pageId: 1, customerId: 1 });

export default mongoose.model('customer_notifications', schema);
