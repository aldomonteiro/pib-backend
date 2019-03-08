import { Bot, Elements, Buttons, QuickReplies } from 'facebook-messenger-bot';
import {
    sendWelcomeMessage,
    sendMainMenu,
    sendCardapio,
    askForPhone,
    showPhone,
    askToTypePhone,
    askForQuantity,
    askForQuantityMore,
    showQuantity,
    askForSize,
    showSize,
    askForFlavor,
    showFlavor,
    showOrderOrNextItem,
    askForLocation,
    confirmAddressOrAskLocation,
    confirmLocationAddress,
    showAddress,
    confirmOrder,
    askToTypeAddress,
    askForWantBeverage, askForBeverages, showBeverage, showNoBeverage,
    sendHorario,
    basicReply,
    askForChangeOrder,
    cancelItem,
    changeItem,
    checkSplit,
    askForFlavorOrConfirm,
    askForSpecificItem,
    updateItemAskOptions,
    showOrderOrAskForPhone,
    showSplit,
    showFullOrder,
    askForWantOrder,
    askForContinue,
    checkLastAction,
    optionsStopOrder,
    passThreadControl,
    confirmAddress,
    confirmTypedPhone,
    askForPaymentType,
    showPaymentType,
    showPaymentChange,
    askForPaymentChange,
    cancelPendingOrder,
    askForComments,
    showComments,
    askToTypeComments,
    askForDeliver,
    showDeliver,
} from './botController';

import {
    m_askForRestaurant, m_askForOwnership, m_askForOptions,
    m_askHowGetHere,
    m_askForTestType, m_askForBeginTest, m_afterOrderConfirmation, m_startTrial,
    m_openQuestion, m_confirmOpenQuestion, m_returnContact, m_contactPhone, m_contactMail, m_typePhone,
    m_isValidPhone,
    m_howItWorks2,
    m_howItWorks3,
    m_howItWorks4,
    m_howItWorks5,
    m_howItWorks,
    m_askTestTypePizzaria,
    m_showPrices,
    m_returnedCustomer,
} from './botMarkController';
import { getOrderPending } from '../controllers/ordersController';

const QTY_1 = [1, 'um', 'uma'];

export const checkTypedText = async ({ bot, sender, pageID, text }) => {
    try {
        const pendingOrder = await getOrderPending({ pageId: pageID, userId: sender.id });

        if (pendingOrder && pendingOrder.order) {
            if (pendingOrder.order.waitingFor === 'typed_address') {
                const addrData = {
                    manual_addres: true,
                    formattedAddress: text,
                }
                await sendActions({ action: 'CONFIRM_ADDRESS', bot, sender, pageID, addrData })
            }
            else if (pendingOrder.order.waitingFor === 'phone')
                await sendActions({ action: 'CONFIRM_TYPED_PHONE', bot, sender, pageID, text });
            else if (pendingOrder.order.waitingFor === 'quantity' && !isNaN(text) && +text <= 6) {
                const data = 'qty_' + text;
                await mapEventsActions({ event: 'ORDER_QTY', data, bot, sender, pageID })
            }
            else if (pendingOrder.order.waitingFor === 'typed_comments') {
                await sendActions({ action: 'SHOW_COMMENTS', bot, sender, pageID, text });
                await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID });
            }
            else // Bot didn't understand what was typed
                await sendActions({ action: 'ASK_FOR_CONTINUE', bot, sender, pageID });
        } else {
            await sendActions({ action: 'SEND_MAIN_MENU', bot, sender, pageID });
        }

    } catch (confirmTypedTextError) {
        console.error({ confirmTypedTextError });
        throw confirmTypedTextError;
    }
}


/**
 * Receive events, dispatch actions
 * @param {*} param
 */
