import Order from '../models/orders';
import util from 'util';
import { updateItem, getItems, getItemsTotal, cancelItems } from './itemsController';
import { updateCustomer, getCustomerById } from './customersController';
import { getStoreData, calcDeliveryFee } from './storesController';
import {
    configSortQuery, configRangeQueryNew,
    configFilterQueryMultiple, distanceBetweenCoordinates,
} from '../util/util';
import { DateTime } from 'luxon';
// import { Bot, Elements } from 'facebook-messenger-bot';
// import { getOnePageToken } from './pagesController';
import { sendShippingNotification, sendRejectionNotification } from '../bot/botController';
import { emitEvent } from './redisController';
import { emitEventWhats } from './socketController';
export const ORDERSTATUS_PENDING = 0;
export const ORDERSTATUS_CONFIRMED = 1;
export const ORDERSTATUS_VIEWED = 2;
export const ORDERSTATUS_ACCEPTED = 3;
export const ORDERSTATUS_PRINTED = 4;
export const ORDERSTATUS_DELIVERED = 5;
export const ORDERSTATUS_REJECTED = 8;
export const ORDERSTATUS_CANCELLED = 9;

// List all orders
// TODO: use filters in the query req.query
export const order_get_all = async (req, res) => {
    try {
        const sortObj = configSortQuery(req.query.sort);
        const rangeObj = configRangeQueryNew(req.query.range);
        const filterObj = configFilterQueryMultiple(req.query.filter);

        let queryParam = {};
        if (req.currentUser.activePage) {
            queryParam['pageId'] = req.currentUser.activePage;
        }

        // simple orders are querying all orders, even the ones not confirmed.
        // queryParam['status'] = { $gte: ORDERSTATUS_CONFIRMED };

        if (!sortObj) {
            sortObj['createdAt'] = 'DESC';
        }

        if (filterObj && filterObj.filterField && filterObj.filterField.length) {
            for (let i = 0; i < filterObj.filterField.length; i++) {
                let filter = filterObj.filterField[i];
                const value = filterObj.filterValues[i];
                if (Array.isArray(value)) {
                    if (value.length === 2) {
                        const dateIni = DateTime.fromISO(value[0]).set({ hour: 0, minute: 0, second: 0 }).setZone('UTC');
                        const dateEnd = DateTime.fromISO(value[1]).set({ hour: 23, minute: 59, second: 59 }).setZone('UTC');

                        if (!dateIni.invalid && !dateEnd.invalid)// is date
                            queryParam[filter] = { $gte: dateIni.toISO(), $lt: dateEnd.toISO() };
                        else
                            queryParam[filter] = { $in: value };
                    } else
                        queryParam[filter] = { $in: value };
                } else {
                    const date = DateTime.fromISO(value);
                    if (!date.invalid) { // is a date
                        // date comes with the current time, so, I am setting it to midnight.
                        // Mongoose stores data on GMT timezone
                        if (filter.endsWith('_rangestart')) {
                            filter = filter.replace('_rangestart', '');
                            const rezonedIni = date.set({ hour: 0, minute: 0, second: 0 }).setZone('UTC');
                            queryParam[filter] = { $gte: rezonedIni.toISO() };
                        } else if (filter.endsWith('_rangeend')) {
                            filter = filter.replace('_rangeend', '');
                            const rezonedIni = date.set({ hour: 0, minute: 0, second: 0 }).setZone('UTC');
                            const rezonedEnd = rezonedIni.plus({ days: 1 });
                            if (queryParam[filter])
                                queryParam[filter] = { $gte: Object.values(queryParam[filter])[0], $lt: rezonedEnd.toISO() };
                            else
                                queryParam[filter] = { $lt: rezonedEnd.toISO() };
                        } else {
                            const rezonedIni = date.set({ hour: 0, minute: 0, second: 0 }).setZone('UTC');
                            const rezonedEnd = rezonedIni.plus({ days: 1 });
                            queryParam[filter] = { $gte: rezonedIni.toISO(), $lt: rezonedEnd.toISO() };
                        }
                    } else
                        queryParam[filter] = value;
                }
            }
        }

        let ret;
        if (req.body.simpleOrder)
            ret = await simpleOrderGetAll(queryParam, sortObj, rangeObj);
        else ret = await fullOrderGetAll(queryParam, sortObj, rangeObj);

        console.log('ret from fullOrderGetAll:', ret);

        res.setHeader('Content-Range',
            util.format('orders %d-%d/%d',
                ret.rangeIni, ret.rangeEnd, ret.totalCount));
        res.status(200).json(ret.ordersArray);

    } catch (orderGetAllErr) {
        console.error({ orderGetAllErr })
        res.status(500).json({ message: orderGetAllErr.message });
    }
};

