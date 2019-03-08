import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: { type: Number, required: true },
        product: { type: String, required: true },
        category_id: { type: Number, required: true },
        pageId: { type: String, required: true },
        sizes: [{ size_id: Number, price: Number }],
    }, { timestamps: true },
);

schema.index({ pageId: 1, kind: 1, name: 1 }, { unique: true });
schema.index({ pageId: 1, id: 1 }, { unique: true });

export default mongoose.model('products', schema);