export const mapEventsActions = async ({ event, data, bot, sender, pageID, text }) => {
    try {
        switch (event) {
            case 'ORDER_CONTINUE_ORDER':
                switch (data) {
                    case 'continueorder_yes':
                        await sendActions({ action: 'CHECK_LAST_ACTION', bot, sender, pageID });
                        break;
                    case 'continueorder_no':
                        await sendActions({ action: 'CONTINUE_ORDER_NO', bot, sender, pageID });
                        break;
                }
                break;
            case 'STOP_ORDER_OPTIONS':
                switch (data) {
                    case 'stoporder_init':
                        await sendActions({ action: 'CANCEL_PENDING_ORDER', bot, sender, pageID });
                        break;
                    case 'stoporder_human':
                        await sendActions({ action: 'PASS_THREAD_CONTROL', bot, sender, pageID });
                        break;
                }
                break;
            case 'MAIN-MENU':
                switch (data) {
                    case 'CARDAPIO_PAYLOAD':
                        await sendActions({ action: 'SEND_CARDAPIO', bot, sender, pageID });
                        await Bot.wait(3000);
                        await sendActions({ action: 'ASK_FOR_ORDER', bot, sender, pageID });
                        break;
                    case 'PEDIDO_PAYLOAD':
                        // await sendActions({ action: 'CHECK_ADDRESS', bot, sender, pageID });
                        await sendActions({ action: 'ASK_FOR_DELIVER', bot, sender, pageID });
                        break;
                    case 'HORARIO_PAYLOAD':
                        await sendActions({ action: 'SEND_HORARIO', bot, sender, pageID });
                        break;
                }
                break;
            case 'ORDER_WANT_ORDER':
                switch (data) {
                    case 'wantorder_yes':
                        // await sendActions({ action: 'CHECK_ADDRESS', bot, sender, pageID });
                        await sendActions({ action: 'ASK_FOR_DELIVER', bot, sender, pageID });
                        break;
                    case 'wantorder_no':
                        await sendActions({ action: 'BASIC_REPLY', bot, sender, pageID, data: 'Ok, vou enviar as opções então. Para continuar é só clicar em uma delas' });
                        await sendActions({ action: 'SEND_MAIN_MENU', bot, sender, pageID });
                        break;
                }
                break;
            case 'ORDER_DELIVER':
                await sendActions({ action: 'SHOW_DELIVER', bot, sender, pageID, data });
                switch (data.type) {
                    case 'delivery':
                        await sendActions({ action: 'CHECK_ADDRESS', bot, sender, pageID });
                        break;
                    case 'pickup':
                        await sendActions({ action: 'ASK_FOR_PHONE', bot, sender, pageID });
                        break;
                }
                break;
            case 'CORRECT_SAVED_ADDRESS':
                await sendActions({ action: 'SHOW_ADDRESS', bot, sender, pageID, data });
                await sendActions({ action: 'ASK_FOR_PHONE', bot, sender, pageID });
                break;
            case 'WRONG_SAVED_ADDRESS':
                await sendActions({ action: 'ASK_FOR_LOCATION', bot, sender, pageID, event });
                break;
            case 'LOCATION_ADDRESS':
                switch (data) {
                    case 'incorrect_address':
                        await sendActions({ action: 'ASK_TO_TYPE_ADDRESS', bot, sender, pageID });
                        break;
                    default:
                        await sendActions({ action: 'SHOW_ADDRESS', bot, sender, pageID, data });
                        await sendActions({ action: 'SHOW_ORDER_OR_ASK_FOR_PHONE', bot, sender, pageID });
                        break;
                }
                break;
            case 'PHONE_CONFIRMED':
                switch (data) {
                    case 'change_phone':
                        await sendActions({ action: 'ASK_TO_TYPE_PHONE', bot, sender, pageID });
                        break;
                    default:
                        await sendActions({ action: 'SHOW_PHONE', bot, sender, pageID, data });
                        await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID });
                        break;
                }
                break;
            case 'ORDER_QTY':
                switch (data) {
                    case 'qty_more':
                        await sendActions({ action: 'ASK_FOR_QUANTITY_MORE', bot, sender, pageID });
                        break;
                    case 'qty_less':
                        await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID });
                        break;
                    default:
                        await sendActions({ action: 'SHOW_QUANTITY', bot, sender, pageID, data });
                        await sendActions({ action: 'ASK_FOR_SIZE', bot, sender, pageID });
                        break;
                }
                break;
            case 'ORDER_SIZE':
                await sendActions({ action: 'SHOW_SIZE', bot, sender, pageID, data })
                await sendActions({ action: 'CHECK_SPLIT', bot, sender, pageID, data })
                break;
            case 'ORDER_SPLIT':
                await sendActions({ action: 'SHOW_SPLIT', bot, sender, pageID, data })
                await sendActions({ action: 'CHECK_FLAVOR', bot, sender, pageID, data })
                break;
            case 'ORDER_FLAVOR':
                switch (data.option) {
                    case 'flavors_more':
                        await sendActions({ action: 'ASK_FOR_FLAVOR', bot, sender, pageID, multiple: data.multiple })
                        break;
                    default:
                        await sendActions({ action: 'SHOW_FLAVOR', bot, sender, pageID, data })
                        await sendActions({ action: 'CHECK_ITEM', bot, sender, pageID })
                        break;
                }
                break;
            case 'ORDER_PIZZA_CONFIRMATION':
                switch (data.type) {
                    case 'confirmation_yes':
                        await sendActions({ action: 'ASK_FOR_WANT_BEVERAGE', bot, sender, pageID });
                        break;
                    default:
                        await sendActions({ action: 'ASK_FOR_CHANGE_ORDER', bot, sender, pageID, data });
                        break;
                }
                break;
            case 'ORDER_WANT_CHANGE':
                await sendActions({ action: 'ASK_FOR_SPECIFIC_ITEM', bot, sender, pageID });
                break;
            case 'ORDER_CHANGE':
                switch (data) {
                    case 'change_quantity':
                        await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID });
                        break;
                    case 'change_size':
                        await sendActions({ action: 'ASK_FOR_SIZE', bot, sender, pageID });
                        break;
                    case 'change_flavor':
                        await sendActions({ action: 'ASK_FOR_FLAVOR', bot, sender, pageID, multiple: 1 })
                        break;
                    case 'change_address':
                        await sendActions({ action: 'ASK_FOR_LOCATION', bot, sender, pageID });
                        break;
                    default:
                        break;
                }
                break;
            case 'ORDER_CHANGE_ITEM':
                await sendActions({ action: 'CHANGE_ITEM', bot, sender, pageID, data });
                break;
            case 'ORDER_CANCEL_ITEM':
                await sendActions({ action: 'CANCEL_ITEM', bot, sender, pageID, data });
                break;
            case 'ORDER_CONFIRM_BEVERAGE':
                switch (data) {
                    case 'beverage_yes':
                        await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID, multiple: 1 })
                        break;
                    default:
                        await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID })
                        await sendActions({ action: 'ASK_FOR_PAYMENT_TYPE', bot, sender, pageID })
                        break;
                }
                break;
            case 'ORDER_BEVERAGE':
                switch (data.option) {
                    case 'beverages_more':
                        await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID, multiple: data.multiple })
                        break;
                    case 'beverages_cancel':
                        await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID })
                        await sendActions({ action: 'ASK_FOR_PAYMENT_TYPE', bot, sender, pageID })
                        break;
                    default:
                        await sendActions({ action: 'SHOW_BEVERAGE', bot, sender, pageID, data })
                        await sendActions({ action: 'ASK_FOR_PAYMENT_TYPE', bot, sender, pageID })
                        break;
                }
                break;
            case 'ORDER_PAYMENT_TYPE':
                await sendActions({ action: 'SHOW_PAYMENT_TYPE', bot, sender, pageID, data })

                switch (data) {
                    case 'payment_money':
                        await sendActions({ action: 'ASK_FOR_PAYMENT_CHANGE', bot, sender, pageID })
                        break;
                    case 'payment_card':
                        await sendActions({ action: 'ASK_FOR_COMMENTS', bot, sender, pageID })
                        // await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID })
                        break;
                }
                break;
            case 'ORDER_PAYMENT_CHANGE':
                await sendActions({ action: 'SHOW_PAYMENT_CHANGE', bot, sender, pageID, data })
                await sendActions({ action: 'ASK_FOR_COMMENTS', bot, sender, pageID })
                break;
            case 'ORDER_COMMENTS':
                switch (data) {
                    case 'comments_yes':
                        await sendActions({ action: 'ASK_FOR_TYPE_COMMENTS', bot, sender, pageID })
                        break;
                    default:
                        await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID })
                        break;
                }
                break;
            case 'ORDER_CONFIRMATION':
                switch (data.type) {
                    case 'confirmation_yes':
                        await sendActions({ action: 'CONFIRM_ORDER', bot, sender, pageID });
                        if (bot.marketing) { // marketing. if the order is confirmed, go on in the conversation
                            await sendActions({ action: 'PIZZAIBOT_MARKETING', bot, sender, pageID, data: 'confirmation_yes' });
                        }
                        break;
                    default:
                        await sendActions({ action: 'ASK_FOR_CHANGE_ORDER', bot, sender, pageID });
                        break;
                }
                break;
            case 'ORDER_CHANGE_SELECT_ITEM':
                await sendActions({ action: 'UPDATE_ITEM', bot, sender, pageID, data })
                break;

        }
    } catch (mapEventsActionsErr) {
        console.error({ event }, { mapEventsActionsErr }, { data });
    }
}

