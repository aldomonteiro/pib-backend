import Items from '../models/items';
import mongoose from 'mongoose';
import { getFlavor } from './flavorsController';
import { getSize } from './sizesController';


const ITEMSTATUS_PENDING = 0;
const ITEMSTATUS_COMPLETED = 1;

export const updateItem = async orderData => {
    const { orderId, userId, pageId, qty, sizeId, flavorId, completeItem } = orderData;

    if (qty || sizeId || flavorId || typeof completeItem === 'boolean') {
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
            if (typeof completeItem === 'boolean')
                item.status = completeItem === true ? ITEMSTATUS_COMPLETED : ITEMSTATUS_PENDING;

            if (qty || sizeId || flavorId || typeof completeItem === 'boolean')
                await item.save();
        }
        else {
            const record = new Items({
                orderId: orderId,
                userId: userId,
                pageId: pageId,
                qty: qty,
                sizeId: sizeId,
                flavorId: flavorId,
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
}

export const getItems = async orderData => {
    const { orderId, pageId } = orderData;

    const items = await Items.find({ orderId: orderId, pageId: pageId }).exec();
    if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].flavorId && items[i].flavorId > 0) {
                const flavor = await getFlavor(pageId, items[i].flavorId);
                if (flavor)
                    items[i].flavor = flavor.flavor;
            }

            if (items[i].sizeId && items[i].sizeId > 0) {
                const size = await getSize(pageId, items[i].sizeId);
                if (size)
                    items[i].size = size.size;
            }
        }
        return items;
    } else {
        return null;
    }
}
