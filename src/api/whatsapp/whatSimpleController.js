import axios from 'axios';
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
                        pageID: pageId, userID: userId, text: updatedComents,
                    });
                }
                return result;
            } else {
                const page = await getOnePageData(pageId);
                const store = await getStoreData(pageId);
                // Get the last order from this customer.
                const lastOrder = await getLastUserOrder({ pageId, userId });
                console.log('>> Found lastOrder:', lastOrder.id);

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
            let objectWithEvent;
            if (match.hasOwnProperty('event'))
                objectWithEvent = match;
            else if (match.hasOwnProperty('buttons')) {
                if (match.buttons.hasOwnProperty('event'))
                    objectWithEvent = match.buttons;
            }

            if (objectWithEvent) {
                const { event, data } = objectWithEvent;
                const multiple = data ? (data.multiple ? data.multiple : 1) : 1;
                const action = mapEventsActions(event, data);
                const result = await sendActions({
                    action, pageID: pageId,
                    userID: userId, data, location, multiple, user,
                });
                return result;
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
        }
    } else {
        console.info(`### w_controller ### did not find store for myId: ${myId}`);
    }
}

const mapEventsActions = (event, data) => {
    switch (event) {
        case 'MAIN_MENU':
            return 'SEND_MAIN_MENU'
        case 'ORDER_CONTINUE_ORDER':
            switch (data) {
                case 'continueorder_yes':
                    return 'CHECK_LAST_ACTION';
                case 'continueorder_no':
                    return 'CONTINUE_ORDER_NO';
            }
            break;
        case 'STOP_ORDER_OPTIONS':
            switch (data) {
                case 'stoporder_init':
                    return 'CANCEL_PENDING_ORDER';
                case 'stoporder_human':
                    return 'PASS_THREAD_CONTROL';
            }
            break;
        case 'MAIN-MENU':
            switch (data) {
                case 'CARDAPIO_PAYLOAD':
                    return 'SEND_CARDAPIO';
                case 'PEDIDO_PAYLOAD':
                    return 'ASK_FOR_DELIVER';
                case 'HORARIO_PAYLOAD':
                    return 'SEND_HORARIO';
                case 'stoporder_human':
                    return 'PASS_THREAD_CONTROL';
            }
            break;
        case 'ORDER_WANT_ORDER':
            switch (data) {
                case 'wantorder_yes':
                    return 'ASK_FOR_DELIVER';
                case 'wantorder_no':
                    return 'SEND_MAIN_MENU';
            }
            break;
        case 'ORDER_DELIVER':
            switch (data.type) {
                case 'delivery':
                    return 'SHOW_DELIVER_CHECK_ADDRESS'
                case 'pickup':
                    return 'SHOW_DELIVER_ASK_FOR_CATEGORY';
            }
            break;
        case 'CORRECT_SAVED_ADDRESS':
            return 'SHOW_ADDRESS_ASK_FOR_CATEGORY';
        case 'WRONG_SAVED_ADDRESS':
            return 'ASK_FOR_LOCATION';
        case 'LOCATION':
            switch (data) {
                case 'location_location':
                    return 'LOCATION_CONFIRM_ADDRESS';
            }
            break;
        case 'LOCATION_ADDRESS':
            switch (data) {
                case 'incorrect_address':
                    return 'ASK_TO_TYPE_ADDRESS';
                default:
                    return 'SHOW_ADDRESS_ASK_FOR_CATEGORY';
            }
        case 'ORDER_QTY':
            switch (data) {
                case 'qty_more':
                    return 'ASK_FOR_QUANTITY_MORE';
                case 'qty_less':
                    return 'ASK_FOR_QUANTITY';
                default:
                    return 'SHOW_QUANTITY_ASK_FOR_SIZE';
            }
        case 'ORDER_SIZE':
            return 'SHOW_SIZE_CHECK_SPLIT';
        case 'ORDER_SPLIT':
            return 'SHOW_SPLIT_CHECK_FLAVOR';
        case 'ORDER_FLAVOR':
            switch (data.option) {
                case 'flavors_more':
                    return 'ASK_FOR_FLAVOR';
                default:
                    return 'SHOW_FLAVOR_CHECK_ITEM';
            }
        case 'ORDER_PIZZA_CONFIRMATION':
            switch (data.type) {
                case 'confirmation_yes':
                    return 'ASK_FOR_PAYMENT_TYPE';
                default:
                    return 'ASK_FOR_CHANGE_ORDER';
            }
        case 'ORDER_WANT_CHANGE':
            return 'ASK_FOR_SPECIFIC_ITEM';
        case 'ORDER_CHANGE':
            switch (data) {
                case 'change_quantity':
                    return 'ASK_FOR_QUANTITY';
                case 'change_size':
                    return 'ASK_FOR_SIZE';
                case 'change_flavor':
                    return 'ASK_FOR_FLAVOR';
                case 'change_address':
                    return 'ASK_FOR_LOCATION';
                case 'change_item':
                    return 'CHANGE_ITEM';
                case 'cancel_item':
                    return 'CANCEL_ITEM';
            }
            break;
        case 'ORDER_CHANGE_ITEM':
            return 'CHANGE_ITEM';
        case 'ORDER_CANCEL_ITEM':
            return 'CANCEL_ITEM';
        case 'ORDER_CONFIRM_BEVERAGE':
            switch (data) {
                case 'beverage_yes':
                    return 'ASK_FOR_BEVERAGE_OPTIONS';
                default:
                    return 'SHOW_NO_BEVERAGE_ASK_FOR_PAYMENT_TYPE';
            }
        case 'ORDER_BEVERAGE':
            switch (data.option) {
                case 'beverages_more':
                    return 'ASK_FOR_BEVERAGE_OPTIONS';
                case 'beverages_cancel':
                    return 'SHOW_NO_BEVERAGE_ASK_FOR_PAYMENT_TYPE';
                default:
                    return 'SHOW_BEVERAGE_ASK_FOR_PAYMENT_TYPE';
            }
        case 'ORDER_PAYMENT_TYPE':
            // switch (data) {
            //     case 'payment_money':
            //         return 'SHOW_PAYMENT_TYPE_ASK_FOR_PAYMENT_CHANGE';
            //     case 'payment_card':
            return 'SHOW_PAYMENT_TYPE_ASK_FOR_COMMENTS';
        // }
        // break;
        case 'ORDER_PAYMENT_CHANGE':
            return 'SHOW_PAYMENT_CHANGE_ASK_FOR_COMMENTS';
        case 'ORDER_COMMENTS':
            switch (data) {
                case 'comments_yes':
                    return 'ASK_FOR_TYPE_COMMENTS';
                default:
                    return 'SHOW_FULL_ORDER_CONFIRM_ORDER';
            }
        case 'ORDER_CONFIRMATION':
            switch (data.type) {
                case 'confirmation_yes':
                    return 'CONFIRM_ORDER';
                default:
                    return 'ASK_FOR_CHANGE_ORDER';
            }
        case 'ORDER_CHANGE_SELECT_ITEM':
            return 'UPDATE_ITEM';
        case 'ORDER_PARTIAL_CONFIRMATION':
            return 'CANCEL_PENDING_SHOW_PARTIAL_ORDER';
        case 'ORDER_CATEGORY':
            return 'SHOW_CATEGORY_ASK_FOR_SIZE';
        case 'ORDER_ASK_CATEGORY':
            return 'ASK_FOR_CATEGORY';
        case 'ORDER_CATEGORY_CARDAPIO':
            return 'SHOW_FLAVORS_CATEGORY';
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
