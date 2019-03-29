import axios from 'axios';
import {
    basicReply, askForContinue, passThreadControl,
    sendMainMenu, sendWelcomeMessage, sendCardapio, sendHorario,
    checkLastAction, optionsStopOrder,
    showDeliverCheckAddress,
    confirmLocationAddress, confirmAddressOrAskLocation, confirmAddress,
    askForLocation, askToTypeAddress,
    askForQuantityMore, showQuantityAskForSize,
    showSizeCheckSplit,
    showSplitCheckFlavor, askForQuantity,
    showFlavor, showFlavorCheckItem, showOrderOrNextItem,
    askForWantBeverage, askForBeverages, showBeverageAskForPaymentType,
    showNoBeverageAskForPaymentType,
    showPaymentTypeAskForPaymentChange,
    showPaymentTypeAskForComments, showPaymentChangeAskForComments,
    confirmOrder, askForChangeOrder, askForSpecificItem, updateItemAskOptions,
    askForFlavorOrConfirm, cancelPendingOrder, changeItem, cancelItem,
    askForDeliver, askForComments,
    showFullOrderConfirmOrder, askToTypeComments, showDeliverAskForCategory,
    showCategoryAskForSize, askForCategory, askForPaymentType, showAddressAskForCategory,
    askForSizeCat, cancelPendingShowPartialOrder,
    showCommentsItem,
} from '../bot/botController';
import { getStoreByPhone } from '../controllers/storesController';
import { getOrderPending } from '../controllers/ordersController';
import { askForCategoryCardapio } from '../bot/show_cardapio';

/**
 * Receives the user and message from whatsapp and
 * returns a message from the system.
 * @param {*} args
 */
export const w_controller = async (args) => {
    console.info('###### w_controller ######');
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

        // Welcome Message
        if (!match) {
            const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId });

            if (pendingOrder && pendingOrder.order) {
                console.info(`pendingorder id:${pendingOrder.order.id} 
                waitingFor:${pendingOrder.order.waitingFor}
                undo:${pendingOrder.order.undo} `);

                let result;

                // user typed 0, it is undo
                if (message === '0') {
                    if (pendingOrder.order.undo === 'quantity') {
                        return await sendActions({
                            action: 'ASK_FOR_QUANTITY',
                            pageID: pageId, userID: userId,
                        });
                    } else if (pendingOrder.order.undo === 'size') {
                        return await sendActions({
                            action: 'ASK_FOR_SIZE',
                            pageID: pageId, userID: userId,
                            data: pendingOrder.order.currentItemCategory,
                        });
                    }
                }

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
                    result = await sendActions({
                        action: 'SHOW_FULL_ORDER_CONFIRM_ORDER',
                        pageID: pageId, userID: userId, data: message,
                    });
                } else if (pendingOrder.order.waitingFor === 'typed_comments_item') {
                    result = await sendActions({
                        action: 'SHOW_COMMENTS_ITEM',
                        pageID: pageId, userID: userId, data: message,
                    });
                } else if (pendingOrder.order.waitingFor === 'location') {
                    if (location) {
                        result = await sendActions({
                            action: 'LOCATION_CONFIRM_ADDRESS',
                            pageID: pageId, userID: userId, location,
                        });
                    } else {
                        result = await sendActions({
                            action: 'ASK_TO_TYPE_ADDRESS',
                            pageID: pageId, userID: userId,
                        });
                    }
                } else {
                    result = await sendActions({
                        action: 'ASK_FOR_CONTINUE',
                        pageID: pageId, userID: userId, user,
                    });
                }
                return result;
            } else {
                let replyText = await getText(sendWelcomeMessage, [pageId, contactName]);
                replyText = replyText + '\n';

                const dataMenu = await sendMainMenu();
                dataMenu.text = replyText + dataMenu.text;
                return dataMenu;
            }
        } else {
            let objectWithEvent;
            if (match.hasOwnProperty('event'))
                objectWithEvent = match;
            else if (match.hasOwnProperty('buttons')) {
                if (match.buttons.hasOwnProperty('event'))
                    objectWithEvent = match.buttons;
            }

            const { event, data } = objectWithEvent;
            const multiple = data ? (data.multiple ? data.multiple : 1) : 1;
            const action = mapEventsActions(event, data);
            const result = await sendActions({
                action, pageID: pageId,
                userID: userId, data, location, multiple, user,
            });
            return result;
        }
    } else {
        console.info(`### w_controller ### did not find store for myId: ${myId}`);
    }
}

