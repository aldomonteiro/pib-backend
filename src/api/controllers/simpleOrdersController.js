import Order from '../models/orders';
import util from 'util';
import { updateCustomer, getCustomerById } from './customersController';
import { getStoreData } from './storesController';
import {
    configSortQuery, configRangeQueryNew,
    configFilterQueryMultiple,
    formatAsCurrency,
    addTimedMessage,
} from '../util/util';
import { DateTime } from 'luxon';
// import { Bot, Elements } from 'facebook-messenger-bot';
// import { getOnePageToken } from './pagesController';
import { sendShippingNotification, sendRejectionNotification } from '../bot/botController';
import { emitEventBotWebapp } from './redisController';
import { emitEventWhats } from './socketController';
export const ORDERSTATUS_PENDING = 0;
export const ORDERSTATUS_CONFIRMED = 1;
export const ORDERSTATUS_VIEWED = 2;
export const ORDERSTATUS_ACCEPTED = 3;
export const ORDERSTATUS_PRINTED = 4;
export const ORDERSTATUS_DELIVERED = 5;
export const ORDERSTATUS_FINISHED = 7;
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

        // queryParam['status'] = { $gte: ORDERSTATUS_CONFIRMED };

        if (!sortObj) {
            sortObj['status'] = 'ASC';
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

        const ret = await fullOrderGetAll(queryParam, sortObj, rangeObj);
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
            console.dir(req.body);
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
                const notif = store.accept_notification;
                if (notif) {
                    doc.comments = addTimedMessage(doc.comments, notif)
                    sendNotification(store.phone, doc.userId, notif);
                }
            } else if (operation === 'PRINT') {
                doc.status = ORDERSTATUS_PRINTED;
                // sendRejectionNotification(doc.pageId, doc.userId, doc.id, rejectionExplanation);
            } else if (operation === 'DELIVER') {
                doc.status = ORDERSTATUS_DELIVERED;
                const store = await getStoreData(doc.pageId);

                const notif = store.deliver_notification;
                if (notif) {
                    doc.comments = addTimedMessage(doc.comments, notif)
                    sendNotification(store.phone, doc.userId, notif);
                }
            } else if (operation === 'MISSING_ADDRESS') {
                updateOrder = false;
                const store = await getStoreData(doc.pageId);

                const notif = store.missing_address_notification;
                if (notif) {
                    updateOrder = true;
                    doc.comments = addTimedMessage(doc.comments, notif)
                    sendNotification(store.phone, doc.userId, notif);
                }
            } else if (operation === 'OPEN_QUESTION') {
                const { question } = req.body;
                // doc.comments = doc.comments + '\n' + question;
                const store = await getStoreData(doc.pageId);

                const notif = question;
                if (notif) {
                    updateOrder = true;
                    doc.comments = addTimedMessage(doc.comments, notif)
                    sendNotification(store.phone, doc.userId, notif);
                }
            } else if (operation === 'UPDATE_ORDER_DATA') {
                const {
                    newAddress,
                    newDetails,
                    newTotal, totalNotification,
                    updatePostComments, updatedPostComment,
                    closeOrder } = req.body;
                if (newAddress)
                    doc.address = newAddress;
                else if (newDetails)
                    doc.details = newDetails;
                else if (newTotal) {
                    const formatted = newTotal.toString().replace(',', '.')
                    if (!isNaN(Number(formatted))) {
                        doc.total = Number(formatted);

                        if (totalNotification) {
                            const store = await getStoreData(doc.pageId);

                            const notif = store.total_notification;
                            if (notif) {
                                const message = notif.toString().replace('$TOTAL', formatAsCurrency(doc.total))
                                updateOrder = true;
                                doc.comments = addTimedMessage(doc.comments, message)
                                sendNotification(store.phone, doc.userId, message);
                            }
                        }
                    } else {
                        res.status(500).json({ message: 'pos.orders.messages.invalidTotal' });
                        return
                    }
                } else if (updatePostComments) {
                    if (updatePostComments === 'MERGE') {
                        doc.details = doc.details ? doc.details + '\n' + updatedPostComment : updatedPostComment;
                        const index = doc.postComments.indexOf(updatedPostComment);
                        doc.postComments.splice(index, 1);
                    } else if (updatePostComments === 'DELETE') {
                        const index = doc.postComments.indexOf(updatedPostComment);
                        doc.postComments.splice(index, 1);
                    }
                } else if (closeOrder) {
                    doc.status = ORDERSTATUS_FINISHED;
                }
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

// List one record by filtering by ID
export const getOrderJson = async (pageId, orderId) => {
    try {
        const order = await Order.findOne({ pageId: pageId, id: orderId });
        if (order) {
            const customer = await getCustomerById(pageId, order.customerId);
            return getOrderData(order, customer);
        } else return null;
    } catch (getOrderJsonErr) {
        console.error({ getOrderJsonErr });
        throw new Error(getOrderJsonErr.message);
    }
}

const getOrderData = (order, customer, totalAmount, totalItems) => {
    let cleaned = ('' + order.phone).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})(\d{4})$/)
    if (match) {
        cleaned = `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`
    }
    const jsonOrder = {
        id: order.id,
        customerId: order.customerId,
        customerName: customer ? customer.first_name + ' ' + (customer.last_name || '') : null,
        profile_pic: customer ? customer.profile_pic : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        changed_at: order.changed_at,
        status: order.status,
        status2: order.status2,
        phone: cleaned,
        address: order.address,
        total: order.total,
        details: order.details,
        comments: order.comments,
        postComments: order.postComments,
        asideTotalAmount: totalAmount,
        asideTotalItems: totalItems,
    }
    return jsonOrder;
}

