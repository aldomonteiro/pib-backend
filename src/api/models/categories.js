import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        pageId: { type: String, required: true },
        isPizza: { type: Boolean },
    }, { timestamps: true },
);

schema.index({ pageId: 1, id: 1 }, { unique: true });


export default mongoose.model('categories', schema);
