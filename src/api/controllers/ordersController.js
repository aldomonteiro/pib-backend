import Order from '../models/orders';
import { updateItem, getItems } from './itemsController';
import { customer_update } from './customersController';

const ORDERSTATUS_PENDING = 0;
const ORDERSTATUS_CONFIRMED = 1;
const ORDERSTATUS_CANCELLED = 2;
const ORDERSTATUS_DELIVERED = 3;

export const updateOrder = async orderData => {
    const { pageId, userId, qty, location, user, phone, addrData } = orderData;

    if (user) {
        const { first_name, last_name, profile_pic } = user;
        await customer_update({ pageId, userId, first_name, last_name, profile_pic })
    } else if (phone) {
        await customer_update({ pageId, userId, phone })
    } else if (location) {
        await customer_update({ pageId, userId, location })
    } else if (addrData) {
        await customer_update({ pageId, userId, addrData })
    }

    const order = await Order.findOne({ userId: userId, pageId: pageId, status: ORDERSTATUS_PENDING }).exec();

    if (order) {
        orderData.orderId = order.id;

        if (location) {
            order.location_lat = location.lat;
            order.location_long = location.long;
            order.location_url = location.url;
        }
        if (qty) {
            order.qty_total = qty;
        }
        if (phone) {
            order.phone = phone;
        }
        if (addrData) {
            order.address = addrData.formattedAddress;
        }

        if (location || phone || qty || addrData)
            await order.save();

        await updateItem(orderData);
    } else {
        const count = await Order.find({ pageId: pageId }).count().exec();
        let orderId = 1;
        if (count) orderId = count + 1;
        const record = new Order({
            id: orderId,
            userId: userId,
            pageId: pageId,
            qty_total: qty,
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

export const getOrderPending = async orderData => {
    const { userId, pageId, isComplete } = orderData;

    const _order = await Order.findOne({ userId: userId, pageId: pageId, status: ORDERSTATUS_PENDING }).exec();

    if (isComplete && isComplete === true) {
        const _items = await getItems({ orderId: _order.id, pageId: pageId });

        const completeOrder = {
            order: _order,
            items: _items,
        };

        return completeOrder;
    } else {
        const headerOrder = {
            order: _order,
        }
        return headerOrder;
    }
}
