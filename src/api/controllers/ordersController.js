import Order from '../models/orders';
import { updateItem, getItems } from './itemsController';

const ORDERSTATUS_PENDING = 0;
const ORDERSTATUS_CONFIRMED = 1;
const ORDERSTATUS_CANCELLED = 2;
const ORDERSTATUS_DELIVERED = 3;

export const updateOrder = async orderData => {
    const { userId, pageId, location, phone } = orderData;

    const order = await Order.findOne({ userId: userId, pageId: pageId, status: ORDERSTATUS_PENDING }).exec();

    if (order) {
        orderData.orderId = order.id;

        if (location) {
            order.location_lat = location.lat;
            order.location_long = location.long;
            order.location_url = location.url;
            await order.save();
        } else if (phone) {
            order.phone = phone;
            await order.save();
        }
        else {
            await updateItem(orderData);
        }
    } else {
        const count = await Order.find({ pageId: pageId }).count().exec();
        let orderId = 1;
        if (count) orderId = count + 1;
        const record = new Order({
            id: orderId,
            userId: userId,
            pageId: pageId,
            location_lat: location ? location.lat : null,
            location_long: location ? location.long : null,
            location_url: location ? location.url : null,
            status: ORDERSTATUS_PENDING,
        });
        const saved = await record.save();
        orderData.orderId = saved.id;
        await updateItem(orderData);
    }
}

export const showOrderPending = async orderData => {
    const userId = orderData.userId;
    const pageId = orderData.pageId;

    const _order = await Order.findOne({ userId: userId, pageId: pageId, status: ORDERSTATUS_PENDING }).exec();
    const _items = await getItems({ orderId: _order.id, pageId: pageId });

    const completeOrder = {
        order: _order,
        items: _items,
    };

    console.error({ completeOrder });

    return completeOrder;
}
