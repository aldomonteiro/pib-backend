import Order from '../models/orders';
import util from "util";
import { updateItem, getItems, getItemsTotal } from './itemsController';
import { customer_update } from './customersController';
import { getStoreData } from './storesController';
import { configSortQuery, configRangeQueryNew, configFilterQueryMultiple, distanceBetweenCoordinates } from '../util/util';
import { DateTime } from 'luxon';
// import { Bot, Elements } from 'facebook-messenger-bot';
// import { getOnePageToken } from './pagesController';
import { sendShippingNotification, sendRejectionNotification } from '../bot/botController';
const ORDERSTATUS_PENDING = 0;
const ORDERSTATUS_CONFIRMED = 1;
const ORDERSTATUS_ACCEPTED = 2;
const ORDERSTATUS_PRINTED = 3;
const ORDERSTATUS_DELIVERED = 4;
const ORDERSTATUS_REJECTED = 8;
const ORDERSTATUS_CANCELLED = 9;

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

        if (!sortObj) {
            sortObj['createdAt'] = "DESC";
        }

        if (filterObj && filterObj.filterField && filterObj.filterField.length) {
            for (let i = 0; i < filterObj.filterField.length; i++) {
                const filter = filterObj.filterField[i];
                const value = filterObj.filterValues[i];
                if (Array.isArray(value)) {
                    if (value.length === 2) {
                        const dateIni = DateTime.fromISO(value[0]);
                        const dateEnd = DateTime.fromISO(value[1]);

                        if (!dateIni.invalid && !dateEnd.invalid)// is date
                            queryParam[filter] = { $gte: dateIni.toISO(), $lt: dateEnd.toISO() };
                        else
                            queryParam[filter] = { $in: value };
                    } else
                        queryParam[filter] = { $in: value };
                } else {
                    const date = DateTime.fromISO(value);
                    if (!date.invalid) { // is a date
                        const nextDay = date.plus({ days: 1 });
                        queryParam[filter] = { $gte: date.toISODate(), $lt: nextDay.toISODate() };
                    } else
                        queryParam[filter] = value;
                }
            }
        }

        console.info('orders get_all queryParam:', queryParam, filterObj);

        Order.find(queryParam).sort(sortObj).exec(async (findError, result) => {
            if (findError) {
                console.error({ findError });
                res.status(500).json({ message: findError.message });
            } else {
                let _rangeIni = 0;
                let _rangeEnd = result.length;
                if (rangeObj) {
                    _rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
                    _rangeEnd = (rangeObj.offset + rangeObj.limit) <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
                }
                let _totalCount = result.length;
                let ordersArray = new Array();
                if (result && result.length && result.length > 0) {
                    const store = await getStoreData(result[0].pageId);
                    for (let i = _rangeIni; i < _rangeEnd; i++) {
                        const order = result[i];
                        const items = await getItems({ orderId: order.id, pageId: order.pageId, completeItems: false });
                        const distanceFromStore = distanceBetweenCoordinates(store.location_lat, store.location_long, order.location_lat, order.location_long);
                        let formattedDistance;
                        if (distanceFromStore < 1) {
                            formattedDistance = (distanceFromStore * 100).toFixed(2) + ' m';
                        } else {
                            formattedDistance = distanceFromStore.toFixed(2) + ' km';
                        }
                        let jsonOrder = {
                            id: order.id,
                            pageId: order.pageId,
                            customerId: order.customerId,
                            userId: order.userId,
                            phone: order.phone,
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
                        }
                        ordersArray.push(jsonOrder);
                    }
                }
                res.setHeader('Content-Range', util.format("orders %d-%d/%d", _rangeIni, _rangeEnd, _totalCount));
                res.status(200).json(ordersArray);
            }
        });
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

            if (operation === 'REJECT') {
                const { rejectionExplanation } = req.body;

                doc.status = ORDERSTATUS_REJECTED;
                doc.sent_reject_notification = DateTime.local();
                doc.rejection_reason = rejectionExplanation;
                sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            }
            else if (operation === 'ACCEPT') {
                doc.status = ORDERSTATUS_ACCEPTED;
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            }
            else if (operation === 'PRINT') {
                doc.status = ORDERSTATUS_PRINTED;
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            }
            else if (operation === 'DELIVER') {
                doc.status = ORDERSTATUS_DELIVERED;
                if (!doc.sent_shipping_notification) {
                    await sendShippingNotification(doc.pageId, doc.userId, doc.id);
                    doc.sent_shipping_notification = DateTime.local();
                }
            }
            else {
                if (req.body.status2 === 'ordered') {
                    doc.status = ORDERSTATUS_CONFIRMED;
                } else if (req.body.status2 === 'delivered') {
                    doc.status = ORDERSTATUS_DELIVERED;
                    doc.delivered_at = DateTime.local();
                } else if (req.body.status2 === 'cancelled') {
                    doc.status = ORDERSTATUS_DELIVERED;
                }

                if (doc.status === ORDERSTATUS_DELIVERED) {
                    if (!doc.sent_shipping_notification) {
                        console.info("I am going to send to " + doc.userId + ", about the order number:" + doc.id + " a shipping notification");
                        await sendShippingNotification(doc.pageId, doc.userId, doc.id);
                        doc.sent_shipping_notification = DateTime.local();
                    }
                }
            }
            await doc.save();
            const jsonOrder = await getOrderJson(pageId, doc.id);
            res.status(200).json(jsonOrder);
        }
        catch (orderUpdateErr) {
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
        const items = await getItems({ pageId: pageId, orderId: orderId });
        const store = await getStoreData(order.pageId);
        const distanceFromStore = distanceBetweenCoordinates(store.location_lat, store.location_long, order.location_lat, order.location_long);
        let jsonItems = [];
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
        let jsonOrder = {
            id: order.id,
            customerId: order.customerId,
            createdAt: order.createdAt,
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
            confirmed_at: order.confirmed_at,
            deliverd_at: order.delivered_at,
            payment_type: order.payment_type,
            payment_change: order.payment_change,
            comments: order.comments,
        }
        return jsonOrder;
    } catch (getOrderJsonErr) {
        console.error({ getOrderJsonErr });
        throw new Error(getOrderJsonErr.message);
    }
}


export const updateOrder = async orderData => {
    try {
        const { pageId, userId, qty, location, user,
            phone, addrData, completeItem, confirmOrder,
            waitingForAddress, waitingFor, currentItem, sizeId, calcTotal,
            split, originalSplit, eraseSplit, noBeverage,
            paymentType, paymentChange } = orderData;

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

            if (currentItem) {
                order.currentItem = currentItem;
                updateOrder = true;
            }

            if (qty) {
                order.qty_total = qty;
                updateOrder = true;

                // order has total quantity.
                // items are always 1. this variable will be passed to updateItem
                orderData.qty = 1;
            }

            // when I have a split, I am forcing size and qty
            if (typeof split === 'number') {
                order.currentItemSplit = split;
                orderData.sizeId = order.currentItemSize;
                orderData.qty = 1;

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
            if (addrData) {
                order.address = addrData.formattedAddress;
                if (addrData.location_lat && addrData.location_long) {
                    order.location_lat = addrData.location_lat;
                    order.location_long = addrData.location_long;
                }
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
            }

            if (typeof calcTotal === 'boolean') {
                const total = await getItemsTotal({ orderId: order.id, pageId: order.pageId });
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
            await record.save();
            orderData.orderId = record.id;
            await updateItem(orderData);
        }
    } catch (updateOrderError) {
        console.error({ updateOrderError });
        throw updateOrderError;
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