// List one record by filtering by ID
export const order_get_one = async (req, res) => {
    if (req.params && req.params.id) {
        try {
            const pageId = req.currentUser.activePage ? req.currentUser.activePage : null;
            const jsonOrder = await getOrderJson(pageId, req.params.id);
            res.status(200).json(jsonOrder);
        } catch (orderGetOneError) {
            console.error({ orderGetOneError });
            res.status(500).json({ message: orderGetOneError.message });
        }
    }
}

// UPDATE
export const order_update = async (req, res) => {
    if (req.body && req.body.id) {
        try {
            const { id, operation } = req.body;
            const pageId = req.currentUser.activePage;
            const doc = await Order.findOne({ pageId: pageId, id: id });

            let updateOrder = true;

            if (operation === 'REJECT') {
                const { rejectionExplanation } = req.body;

                doc.status = ORDERSTATUS_REJECTED;
                doc.sent_reject_notification = DateTime.local();
                doc.rejection_reason = rejectionExplanation;
                sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            } else if (operation === 'VIEW') {
                doc.status = ORDERSTATUS_VIEWED;
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            } else if (operation === 'ACCEPT') {
                doc.status = ORDERSTATUS_ACCEPTED;
                const store = await getStoreData(doc.pageId);
                sendNotification(store.phone, doc.userId, store.accept_notification);
            } else if (operation === 'PRINT') {
                doc.status = ORDERSTATUS_PRINTED;
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            } else if (operation === 'DELIVER') {
                doc.status = ORDERSTATUS_DELIVERED;
                const store = await getStoreData(doc.pageId);
                sendNotification(store.phone, doc.userId, store.deliver_notification);
            } else if (operation === 'MISSING_ADDRESS') {
                updateOrder = false;
                const store = await getStoreData(doc.pageId);
                sendNotification(store.phone, doc.userId, store.missing_address_notification);
            } else if (operation === 'OPEN_QUESTION') {
                const { question } = req.body;
                doc.comments = doc.comments + '\n' + question;
                const store = await getStoreData(doc.pageId);
                sendNotification(store.phone, doc.userId, question);
            } else {
                if (req.body.status2 === 'ordered') {
                    doc.status = ORDERSTATUS_CONFIRMED;
                } else if (req.body.status2 === 'delivered') {
                    doc.status = ORDERSTATUS_DELIVERED;
                    doc.delivered_at = DateTime.local();
                } else if (req.body.status2 === 'cancelled') {
                    doc.status = ORDERSTATUS_DELIVERED;
                }
                if (doc.status === ORDERSTATUS_DELIVERED) {
                    if (doc.source !== 'whatsapp') {
                        if (!doc.sent_shipping_notification) {
                            console.info('I am going to send to ' + doc.userId + ', about the order number:' + doc.id + ' a shipping notification');
                            await sendShippingNotification(doc.pageId, doc.userId, doc.id);
                            doc.sent_shipping_notification = DateTime.local();
                        }
                    }
                }
            }
            if (updateOrder)
                await doc.save();
            const jsonOrder = await getOrderJson(pageId, doc.id);
            res.status(200).json(jsonOrder);
        } catch (orderUpdateErr) {
            console.error(orderUpdateErr);
            res.status(500).json({ message: orderUpdateErr.message });
        }
    }
}

/**
 * Delete all records from a pageID
 * @param {*} pageID
 */
