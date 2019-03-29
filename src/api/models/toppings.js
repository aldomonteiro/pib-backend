import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: Number, required: true },
    topping: { type: String, required: true },
    pageId: String,
}, { timestamps: true });

schema.index({ pageId: 1, id: 1 }, { unique: true });

export default mongoose.model('toppings', schema);
