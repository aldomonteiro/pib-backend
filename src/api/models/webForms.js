import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
    }, { timestamps: true },
);

export default mongoose.model('webforms', schema);