export const deleteManyOrders = async (pageID) => {
    return await Order.deleteMany({ pageId: pageID }).exec();
}

// export const sendShippingNotification = async order => {
//     const { accessToken } = await getOnePageToken(order.pageId);

//     const _txt = 'O seu pedido número ' + order.id + ' acabou de sair para entrega. Bom apetite!';

//     const out = new Elements();
//     out.add({ text: _txt });
//     await Bot.send_message_tag(accessToken, order.userId, out);
// }

// List one record by filtering by ID
export const getOrderJson = async (pageId, orderId) => {
    try {
        const order = await Order.findOne({ pageId: pageId, id: orderId });
        const customer = await getCustomerById(pageId, order.customerId);
        const items = await getItems({ pageId: pageId, orderId: orderId, completeItems: true });
        const store = await getStoreData(order.pageId);
        const distanceFromStore = distanceBetweenCoordinates(store.location_lat, store.location_long, order.location_lat, order.location_long);
        const deliverAt = order.deliver_time
            ? DateTime.fromJSDate(order.confirmed_at).plus({ minutes: order.deliver_time })
            : order.updatedAt;
        let jsonItems = [];
        if (items && items.length > 0) {
            items.forEach(item => {
                let jsonItem = {
                    id: item.id,
                    flavorId: item.flavorId,
                    sizeId: item.sizeId,
                    beverageId: item.beverageId,
                    beverage: item.beverage,
                    price: item.price,
                    qty: item.qty,
                    split: item.split,
                    flavor: item.flavor,
                    size: item.size,
                }
                jsonItems.push(jsonItem);
            });
        }
        let jsonOrder = {
            id: order.id,
            customerId: order.customerId,
            customerName: customer.first_name + ' ' + customer.last_name,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            deliverAt: deliverAt,
            confirmed_at: order.confirmed_at,
            delivered_at: order.delivered_at,
            deliver_type: order.deliver_type,
            deliver_time: order.deliver_time,
            qty_total: order.qty_total,
            status: order.status,
            status2: order.status2,
            status3: order.status3,
            phone: order.phone,
            address: order.address,
            total: order.total,
            items: jsonItems,
            distanceFromStore: distanceFromStore,
            location_lat: order.location_lat,
            location_long: order.location_long,
            payment_type: order.payment_type,
            payment_change: order.payment_change,
            comments: order.comments,
            delivery_fee: order.delivery_fee,
            surcharge_percent: order.surcharge_percent,
            surcharge_amount: order.surcharge_amount,
        }
        return jsonOrder;
    } catch (getOrderJsonErr) {
        console.error({ getOrderJsonErr });
        throw new Error(getOrderJsonErr.message);
    }
}


