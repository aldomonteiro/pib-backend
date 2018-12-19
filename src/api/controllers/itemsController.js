import mongoose from 'mongoose';
import Items from '../models/items';
import { getFlavor } from './flavorsController';
import { getOnePricingByFlavor } from './pricingsController';
import { getSize } from './sizesController';
import { getBeverage } from './beveragesController';


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
    const { orderId, userId, pageId,
        qty, sizeId, flavorId,
        beverageId, beveragePrice, completeItem, split, originalSplit } = orderData;

    if (qty || sizeId || flavorId || beverageId || typeof completeItem === 'boolean') {
        let _searchStatus = ITEMSTATUS_PENDING;
        // Received a completeItem = false from botController, so,
        // the search is for a completed item.
        if (typeof completeItem === 'boolean' && !completeItem)
            _searchStatus = ITEMSTATUS_COMPLETED;

        const item = await Items.findOne({ orderId: orderId, userId: userId, pageId: pageId, status: _searchStatus }).exec();
        if (item) {
            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (flavorId) item.flavorId = flavorId;
            if (beverageId) {
                item.qty = 1;
                item.beverageId = beverageId;
                item.price = beveragePrice;
            }
            if (split) item.split = split;
            if (typeof completeItem === 'boolean')
                item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;

            if (item.sizeId && item.flavorId) {
                const pricing = await getOnePricingByFlavor(pageId, item.sizeId, item.flavorId);
                if (pricing) {
                    const _qty = item.qty && item.qty > 0 ? item.qty : 1;
                    item.price = (pricing.price * _qty)
                    if (item.split && item.split > 1) {
                        item.price = item.price / item.split;
                    }
                }
            }

            if (qty || sizeId || flavorId || split || beverageId || originalSplit || typeof completeItem === 'boolean')
                await item.save();
        }
        else {
            let resultLastId = await Items.find({ pageId: pageId, orderId: orderId }).select('id').sort('-id').limit(1).exec();
            let itemId = 1;
            if (resultLastId && resultLastId.length)
                itemId = resultLastId[0].id + 1;

            let price = 0;
            if (beverageId && beveragePrice) {
                price = beveragePrice;
            }

            const record = new Items({
                id: itemId,
                orderId: orderId,
                userId: userId,
                pageId: pageId,
                qty: qty,
                sizeId: sizeId,
                flavorId: flavorId,
                beverageId: beverageId,
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

    let queryAuxTables = true;
    if (typeof completeItems !== 'undefined') {
        queryAuxTables = completeItems;
    }

    const items = await Items.find({ orderId: orderId, pageId: pageId }).exec();
    if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].flavorId && items[i].flavorId > 0) {
                if (queryAuxTables) {
                    const flavor = await getFlavor(pageId, items[i].flavorId);
                    if (flavor)
                        items[i].flavor = flavor.flavor;
                }
            }

            if (items[i].sizeId && items[i].sizeId > 0) {
                if (queryAuxTables) {
                    const size = await getSize(pageId, items[i].sizeId);
                    if (size)
                        items[i].size = size.size;
                }
            }

            if (items[i].beverageId && items[i].beverageId > 0) {
                if (queryAuxTables) {
                    const beverage = await getBeverage(pageId, items[i].beverageId);
                    if (beverage)
                        items[i].beverage = beverage.name;
                }
            }
        }
        return items;
    } else {
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

