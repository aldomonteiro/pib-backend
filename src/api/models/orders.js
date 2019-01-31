import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  id: { type: Number, required: true },
  customerId: { type: Number },
  userId: { type: String, required: true },
  pageId: { type: String, required: true },
  status: { type: Number },
  status2: { type: String },
  status3: { type: String },
  location_lat: { type: Number },
  location_long: { type: Number },
  location_url: { type: String },
  phone: { type: String },
  address: { type: String },
  qty_total: { type: Number },
  item_complete: { type: Number },
  currentItem: { type: Number },
  currentItemSize: { type: Number },
  currentItemSplit: { type: Number },
  originalSplit: { type: Number },
  waitingForAddress: { type: Boolean },
  waitingFor: { type: String },
  total: { type: Number },
  sent_shipping_notification: { type: Date },
  sent_reject_notification: { type: Date },
  no_beverage: { type: Boolean },
  payment_type: { type: String },
  payment_change: { type: String },
  confirmed_at: { type: Date },
  delivered_at: { type: Date },
  comments: { type: String },
  rejection_reason: { type: String },
}, { timestamps: true });

schema.pre('save', function (next) {
  switch (this.status) {
    case 0: this.status2 = 'pending'; this.status3 = 'pending'; break;
    case 1: this.status2 = 'confirmed'; this.status3 = 'pending'; break;
    case 2: this.status2 = 'accepted'; this.status3 = 'pending'; break;
    case 3: this.status2 = 'printed'; this.status3 = 'pending'; break;
    case 4: this.status2 = 'delivered'; this.status3 = 'delivered'; break;
    case 8: this.status2 = 'rejected'; this.status3 = 'cancelled'; break;
    case 9: this.status2 = 'cancelled'; this.status3 = 'cancelled'; break;
    default:
      break;
  }
  next();
});

export default mongoose.model("orders", schema);
