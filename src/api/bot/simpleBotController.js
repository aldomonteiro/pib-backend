import { updateOrder } from '../controllers/simpleOrdersController';
import { formatWhatsappNumber } from '../util/util';

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
export const basicPostComments = async (pageId, userId, text, user) => {
    const _phone = formatWhatsappNumber(userId);
    await updateOrder({
        pageId, userId,
        phone: _phone,
        waitingFor: 'typed_comments',
        postComments: text,
        user: user,
        mergeComments: true,
    });
    return true;
}
