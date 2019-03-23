import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import util from 'util';
import Order from '../models/orders';
import Items from '../models/items';
import { getFlavors } from './flavorsController';
import { getSizes } from './sizesController';
import { getCategories } from './categoriesController';
import {
    configSortQuery, configRangeQueryNew,
    configFilterQueryMultiple,
} from '../util/util';
import { ORDERSTATUS_CONFIRMED, ORDERSTATUS_REJECTED } from './ordersController';

const ITEMSTATUS_PENDING = 0;
const ITEMSTATUS_COMPLETED = 1;

// List all orders
// TODO: use filters in the query req.query
export const item_get_all = async (req, res) => {
    try {
        const sortObj = configSortQuery(req.query.sort);
        const rangeObj = configRangeQueryNew(req.query.range);
        const filterObj = configFilterQueryMultiple(req.query.filter);
        const pageID = req.currentUser ? req.currentUser.activePage : null;

        if (pageID) {
            let queryParamOrder = {};
            let queryParamItem = {};
            queryParamOrder['pageId'] = pageID;
            queryParamItem['pageId'] = pageID;

            queryParamOrder['status'] = { $gte: ORDERSTATUS_CONFIRMED, $lt: ORDERSTATUS_REJECTED };

            if (filterObj && filterObj.filterField && filterObj.filterField.length) {
                for (let i = 0; i < filterObj.filterField.length; i++) {
                    let filter = filterObj.filterField[i];
                    const value = filterObj.filterValues[i];
                    if (filter.endsWith('_rangestart')) {
                        const date = DateTime.fromISO(value);
                        filter = filter.replace('_rangestart', '');
                        const rezonedIni = date.set({ hour: 0, minute: 0, second: 0 }).setZone('UTC');
                        queryParamOrder[filter] = { $gte: rezonedIni.toISO() };
                    } else if (filter.endsWith('_rangeend')) {
                        const date = DateTime.fromISO(value);
                        filter = filter.replace('_rangeend', '');
                        const rezonedIni = date.set({ hour: 0, minute: 0, second: 0 }).setZone('UTC');
                        const rezonedEnd = rezonedIni.plus({ days: 1 });
                        if (queryParamOrder[filter])
                            queryParamOrder[filter] = { $gte: Object.values(queryParamOrder[filter])[0], $lt: rezonedEnd.toISO() };
                        else
                            queryParamOrder[filter] = { $lt: rezonedEnd.toISO() };
                    } else {
                        queryParamItem[filter] = value;
                    }
                }
            }

            const orders = await Order.find(queryParamOrder).exec();
            const ordersArray = orders.map(order => order.id);

            queryParamItem['orderId'] = { $in: ordersArray };
            queryParamItem['flavorId'] = { $gt: 0 };

            console.info(queryParamOrder);
            console.info(queryParamItem);

            const items = await Items.find(queryParamItem).sort('flavorId').exec();
            const flavors = await getFlavors(pageID, queryParamItem['categoryId'], 'id');

            let i = 0;
            const itemsStats = [];
            for (let flavor of flavors) {
                const itemStat = {
                    id: flavor.id,
                    flavor: flavor.flavor,
                    categoryId: flavor.categoryId,
                    itemsSold: 0,
                    amountSold: 0,
                    firstSale: null,
                    lastSale: null,
                }

                while (1) {
                    if (i < items.length) {
                        if (items[i].flavorId === flavor.id) {
                            itemStat.itemsSold = itemStat.itemsSold + 1;
                            itemStat.amountSold = itemStat.amountSold + items[i].price;
                            if (!itemStat.firstSale || items[i].updatedAt < itemStat.firstSale)
                                itemStat.firstSale = items[i].updatedAt;
                            if (!itemStat.lastSale || items[i].updatedAt > itemStat.lastSale)
                                itemStat.lastSale = items[i].updatedAt;
                        } else
                            break;
                    } else
                        break;
                    i++
                }
                itemsStats.push(itemStat);
            }

            let _rangeIni = 0;
            let _rangeEnd = itemsStats.length;
            if (rangeObj) {
                _rangeIni = rangeObj.offset <= itemsStats.length ? rangeObj.offset : itemsStats.length;
                _rangeEnd = (rangeObj.offset + rangeObj.limit) <= itemsStats.length ? rangeObj.offset + rangeObj.limit : itemsStats.length;
            }
            let _totalCount = itemsStats.length;
            let resultArray = [];

            if (itemsStats && itemsStats.length > 0) {
                for (let k = _rangeIni; k < _rangeEnd; k++) {
                    resultArray.push(itemsStats[k]);
                }

                // https://stackoverflow.com/a/1129270/7948731
                if (sortObj) {
                    const field = Object.keys(sortObj)[0];
                    if (sortObj[field] === 'ASC')
                        resultArray.sort((a, b) => a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0);
                    else
                        resultArray.sort((a, b) => b[field] > a[field] ? 1 : a[field] > b[field] ? -1 : 0);
                }
            }
            // All lists must have an ID field, if not, React-admin throws a Content-Range error.
            // https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources
            res.setHeader('Content-Range', util.format('items %d-%d/%d', _rangeIni, _rangeEnd, _totalCount));
            res.status(200).json(resultArray);
        } else {
            res.setHeader('Content-Range', 'items 0-0/0');
            res.status(200).json([]);
        }
    } catch (itemGetAllErr) {
        console.error({ itemGetAllErr })
        res.status(500).json({ message: itemGetAllErr.message });
    }
}

/**
 * Delete all records from a pageID
 * @param {*} pageID
 */
export const deleteManyItems = async (pageID) => {
    return await Items.deleteMany({ pageId: pageID }).exec();
}

