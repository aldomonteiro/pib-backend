import Order from '../models/orders';
import util from "util";
import { updateItem, getItems } from './itemsController';
import { customer_update } from './customersController';
import { configSortQuery, configRangeQuery } from '../util/util';

const ORDERSTATUS_PENDING = 0;
const ORDERSTATUS_CONFIRMED = 1;
const ORDERSTATUS_CANCELLED = 2;
const ORDERSTATUS_DELIVERED = 3;

// List all orders
// TODO: use filters in the query req.query
export const order_get_all = async (req, res) => {
    // Getting the sort from the requisition
    var sortObj = configSortQuery(req.query.sort);
    // Getting the range from the requisition
    var rangeObj = configRangeQuery(req.query.range);

    let options = {
        offset: rangeObj['offset'],
        limit: rangeObj['limit'],
        sort: sortObj,
        lean: true,
        leanWithId: false,
    };

    let query = {};
    let pageID = null;
    if (req.currentUser.activePage) {
        pageID = req.currentUser.activePage;
        query = Order.find({ pageId: pageID });
    }

    Order.paginate(query, options, async (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            for (let order of result.docs) {
                const items = await getItems({ orderId: order.id, pageId: order.pageId });
                order.items = items;
            }
            res.setHeader('Content-Range', util.format("orders %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result.docs);
        }
    });
};

// List one record by filtering by ID
export const order_get_one = (req, res) => {
    if (req.params && req.params.id) {
        const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
        Order.findOne({ pageId: pageId, id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errMsg });
            }
            else {
                res.status(200).json(doc);
            }
        });
    }
}


export const updateOrder = async orderData => {
    try {
        const { pageId, userId, qty, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, waitingFor, sizeId } = orderData;
        let customerID = 0;
        let customerData = {}
        customerData.pageId = pageId;
        customerData.userId = userId;
        if (user) {
            const { first_name, last_name, profile_pic } = user;
            customerData.first_name = first_name;
            customerData.last_name = last_name;
            customerData.profile_pic = profile_pic;
        }
        customerData.phone = phone;
        customerData.location = location;
        customerData.addrData = addrData;
        customerID = await customer_update(customerData);
        const order = await Order.findOne({ pageId: pageId, userId: userId, status: ORDERSTATUS_PENDING }).exec();

        if (order) {
            orderData.orderId = order.id;

            let updateOrder = false;
            if (location) {
                order.location_lat = location.lat;
                order.location_long = location.long;
                order.location_url = location.url;
                updateOrder = true;
            }
            if (qty) {
                order.qty_total = qty;
                updateOrder = true;

                // order has total quantity.
                // items are always 1. this variable will be passed to updateItem
                orderData.qty = 1;
            }
            if (customerID > 0) {
                order.customerId = customerID;
                updateOrder = true;
            }

            if (phone) {
                order.phone = phone;
                updateOrder = true;
            }
            if (addrData) {
                order.address = addrData.formattedAddress;
                updateOrder = true;
            }

            if (sizeId) {
                order.currentItemSize = sizeId;
                updateOrder = true;
            }

            if (completeItem) {
                if (order.item_complete) order.item_complete = order.item_complete + 1;
                else order.item_complete = 1;
                updateOrder = true;
            }

            if (confirmOrder) {
                order.status = ORDERSTATUS_CONFIRMED;
                updateOrder = true;
            }

            if (typeof waitingForAddress === 'boolean') {
                order.waitingForAddress = waitingForAddress;
                updateOrder = true;
            }

            if (waitingFor) {
                order.waitingFor = waitingFor;
                updateOrder = true;
            }

            if (updateOrder)
                await order.save();

            await updateItem(orderData);
        } else {
            // const count = await Order.find({ pageId: pageId }).count().exec();
            // let orderId = 1;
            // if (count) orderId = count + 1;

            const resultLastId = await Order.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
            let orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;

            console.info({ resultLastId });

            const record = new Order({
                id: orderId,
                pageId: pageId,
                userId: userId,
                qty_total: qty ? qty : 0,
                location_lat: location ? location.lat : null,
                location_long: location ? location.long : null,
                location_url: location ? location.url : null,
                waitingForAddress: typeof waitingForAddress === 'boolean' ? waitingForAddress : false,
                status: ORDERSTATUS_PENDING,
            });
            const saved = await record.save();
            orderData.orderId = saved.id;
            await updateItem(orderData);
        }
    } catch (updateOrderError) {
        console.error({ updateOrderError });
        throw (error);
    }
}

export const getOrderPending = async orderData => {
    const { userId, pageId, isComplete } = orderData;

    const _order = await Order.findOne({ userId: userId, pageId: pageId, status: ORDERSTATUS_PENDING }).exec();
    if (_order) {
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
    } else return null;
}
