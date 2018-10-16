import mongoose, { Schema } from "mongoose";
import paginate from 'mongoose-paginate';

const schema = new Schema(
  {
    id: { type: Number, required: true },
    kind: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    pageId: { type: String, required: true },
  }, { timestamps: true },
);

schema.index({ pageId: 1, kind: 1, size: 1 }, { unique: true });

// Getter
// schema.path('price').get((num) => (num / 100).toFixed(2));
// // Setter
// schema.path('price').set((num) => num * 100);

schema.plugin(paginate);


export default mongoose.model("pricings", schema);
