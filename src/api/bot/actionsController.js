import { getFlavors, getFlavorByName } from "../controllers/flavorsController";
import { getToppings, getToppingsNames } from "../controllers/toppingsController";
import { getOpeningTimes } from '../controllers/storesController';
import { getOnePricing } from '../controllers/pricingsController';

const QTY_1 = [1, "um", "uma"];

export const getFlavorsAndToppings = async (pageID, sizeID) => {
    try {
        const flavorArray = await getFlavors(pageID);
        for (let flavor of flavorArray) {
            if (sizeID) {
                const pricing = await getOnePricing(pageID, flavor.kind, sizeID);
                if (pricing) {
                    flavor.price = pricing.price;
                }
            }
            flavor.toppingsNames = await getToppingsNames(flavor.toppings);
        }
        return flavorArray;
    } catch (err) {
        console.log("err on getFlavorsAndToppings");
        console.log(err);
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

/**
 * validateBotOrder
 * @param {*} pageID 
 * @param {*} entities 
 * @return
 */
export const validateBotOrder = async (pageID, entities) => {
    const { quantidade, tamanho, produto, sabor } = entities;
    const validated = basicValidation(quantidade, tamanho, produto, sabor);
    var replyText = new String();
    if (validated === 0) { // passed
        const order_flavor = await getFlavorByName(pageID, sabor[0]);

        if (order_flavor) {
            const order_qty = quantidade[0];
            const order_size = tamanho[0];
            const order_prod = produto.length > 0 ? produto[0] : 'pizza';
            const order_flav = order_flavor.flavor;

            replyText = 'Ok, o seu pedido é : \n';
            replyText = replyText.concat(order_qty, ' ', order_prod, ' ', order_size, ' de ', order_flav, '\n');
            replyText = replyText.concat('Para confirmar, digite SIM. Se tem algum problema, diga pra mim o que está errado');
        } else {
            replyText = 'Não temos o sabor ' + sabor[0];
        }
    } else if (validated === 1) {
        replyText = 'A quantidade solicitada não bate, vou questionar se está faltando algo...';
    } else {
        replyText = 'Algum problema com tamanho ou sabor...';
    }
    return replyText;
}

/**
 * basicValidation
 * @param {*} quantidade 
 * @param {*} tamanho 
 * @param {*} produto 
 * @param {*} sabor 
 * @returns
 *      0 - if the validation passed
 *      1 - if quantidade validation failed
 *      2 - if tamanho validation failed
 *      3 - if produto validation failed
 *      4 - if sabor validation failed
 */
const basicValidation = (quantidade, tamanho, produto, sabor) => {
    // 1 pizza, 1 sabor, 1 quantidade
    if (quantidade.length === 1) { // && QTY_1.includes(quantidade[1])) {
        if (tamanho.length === 1) {
            if (sabor.length === 1) {
                return 0;
            }
        }
    }
    return 5;
}


