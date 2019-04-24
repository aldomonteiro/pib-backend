import axios from 'axios';
import { DateTime } from 'luxon';
import {
    basicReply,
    basicOption,
    basicComments,
} from '../bot/botController';
import { getStoreByPhone, getStoreData } from '../controllers/storesController';
import { getOrderPending, getLastUserOrder } from '../controllers/ordersController';
import { getOnePageData } from '../controllers/pagesController';

/**
 * Receives the user and message from whatsapp and
 * returns a message from the system.
 * @param {*} args
 */
export const w_controller = async (args) => {
    console.info('###### w_controller SIMPLE ######');
    console.info(args);
    const { myId, message, userId, match, location, contactName, profileImg } = args;

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
        console.info(`store name: ${store.name}, match:${match}`);
        const { pageId } = store;

        if (!match) {
            const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId });
            if (pendingOrder && pendingOrder.order) {
                console.log(`pendingorder id:${pendingOrder.order.id} 
                waitingFor:${pendingOrder.order.waitingFor}`);

                let result;

                if (pendingOrder.order.waitingFor === 'typed_address') {
                    const addrData = {
                        manual_addres: true,
                        formattedAddress: message,
                    }
                    result = await sendActions({
                        action: 'CONFIRM_ADDRESS',
                        pageID: pageId, userID: userId, addrData, user,
                    });
                } else if (pendingOrder.order.waitingFor === 'typed_comments') {
                    const oldComments = pendingOrder.order.comments;

                    // concat old comments and the new comments
                    let updatedComents = oldComments ? oldComments + '\n' + message : message;

                    result = await sendActions({
                        action: 'BASIC_UPDATE_COMMENTS',
                        pageID: pageId,
                        userID: userId,
                        text: updatedComents,
                        user: user,
                    });
                }
                return result;
            } else {
                const page = await getOnePageData(pageId);
                const store = await getStoreData(pageId);
                // Get the last order from this customer.
                const lastOrder = await getLastUserOrder({ pageId, userId });

                if (lastOrder) {
                    console.log('>> Found lastOrder:', lastOrder.id);

                    const orderDay = DateTime.fromJSDate(lastOrder.confirmed_at).get('day');
                    const today = DateTime.local().get('day');

                    if (orderDay === today) {
                        console.log(' from today...');
                        return;
                    }
                }
                const tempoEntregar = store.delivery_time ? `(+ ou - ${store.delivery_time} min.)` : '';
                const tempoRetirar = store.pickup_time ? `(+ ou - ${store.pickup_time} min.)` : '';

                let replyText = page.firstResponseText.replace('$NAME', contactName);
                replyText = replyText + '\n\n';

                if (lastOrder && lastOrder.comments) {
                    replyText = replyText + 'Seu último pedido:\n';
                    replyText = replyText + lastOrder.comments + '\n';
                    replyText = replyText + 'Envie *REPETIR* para fazer o mesmo pedido OU envie os dados do pedido:\n';

                    return await sendActions({
                        action: 'BASIC_OPTION',
                        pageID: pageId,
                        userID: userId,
                        text: replyText,
                        payload: lastOrder.comments,
                        data: 'REPETIR',
                        user: user,
                    });
                } else {
                    replyText = replyText + page.orderExample + '\n';
                    replyText = replyText.replace('$TEMPOENTREGAR', tempoEntregar);
                    replyText = replyText.replace('$TEMPORETIRAR', tempoRetirar);

                    return await sendActions({
                        action: 'BASIC_REPLY',
                        pageID: pageId,
                        userID: userId,
                        text: replyText,
                        user: user,
                    });
                }

            }
        } else {
            if (match.hasOwnProperty('text') && match.text === 'REPETIR') {
                return await sendActions({
                    action: 'BASIC_REPLY',
                    pageID: pageId,
                    userID: userId,
                    text: 'Ok, vamos repetir o pedido.',
                    user: user,
                    data: match.subText,
                });
            }
        }
    } else {
        console.info(`### w_controller ### did not find store for myId: ${myId}`);
    }
}

export const sendActions = async ({
    action, pageID, userID, multiple, data, payload,
    location, text, addrData, user }) => {
    try {
        let out;
        switch (action) {
            case 'BASIC_REPLY':
                out = await basicReply(pageID, userID, text, user, data);
                break;
            case 'BASIC_OPTION':
                out = await basicOption(pageID, userID, text, data, payload, user);
                break;
            case 'BASIC_UPDATE_COMMENTS':
                out = await basicComments(pageID, userID, text, user);
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