export const updateOrder = async orderData => {
    try {
        const { pageId, userId, source, deliverType, deliverTime, qty, qty_total, location, user,
            phone, addrData, completeItem, confirmOrder,
            waitingForAddress, waitingFor, waitingForData, undo, currentItem, sizeId, calcTotal,
            originalSplit, split, currentItemSplit, eraseSplit, noBeverage,
            paymentType, paymentChange, backToConfirmation, comments,
            categoryId, surcharge_percent, surcharge_amount,
            storeAddress } = orderData;

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
        customerID = await updateCustomer(customerData);
        const order = await Order.findOne({ pageId: pageId, userId: userId, status: ORDERSTATUS_PENDING }).exec();

        if (order) {
            orderData.orderId = order.id;

            let updateOrder = false;

            let calcDistance = {
                calc: false,
                lat: 0,
                long: 0,
            }

            if (location) {
                order.location_lat = location.lat;
                order.location_long = location.long;
                order.location_url = location.url;
                updateOrder = true;

                calcDistance.calc = true;
                calcDistance.lat = location.lat;
                calcDistance.long = location.long;
            }

            if (addrData) {
                order.address = addrData.formattedAddress;
                if (addrData.location_lat && addrData.location_long) {
                    order.location_lat = addrData.location_lat;
                    order.location_long = addrData.location_long;

                    calcDistance.calc = true;
                    calcDistance.lat = addrData.location_lat;
                    calcDistance.long = addrData.location_long;
                }
                updateOrder = true;
            }

            if (calcDistance.calc) {
                const storeData = await getStoreData(pageId);
                if (storeData.location_lat && storeData.location_long) {
                    const distanceFromStore = distanceBetweenCoordinates(storeData.location_lat, storeData.location_long, calcDistance.lat, calcDistance.long)
                    order.distance_from_store = distanceFromStore;
                    order.delivery_fee = calcDeliveryFee(storeData.delivery_fees, distanceFromStore);
                }
            }

            if (currentItem) {
                order.currentItem = currentItem;
                updateOrder = true;
            }

            if (source) {
                order.source = source;
                updateOrder = true;
            }

            if (qty) {
                order.qty = qty;
                updateOrder = true;

                // order has total quantity.
                // items are always 1. this variable will be passed to updateItem
                orderData.qty = 1;
            }

            if (deliverType) {
                order.deliver_type = deliverType;
                updateOrder = true;
            }

            if (deliverTime) {
                order.deliver_time = deliverTime;
                updateOrder = true;
            }

            if (qty_total) {
                order.qty_total = qty_total;
                updateOrder = true;
            }

            if (originalSplit) {
                // split increments the items number (+originalSplit)
                //  and removes 1 (that was the original quantity asked by the user)
                order.qty_total = order.qty_total + originalSplit - 1;
                // saving the originalSplit in the order and...
                order.originalSplit = originalSplit;
                // ...always saving the split as originalSplit in item.
                // because the split in the order will be decreased until 1
                orderData.split = originalSplit;
                updateOrder = true;
            }

            // starts from 1 until originalSplit
            if (currentItemSplit) {
                order.currentItemSplit = currentItemSplit;
                updateOrder = true;
            }

            // originalSplit is passed as parameter only once: when user choose the
            // split division. split is passed as the same value as originalSplit, so, here
            // I am changing the quantity to assure the item will receive correct data.
            // originalSplit changes the quantity, so, it can't be passed more than once.
            if (split) {
                orderData.sizeId = order.currentItemSize;
                orderData.qty = 1;
            }

            // eraseSplit is sent when I am gonna ask the user
            // about the next pizza.
            if (eraseSplit) {
                order.originalSplit = null;
                order.currentItemSplit = null;
                updateOrder = true;
            }

            if (customerID > 0) {
                order.customerId = customerID;
                updateOrder = true;
            }

            if (phone) {
                order.phone = phone;
                updateOrder = true;
            }

            if (sizeId) {
                order.currentItemSize = sizeId;
                updateOrder = true;
            }

            if (surcharge_percent) {
                order.surcharge_percent = surcharge_percent / 100;
                updateOrder = true;
            }

            if (surcharge_amount) {
                order.surcharge_amount = surcharge_amount;
                updateOrder = true;
            }

            if (storeAddress) {
                order.store_address = storeAddress;
                updateOrder = true;
            }

            /** EraseSize only in the item, because, user can navigate through categories
             * of the same size.
             */
            // if (eraseSize) {
            //     order.currentItemSize = null;
            // }

            if (completeItem) {
                if (order.item_complete) order.item_complete = order.item_complete + 1;
                else order.item_complete = 1;
                updateOrder = true;
            }

            if (confirmOrder) {
                order.status = ORDERSTATUS_CONFIRMED;
                order.confirmed_at = DateTime.local();
                updateOrder = true;
            } else {
                // when updateorder with flavor, I dont have neither split nor originalSplit
                // but, if the order has an originalSplit, I am going to send it to the item.
                // This code should run only if I am not confirming the order.
                if (order.originalSplit && order.originalSplit > 1) {
                    orderData.split = order.originalSplit;
                    updateOrder = true;
                }
            }

            if (typeof waitingForAddress === 'boolean') {
                order.waitingForAddress = waitingForAddress;
                updateOrder = true;
            }

            if (waitingFor) {
                order.waitingFor = waitingFor;
                updateOrder = true;

                if (!undo)
                    order.undo = null;
            }

            if (waitingForData) {
                order.waitingForData = waitingForData;
                updateOrder = true;
            }

            if (undo) {
                order.undo = undo;
                updateOrder = true;
            }

            if (backToConfirmation) {
                order.backToConfirmation = backToConfirmation;
                updateOrder = true;
            }

            if (comments) {
                order.comments = comments;
                updateOrder = true;
                emitEvent(pageId, 'new-comment', { id: order.id, updatedAt: Date.now() });
            }

            if (typeof calcTotal === 'boolean') {
                let total = await getItemsTotal({ orderId: order.id, pageId: order.pageId });
                if (order.delivery_fee > 0) total += order.delivery_fee;
                if (order.surcharge_percent > 0) total += total * order.surcharge_percent;
                if (order.surcharge_amount > 0) total += order.surcharge_amount;

                if (total > 0 && total !== order.total) {
                    order.total = total;
                    updateOrder = true;
                }
            }

            if (typeof noBeverage === 'boolean') {
                order.no_beverage = noBeverage;
                updateOrder = true;
            }

            if (paymentType) {
                order.payment_type = paymentType;
                updateOrder = true;
            }

            if (paymentChange) {
                order.payment_change = paymentChange;
                updateOrder = true;
            }

            if (categoryId) {
                order.currentItemCategory = categoryId;
                updateOrder = true;
            }

            if (updateOrder)
                await order.save();

            await updateItem(orderData);

            if (confirmOrder) {
                emitEvent(pageId, 'new-order', { id: order.id, confirmed_at: order.confirmed_at });
            }

        } else {
            // const count = await Order.find({ pageId: pageId }).count().exec();
            // let orderId = 1;
            // if (count) orderId = count + 1;

            const resultLastId = await Order.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
            let orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;

            const record = new Order({
                id: orderId,
                pageId: pageId,
                userId: userId,
                qty_total: qty || 0,
                location_lat: location ? location.lat : null,
                location_long: location ? location.long : null,
                location_url: location ? location.url : null,
                waitingForAddress: typeof waitingForAddress === 'boolean' ? waitingForAddress : false,
                waitingFor: waitingFor,
                comments: comments,
                deliver_type: deliverType,
                status: ORDERSTATUS_PENDING,
            });
            await record.save();
            orderData.orderId = record.id;
            await updateItem(orderData);
        }
    } catch (updateOrderError) {
        console.error({ updateOrderError });
        throw updateOrderError;
    }
}