export const sendActions = async ({ action, bot, sender, pageID, multiple, split,
    data, payload, location, text, addrData }) => {
    try {
        let out = new Elements();
        await bot.startTyping(sender.id);
        await Bot.wait(500);
        switch (action) {
            case 'BASIC_REPLY':
                out = await getElement(basicReply, data);
                break;
            case 'CHECK_TYPED_TEXT':
                out = await checkTypedText(pageID, sender.id, text);
                break;
            case 'ASK_FOR_CONTINUE':
                out = await getElement(askForContinue);
                break;
            case 'CHECK_LAST_ACTION':
                out = await getElement(checkLastAction, [pageID, sender.id]);
                break;
            case 'CONTINUE_ORDER_NO':
                out = await getElement(optionsStopOrder);
                break;
            case 'PASS_THREAD_CONTROL':
                out = await getElement(passThreadControl, [pageID, sender.id]);
                break;
            case 'SEND_WELCOME':
                out = await getElement(sendWelcomeMessage, [pageID, sender]);
                break;
            case 'SEND_MAIN_MENU':
                out = await getElement(sendMainMenu);
                break;
            case 'SEND_CARDAPIO':
                out = await getElement(sendCardapio, [pageID]);
                break;
            case 'SEND_HORARIO':
                out = await getElement(sendHorario, [pageID]);
                break;
            case 'ASK_FOR_DELIVER':
                out = await getElement(askForDeliver, [pageID, sender.id]);
                break;
            case 'SHOW_DELIVER':
                out = await getElement(showDeliver, [pageID, sender.id, data]);
                break;
            case 'CHECK_ADDRESS':
                const user1 = await bot.fetchUser(sender.id);
                out = await getElement(confirmAddressOrAskLocation, [pageID, sender.id, user1]);
                break;
            case 'CONFIRM_ADDRESS':
                out = await getElement(confirmAddress, [pageID, sender.id, addrData]);
                break;
            case 'ASK_FOR_ORDER':
                out = await getElement(askForWantOrder);
                break;
            case 'LOCATION_CONFIRM_ADDRESS':
                const user2 = await bot.fetchUser(sender.id);
                out = await getElement(confirmLocationAddress,
                    [pageID, sender.id, location, user2]);
                break;
            case 'ASK_FOR_PHONE':
                out = await getElement(askForPhone, [pageID, sender.id]);
                break;
            case 'SHOW_PHONE':
                out = await showPhone(pageID, sender.id, payload || data);
                break;
            case 'SHOW_ADDRESS':
                out = await getElement(showAddress, [pageID, sender.id, data]);
                break;
            case 'SHOW_ORDER_OR_ASK_FOR_PHONE':
                out = await getElement(showOrderOrAskForPhone, [pageID, sender.id]);
                break;
            case 'ASK_TO_TYPE_PHONE':
                out = await askToTypePhone(pageID, sender.id);
                break;
            case 'CONFIRM_TYPED_PHONE':
                out = await confirmTypedPhone(pageID, sender.id, text);
                break;
            case 'ASK_FOR_LOCATION':
                const user = await bot.fetchUser(sender.id);
                out = await getElement(askForLocation, [pageID, sender.id, user]);
                break;
            case 'ASK_TO_TYPE_ADDRESS':
                out = await getElement(askToTypeAddress, [pageID, sender.id]);
                break;
            case 'ASK_FOR_QUANTITY':
                out = await getElement(askForQuantity, [pageID, sender.id]);
                break;
            case 'ASK_FOR_QUANTITY_MORE':
                out = await getElement(askForQuantityMore, [pageID, sender.id]);
                break;
            case 'SHOW_QUANTITY':
                out = await getElement(showQuantity, [pageID, sender.id, data]);
                break;
            case 'ASK_FOR_SIZE':
                out = await getElement(askForSize, [pageID, sender.id]);
                break;
            case 'SHOW_SIZE':
                out = await getElement(showSize, [pageID, sender.id, data]);
                break;
            case 'SHOW_SPLIT':
                out = await getElement(showSplit, [pageID, sender.id, data]);
                break;
            case 'CHECK_SPLIT':
                out = await getElement(checkSplit, [pageID, sender.id, 1]);
                break;
            case 'CHECK_FLAVOR':
                out = await getElement(askForFlavorOrConfirm, [pageID, sender.id, 1]);
                break;
            case 'ASK_FOR_FLAVOR':
                out = await getElement(askForFlavor, [pageID, sender.id, multiple]);
                break;
            case 'SHOW_FLAVOR':
                out = await getElement(showFlavor, [pageID, sender.id, data]);
                break;
            case 'CHECK_ITEM':
                out = await getElement(showOrderOrNextItem, [pageID, sender.id]);
                break;
            case 'ASK_FOR_WANT_BEVERAGE':
                out = await getElement(askForWantBeverage, [pageID, sender.id]);
                break;
            case 'SHOW_NO_BEVERAGE':
                out = await getElement(showNoBeverage, [pageID, sender.id, data]);
                break;
            case 'ASK_FOR_BEVERAGE_OPTIONS':
                out = await getElement(askForBeverages, [pageID, sender.id, multiple]);
                break;
            case 'SHOW_BEVERAGE':
                out = await getElement(showBeverage, [pageID, sender.id, data]);
                break;
            case 'ASK_FOR_PAYMENT_TYPE':
                out = await getElement(askForPaymentType, [pageID, sender.id]);
                break;
            case 'SHOW_PAYMENT_TYPE':
                out = await getElement(showPaymentType, [pageID, sender.id, data]);
                break;
            case 'ASK_FOR_PAYMENT_CHANGE':
                out = await getElement(askForPaymentChange, [pageID, sender.id]);
                break;
            case 'SHOW_PAYMENT_CHANGE':
                out = await getElement(showPaymentChange, [pageID, sender.id, data]);
                break;
            case 'ASK_FOR_COMMENTS':
                out = await getElement(askForComments, [pageID, sender.id]);
                break;
            case 'ASK_FOR_TYPE_COMMENTS':
                out = await getElement(askToTypeComments, [pageID, sender.id]);
                break;
            case 'SHOW_COMMENTS':
                out = await getElement(showComments, [pageID, sender.id, text]);
                break;
            case 'ASK_TO_TYPE_COMMENTS':
                out = await getElement(askToTypeComments, [pageID, sender.id]);
                break;
            case 'SHOW_FULL_ORDER':
                out = await getElement(showFullOrder, [pageID, sender.id]);
                break;
            case 'ASK_FOR_CHANGE_ORDER':
                out = await getElement(askForChangeOrder, [pageID, sender.id, data]);
                break;
            case 'ASK_FOR_SPECIFIC_ITEM':
                out = await getElement(askForSpecificItem, [pageID, sender.id]);
                break;
            case 'CHANGE_ITEM':
                out = await getElement(changeItem, [pageID, sender.id, data]);
                break;
            case 'CANCEL_ITEM':
                out = await getElement(cancelItem, [pageID, sender.id, data]);
                break;
            case 'UPDATE_ITEM':
                out = await getElement(updateItemAskOptions, [pageID, sender.id, data]);
                break;
            case 'CANCEL_PENDING_ORDER':
                out = await getElement(cancelPendingOrder, [pageID, sender.id]);
                break;
            case 'CONFIRM_ORDER':
                out = await getElement(confirmOrder, [pageID, sender.id]);
                break;
            case 'PIZZAIBOT_MARKETING':
                out = await marketing_flow(pageID, sender.id, data, text, payload);
                break;
            default:
                break;
        }
        await bot.stopTyping(sender.id);
        await bot.send(sender.id, out);
    } catch (sendActionsErr) {
        console.error('action:', action, 'data:', data, 'err:', sendActionsErr);
        throw sendActionsErr;
    }
}

