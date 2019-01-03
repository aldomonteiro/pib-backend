import { getFlavors, getFlavorByName } from "../controllers/flavorsController";
import { getToppings, getToppingsNames } from "../controllers/toppingsController";
import { getStoreData } from '../controllers/storesController';
import { getOnePricing } from '../controllers/pricingsController';
import { Bot, Elements } from 'facebook-messenger-bot';
import {
    sendWelcomeMessage,
    sendErrorMsg,
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
    confirmTypedText,
    askForWantBeverage, askForBeverages, showBeverage, showNoBeverage,
    sendHorario,
    basicReply,
    askForChangeOrder,
    askForSplitFlavorOrConfirm,
    askForFlavorOrConfirm,
    askForSpecificItem,
    updateItemAskOptions,
    showOrderOrAskForPhone,
    showSplit,
    showFullOrder,
    askForWantOrder
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
    m_returnedCustomer
} from "./botMarkController";


const QTY_1 = [1, "um", "uma"];

/**
 * Receive events, dispatch actions
 * @param {*} param0 
 */
export const mapEventsActions = async ({ event, data, bot, sender, pageID }) => {
    try {
        switch (event) {
            case 'MAIN-MENU':
                switch (data) {
                    case 'CARDAPIO_PAYLOAD':
                        await sendActions({ action: 'SEND_CARDAPIO', bot, sender, pageID });
                        await Bot.wait(3000);
                        await sendActions({ action: 'ASK_FOR_ORDER', bot, sender, pageID });
                        break;
                    case 'PEDIDO_PAYLOAD':
                        await sendActions({ action: 'CHECK_ADDRESS', bot, sender, pageID });
                        break;
                    case 'HORARIO_PAYLOAD':
                        await sendActions({ action: 'SEND_HORARIO', bot, sender, pageID });
                        break;
                }
                break;
            case 'ORDER_WANT_ORDER':
                switch (data) {
                    case 'wantorder_yes':
                        await sendActions({ action: 'CHECK_ADDRESS', bot, sender, pageID });
                        break;
                    case 'wantorder_no':
                        await sendActions({ action: 'BASIC_REPLY', bot, sender, pageID, data: 'Ok, vou enviar as opções então. Para continuar é só clicar em uma delas' });
                        await sendActions({ action: 'SEND_MAIN_MENU', bot, sender, pageID });
                        break;
                }
                break;
            case 'CORRECT_SAVED_ADDRESS':
                await sendActions({ action: 'SHOW_ADDRESS', bot, sender, pageID, data });
                await sendActions({ action: 'ASK_FOR_PHONE', bot, sender, pageID });
                break;
            case 'WRONG-SAVED-ADDRESS':
                await sendActions({ action: 'ASK_FOR_LOCATION', bot, sender, pageID });
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
                switch (data) {
                    case 'confirmation_yes':
                        await sendActions({ action: 'ASK_FOR_WANT_BEVERAGE', bot, sender, pageID });
                        break;
                    default:
                        await sendActions({ action: 'ASK_FOR_CHANGE_ORDER', bot, sender, pageID });
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
            case 'ORDER_CONFIRM_BEVERAGE':
                switch (data) {
                    case 'beverage_yes':
                        await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID, multiple: 1 })
                        break;
                    default:
                        await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID })
                        await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID })
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
                        await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID })
                        break;
                    default:
                        await sendActions({ action: 'SHOW_BEVERAGE', bot, sender, pageID, data })
                        await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID })
                        break;
                }
                break;
            case 'ORDER_CONFIRMATION':
                switch (data) {
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

export const sendActions = async ({ action, bot, sender, pageID, multiple, split, data, payload, location, text, last_answer }) => {
    try {
        let out = new Elements();
        await bot.startTyping(sender.id);
        await Bot.wait(500);
        switch (action) {
            case 'BASIC_REPLY':
                out = await basicReply(data);
                break;
            case 'SEND_WELCOME':
                out = await sendWelcomeMessage(pageID, sender)
                break;
            case 'SEND_MAIN_MENU':
                out = await sendMainMenu();
                break;
            case 'SEND_CARDAPIO':
                out = await sendCardapio(pageID);
                break;
            case 'SEND_HORARIO':
                out = await sendHorario(pageID);
                break;
            case 'CHECK_ADDRESS':
                out = await confirmAddressOrAskLocation(pageID, sender.id, user);
                break;
            case 'ASK_FOR_ORDER':
                out = await askForWantOrder(pageID, sender.id);
                break;
            case 'LOCATION_CONFIRM_ADDRESS':
                const user = await bot.fetchUser(sender.id);
                out = await confirmLocationAddress(pageID, sender.id, location, user);
                break;
            case 'ASK_FOR_PHONE':
                out = await askForPhone(pageID, sender.id);
                break;
            case 'SHOW_PHONE':
                out = await showPhone(pageID, sender.id, payload || data);
                break;
            case 'SHOW_ADDRESS':
                out = await showAddress(pageID, sender.id, data);
                break;
            case 'SHOW_ORDER_OR_ASK_FOR_PHONE':
                out = await showOrderOrAskForPhone(pageID, sender.id);
                break;
            case 'ASK_TO_TYPE_PHONE':
                out = await askToTypePhone(pageID, sender.id);
                break;
            case 'ASK_FOR_LOCATION':
                out = await askForLocation();
                break;
            case 'ASK_TO_TYPE_ADDRESS':
                out = await askToTypeAddress(pageID, sender.id);
                break;
            case 'ASK_FOR_QUANTITY':
                out = await askForQuantity(pageID, sender.id);
                break;
            case 'ASK_FOR_QUANTITY_MORE':
                out = await askForQuantityMore(pageID, sender.id);
                break;
            case 'SHOW_QUANTITY':
                out = await showQuantity(pageID, sender.id, data);
                break;
            case 'ASK_FOR_SIZE':
                out = await askForSize(pageID, sender.id);
                break;
            case 'SHOW_SIZE':
                out = await showSize(pageID, sender.id, data);
                break;
            case 'SHOW_SPLIT':
                out = await showSplit(pageID, sender.id, data);
                break;
            case 'CHECK_SPLIT':
                out = await askForSplitFlavorOrConfirm(pageID, sender.id, 1);
                break;
            case 'CHECK_FLAVOR':
                out = await askForFlavorOrConfirm(pageID, sender.id, 1, data);
                break;
            case 'ASK_FOR_FLAVOR':
                out = await askForFlavor(pageID, sender.id, multiple, split);
                break;
            case 'SHOW_FLAVOR':
                out = await showFlavor(pageID, sender.id, data);
                break;
            case 'CHECK_ITEM':
                out = await showOrderOrNextItem(pageID, sender.id);
                break;
            case 'ASK_FOR_WANT_BEVERAGE':
                out = await askForWantBeverage(pageID, sender.id);
                break;
            case 'SHOW_NO_BEVERAGE':
                out = await showNoBeverage(pageID, sender.id, data);
                break;
            case 'ASK_FOR_BEVERAGE_OPTIONS':
                out = await askForBeverages(pageID, sender.id, multiple);
                break;
            case 'SHOW_BEVERAGE':
                out = await showBeverage(pageID, sender.id, data);
                break;
            case 'SHOW_FULL_ORDER':
                out = await showFullOrder(pageID, sender.id);
                break;
            case 'ASK_FOR_CHANGE_ORDER':
                out = await askForChangeOrder(pageID, sender.id);
                break;
            case 'ASK_FOR_SPECIFIC_ITEM':
                out = await askForSpecificItem(pageID, sender.id);
                break;
            case 'UPDATE_ITEM':
                out = await updateItemAskOptions(pageID, sender.id, data);
                break;
            case 'CONFIRM_ORDER':
                out = await confirmOrder(pageID, sender.id);
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


/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID 
 * @param {*} sizeID 
 */
export const getFlavorsAndToppings = async (pageID, sizeID) => {
    try {
        const flavorArray = await getFlavors(pageID);
        const flavorsWithPrice = new Array();
        for (let flavor of flavorArray) {
            if (sizeID) {
                const pricing = await getOnePricing(pageID, flavor.kind, sizeID);
                if (pricing) {
                    flavor.price = pricing.price;
                }
            }
            if (sizeID) {
                if (flavor.price) {
                    flavor.toppingsNames = await getToppingsNames(flavor.toppings, pageID);
                    flavorsWithPrice.push(flavor);
                }
            } else {
                flavor.toppingsNames = await getToppingsNames(flavor.toppings, pageID);
                flavorsWithPrice.push(flavor);
            }
        }
        return flavorsWithPrice;
    } catch (flavorsAndToppingsErr) {
        console.error({ flavorsAndToppingsErr });
    }
}

export const inputCardapioReplyMsg = (flavorArray) => {
    let replyMsg = '';
    if (flavorArray) {
        for (const flavor of flavorArray) {
            replyMsg = replyMsg + '*' + flavor.flavor + '*' + '\n';
            replyMsg = replyMsg + flavor.toppingsNames.join();
            replyMsg = replyMsg + '\n';
        }
    }
    return replyMsg;
}

export const getOpenAndClose = async (pageID) => {
    // TODO: timezone from the store
    const weekDay = (new Date()).getDay();

    const openingTimes = await getStoreData(pageID);

    if (openingTimes) {
        let openAndClose = { isOpen: false, openTime: null, closeTime: null };
        if (weekDay === 1) {
            openAndClose.isOpen = openingTimes.mon_is_open;
            openAndClose.openTime = openingTimes.mon_open;
            openAndClose.closeTime = openingTimes.mon_close;
        } else if (weekDay === 2) {
            openAndClose.isOpen = openingTimes.tue_is_open;
            openAndClose.openTime = openingTimes.tue_open;
            openAndClose.closeTime = openingTimes.tue_close;
        } else if (weekDay === 3) {
            openAndClose.isOpen = openingTimes.wed_is_open;
            openAndClose.openTime = openingTimes.wed_open;
            openAndClose.closeTime = openingTimes.wed_close;
        } else if (weekDay === 4) {
            openAndClose.isOpen = openingTimes.thu_is_open;
            openAndClose.openTime = openingTimes.thu_open;
            openAndClose.closeTime = openingTimes.thu_close;
        } else if (weekDay === 5) {
            openAndClose.isOpen = openingTimes.fri_is_open;
            openAndClose.openTime = openingTimes.fri_open;
            openAndClose.closeTime = openingTimes.fri_close;
        } else if (weekDay === 6) {
            openAndClose.isOpen = openingTimes.sat_is_open;
            openAndClose.openTime = openingTimes.sat_open;
            openAndClose.closeTime = openingTimes.sat_close;
        }
        else if (weekDay === 7) {
            openAndClose.isOpen = openingTimes.sun_is_open;
            openAndClose.openTime = openingTimes.sun_open;
            openAndClose.closeTime = openingTimes.sun_close;
        }
        return openAndClose;
    }
    return null;
}

export const inputHorarioReplyMsg = (openAndClose) => {
    let replyMsg = '';
    if (openAndClose) {
        if (openAndClose.isOpen === true) {
            const strOpenTime = new Date(openAndClose.openTime).getHours() + ':' + new Date(openAndClose.openTime).getMinutes().toString().padStart(2, '0');
            const strCloseTime = new Date(openAndClose.closeTime).getHours() + ':' + new Date(openAndClose.closeTime).getMinutes().toString().padStart(2, '0');

            replyMsg = 'Olá, hoje nosso horário de funcionamento é a partir das ';
            replyMsg = replyMsg + strOpenTime + ' horas, até às ';
            replyMsg = replyMsg + strCloseTime + ' horas.';
        } else {
            replyMsg = 'Olá, infelizmente hoje estamos fechados, então, não estamos aceitando pedidos. ';
        }
    }
    return replyMsg;
}
