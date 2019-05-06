import { updateOrder } from '../controllers/simpleOrdersController';
import { formatWhatsappNumber } from '../util/util';
// import { emitEventBotWebapp } from './redisController';

/**
 *
 * @param {*} pageId .
 * @param {*} userId .
 * @param {*} replyText is gonna be returned by bot
 * @param {*} user
 * @param {*} data message received by the bot
 */
export const basicReply = async (pageId, userId, replyText, user, data) => {
    const confirm = !!data;
    const _phone = formatWhatsappNumber(userId);
    await updateOrder(
        {
            pageId, userId,
            waitingFor: 'typed_comments',
            user: user,
            comments: data,
            confirmOrder: confirm,
            phone: _phone,
        });
    return { type: 'text', text: replyText };
}

export const basicOption = async (pageId, userId, text, optionText, data, user, message) => {
    const _phone = formatWhatsappNumber(userId);

    await updateOrder({
        pageId,
        userId,
        waitingFor: 'typed_comments',
        user: user,
        phone: _phone,
        comments: message,
    });

    const _options = [];
    _options.push({ text: optionText, subText: data, hidden: true });

    return {
        type: 'list',
        text: text,
        options: _options,
    };
}

/**
 * Just update the comments, do not return nothing.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} text
 */
export const basicComments = async (pageId, userId, text, user) => {
    await updateOrder({ pageId, userId, waitingFor: 'typed_comments', comments: text, user: user, confirmOrder: true });
    return true;
}

/**
 * Just update the comments, do not return nothing.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} text
 */
export const basicPostComments = async (pageId, userId, text, user, autoReplyMsg) => {
    const _phone = formatWhatsappNumber(userId);
    const order = await updateOrder({
        pageId, userId,
        phone: _phone,
        waitingFor: 'typed_comments',
        postComments: text,
        user: user,
        mergeComments: true,
        autoReplyMsg: autoReplyMsg,
    });
    return order;

    // WhatsappWebBot-Delay - This solution works well with delay managed by whatsapp-web-bot.
    // if (autoReplyMsg) {
    //     if (!order.sent_autoreply) {            
    //         return basicAutoReply(pageId, userId, autoReplyMsg)
    //     } else return true;
    // } else return true;
}

// WhatsappWebBot-Delay - This solution works well with delay managed by whatsapp-web-bot.
// export const basicAutoReply = async (pageId, userId, text) => {
//     await updateOrder({
//         pageId, userId, sentAutoReply: true, comments: text, mergeComments: true,
//     });
//     return { type: 'text', text: text, msgType: 'withdelay' };
// }

export const basicAutoReply = async (pageId, userId, text) => {
    await updateOrder({
        pageId, userId, sentAutoReply: true, comments: text, mergeComments: true,
    });
    return true;
}