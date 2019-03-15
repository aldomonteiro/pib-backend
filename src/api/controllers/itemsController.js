import mongoose from 'mongoose';
import Items from '../models/items';
import { getFlavors } from './flavorsController';
import { getOnePricingByFlavor } from './pricingsController';
import { getSizes } from './sizesController';
import { getCategories } from './categoriesController';

const ITEMSTATUS_PENDING = 0;
const ITEMSTATUS_COMPLETED = 1;


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

