import axios from 'axios';
import {
    basicOption,
    basicComments,
    basicPostComments,
    basicAutoReply,
} from '../bot/simpleBotController';
import { getStoreByPhone } from '../controllers/storesController';
import { emitEventBotWhats } from '../controllers/redisController';

var delayedTimeoutMSGS = {};

/**
 * Receives the user and message from whatsapp and
 * returns a message from the system.
 * @param {*} args
 */
export const w_controller = async (args) => {
    console.log('###### w_controller SIMPLE ######');
    console.dir(args);
    const { myId, message, userId, contactName, profileImg, quotedMsg } = args;
    // If user is referencing a message (quotedMsg), insert it into processedMsg.
    // Otherwise, processdMsg is the same message sent.
    const processedMsg = quotedMsg ? quotedMsg + '\n' + message : message;

    const names = contactName.split(' ');
    const first_name = names.shift();
    const last_name = names.length >= 1 ? names.join(' ') : null;
    const _profile_pic = profileImg && decodeURIComponent(profileImg.replace('https://web.whatsapp.com/pp?e=', ''));
    const user = {
        first_name: first_name,
        last_name: last_name,
        profile_pic: _profile_pic,
    }


    const store = await getStoreByPhone(myId);
    if (store) {
        console.info(`store name: ${store.name}`);
        const { pageId } = store;

        const order = await sendActions({
            action: 'BASIC_UPDATE_POSTCOMMENTS',
            pageID: pageId,
            userID: userId,
            text: processedMsg,
            user: user,
            autoReplyMsg: store.autoreply_notification,
        });

        if (store.autoreply_notification) {
            if (!order.sent_autoreply) {
                const key = order.pageId + order.userId;
                if (!delayedTimeoutMSGS[key]) {
                    delayedTimeoutMSGS[key] = setTimeout(directReply, 10000, myId, pageId, order.userId, store.autoreply_notification);
                } else {
                    clearTimeout(delayedTimeoutMSGS[key]);
                    delayedTimeoutMSGS[key] = setTimeout(directReply, 10000, myId, pageId, order.userId, store.autoreply_notification);
                }
            }
        }

        return true;
    }
}

const directReply = (whatsAppId, pageId, userId, message) => {
    const key = pageId + userId;
    delayedTimeoutMSGS[key] = null;
    basicAutoReply(pageId, userId, message);
    emitEventBotWhats(whatsAppId, userId, message);
}

// /**
//  * Receives the user and message from whatsapp and
//  * returns a message from the system.
//  * @param {*} args
//  */
// export const w_controller = async (args) => {
//     console.log('###### w_controller SIMPLE ######');
//     console.dir(args);
//     const { myId, message, userId, match, contactName, profileImg, quotedMsg } = args;
//     // If user is referencing a message (quotedMsg), insert it into processedMsg.
//     // Otherwise, processdMsg is the same message sent.
//     const processedMsg = quotedMsg ? quotedMsg + '\n' + message : message;

//     const names = contactName.split(' ');
//     const first_name = names.shift();
//     const last_name = names.length >= 1 ? names.join(' ') : null;
//     const _profile_pic = profileImg && decodeURIComponent(profileImg.replace('https://web.whatsapp.com/pp?e=', ''));
//     const user = {
//         first_name: first_name,
//         last_name: last_name,
//         profile_pic: _profile_pic,
//     }


//     const store = await getStoreByPhone(myId);
//     if (store) {
//         console.info(`store name: ${store.name}, match:${match}`);
//         const { pageId } = store;

//         // No option match, plain text.
//         if (!match) {
//             const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId });
//             // Found a pending order
//             if (pendingOrder && pendingOrder.order) {
//                 console.log(`pendingorder id:${pendingOrder.order.id} 
//                 waitingFor:${pendingOrder.order.waitingFor}
//                 coments:${pendingOrder.order.comments}`);

//                 let result;

//                 if (pendingOrder.order.waitingFor === 'typed_comments') {
//                     const oldComments = pendingOrder.order.comments;

//                     // Order not yet accepted
//                     if (pendingOrder.order.status < ORDERSTATUS_ACCEPTED) {
//                         // concat old comments and the new comments
//                         let updatedComents = oldComments ? oldComments + '\n' + processedMsg : processedMsg;

//                         result = await sendActions({
//                             action: 'BASIC_UPDATE_COMMENTS',
//                             pageID: pageId,
//                             userID: userId,
//                             text: updatedComents,
//                             user: user,
//                         });