const getElement = async (fn, params) => {
    // TODO: Where check if it is facebook or whatsapp?

    const out = new Elements();
    const data = params ? await fn(...params) : await fn();
    if (data.type === 'text') {
        out.add({ text: data.text });
    } else if (data.type === 'buttons') {
        const buttons = new Buttons();
        data.options.map(option => buttons.add(option));
        out.add({ text: data.text, buttons });
    }
    else if (data.type === 'replies') {
        out.add({ text: data.text });
        const replies = new QuickReplies();
        data.options.map(option => replies.add(option));
        out.setQuickReplies(replies);
    }
    else if (data.type === 'list' || data.type === 'fulllist') {
        out.setListStyle('compact');
        data.options.map(option => {
            if (!option.hidden) {
                const buttons = new Buttons();
                buttons.add(option.buttons);
                if (option.isOnlyButtons) out.add({ isOnlyButtons: option.isOnlyButtons, buttons: buttons })
                else out.add({ text: option.text, subtext: option.subtext, buttons: buttons })
            }
        });
    }

    return out;
}


/**
 * Actions for marketing controller
 * @param {*} data 
 */
export const marketing_flow = async (pageID, userID, data, text, payload) => {
    switch (data) {
        case 'GET_STARTED':
            return await m_askHowGetHere(data, pageID, userID);
        case 'howget_pizzaria':
        case 'howget_facebookad':
        case 'howget_activemarketing':
        case 'howget_dontremember':
            return await m_askForRestaurant(data, pageID, userID);
        case 'restaurant_yes':
            return await m_askForOwnership(data, pageID, userID);
        case 'restaurant_no':
            return await m_askForOptions(data, pageID, userID);
        case 'owner_yes':
            return await m_askForOptions(data, pageID, userID, 'owner');
        case 'employee_yes':
            return await m_askForOptions(data, pageID, userID, 'employee');
        case 'options_howitworks':
            return await m_howItWorks(data, pageID, userID);
        case 'howitworks_2':
            return await m_howItWorks2(data, pageID, userID);
        case 'howitworks_3':
            return await m_howItWorks3(data, pageID, userID);
        case 'howitworks_4':
            return await m_howItWorks4(data, pageID, userID);
        case 'howitworks_5':
            return await m_howItWorks5(data, pageID, userID);
        case 'options_howmuch':
            return await m_showPrices(data, pageID, userID);
        case 'options_wanttest':
            return await m_askForTestType(data, pageID, userID);
        case 'testtype_customer':
            return await m_askForBeginTest(data, pageID, userID);
        case 'testtype_pizzaria':
            return await m_askTestTypePizzaria(data, pageID, userID);
        case 'confirmation_yes':
            return await m_afterOrderConfirmation(data, pageID, userID);
        case 'orderConfirmation_start':
            return await m_startTrial(data, pageID, userID);
        case 'orderConfirmation_question':
            return await m_openQuestion(data, pageID, userID);
        case 'open_question':
            return await m_confirmOpenQuestion(data, pageID, userID, text);
        case 'finalquestion_phone':
            return await m_returnContact(data, pageID, userID, 'phone');
        case 'finalquestion_whatsapp':
            return await m_returnContact(data, pageID, userID, 'whatsapp');
        case 'finalquestion_mail':
            return await m_returnContact(data, pageID, userID, 'email');
        case 'finalquestion_messenger':
            return await m_returnContact(data, pageID, userID, 'messenger');
        case 'type_phone':
            return await m_typePhone(data, pageID, userID);
        case 'retype_phone':
            return await m_typePhone(data, pageID, userID);
        case 'contact_phone':
            const validation = await m_isValidPhone(payload || text);
            console.info({ validation });
            if (validation === 'OK_PHONE')
                return await m_contactPhone(data, pageID, userID, payload || text);
            else return await m_typePhone('retype_phone', pageID, userID, validation);
        case 'contact_mail':
            return await m_contactMail(data, pageID, userID, text);
        case 'returned_customer':
            return await m_returnedCustomer(data, pageID, userID);
        default:
            return await basicReply('Ops, não tenho uma resposta para isso.');
    }
}