export const updateOrder = async orderData => {
    try {
        const { pageId, userId, user,
            phone, addrData, confirmOrder,
            waitingFor,
            comments, postComments, mergeComments,
            sentAutoReply, autoReplyMsg,
        } = orderData;

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
        customerData.addrData = addrData;
        const customer = await updateCustomer(customerData);
        // const order = await Order.findOne({ pageId: pageId, userId: userId, status: { $lt: ORDERSTATUS_FINISHED } }).exec();
        const order = await getLastUserOrder({
            pageId: pageId, userId: userId,
            status: ORDERSTATUS_FINISHED,
        });

        if (order) {
            orderData.orderId = order.id;

            let updateOrder = false;

            if (addrData) {
                order.address = addrData.formattedAddress;
                if (addrData.location_lat && addrData.location_long) {
                    order.location_lat = addrData.location_lat;
                    order.location_long = addrData.location_long;
                }
                updateOrder = true;
            }

            if (customer > 0) {
                order.customerId = customer.id;
                updateOrder = true;
            }

            if (phone) {
                order.phone = phone;
                updateOrder = true;
            }

            if (confirmOrder) {
                if (order.status < ORDERSTATUS_CONFIRMED) {
                    order.status = ORDERSTATUS_CONFIRMED;
                    order.confirmed_at = DateTime.local();
                    updateOrder = true;
                }
            }

            if (waitingFor) {
                order.waitingFor = waitingFor;
                updateOrder = true;
            }

            if (comments) {
                if (mergeComments)
                    // order.comments = order.comments ? order.comments + '\n' + hours + comments : hours + comments;
                    order.comments = addTimedMessage(order.comments, comments);
                else
                    order.comments = comments;
                updateOrder = true;
            }

            if (postComments) {

                // This store is setup to send auto reply, but it wasn't send yet.
                // So, I am gonna put all comments into comments, not postComments.
                if (autoReplyMsg && !order.sent_autoreply) {
                    order.details = order.details ? order.details + '\n' + postComments : postComments;
                } else {

                    if (!order.postComments)
                        order.postComments = [];

                    // let arrPostComments = postComments.split('\n');
                    // order.postComments = order.postComments.concat(arrPostComments);

                    order.postComments.push(postComments);
                }

                if (mergeComments)
                    // order.comments =  order.comments ? order.comments + '\n' + hours + postComments : hours + postComments;
                    order.comments = addTimedMessage(order.comments, postComments);

                updateOrder = true;
            }

            if (sentAutoReply) {
                order.sent_autoreply = sentAutoReply;
                updateOrder = true;
            }

            if (updateOrder) {
                // changed_at keeps the last time the user sent a message.
                order.changed_at = DateTime.local();
                await order.save();
            }

            if (confirmOrder || comments || postComments) {
                // every time new comments are stored I am passing the confirmOrder parameter. So,
                // here I check if this order was not already confirmed.
                // if (confirmOrder && currentStatus < ORDERSTATUS_CONFIRMED) {
                //     // emitEvent(pageId, 'new-order', order);
                // } else 
                if (comments || postComments) {
                    const orderJson = getOrderData(order, customer);
                    emitEventBotWebapp(pageId, 'new-comment', orderJson);
                }
            }

            return order;

        } else {
            // const count = await Order.find({ pageId: pageId }).count().exec();
            // let orderId = 1;
            // if (count) orderId = count + 1;

            const resultLastId = await Order.find({ pageId: pageId }).select('id').sort('-id').limit(1).exec();
            let orderId = 1;
            if (resultLastId && resultLastId.length) orderId = resultLastId[0].id + 1;

            let _comments;
            if (mergeComments && postComments)
                // _comments = comments ? comments + '\n' + hours + postComments : hours + postComments;
                _comments = addTimedMessage(comments, postComments);
            else
                _comments = addTimedMessage(null, comments);

            // First message goes to details, not to postComments
            const order = new Order({
                id: orderId,
                pageId: pageId,
                userId: userId,
                customerId: customer.id,
                phone: phone,
                waitingFor: waitingFor,
                comments: _comments,
                details: postComments,
                status: ORDERSTATUS_PENDING,
            });
            await order.save();

            const orderJson = getOrderData(order, customer)

            emitEventBotWebapp(pageId, 'new-order', orderJson);

            return order;
        }
    } catch (updateOrderError) {
        console.error({ updateOrderError });
        throw updateOrderError;
    }
}

