import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    sizeId: { type: Number, required: true },
    price: { type: Number, required: true },
    pageId: { type: String, required: true },
  }, { timestamps: true },
);

schema.index({ pageId: 1, categoryId: 1, sizeId: 1 }, { unique: true });

// Getter
// schema.path('price').get((num) => (num / 100).toFixed(2));
// // Setter
// schema.path('price').set((num) => num * 100);

schema.plugin(paginate);


export default mongoose.model('pricings', schema);
