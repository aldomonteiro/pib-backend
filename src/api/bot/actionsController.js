import { getFlavors, getFlavorByName } from "../controllers/flavorsController";
import { getToppings, getToppingsNames } from "../controllers/toppingsController";
import { getOpeningTimes } from '../controllers/storesController';
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
    showFullOrder
} from './botController';


const QTY_1 = [1, "um", "uma"];


export const sendActions = async ({ action, bot, sender, pageID, multiple, split, data, payload }) => {
    try {
        let out = new Elements();
        switch (action) {
            case 'SEND_WELCOME':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await sendWelcomeMessage(pageID, sender)
                await Bot.wait(500);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);

                break;
            case 'SEND_CARDAPIO':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await sendCardapio(pageID);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'ASK_FOR_PHONE':
                await bot.startTyping(sender.id);
                await Bot.wait(800);
                out = await askForPhone(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'SHOW_PHONE':
                await bot.startTyping(sender.id);
                await Bot.wait(500);

                const phone = typeof data === 'undefined' ? payload : data;
                out = await showPhone(pageID, sender.id, phone);

                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'SHOW_ADDRESS':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await showAddress(pageID, sender.id, data);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'SHOW_ORDER_OR_ASK_FOR_PHONE':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await showOrderOrAskForPhone(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'ASK_TO_TYPE_PHONE':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askToTypePhone(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'ASK_FOR_LOCATION':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askForLocation();
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'ASK_TO_TYPE_ADDRESS':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askToTypeAddress(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'ASK_FOR_QUANTITY':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askForQuantity(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;
            case 'ASK_FOR_FLAVOR':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askForFlavor(pageID, sender.id, multiple, split);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'SHOW_FLAVOR':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await showFlavor(pageID, sender.id, data);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;

            case 'ASK_FOR_WANT_BEVERAGE':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askForWantBeverage(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);

                break;

            case 'SHOW_NO_BEVERAGE':
                await bot.startTyping(sender.id);
                await Bot.wait(200);
                out = await showNoBeverage(pageID, sender.id, data);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);

                break;
            case 'ASK_FOR_BEVERAGE_OPTIONS':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await askForBeverages(pageID, sender.id, multiple);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);

                break;

            case 'SHOW_BEVERAGE':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await showBeverage(pageID, sender.id, data);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);

                break;
            case 'SHOW_FULL_ORDER':
                // show summary
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await showFullOrder(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);
                break;
            case 'CONFIRM_ORDER':
                await bot.startTyping(sender.id);
                await Bot.wait(500);
                out = await confirmOrder(pageID, sender.id);
                await bot.stopTyping(sender.id);
                await bot.send(sender.id, out);

                break;
            default:
                break;
        }
    } catch (sendActionsErr) {
        console.error(action, sendActionsErr);
        throw sendActionsErr;
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
                    flavor.toppingsNames = await getToppingsNames(flavor.toppings);
                    flavorsWithPrice.push(flavor);
                }
            } else {
                flavor.toppingsNames = await getToppingsNames(flavor.toppings);
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

    const openingTimes = await getOpeningTimes(pageID);

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