const fullOrderGetAll = async (queryObj, sortObj, rangeObj) => {
    try {

        const ret = {
            rangeIni: 0,
            rangeEnd: 0,
            totalCount: 0,
            ordersArray: [],
        }

        const result = await Order.find(queryObj).sort(sortObj).exec();

        ret.rangeIni = 0;
        ret.rangeEnd = result.length;
        if (rangeObj) {
            ret.rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
            ret.rangeEnd = (rangeObj.offset + rangeObj.limit) <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
        }
        ret.totalCount = result.length;
        ret.ordersArray = [];
        if (result && result.length && result.length > 0) {

            // workaround to show totalamount and totalitems in the frontend, because
            // I am only sending part of the list (pagination)
            let asideTotalAmount = 0;
            let asideTotalItems = result.length;
            for (const order of result) {
                asideTotalAmount = asideTotalAmount + order.total;
            }
            // workaround end: all orders will receive these values.

            const store = await getStoreData(result[0].pageId);
            for (let i = ret.rangeIni; i < ret.rangeEnd; i++) {
                const order = result[i];
                const items = await getItems({ orderId: order.id, pageId: order.pageId, completeItems: false });
                const distanceFromStore = distanceBetweenCoordinates(store.location_lat, store.location_long, order.location_lat, order.location_long);
                let formattedDistance;
                if (distanceFromStore < 1) {
                    formattedDistance = (distanceFromStore * 100).toFixed(2) + ' m';
                } else {
                    formattedDistance = distanceFromStore.toFixed(2) + ' km';
                }

                const refDate = order.confirmed_at || order.createdAt;

                const deliverAt = order.deliver_time
                    ? DateTime.fromJSDate(refDate).plus({ minutes: order.deliver_time })
                    : refDate;

                let jsonOrder = {
                    id: order.id,
                    pageId: order.pageId,
                    customerId: order.customerId,
                    userId: order.userId,
                    phone: order.phone,
                    deliverAt: deliverAt,
                    deliver_type: order.deliver_type,
                    deliver_time: order.deliver_time,
                    address: order.address,
                    status: order.status,
                    status2: order.status2,
                    status3: order.status3,
                    qty_total: order.qty_total,
                    total: order.total,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    items: items,
                    distanceFromStore: formattedDistance,
                    location_lat: order.location_lat,
                    location_long: order.location_long,
                    confirmed_at: order.confirmed_at,
                    deliverd_at: order.delivered_at,
                    payment_type: order.payment_type,
                    payment_change: order.payment_change,
                    comments: order.comments,
                    delivery_fee: order.delivery_fee,
                    surcharge_percent: order.surcharge_percent,
                    surcharge_amount: order.surcharge_amount,
                    asideTotalAmount: asideTotalAmount,
                    asideTotalItems: asideTotalItems,
                }
                ret.ordersArray.push(jsonOrder);
            }
        }
        return ret;
    } catch (error) {

    }
}

