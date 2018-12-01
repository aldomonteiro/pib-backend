import { getFlavors, getFlavorByName } from "../controllers/flavorsController";
import { getToppings, getToppingsNames } from "../controllers/toppingsController";
import { getOpeningTimes } from '../controllers/storesController';
import { getOnePricing } from '../controllers/pricingsController';

const QTY_1 = [1, "um", "uma"];

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

export const addQuickReplyOptions = quickReplyOptions => {

}