const fullOrderGetAll = async (queryObj, sortObj, rangeObj) => {
    const ret = {
        rangeIni: 0,
        rangeEnd: 0,
        totalCount: 0,
        ordersArray: [],
    }

    try {
        const result = await Order.find(queryObj).sort(sortObj).exec();

        ret.rangeIni = 0;
        ret.rangeEnd = result ? result.length : 0;
        ret.totalCount = result ? result.length : 0;

        if (rangeObj) {
            ret.rangeIni = rangeObj.offset <= result.length ? rangeObj.offset : result.length;
            ret.rangeEnd = (rangeObj.offset + rangeObj.limit) <= result.length ? rangeObj.offset + rangeObj.limit : result.length;
        }

        ret.ordersArray = [];
        if (result && result.length && result.length > 0) {

            // workaround to show totalamount and totalitems in the frontend, because
            // I am only sending part of the list (pagination)
            let asideTotalAmount = 0;
            let asideTotalItems = result.length;
            for (const order of result) {
                asideTotalAmount += order.total;
            }
            // workaround end: all orders will receive these values.

            // instant cache to not query the database anytime.
            const savedCustomers = {};
            for (let i = ret.rangeIni; i < ret.rangeEnd; i++) {
                const order = result[i];
                if (!savedCustomers[order.customerId]) {
                    const customer = await getCustomerById(order.pageId, order.customerId);
                    savedCustomers[order.customerId] = customer;
                }

                const jsonOrder = getOrderData(order, savedCustomers[order.customerId], asideTotalAmount, asideTotalItems);
                ret.ordersArray.push(jsonOrder);
            }
        }
        return ret;
    } catch (error) {
        console.error(error);
        return ret;
    }
}


export const getOrderPending = async orderData => {
    const { userId, pageId } = orderData;

    const _order = await Order.findOne({
        userId: userId, pageId: pageId,
        status: { $lt: ORDERSTATUS_FINISHED },
    }).exec();
    if (_order) {
        const headerOrder = {
            order: _order,
        }
        return headerOrder;
    }
    else return null;
}

export const getLastUserOrder = async orderData => {
    const { userId, pageId, status } = orderData;

    const resultLast = await Order.find({
        pageId: pageId,
        userId: userId,
        status: { $lt: status },
    }).sort('-id').limit(1).exec();
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

const sendNotification = (whatsAppId, userId, message) => {
    emitEventWhats(whatsAppId, 'notify', { userId: userId, message: message })
}

const sendDelayedMsg = async (pageID, userID, message) => {
    sendNotification(whatsAppId, userId, message);
}