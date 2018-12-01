import Order from '../models/orders';
import util from "util";
import { updateItem, getItems, getItemsTotal } from './itemsController';
import { customer_update } from './customersController';
import { configSortQuery, configRangeQueryNew, configFilterQuery } from '../util/util';

const ORDERSTATUS_PENDING = 0;
const ORDERSTATUS_CONFIRMED = 1;
const ORDERSTATUS_CANCELLED = 2;
const ORDERSTATUS_DELIVERED = 3;

// List all orders
// TODO: use filters in the query req.query
export const order_get_all = async (req, res) => {
    try {
        console.info(req.query.filter);

        const sortObj = configSortQuery(req.query.sort);
        const rangeObj = configRangeQueryNew(req.query.range);
        const filterObj = configFilterQuery(req.query.filter);

        let queryParam = {};
        if (req.currentUser.activePage) {
            queryParam['pageId'] = req.currentUser.activePage;
        }

        if (filterObj) {
            if (typeof filterObj.filterValues === 'Array') {
                queryParam[filterObj.filterField] = { $in: filterObj.filterValues };
            } else {
                queryParam[filterObj.filterField] = filterObj.filterValues;
            }
        }

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
                for (let i = _rangeIni; i < _rangeEnd; i++) {
                    const order = result[i];
                    const items = await getItems({ orderId: order.id, pageId: order.pageId });
                    let jsonOrder = {
                        id: order.id,
                        pageId: order.pageId,
                        customerId: order.customerId,
                        userId: order.userId,
                        status: order.status,
                        status2: order.status2,
                        qty_total: order.qty_total,
                        total: order.total,
                        createdAt: order.createdAt,
                        items: items,
                    }
                    ordersArray.push(jsonOrder);
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
            const order = await Order.findOne({ pageId: pageId, id: req.params.id });
            const items = await getItems({ orderId: order.id, pageId: pageId });
            let jsonItems = [];
            items.forEach(item => {
                let jsonItem = {
                    id: item.id,
                    flavorId: item.flavorId,
                    sizeId: item.sizeId,
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
                total: order.total,
                items: jsonItems,
            }
            res.status(200).json(jsonOrder);
        } catch (orderGetOneError) {
            console.error({ orderGetOneError });
            res.status(500).json({ message: orderGetOneError.message });
        }
    }
}


export const updateOrder = async orderData => {
    try {
        const { pageId, userId, qty, location, user, phone, addrData, completeItem, confirmOrder, waitingForAddress, waitingFor, currentItem, sizeId, calcTotal, split, originalSplit, eraseSplit } = orderData;
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