const simpleOrderGetAll = async (query, sort, rangeObj) => {
    let ret = {
        rangeIni: 0,
        rangeEnd: 0,
        totalCount: 0,
        ordersArray: [],
    }

    Order.find(query).sort(sort).exec(async (findError, result) => {
        if (findError) {
            console.error({ findError });
            throw new Error(findError.message);
        } else {
            ret.rangeIni = 0;
            ret.rangeEnd = result.length;
            if (rangeObj) {
                ret.rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
                ret.rangeEnd = (rangeObj.offset + rangeObj.limit) <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
            }
            ret.totalCount = result.length;
            ret.ordersArray = [];
            if (result && result.length && result.length > 0) {

                // workaround to show totalamount and totalitems in the frontend, because
                // I am only sending part of the list (pagination)
                let asideTotalAmount = 0;
                let asideTotalItems = result.length;
                for (const order of result) {
                    asideTotalAmount = asideTotalAmount + order.total;
                }
                // workaround end: all orders will receive these values.

                const store = await getStoreData(result[0].pageId);
                for (let i = ret.rangeIni; i < ret.rangeEnd; i++) {
                    const order = result[i];
                    const items = await getItems({ orderId: order.id, pageId: order.pageId, completeItems: false });
                    const distanceFromStore = distanceBetweenCoordinates(store.location_lat, store.location_long, order.location_lat, order.location_long);
                    let formattedDistance;
                    if (distanceFromStore < 1) {
                        formattedDistance = (distanceFromStore * 100).toFixed(2) + ' m';
                    } else {
                        formattedDistance = distanceFromStore.toFixed(2) + ' km';
                    }
                    const deliverAt = order.deliver_time
                        ? DateTime.fromJSDate(order.confirmed_at).plus({ minutes: order.deliver_time })
                        : order.confirmed_at;

                    let jsonOrder = {
                        id: order.id,
                        pageId: order.pageId,
                        customerId: order.customerId,
                        userId: order.userId,
                        phone: order.phone,
                        deliverAt: deliverAt,
                        deliver_type: order.deliver_type,
                        deliver_time: order.deliver_time,
                        address: order.address,
                        status: order.status,
                        status2: order.status2,
                        status3: order.status3,
                        qty_total: order.qty_total,
                        total: order.total,
                        createdAt: order.createdAt,
                        items: items,
                        distanceFromStore: formattedDistance,
                        location_lat: order.location_lat,
                        location_long: order.location_long,
                        confirmed_at: order.confirmed_at,
                        deliverd_at: order.delivered_at,
                        payment_type: order.payment_type,
                        payment_change: order.payment_change,
                        comments: order.comments,
                        delivery_fee: order.delivery_fee,
                        surcharge_percent: order.surcharge_percent,
                        surcharge_amount: order.surcharge_amount,
                        asideTotalAmount: asideTotalAmount,
                        asideTotalItems: asideTotalItems,
                    }
                    ret.ordersArray.push(jsonOrder);
                }
            }
        }
    });

    return ret;
}

