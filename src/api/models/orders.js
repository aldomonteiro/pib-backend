import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: Number, required: true },
    userId: { type: String, required: true },
    pageId: { type: String, required: true },
    customerId: { type: Number },
    status: { type: Number },
    status2: { type: String },
    status3: { type: String },
    location_lat: { type: Number },
    location_long: { type: Number },
    location_url: { type: String },
    phone: { type: String },
    address: { type: String },
    qty: { type: Number },
    qty_total: { type: Number },
    item_complete: { type: Number },
    currentItem: { type: Number },
    currentItemSize: { type: Number },
    currentItemCategory: { type: Number },
    currentItemSplit: { type: Number },
    originalSplit: { type: Number },
    waitingForAddress: { type: Boolean },
    waitingFor: { type: String },
    waitingForData: Schema.Types.Mixed,
    undo: { type: String },
    total: { type: Number },
    sent_shipping_notification: { type: Date },
    sent_reject_notification: { type: Date },
    payment_type: { type: String },
    payment_change: { type: String },
    confirmed_at: { type: Date },
    delivered_at: { type: Date },
    changed_at: { type: Date }, // date and time where user changed something.
    // Different from updatedAt, with has any updates, including the ones by the system.
    details: { type: String },
    comments: { type: String },
    postComments: [{ type: String }],
    rejection_reason: { type: String },
    backToConfirmation: { type: String },
    deliver_type: { type: String },
    deliver_time: { type: Number },
    source: { type: String },
    distance_from_store: { type: Number },
    delivery_fee: { type: Number },
    surcharge_percent: { type: Number },
    surcharge_amount: { type: Number },
    store_address: { type: String },
    sent_autoreply: { type: Boolean },
}, { timestamps: true });

schema.pre('save', function (next) {
    switch (this.status) {
        case 0: this.status2 = 'pending'; this.status3 = 'pending'; break;
        case 1: this.status2 = 'confirmed'; this.status3 = 'pending'; break;
        case 2: this.status2 = 'viewed'; this.status3 = 'pending'; break;
        case 3: this.status2 = 'accepted'; this.status3 = 'pending'; break;
        case 4: this.status2 = 'printed'; this.status3 = 'pending'; break;
        case 5: this.status2 = 'delivered'; this.status3 = 'delivered'; break;
        case 7: this.status2 = 'finished'; this.status3 = 'finished'; break;
        case 8: this.status2 = 'rejected'; this.status3 = 'cancelled'; break;
        case 9: this.status2 = 'cancelled'; this.status3 = 'cancelled'; break;
        default:
            break;
    }
    next();
});

export default mongoose.model('orders', schema);