const getText = async (fn, params) => {
    const data = params ? await fn(...params) : await fn();
    let replyText = '';
    if (data.type === 'buttons') {
        replyText = data.text + '\n';
        let index = 1;
        data.options.map(option => {
            replyText = replyText + index + '. ' + option.text + '\n';
            index++;
        });
    } else if (data.type === 'text') {
        replyText = data.text + '\n';
    }
    return replyText;
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
                out = await getElement(basicReply, data);
                break;
            case 'CHECK_TYPED_TEXT':
                out = await checkTypedText(pageID, userID, text);
                break;
            case 'ASK_FOR_CONTINUE':
                out = await getElement(askForContinue);
                break;
            case 'CHECK_LAST_ACTION':
                out = await checkLastAction(pageID, userID);
                break;
            case 'CONTINUE_ORDER_NO':
                out = await getElement(optionsStopOrder);
                break;
            case 'PASS_THREAD_CONTROL':
                out = await passThreadControl(pageID, userID, 'whatsapp');
                break;
            case 'SEND_WELCOME':
                out = await getElement(sendWelcomeMessage, [pageID, user.first_name]);
                break;
            case 'SEND_MAIN_MENU':
                out = await getElement(sendMainMenu);
                break;
            case 'SEND_CARDAPIO':
                out = await getElement(askForCategoryCardapio, [pageID]);
                break;
            case 'SEND_HORARIO':
                out = await getElement(sendHorario, [pageID, 'whatsapp']);
                break;
            case 'ASK_FOR_DELIVER':
                out = await getElement(askForDeliver, [pageID, userID]);
                break;
            case 'SHOW_DELIVER_CHECK_ADDRESS':
                out = await getElement(showDeliverCheckAddress,
                    [pageID, userID, data, user, 'whatsapp']);
                break;
            case 'CHECK_ADDRESS':
                out = await getElement(confirmAddressOrAskLocation,
                    [pageID, userID, user, 'whatsapp']);
                break;
            case 'CONFIRM_ADDRESS':
                out = await getElement(confirmAddress, [pageID, userID, addrData, user, 'whatsapp']);
                break;
            case 'ASK_FOR_ORDER':
                out = await getElement(askForWantOrder);
                break;
            case 'LOCATION_CONFIRM_ADDRESS':
                out = await getElement(confirmLocationAddress, [pageID, userID, location]);
                break;
            case 'SHOW_ADDRESS_ASK_FOR_CATEGORY':
                out = await getElement(showAddressAskForCategory, [pageID, userID, data, 'whatsapp']);
                break;
            case 'ASK_FOR_LOCATION':
                out = await getElement(askForLocation, [pageID, userID, user, 'whatsapp']);
                break;
            case 'ASK_TO_TYPE_ADDRESS':
                out = await askToTypeAddress(pageID, userID);
                break;
            case 'SHOW_DELIVER_ASK_FOR_CATEGORY':
                out = await getElement(showDeliverAskForCategory, [pageID, userID, data, user, 'whatsapp']);
                break;
            case 'ASK_FOR_QUANTITY':
                out = await getElement(askForQuantity, [pageID, userID]);
                break;
            case 'ASK_FOR_QUANTITY_MORE':
                out = await getElement(askForQuantityMore, [pageID, userID]);
                break;
            case 'SHOW_QUANTITY_ASK_FOR_SIZE':
                out = await getElement(showQuantityAskForSize, [pageID, userID, data]);
                break;
            case 'ASK_FOR_SIZE':
                out = await askForSizeCat(pageID, userID, data);
                break;
            case 'SHOW_SIZE_CHECK_SPLIT':
                out = await showSizeCheckSplit(pageID, userID, data, 1);
                break;
            case 'SHOW_SPLIT_CHECK_FLAVOR':
                out = await showSplitCheckFlavor(pageID, userID, data);
                break;
            case 'ASK_FOR_FLAVOR':
                out = await askForFlavorOrConfirm(pageID, userID, multiple);
                break;
            case 'SHOW_FLAVOR':
                out = await showFlavor(pageID, userID, data);
                break;
            case 'CHECK_ITEM':
                out = await showOrderOrNextItem(pageID, userID);
                break;
            case 'SHOW_FLAVOR_CHECK_ITEM':
                out = await showFlavorCheckItem(pageID, userID, data);
                break;
            case 'ASK_FOR_WANT_BEVERAGE':
                out = await askForWantBeverage(pageID, userID);
                break;
            case 'SHOW_NO_BEVERAGE_ASK_FOR_PAYMENT_TYPE':
                out = await showNoBeverageAskForPaymentType(pageID, userID, data);
                break;
            case 'ASK_FOR_BEVERAGE_OPTIONS':
                out = await askForBeverages(pageID, userID, multiple);
                break;
            case 'SHOW_BEVERAGE_ASK_FOR_PAYMENT_TYPE':
                out = await showBeverageAskForPaymentType(pageID, userID, data);
                break;
            case 'ASK_FOR_PAYMENT_TYPE':
                out = await askForPaymentType(pageID, userID);
                break;
            case 'SHOW_PAYMENT_TYPE_ASK_FOR_COMMENTS':
                out = await showPaymentTypeAskForComments(pageID, userID, data);
                break;
            case 'SHOW_PAYMENT_TYPE_ASK_FOR_PAYMENT_CHANGE':
                out = await showPaymentTypeAskForPaymentChange(pageID, userID, data);
                break;
            case 'SHOW_PAYMENT_CHANGE_ASK_FOR_COMMENTS':
                out = await showPaymentChangeAskForComments(pageID, userID, data);
                break;
            case 'ASK_FOR_COMMENTS':
                out = await askForComments(pageID, userID);
                break;
            case 'ASK_FOR_TYPE_COMMENTS':
                out = await getElement(askToTypeComments, [pageID, userID]);
                break;
            case 'SHOW_FULL_ORDER_CONFIRM_ORDER':
                out = await showFullOrderConfirmOrder(pageID, userID, data);
                break;
            case 'ASK_FOR_CHANGE_ORDER':
                out = await askForChangeOrder(pageID, userID, data);
                break;
            case 'ASK_FOR_SPECIFIC_ITEM':
                out = await askForSpecificItem(pageID, userID, data);
                break;
            case 'CHANGE_ITEM':
                out = await changeItem(pageID, userID, data);
                break;
            case 'SHOW_COMMENTS_ITEM':
                out = await showCommentsItem(pageID, userID, data);
                break;
            case 'CANCEL_ITEM':
                out = await cancelItem(pageID, userID, data);
                break;
            case 'UPDATE_ITEM':
                out = await updateItemAskOptions(pageID, userID, data);
                break;
            case 'CONFIRM_ORDER':
                out = await confirmOrder(pageID, userID);
                break;
            case 'CANCEL_PENDING_ORDER':
                out = await cancelPendingOrder(pageID, userID);
                break;
            case 'SHOW_CATEGORY_ASK_FOR_SIZE':
                out = await getElement(showCategoryAskForSize, [pageID, userID, data]);
                break;
            case 'ASK_FOR_CATEGORY':
                out = await getElement(askForCategory, [pageID, userID, data]);
                break;
            case 'CANCEL_PENDING_SHOW_PARTIAL_ORDER':
                out = await getElement(cancelPendingShowPartialOrder, [pageID, userID]);
                break;
            case 'SHOW_FLAVORS_CATEGORY':
                out = await getElement(sendCardapio, [pageID, data, 'whatsapp']);
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

const getElement = async (fn, params) => {
    const data = params ? await fn(...params) : await fn();
    return data;
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
