import TextOrder from '../models/texto_orders';
import util from 'util';
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
export const text_order_get_all = async (req, res) => {
    try {
        const sortObj = configSortQuery(req.query.sort);
        const rangeObj = configRangeQueryNew(req.query.range);
        const filterObj = configFilterQueryMultiple(req.query.filter);

        let queryParam = {};
        if (req.currentUser.activePage) {
            queryParam['pageId'] = req.currentUser.activePage;
        }

        queryParam['status'] = { $gte: ORDERSTATUS_CONFIRMED };

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

        TextOrder.find(queryParam).sort(sortObj).exec(async (findError, result) => {
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
                let ordersArray = [];
                if (result && result.length && result.length > 0) {

                    // workaround to show totalamount and totalitems in the frontend, because
                    // I am only sending part of the list (pagination)
                    let asideTotalAmount = 0;
                    let asideTotalItems = result.length;
                    for (const order of result) {
                        asideTotalAmount = asideTotalAmount + order.total;
                    }
                    // workaround end: all orders will receive these values.

                    for (let i = _rangeIni; i < _rangeEnd; i++) {
                        const textOrder = result[i];
                        const deliverAt = textOrder.deliverTime
                            ? DateTime.fromJSDate(textOrder.confirmedAt).plus({ minutes: textOrder.deliverTime })
                            : textOrder.confirmedAt;

                        let jsonOrder = {
                            id: textOrder.id,
                            pageId: textOrder.pageId,
                            customerId: textOrder.customerId,
                            userId: textOrder.userId,
                            phone: textOrder.phone,
                            details: textOrder.details,
                            deliverTime: textOrder.deliverTime,
                            status: textOrder.status,
                            status2: textOrder.status2,
                            status3: textOrder.status3,
                            total: textOrder.total,
                            deliverAt: deliverAt,
                            createdAt: textOrder.createdAt,
                            updatedAt: textOrder.updatedAt,
                            confirmedAt: textOrder.confirmedAt,
                            deliveredAt: textOrder.deliveredAt,
                            asideTotalAmount: asideTotalAmount,
                            asideTotalItems: asideTotalItems,
                        }
                        ordersArray.push(jsonOrder);
                    }
                }
                res.setHeader('Content-Range',
                    util.format('text_orders %d-%d/%d',
                        _rangeIni, _rangeEnd, _totalCount));
                res.status(200).json(ordersArray);
            }
        });
    } catch (orderGetAllErr) {
        console.error({ orderGetAllErr })
        res.status(500).json({ message: orderGetAllErr.message });
    }
};

// List one record by filtering by ID
export const text_order_get_one = async (req, res) => {
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
export const text_order_update = async (req, res) => {
    if (req.body && req.body.id) {
        try {
            const { id, operation } = req.body;
            const pageId = req.currentUser.activePage;
            const doc = await TextOrder.findOne({ pageId: pageId, id: id });

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
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            } else if (operation === 'PRINT') {
                doc.status = ORDERSTATUS_PRINTED;
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            } else if (operation === 'DELIVER') {
                doc.status = ORDERSTATUS_DELIVERED;
                if (doc.source !== 'whatsapp') {
                    if (!doc.sent_shipping_notification) {
                        await sendShippingNotification(doc.pageId, doc.userId, doc.id);
                        doc.sent_shipping_notification = DateTime.local();
                    }
                }
            } else {
                if (req.body.status2 === 'ordered') {
                    doc.status = ORDERSTATUS_CONFIRMED;
                } else if (req.body.status2 === 'delivered') {
                    doc.status = ORDERSTATUS_DELIVERED;
                    doc.deliveredAt = DateTime.local();
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
export const deleteManyTextOrders = async (pageID) => {
    return await TextOrder.deleteMany({ pageId: pageID }).exec();
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
        const order = await TextOrder.findOne({ pageId: pageId, id: orderId });
        const customer = await getCustomerById(pageId, order.customerId);
        const deliverAt = order.deliverTime
            ? DateTime.fromJSDate(order.confirmedAt).plus({ minutes: order.deliverTime })
            : order.confirmedAt;

        let jsonOrder = {
            id: order.id,
            customerId: order.customerId,
            customerName: customer.first_name + ' ' + customer.last_name,
            phone: order.phone,
            deliverAt: deliverAt,
            deliverTime: order.deliverTime,
            status: order.status,
            status2: order.status2,
            status3: order.status3,
            total: order.total,
            createdAt: order.createdAt,
            confirmedAt: order.confirmedAt,
            deliveredAt: order.deliveredAt,
        }
        return jsonOrder;
    } catch (getOrderJsonErr) {
        console.error({ getOrderJsonErr });
        throw new Error(getOrderJsonErr.message);
    }
}


export const updateOrder = async orderData => {
    try {
        const {
            pageId,
            userId,
            user,
            details,
            deliverTime,
            phone,
            confirmOrder } = orderData;

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
        customerID = await updateCustomer(customerData);
        const textOrder = await TextOrder.findOne({
            pageId: pageId,
            userId: userId,
            status: ORDERSTATUS_PENDING,
        }).exec();

        if (textOrder) {
            orderData.orderId = textOrder.id;

            let updateOrder = false;

            if (deliverTime) {
                textOrder.deliverTime = deliverTime;
                updateOrder = true;
            }

            if (customerID > 0) {
                textOrder.customerId = customerID;
                updateOrder = true;
            }

            if (phone) {
                textOrder.phone = phone;
                updateOrder = true;
            }

            if (confirmOrder) {
                textOrder.status = ORDERSTATUS_CONFIRMED;
                textOrder.confirmedAt = DateTime.local();
                updateOrder = true;
            }

            if (details) {
                textOrder.details = details;
                updateOrder = true;
            }

            if (updateOrder)
                await textOrder.save();

            if (confirmOrder) {
                emitEvent(pageId, 'new-order', { id: textOrder.id, confirmedAt: textOrder.confirmedAt });
            }

        } else {
            const resultLastId = await TextOrder.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
            let orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;

            const record = new TextOrder({
                id: orderId,
                pageId: pageId,
                userId: userId,
                status: ORDERSTATUS_PENDING,
            });
            await record.save();
        }
    } catch (updateTextOrderErr) {
        console.error({ updateTextOrderErr });
        throw updateTextOrderErr;
    }
}

export const getOrderPending = async orderData => {
    const { userId, pageId } = orderData;

    const _order = await TextOrder.findOne({
        userId: userId, pageId: pageId,
        status: ORDERSTATUS_PENDING,
    }).exec();

    if (_order) {
        const headerOrder = {
            order: _order,
        }
        return headerOrder;
    } else return null;
}

export const getLastOrder = async orderData => {
    const { userId, pageId } = orderData;

    const orders = await TextOrder.find({
        pageId: pageId,
        userId: userId,
        status: ORDERSTATUS_CONFIRMED,
    }).select('id confirmedAt')
        .sort('-confirmedAt')
        .exec();

    if (orders && orders.length)
        return orders;
    else return [];
}


export const getOrdersCustomerStat = async orderData => {
    const { pageId, customerId } = orderData;

    const orders = await TextOrder.find({ pageId: pageId, customerId: customerId }).select('createdAt total').sort('createdAt').exec();
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

    await TextOrder.findOneAndRemove({ pageId: pageId, userId: userId, status: ORDERSTATUS_PENDING },
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