export const updateItem = async orderData => {
    const { orderId, currentItem, userId, pageId,
        qty, sizeId, flavorId, categoryId,
        price, completeItem, split, eraseSize } = orderData;

    if (sizeId || flavorId || categoryId || typeof completeItem === 'boolean' || eraseSize) {

        const item = await Items.findOne({
            orderId: orderId, userId: userId,
            pageId: pageId, flavorId: null,
            status: ITEMSTATUS_PENDING,
        }).exec();

        // when flavorId is set, a new item will be created.
        if (item) {
            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (eraseSize) item.sizeId = null;
            if (flavorId) item.flavorId = flavorId;
            if (categoryId) item.categoryId = categoryId;
            if (price) item.price = price;
            if (currentItem) item.itemId = currentItem;
            if (split) item.split = split;
            if (typeof completeItem === 'boolean')
                item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;

            const _split = split || item.split;
            const _price = price || item.price;

            if (_split && _split > 1 && _price) {
                item.price = _price / _split;
            }

            await item.save();
        } else {
            let resultLastId = await Items.find({ pageId: pageId, orderId: orderId }).select('id').sort('-id').limit(1).exec();
            let itemId = 1;
            if (resultLastId && resultLastId.length)
                itemId = resultLastId[0].id + 1;

            const record = new Items({
                id: itemId,
                orderId: orderId,
                itemId: currentItem,
                userId: userId,
                pageId: pageId,
                qty: qty || 1,
                split: split || 1,
                sizeId: sizeId,
                flavorId: flavorId,
                categoryId: categoryId,
                price: price,
                status: ITEMSTATUS_PENDING,
            });
            await record.save();
        }
    }
}

export const updateStatusSpecificItem = async (objectId, status) => {
    const item = await Items.findOne({ _id: mongoose.Types.ObjectId(objectId) }).exec();
    if (item) {
        item.status = status;
        await item.save();
    }
    return item;
}

/**
 * Return all items from an orderId+pageId with flavor and size.
 * completeItems=true query aux tables. default is true.
 * completeItems=false do not query aux tables.
 * @param {*} orderData 
 */
export const getItems = async orderData => {
    const { orderId, pageId, completeItems } = orderData;

    let queryAuxTables = false;
    if (typeof completeItems !== 'undefined') {
        queryAuxTables = completeItems;
    }

    const items = await Items.find({ orderId: orderId, pageId: pageId }).exec();

    let flavors = [];
    let sizes = [];
    let categories = [];

    if (queryAuxTables) {
        flavors = await getFlavors(pageId);
        sizes = await getSizes(pageId);
        categories = await getCategories(pageId);
    }

    if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].flavorId && items[i].flavorId > 0) {
                if (queryAuxTables) {
                    for (let flavor of flavors) {
                        if (flavor.id === items[i].flavorId) {
                            items[i].flavor = flavor.flavor;
                            break;
                        }
                    }
                }
            }

            if (items[i].sizeId && items[i].sizeId > 0) {
                if (queryAuxTables) {
                    for (let size of sizes) {
                        if (size.id === items[i].sizeId) {
                            items[i].size = size.size;
                            break;
                        }
                    }
                }
            }

            if (items[i].categoryId && items[i].categoryId > 0) {
                if (queryAuxTables) {
                    for (let category of categories) {
                        if (category.id === items[i].categoryId) {
                            items[i].category = category.name;
                            break;
                        }
                    }
                }
            }
        }
        return items;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} pageId
 * @param {*} userId
 * @param {*} itemId
 */
export const deleteItem = async (pageID, orderID, itemID) => {
    try {
        const result = await Items.deleteMany({ pageId: pageID, orderId: orderID, itemId: itemID }).exec();
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const deletePendingItem = async (pageID, orderID) => {
    try {
        const result = await Items.deleteMany({ pageId: pageID, orderId: orderID, status: ITEMSTATUS_PENDING }).exec();
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const reorderItems = async (pageID, orderID) => {
    try {
        const items = await Items.find({ pageId: pageID, orderId: orderID }).sort({ itemId: 1 }).exec();

        let seq = 1;
        let changedId = 0;
        for (let item of items) {
            let currentId = item.itemId;
            if (currentId !== changedId) {
                if (currentId !== seq) {
                    await Items.updateMany(
                        { pageId: pageID, orderId: orderID, itemId: currentId },
                        { $set: { itemId: seq } }).exec();
                }
                changedId = currentId;
                seq++;
            }
        }
        return seq;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Updates all items with same itemID, setting their status as COMPLETED. It is used
 * when an item has split, and the status is PENDING whle the user is choosing all the flavors.
 * @param {*} pageID
 * @param {*} orderID
 * @param {*} itemID
 */
export const updateItemStatus = async (pageID, orderID, itemID) => {
    try {
        const result = await Items.updateMany(
            { pageId: pageID, orderId: orderID, itemId: itemID },
            { $set: { status: ITEMSTATUS_COMPLETED } }).exec();
        console.info(result);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Calculate total price of an orderId+pageId
 * @param {*} orderData
 */
export const getItemsTotal = async orderData => {
    const { orderId, pageId } = orderData;
    const items = await getItems({ orderId, pageId, completeItems: false });

    let _total = 0;

    if (items && items.length) {
        for (const item of items) {
            _total += item.price ? item.price : 0;
        }
    }

    return _total;
}

export const cancelItems = async (pageId, orderId) => {
    await Items.deleteMany({ pageId: pageId, orderId: orderId }, (err) => {
        if (err) {
            console.error(`Items.deleteMany orderId: ${orderId}`);
            console.error(err);
        }
    });
}