//                     } else { // Order already accepted
//                         result = await sendActions({
//                             action: 'BASIC_UPDATE_POSTCOMMENTS',
//                             pageID: pageId,
//                             userID: userId,
//                             text: processedMsg,
//                             user: user,
//                         });
//                     }
//                 }
//                 return result;
//             } else { // No pending order found.
//                 const page = await getOnePageData(pageId);
//                 const store = await getStoreData(pageId);
//                 // Get the last order from this customer.
//                 const lastOrder = await getLastUserOrder({ pageId, userId, status: ORDERSTATUS_REJECTED });

//                 if (lastOrder) {
//                     console.log('>> Found lastOrder:', lastOrder.id);

//                     const orderDay = DateTime.fromJSDate(lastOrder.createdAt).get('day');
//                     const today = DateTime.local().get('day');

//                     if (orderDay === today && lastOrder.status < ORDERSTATUS_FINISHED) {
//                         console.log(' from today...');
//                         return;
//                     }
//                 }
//                 const tempoEntregar = store.delivery_time ? `(+ ou - ${store.delivery_time} min.)` : '';
//                 const tempoRetirar = store.pickup_time ? `(+ ou - ${store.pickup_time} min.)` : '';

//                 let replyText = page.firstResponseText.replace('$NAME', contactName);
//                 replyText = replyText + '\n\n';

//                 if (lastOrder && lastOrder.comments) {
//                     replyText = replyText + 'Seu último pedido:\n';
//                     replyText = replyText + lastOrder.comments + '\n';
//                     replyText = replyText + 'Envie *REPETIR* para fazer o mesmo pedido OU envie os dados do pedido:\n';

//                     return await sendActions({
//                         action: 'BASIC_OPTION',
//                         pageID: pageId,
//                         userID: userId,
//                         text: replyText,
//                         payload: lastOrder.comments,
//                         data: 'REPETIR',
//                         user: user,
//                         message: processedMsg,
//                     });
//                 } else {
//                     replyText = replyText + page.orderExample + '\n';
//                     replyText = replyText.replace('$TEMPOENTREGAR', tempoEntregar);
//                     replyText = replyText.replace('$TEMPORETIRAR', tempoRetirar);

//                     return await sendActions({
//                         action: 'BASIC_REPLY',
//                         pageID: pageId,
//                         userID: userId,
//                         text: replyText,
//                         user: user,
//                         data: processedMsg,
//                     });
//                 }

//             }
//         } else {
//             if (match.hasOwnProperty('text') && match.text === 'REPETIR') {
//                 return await sendActions({
//                     action: 'BASIC_REPLY',
//                     pageID: pageId,
//                     userID: userId,
//                     text: 'Ok, vamos repetir o pedido.',
//                     user: user,
//                     data: match.subText,
//                 });
//             }
//         }
//     } else {
//         console.info(`### w_controller ### did not find store for myId: ${myId}`);
//     }
// }

export const sendActions = async ({
    action, pageID, userID, multiple, data, payload,
    location, text, message, user, autoReplyMsg }) => {
    try {
        let out;
        switch (action) {
            case 'BASIC_REPLY':
                out = await directReply(pageID, userID, text, user, data);
                break;
            case 'BASIC_OPTION':
                out = await basicOption(pageID, userID, text, data, payload, user, message);
                break;
            case 'BASIC_UPDATE_COMMENTS':
                out = await basicComments(pageID, userID, text, user);
                break;
            case 'BASIC_UPDATE_POSTCOMMENTS':
                out = await basicPostComments(pageID, userID, text, user, autoReplyMsg);
                break;
            default:
                break;
        }
        return out;
    } catch (sendActionsErr) {
        console.error('action:', action, 'data:', data, 'err:', sendActionsErr);
        throw sendActionsErr;
    }
}

/**
 * Used in waboxapp
 * @param {*} to
 * @param {*} text
 */
export const waboxapp_sendMessage = async (to, text) => {
    const myToken = '3207ecb3e9815b97c7efea3f45e7f8205c646bc16cd19';
    const uid = '554499485760';
    const custom_uid = encodeURIComponent(Math.random() * 100);
    const qText = encodeURIComponent(text);
    // eslint-disable-next-line max-len
    const waboxApp = `https://www.waboxapp.com/api/send/chat?token=${myToken}&uid=${uid}&to=${to}&custom_uid=${custom_uid}&text=${qText}`;

    console.info('**** Ready to send: ****');
    console.info(waboxApp);

    return await axios.get(waboxApp);
}
