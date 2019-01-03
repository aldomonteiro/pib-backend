import mongoose from 'mongoose';
import Flow from '../models/flow';

/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */
export const deleteManyFlows = async (pageID) => {
    return await Flow.deleteMany({ pageId: pageID }).exec();
}

export const updateFlow = async orderData => {
    const { orderId, userId, pageId, step } = orderData;

    let resultLastId = await Flow.find({ pageId: pageId, orderId: orderId }).select('id').sort('-id').limit(1).exec();
    let itemId = 1;
    if (resultLastId && resultLastId.length)
        itemId = resultLastId[0].id + 1;

    const record = new Flow({
        id: itemId,
        orderId: orderId,
        userId: userId,
        pageId: pageId,
        step: step
    });
    await record.save();
}