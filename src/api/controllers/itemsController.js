import Items from '../models/items';
import { getFlavor } from './flavorsController';
import { getSize } from './sizesController';


const ITEMSTATUS_PENDING = 0;
const ITEMSTATUS_COMPLETED = 1;

export const updateItem = async orderData => {
    const { orderId, userId, pageId, qty, sizeId, flavorId, completeItem } = orderData;

    if (qty || sizeId || flavorId) {
        const item = await Items.findOne({ orderId: orderId, status: ITEMSTATUS_PENDING }).exec();
        if (item) {
            if (qty) item.qty = qty;
            if (sizeId) item.sizeId = sizeId;
            if (flavorId) item.flavorId = flavorId;
            if (completeItem) item.status = ITEMSTATUS_COMPLETED;

            if (qty || sizeId || flavorId || completeItem)
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

export const getItems = async orderData => {
    const { orderId, pageId } = orderData;

    const items = await Items.find({ orderId: orderId, pageId: pageId }).exec();
    if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
            const flavor = await getFlavor(pageId, items[i].flavorId);
            items[i].flavor = flavor.flavor;

            const size = await getSize(pageId, items[i].sizeId);
            items[i].size = size.size;
        }
        return items;
    } else {
        return null;
    }
}