export const getOrderPending = async orderData => {
    const { userId, pageId, isComplete } = orderData;

    const _order = await Order.findOne({
        userId: userId, pageId: pageId,
        status: { $lt: ORDERSTATUS_DELIVERED },
    }).exec();
    if (_order) {
        if (isComplete && isComplete === true) {
            const _items = await getItems({ orderId: _order.id, pageId: pageId, completeItems: isComplete });

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

export const getLastUserOrder = async orderData => {
    const { userId, pageId } = orderData;

    const resultLast = await Order.find({
        pageId: pageId,
        userId: userId,
        status: { $gte: ORDERSTATUS_DELIVERED },
    }).sort('-updatedAt').limit(1).exec();
    if (resultLast && resultLast.length)
        return resultLast[0];
    else return null;
}

export const getLastOrder = async pageID => {
    const resultLastId = await Order.find({ pageId: pageID, status: { $gte: ORDERSTATUS_CONFIRMED } }).select('id').sort('-confirmed_at').limit(1).exec();
    if (resultLastId && resultLastId.length)
        return resultLastId[0].id;
    else return 0;
}

export const getLastPendingOrders = async pageID => {
    const orders = await Order.find({ pageId: pageID, status: ORDERSTATUS_CONFIRMED })
        .select('id confirmed_at')
        .sort('-confirmed_at')
        .exec();

    if (orders && orders.length)
        return orders;
    else return [];
}


export const getOrdersCustomerStat = async orderData => {
    const { pageId, customerId } = orderData;

    const orders = await Order.find({ pageId: pageId, customerId: customerId }).select('createdAt total').sort('createdAt').exec();
    let total_spent = 0;
    let nb_orders = 0;
    let first_order = Date.now();
    let last_order = null;
    for (const order of orders) {
        total_spent += order.total;
        nb_orders += 1;

        if (first_order >= order.createdAt) {
            first_order = order.createdAt;
        }
        if (last_order <= order.createdAt) {
            last_order = order.createdAt;
        }
    }
    return { total_spent, nb_orders, first_order, last_order };
}

export const cancelOrder = async orderData => {
    const { pageId, userId } = orderData;

    await Order.findOneAndRemove({ pageId: pageId, userId: userId, status: ORDERSTATUS_PENDING },
        async (err, res) => {
            if (!err) {
                if (res) {
                    const orderId = res.id;
                    await cancelItems(pageId, orderId);
                } else {
                    console.error('Items from this order shall be deleted manually');
                    console.info(res);
                }
            } else {
                console.error('Order.findOneAndDelete');
                console.error(err);
            }
        });
}

const sendNotification = (whatsAppId, userId, message) => {
    emitEventWhats(whatsAppId, 'notify', { userId: userId, message: message })
}

/**
 * Trying to reduce the number of calls to getFlavors and getSizes.
 * @param {*} flavors
 * @param {*} sizes
 * @param {*} orderData
 */
// const getPerformaticItems = async (flavors, sizes, orderData) => {
//     orderData.completeItems = false;
//     let items = await getItems(orderData);
//     for (let i = 0; i < items.length; i++) {
//         let item = items[i];
//         if (flavors[item.flavorId]) {
//             item.flavor = flavors[item.flavorId];
//         } else {
//             const flavor = await getFlavor(orderData.pageId, item.flavorId);
//             if (flavor) {
//                 item.flavor = flavors[flavor.id] = flavor.flavor;
//             }
//         }
//         if (sizes[item.sizeId]) {
//             item.size = sizes[item.sizeId];
//         } else {
//             const size = await getSize(orderData.pageId, item.sizeId);
//             if (size) {
//                 item.size = sizes[size.id] = size.size;
//             }
//         }
//     }
//     return items;
// }