// export const getOpenAndClose = async (pageID) => {
//     // TODO: timezone from the store
//     const weekDay = (new Date()).getDay();

//     const openingTimes = await getStoreData(pageID);

//     if (openingTimes) {
//         let openAndClose = { isOpen: false, openTime: null, closeTime: null };
//         if (weekDay === 1) {
//             openAndClose.isOpen = openingTimes.mon_is_open;
//             openAndClose.openTime = openingTimes.mon_open;
//             openAndClose.closeTime = openingTimes.mon_close;
//         } else if (weekDay === 2) {
//             openAndClose.isOpen = openingTimes.tue_is_open;
//             openAndClose.openTime = openingTimes.tue_open;
//             openAndClose.closeTime = openingTimes.tue_close;
//         } else if (weekDay === 3) {
//             openAndClose.isOpen = openingTimes.wed_is_open;
//             openAndClose.openTime = openingTimes.wed_open;
//             openAndClose.closeTime = openingTimes.wed_close;
//         } else if (weekDay === 4) {
//             openAndClose.isOpen = openingTimes.thu_is_open;
//             openAndClose.openTime = openingTimes.thu_open;
//             openAndClose.closeTime = openingTimes.thu_close;
//         } else if (weekDay === 5) {
//             openAndClose.isOpen = openingTimes.fri_is_open;
//             openAndClose.openTime = openingTimes.fri_open;
//             openAndClose.closeTime = openingTimes.fri_close;
//         } else if (weekDay === 6) {
//             openAndClose.isOpen = openingTimes.sat_is_open;
//             openAndClose.openTime = openingTimes.sat_open;
//             openAndClose.closeTime = openingTimes.sat_close;
//         }
//         else if (weekDay === 7) {
//             openAndClose.isOpen = openingTimes.sun_is_open;
//             openAndClose.openTime = openingTimes.sun_open;
//             openAndClose.closeTime = openingTimes.sun_close;
//         }
//         return openAndClose;
//     }
//     return null;
// }

// export const inputHorarioReplyMsg = (openAndClose) => {
//     let replyMsg = '';
//     if (openAndClose) {
//         if (openAndClose.isOpen === true) {
//             const strOpenTime = new Date(openAndClose.openTime).getHours() + ':' + new Date(openAndClose.openTime).getMinutes().toString().padStart(2, '0');
//             const strCloseTime = new Date(openAndClose.closeTime).getHours() + ':' + new Date(openAndClose.closeTime).getMinutes().toString().padStart(2, '0');

//             replyMsg = 'Olá, hoje nosso horário de funcionamento é a partir das ';
//             replyMsg = replyMsg + strOpenTime + ' horas, até às ';
//             replyMsg = replyMsg + strCloseTime + ' horas.';
//         } else {
//             replyMsg = 'Olá, infelizmente hoje estamos fechados, então, não estamos aceitando pedidos. ';
//         }
//     }
//     return replyMsg;
// }
