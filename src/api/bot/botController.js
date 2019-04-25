import util from 'util';
import fs from 'fs';
import { Bot, Elements, QuickReplies } from 'facebook-messenger-bot';
import {
    getOnePageToken,
    getOnePageData, sendPassThreadControl,
} from '../controllers/pagesController';
import { getPricingSizing, getPricings } from '../controllers/pricingsController';
import { getFlavors } from '../controllers/flavorsController';
import { getToppingsFull } from '../controllers/toppingsController';
import { getCardapio } from './show_cardapio';
import { getSizes, getSize } from '../controllers/sizesController';
import { getBeverages } from '../controllers/beveragesController';
import { getTodayOpeningTime, getStoreData } from '../controllers/storesController';
import { updateOrder, getOrderPending, cancelOrder, ORDERSTATUS_PENDING, ORDERSTATUS_CONFIRMED } from '../controllers/ordersController';
import {
    getAddressLocation,
    getCustomerAddress, formatAddrData, notifyUserStopAuto,
} from '../controllers/customersController';
import {
    updateStatusSpecificItem, deleteItem,
    updateItemDirect, deletePendingItem, updateItemStatus,
} from '../controllers/itemsController';
import { formatWhatsappNumber, formatAsCurrency } from '../util/util';
import { getCategories, getCategory } from '../controllers/categoriesController';

// TODO: create a debugger with json format
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

const MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico: ';

// // create a custom timestamp format for log statements
// const SimpleNodeLogger = require('simple-node-logger'),
//     opts = {
//         logFilePath: 'logs/bot.log',
//         timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
//     },
//     log = SimpleNodeLogger.createSimpleLogger(opts);

export const sendErrorMsg = async (_errorMsg) => {
    const out = new Elements();
    let _showErrorMsg = _errorMsg || 'ERRO DESCONHECIDO';
    out.add({ text: MSG_GENERAL_ERROR + _showErrorMsg });
    return out;
}

/**
 * Used in whatSimpleController
 * @param {*} pageId
 * @param {*} userId
 * @param {*} replyText
 */
export const basicReply = async (pageId, userId, replyText, user, data) => {
    const confirm = !!data;
    await updateOrder({ pageId, userId, waitingFor: 'typed_comments', user: user, comments: data, confirmOrder: confirm });
    return { type: 'text', text: replyText };
}

export const basicOption = async (pageId, userId, text, optionText, data, user) => {
    await updateOrder({ pageId, userId, waitingFor: 'typed_comments', user: user });

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
    await updateOrder({ pageId, userId, waitingFor: 'typed_comments', postComments: text, user: user });
    return true;
}


/**
 * Send Yes or No to the user asking if he wants to place an order right now.
 * @param {*} pageId
 * @param {*} userId
 */
export const askForContinue = async () => {
    return {
        type: 'replies',
        text: 'Não entendi o que você quis dizer. 😞.\n Vamos continuar com o pedido?',
        options: [
            { text: 'Sim', data: 'continueorder_yes', event: 'ORDER_CONTINUE_ORDER' },
            { text: 'Não', data: 'continueorder_no', event: 'ORDER_CONTINUE_ORDER' },
        ],
    }
}

export const checkLastAction = async (pageId, userId) => {
    const pendingOrder = await getOrderPending({ pageId, userId });

    if (pendingOrder.order) {
        const wf = pendingOrder.order.waitingFor;
        const wfd = pendingOrder.order.waitingForData;

        if (wf === 'confirm_address') {
            const addrData = await getCustomerAddress(pageId, userId);
            return await confirmAddress(pageId, userId, addrData);
        } else if (wf === 'location')
            return await askForLocation(pageId, userId);
        else if (wf === 'location_address') {
            const location = {
                lat: pendingOrder.order.location_lat,
                long: pendingOrder.order.location_long,
                url: pendingOrder.order.location_url,
            }
            return await confirmLocationAddress(pageId, userId, location);
        } else if (wf === 'size')
            return await askForSizeCat(pageId, userId)
        else if (wf === 'deliver')
            return await askForDeliver(pageId, userId);
        else if (wf === 'category')
            return await askForCategory(pageId, userId, wfd);
        else if (wf === 'quantity')
            return await askForQuantity(pageId, userId);
        else if (wf === 'split')
            return checkSplit(pageId, userId, 1);
        else if (wf === 'flavor')
            return await askForFlavor(pageId, userId, 1);
        else if (wf === 'change_order')
            return await askForChangeOrder(pageId, userId);
        else if (wf === 'partial_confirmation')
            return await showPartialOrder(pageId, userId);
        else if (wf === 'want_beverage')
            return await askForWantBeverage(pageId, userId);
        else if (wf === 'beverage')
            return await askForBeverages(pageId, userId, 1);
        else if (wf === 'payment_type')
            return await askForPaymentType(pageId, userId);
        else if (wf === 'payment_change')
            return await askForPaymentChange(pageId, userId);
        else if (wf === 'comments')
            return await askForComments(pageId, userId);
        else if (wf === 'full_confirmation')
            return await showFullOrder(pageId, userId);
        else if (wf === 'nothing')
            return await showOrderOrNextItem(pageId, userId);
        else
            return await sendMainMenu();
    } else
        return await sendMainMenu();
}

export const optionsStopOrder = async () => {
    return {
        type: 'replies',
        text: 'Muito bem, aqui estão as opções:',
        options: [
            { text: 'Voltar p/ Início', data: 'stoporder_init', event: 'STOP_ORDER_OPTIONS' },
            { text: 'Falar c/ Atendente', data: 'stoporder_human', event: 'STOP_ORDER_OPTIONS' },
        ],
    }
}

export const passThreadControl = async (pageId, userId, source, user) => {
    let _txt = 'Ok, a partir de agora você está nas mãos do nosso atendente.';
    _txt += ' O que você escrever a partir de agora será respondido por uma pessoa,'
    _txt += 'o mais rápido possível!';

    if (source === 'whatsapp') {
        notifyUserStopAuto(pageId, userId, user);
    }
    try {
        await sendPassThreadControl(pageId, userId, source);
        return { type: 'text', text: _txt };
    } catch (err) {
        console.error(err);
        return { type: 'text', text: _txt };
    }
}

/**
 *
 * @param {*} sender
 * @param {*} pageID
 */
export const sendWelcomeMessage = async (pageID, sender) => {
    let _nameToReplace = '';
    if (sender && typeof sender !== 'string') {
        // This only works on Facebook
        await sender.fetch('first_name');
        _nameToReplace = sender.first_name;
    } else if (sender && typeof sender === 'string')
        _nameToReplace = sender;

    const page = await getOnePageData(pageID);
    const replyMsg = page.firstResponseText.replace('$NAME', _nameToReplace);

    return { type: 'text', text: replyMsg };
}

export const sendMainMenu = async () => {
    return {
        type: 'buttons',
        text: 'Por favor escolha uma das opções',
        options: [
            { text: '🍕 Cardápio', data: 'CARDAPIO_PAYLOAD', event: 'MAIN-MENU' },
            { text: '🕒 Horários', data: 'HORARIO_PAYLOAD', event: 'MAIN-MENU' },
            { text: '📨 Fazer Pedido', data: 'PEDIDO_PAYLOAD', event: 'MAIN-MENU' },
            { text: '🗣 Falar c/ Atendente', data: 'stoporder_human', event: 'MAIN-MENU' },
        ],
    };

    // const buttons = new Buttons();
    // buttons.add({ text: '🍕 Cardápio', data: 'CARDAPIO_PAYLOAD', event: 'MAIN-MENU' });
    // buttons.add({ text: '🕒 Horários', data: 'HORARIO_PAYLOAD', event: 'MAIN-MENU' });
    // buttons.add({ text: '📨 Fazer Pedido', data: 'PEDIDO_PAYLOAD', event: 'MAIN-MENU' });

    // const out = new Elements();
    // out.add({ text: 'Por favor escolha uma das opções', buttons });

    // return out;
}

export const sendHorario = async (pageID, source) => {
    const { todayIsOpen, todayOpenAt, todayCloseAt } = await getTodayOpeningTime(pageID);

    let replyMsg = '';
    if (todayIsOpen === true) {
        replyMsg = 'Estamos abertos hoje, a partir das ' + todayOpenAt + ' horas, até às ' + todayCloseAt + ' horas.';
    } else {
        replyMsg = 'Infelizmente hoje não estamos abertos, mas você pode consultar nosso cardápio no menu principal.';
    }

    if (source && source === 'whatsapp') {
        const reply = await sendMainMenu();
        reply.text = replyMsg + '\n\n' + reply.text;
        return reply;
    } else
        return { type: 'text', text: replyMsg };
}

/**
 * Returns only the formatted text to be sent to the user
 * @param {*} pageID
 */
export const sendCardapio = async (pageID, data, source) => {
    const replyMsg = await getCardapio(pageID, data.id);

    if (source && source === 'whatsapp') {
        const reply = await sendMainMenu();
        reply.text = replyMsg + '\n\n' + reply.text;
        return reply;
    } else
        return { type: 'text', text: replyMsg };
}


/**
 * Returns array of flavors. If sizeID was passed, only returns flavors with price.
 * @param {*} pageID
 * @param {*} sizeID
 */
export const getFlavorsAndToppings = async (pageID, categoryID, sizeID) => {
    try {
        const flavorArray = await getFlavors(pageID);
        const allToppings = await getToppingsFull(pageID);
        const pricings = await getPricings(pageID);
        const flavorsWithPrice = [];
        for (let flavor of flavorArray) {
            if (categoryID && flavor.categoryId === categoryID) {
                if (sizeID) {
                    for (let price of pricings) {
                        if (price.categoryId === flavor.categoryId && price.sizeId === sizeID) {
                            flavor.price = price.price;
                            break;
                        }
                    }
                }
                if (flavor.price) {
                    flavor.toppingsNames = [];
                    for (let tId of flavor.toppings) {
                        for (let topping of allToppings) {
                            if (topping.id === tId) {
                                flavor.toppingsNames.push(topping.topping);
                            }
                        }
                    }
                    flavorsWithPrice.push(flavor);
                }
            }
        }
        return flavorsWithPrice;
    } catch (flavorsAndToppingsErr) {
        console.error({ flavorsAndToppingsErr });
    }
}


/**
 * Send Yes or No to the user asking if he wants to place an order right now.
 */
export const askForWantOrder = async () => {
    return {
        type: 'replies',
        text: 'Agora que você viu nosso cardápio, você está pronto para fazer o pedido?',
        options: [
            { text: 'Sim', data: 'wantorder_yes', event: 'ORDER_WANT_ORDER' },
            { text: 'Não', data: 'wantorder_no', event: 'ORDER_WANT_ORDER' },
        ],
    };

    // const out = new Elements();
    // let _txt = 'Agora que você viu nosso cardápio, você está pronto para fazer o pedido?';
    // out.add({ text: _txt });

    // const replies = new QuickReplies();
    // // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });
    // replies.add({ text: "Sim", data: "wantorder_yes", event: 'ORDER_WANT_ORDER' });
    // replies.add({ text: "Não", data: "wantorder_no", event: 'ORDER_WANT_ORDER' });
    // out.setQuickReplies(replies);
    // return out;
}

export const askForDeliver = async (pageId, userId) => {
    await updateOrder({ pageId, userId, waitingFor: 'deliver' });

    const storeData = await getStoreData(pageId);
    let _txt = '';

    if (storeData.delivery_time) {
        _txt += `👉 Tempo de entrega: ⏱ *${storeData.delivery_time}* minutos\n`;
    }
    if (storeData.delivery_fees && storeData.delivery_fees.length > 0) {
        _txt += 'Taxa de Entrega: ';
        for (let delivFee of storeData.delivery_fees) {
            _txt += `${formatAsCurrency(delivFee.fee)} (até ${delivFee.to} km) `
        }
        _txt += '\n';
    }
    if (storeData.pickup_time) {
        _txt += `👉 Para retirar aqui: ⏱ *${storeData.pickup_time}* minutos\n`;
    }

    _txt += 'O pedido é para entregar ou você vem retirar aqui?'

    return {
        type: 'replies',
        text: _txt,
        options: [
            {
                text: 'Entregar',
                data: { type: 'delivery', time: storeData.delivery_time },
                event: 'ORDER_DELIVER',
            },
            {
                text: 'Retirar',
                data: { type: 'pickup', time: storeData.pickup_time, address: storeData.address },
                event: 'ORDER_DELIVER',
            },
        ],
    }
}

export const showDeliver = async (pageId, userId, data, user, source) => {
    let _phone = null;
    if (source && source === 'whatsapp') {
        _phone = formatWhatsappNumber(userId);
    }

    await updateOrder({
        pageId, userId,
        deliverType: data.type, deliverTime: data.time, storeAddress: data.address,
        user: user,
        phone: _phone, source: source,
    });

    let _txtReply;
    if (data && data.type === 'delivery')
        _txtReply = 'Entregaremos o seu pedido.';
    else {
        _txtReply = 'Retirar o pedido conosco.\n';
        if (data.address)
            _txtReply += '📌 Nosso endereço: ' + data.address;
    }

    return {
        type: 'text',
        text: '✅ ' + _txtReply,
    };
}

export const showDeliverCheckAddress = async (pageId, userId, data, user, source) => {
    const prevAnswer = await showDeliver(pageId, userId, data, user, source);
    const nextQuestion = await confirmAddressOrAskLocation(pageId, userId, user, source)

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


/**
 * Question No.01
 * If the user doesnt have an address in the database, this will be the first question.
 */
export const askForLocation = async (pageId, userId, user, source) => {

    let _phone = null;
    if (source && source === 'whatsapp') {
        _phone = formatWhatsappNumber(userId);
    }

    await updateOrder({ pageId, userId, user, waitingFor: 'location', phone: _phone, source: source });

    if (!source || source === 'messenger') {
        return {
            type: 'replies',
            text: 'Para começar, preciso saber aonde você está. Por favor clique no botão abaixo para me mandá-la.',
            options: [
                { text: 'Localização', isLocation: true, data: 'location_location', event: 'LOCATION' },
            ],
        }
    } else if (source === 'whatsapp') {
        return {
            type: 'text',
            text: 'Para começar, preciso saber aonde você está. Favor enviar a sua localização.',
            options: [
                { text: 'Localização', data: 'location_location', event: 'LOCATION' },
            ],
        }
    }
}


export const confirmLocationAddress = async (pageId, userId, location, user) => {
    if (location) {
        await updateOrder({ pageId, userId, location, user, waitingFor: 'location_address' });

        const addresses = await getAddressLocation(location);

        if (addresses && addresses.length && addresses.length > 0) {

            let foundAnyCompleteAddress = false;
            const options = [];
            for (let i = 0; i < 4; i++) {
                const element = addresses[i];
                if (element.address_components && element.address_components.length >= 6) {
                    foundAnyCompleteAddress = true;
                    const _data = { formatted_address: element.formatted_address, address_components: element.address_components };
                    const button = { text: 'Esse!', data: _data, event: 'LOCATION_ADDRESS' };
                    let addressNumber = i + 1;
                    options.push({ text: 'Endereço ' + addressNumber, subtext: element.formatted_address, buttons: button });
                }
            }

            if (foundAnyCompleteAddress) {
                const buttonsOpt = { data: 'incorrect_address', event: 'LOCATION_ADDRESS' };
                options.push({
                    text: 'Não é meu endereço..',
                    subtext: 'Selecione essa opção se seu endereço não aparece',
                    buttons: buttonsOpt,
                    isOnlyButtons: true,
                });
                return {
                    type: 'list',
                    text: 'Encontrei esses endereços, selecione o correto:',
                    options: options,
                };
            } else {
                return await askToTypeAddress(pageId, userId);
            }
        } else {
            return await askToTypeAddress(pageId, userId);
        }
    } else {
        return await askToTypeAddress(pageId, userId);
    }
}

export const confirmAddressOrAskLocation = async (pageId, userId, user, source) => {

    // TODO: check if the location is in the neighborhood.
    // TODO: check if the location is the same as stored in db.
    const addrData = await getCustomerAddress(pageId, userId);

    if (addrData) {
        return confirmAddress(pageId, userId, addrData, user, source);
    } else {
        return await askForLocation(pageId, userId, user, source);
    }
}

export const askToTypeAddress = async (pageID, userID) => {
    await updateOrder({ pageId: pageID, userId: userID, waitingForAddress: true, waitingFor: 'typed_address' });

    return {
        type: 'text',
        text: 'Não foi possível localizar um endereço válido. Digite o seu endereço completo por favor.',
    }
}

export const confirmAddress = async (pageId, userId, addrData, user, source) => {
    let _phone = null;
    if (source && source === 'whatsapp') {
        _phone = formatWhatsappNumber(userId);
    }

    if (user)
        await updateOrder({
            pageId, userId, user, waitingForAddress: false,
            waitingFor: 'confirm_address', phone: _phone,
        });
    else
        await updateOrder({
            pageId, userId, waitingForAddress: false,
            waitingFor: 'confirm_address', phone: _phone,
        });

    let _replyText = 'A entrega será para esse endereço?\n';
    _replyText = _replyText + addrData.formattedAddress;

    return {
        type: 'replies',
        text: _replyText,
        options: [
            { text: 'Sim', data: addrData, event: 'CORRECT_SAVED_ADDRESS' },
            { text: 'Não', data: addrData, event: 'WRONG_SAVED_ADDRESS' },
        ],
    }
}

export const showAddress = async (pageId, userId, addrData, source) => {
    let _phone = null;
    if (source && source === 'whatsapp') {
        _phone = formatWhatsappNumber(userId);
    }

    if (addrData && addrData.address_components) {
        const formattedAddrData = await formatAddrData(addrData);
        await updateOrder({ pageId, userId, addrData: formattedAddrData, phone: _phone });
    } else {
        await updateOrder({ pageId, userId, addrData, phone: _phone });
    }

    return {
        type: 'text',
        text: 'Ok, entregaremos nesse endereço.',
    }
}


export const showOrderOrAskForPhone = async (pageId, userId) => {
    const po = await getOrderPending({ pageId, userId, isComplete: false });

    if (po.order && po.order.waitingFor === 'partial_confirmation')
        return await showOrderOrNextItem(pageId, userId);
    else
        return await askForPhone(pageId, userId);
}

export const askForPhone = async (pageId, userId) => {
    await updateOrder({ pageId, userId, waitingFor: 'phone' });

    const _txt = 'Pode nos enviar o seu telefone para confirmar o seu pedido? Se não aparecer o seu telefone (ou estiver errado), use a opção digitar.';

    const _options = []
    _options.push({ text: 'Telefone', isPhoneNumber: true, data: 'phone_number', event: 'PHONE_NUMBER' });
    _options.push({ text: 'Digitar o telefone', data: 'change_phone', event: 'PHONE_CONFIRMED' });

    return {
        type: 'replies',
        text: _txt,
        options: _options,
    };
}

export const askToTypePhone = async (pageId, userId) => {

    await updateOrder({ pageId, userId, waitingFor: 'phone' });

    const out = new Elements();
    out.add({ text: 'Por favor, digite o número do telefone válido para que possamos confirmar o pedido. Pode digitar o 📞:' });
    return out;
}

export const confirmTypedPhone = async (pageId, userId, phone) => {
    const out = new Elements();

    await updateOrder({ pageId, userId, waitingFor: 'phone' });

    let _txt = 'O telefone ' + phone + ' está coreto?';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: 'Sim', data: phone, event: 'PHONE_CONFIRMED' });
    replies.add({ text: 'Não, usar outro', data: 'change_phone', event: 'PHONE_CONFIRMED' });
    out.setQuickReplies(replies);

    return out;
}


export const showPhone = async (pageId, userId, phone) => {
    await updateOrder({ pageId, userId, phone, waitingFor: 'nothing' });

    const out = new Elements();
    out.add({ text: 'Usaremos o número ' + phone + ' para confirmar o pedido. Agora vou pegar as informações do pedido.' });
    return out;
}

export const showDeliverAskForQuantity = async (pageId, userId, data, user, source) => {
    const prevAnswer = await showDeliver(pageId, userId, data, user, source);
    const nextQuestion = await askForQuantity(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


/**
 * Show Address only stores the addres in database. Ignoring the return.
 * The user is gonna see the AskForQuantity.
 * Used on Whatsapp.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} addrData
 */
export const showAddressAskForQuantity = async (pageId, userId, addrData, source) => {
    const prevAnswer = await showAddress(pageId, userId, addrData, source);
    let nextQuestion;

    // Show Address can be called from the creation order flow or from
    // the update order flow. Below, if it was called from the update order
    // flow, I am gonna return the flow to the showOrder or showFullOrder
    const po = await getOrderPending({ pageId, userId, isComplete: false });
    if (po && po.order && po.order.backToConfirmation) {
        if (po.order.backToConfirmation === 'full_confirmation') {
            nextQuestion = await showFullOrder(pageId, userId);
        } else if (po.order.backToConfirmation === 'partial_confirmation') {
            nextQuestion = await showOrderOrNextItem(pageId, userId);
        } else {
            nextQuestion = await askForQuantity(pageId, userId);
        }
    } else {
        nextQuestion = await askForQuantity(pageId, userId);
    }

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

export const askForQuantity = async (pageId, userId) => {
    await updateOrder({ pageId, userId, waitingFor: 'quantity' });

    return {
        type: 'replies',
        text: 'Quantas pizzas você quer?',
        options: [
            { text: '1', whatsText: 'Uma', data: 'qty_1', event: 'ORDER_QTY' },
            { text: '2', whatsText: 'Duas', data: 'qty_2', event: 'ORDER_QTY' },
            { text: '3', whatsText: 'Três', data: 'qty_3', event: 'ORDER_QTY' },
            { text: '+ de 3', data: 'qty_more', event: 'ORDER_QTY' },
        ],
    }
}

export const askForQuantityMore = async (pageId, userId) => {
    await updateOrder({ pageId, userId, waitingFor: 'quantity' });

    return {
        type: 'replies',
        text: 'Quantas pizzas você quer?',
        options: [
            { text: '- de 4', data: 'qty_less', event: 'ORDER_QTY' },
            { text: '4', whatsText: 'Quatro', data: 'qty_4', event: 'ORDER_QTY' },
            { text: '5', whatsText: 'Cinco', data: 'qty_5', event: 'ORDER_QTY' },
            { text: '6', whatsText: 'Seis', data: 'qty_6', event: 'ORDER_QTY' },
        ],
    }
}

export const showQuantity = async (pageId, userId, data) => {
    // data is 'qty_1', 'qty_2', 'qty_3'...
    const qty = data.substr(data.length - 1, 1);

    await updateOrder({ pageId, userId, qty, waitingFor: 'size', undo: 'quantity', currentItem: 1 });

    let out;
    if (qty == 1) {
        out = {
            type: 'text',
            text: '✅ ' + ' 1 pizza.',
        };
    } else {
        out = {
            type: 'text',
            text: '✅ ' + qty + ' pizzas.',
        };
    }

    // out.text = out.text + '(digite 0 p/ desfazer)'

    return out;
}

export const askForSize = async (pageId, userId) => {

    const po = await getOrderPending({ pageId, userId, isComplete: false });

    if (po.order) {
        let _text = '';
        if (po.order.qty === 1) {
            _text = 'Qual o tamanho da pizza?';
        } else {
            _text = 'Agora vou pegar os detalhes da ' + po.order.currentItem + 'a. pizza.\n';
            _text = _text + 'Qual o tamanho dela?';
        }

        const _options = [];
        const sizesWithPricing = await getPricingSizing(pageId); // only sizes with pricing
        const sizes = await getSizes(pageId, sizesWithPricing);
        for (let i = 0; i < sizes.length; i++) {
            const _data = { id: sizes[i].id, size: sizes[i].size, split: sizes[i].split };
            _options.push({ text: sizes[i].size, data: _data, event: 'ORDER_SIZE' });
        }

        const out = {
            type: 'replies',
            text: _text,
            options: _options,
        }
        if (po.order.qty === 1)
            await updateOrder({ pageId, userId, waitingFor: 'size' });
        else
            await updateOrder({
                pageId, userId, waitingFor: 'size',
                qty_total: po.order.qty_total, currentItem: po.order.currentItem, eraseSplit: true,
            });

        return out;
    } else {
        const out = {
            type: 'text',
            text: MSG_GENERAL_ERROR,
        };
        return out;
    }
}

/**
 * Calls ShowQuantity and AskForSize
 * Used on Whatsapp.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showQuantityAskForSize = async (pageId, userId, data) => {
    const prevAnswer = await showQuantity(pageId, userId, data);
    const nextQuestion = await askForSize(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


export const showSize = async (pageId, userId, data) => {
    if (data && data.split && data.split > 1)
        await updateOrder({ pageId, userId, sizeId: data.id, undo: 'size', waitingFor: 'split' });
    else
        await updateOrder({ pageId, userId, sizeId: data.id, undo: 'size', waitingFor: 'flavor' });

    return {
        type: 'text',
        text: '✅ ' + ' Tamanho: ' + data.size, // + ' (digite 0 p/ desfazer)',
    };
}

/**
 * Triggered by action CHECK_SPLIT
 * @param {*} pageId
 * @param {*} userId
 * @param {*} multiple
 */
export const checkSplit = async (pageId, userId, multiple) => {
    const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId, isComplete: true });
    if (pendingOrder.order) {
        const currentSize = await getSize(pageId, pendingOrder.order.currentItemSize);
        // if split is gt than 1, ask user if he wants to split in more than one flavor.
        if (currentSize.split && currentSize.split > 1) {
            let _txt = 'A pizza ' + currentSize.size + ' pode ser dividida em ' + currentSize.split + ' sabores.\n';
            _txt = _txt + 'Escolha quantos sabores você quer:';

            const _options = [];
            for (let i = 1; i <= currentSize.split; i++) {
                let _replyText = i === 1 ? i + ' Sabor' : i + ' Sabores';
                _options.push({ text: _replyText, data: i, event: 'ORDER_SPLIT' });
            }

            return {
                type: 'replies',
                text: _txt,
                options: _options,
            };
        } else {
            return await askForFlavorOrConfirm(pageId, userId, multiple);
        }
    }
}

export const showSizeCheckSplit = async (pageId, userId, data, multiple) => {
    const prevAnswer = await showSize(pageId, userId, data);
    const nextQuestion = await checkSplit(pageId, userId, multiple);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

/**
 * After user answer if he wants to split the pizza, show the chosen option.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 **/
export const showSplit = async (pageId, userId, data) => {
    await updateOrder({
        pageId, userId,
        sizeId: data.id,
        waitingFor: 'flavor',
        originalSplit: data,
    });

    let _txtFlavor = data === 1 ? 'Sabor' : 'Sabores';

    return {
        type: 'text',
        text: '✅ ' + data + ' ' + _txtFlavor,
    };
}


export const askForFlavorOrConfirm = async (pageId, userId, multiple) => {
    const po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: true });

    if (po.order) {
        if (po.order.originalSplit > 1 &&
            po.order.originalSplit >= po.order.currentItemSplit) {
            return await askForFlavor(pageId, userId, multiple, po);
        } else {
            if (po.items && po.items.length) {
                for (let i = 0; i < po.items.length; i++) {
                    if (po.items[i].status === 0 && po.items[i].flavorId > 0) {
                        await updateStatusSpecificItem(po.items[i]._id, 1);
                        return await showOrderOrNextItem(pageId, userId);
                    }
                }
                return await askForFlavor(pageId, userId, multiple, po);
            }
        }
    }
}

export const showSplitCheckFlavor = async (pageId, userId, data) => {
    const prevAnswer = await showSplit(pageId, userId, data);
    // Changing based on categories
    // const nextQuestion = await askForFlavorOrConfirm(pageId, userId, 1);
    const nextQuestion = await askForFlavor(pageId, userId, 1);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


/**
 *
 * @param {*} pageId
 * @param {*} userId
 * @param {*} multiple: if are the first 4 flavors, multiple=1, if are the next, multiple=2 and so on.
 */
export const askForFlavor = async (pageId, userId, multiple, pendingOrder) => {

    let po = null;
    if (pendingOrder && pendingOrder.order)
        po = pendingOrder;
    else po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: false });

    const flavorsArray = await getFlavorsAndToppings(pageId, po.order.currentItemCategory, po.order.currentItemSize);

    // This variable will be passed as split parameter to updateOrder, so,
    // updateOrder can update the item properly, with the value of originalSplit.
    let _splitForTheItem = po.order.originalSplit;

    // In case where the user typed an option wrongly, the bot invokes askForFlavor
    // without the split parameter. So, because of this situation, I am retrieving
    // the split from the order.
    let currentSplit;
    if (po.order.originalSplit > 1) {
        if (!po.order.currentItemSplit) {
            currentSplit = 1;
        } else {
            currentSplit = po.order.currentItemSplit;
        }
    }

    // Rule to show 'Escolha o 1o. sabor', 'Escolha o 2o. sabor'
    let _txt = 'Escolha o produto:'
    if (currentSplit) {
        // First time currentItemSplit is undefined, so, I am gonna use the originalSplit itself.
        _txt = `Escolha o ${currentSplit}o. sabor:`
    }

    const NUMBER_OF_ITEMS = 10;

    let _rangeIni = (multiple - 1) * NUMBER_OF_ITEMS;
    let _rangeEnd = multiple * NUMBER_OF_ITEMS;

    const _options = [];

    for (let i = 0; i < flavorsArray.length; i++) {
        if (flavorsArray[i]) {
            const _fl = flavorsArray[i];
            const _data = { id: _fl.id, flavor: _fl.flavor, price: _fl.price }
            let _subtext = '';
            if (_fl.toppingsNames && _fl.toppingsNames.length > 0)
                _subtext = _fl.toppingsNames.join() + '\n';
            if (_fl.price) {
                _subtext = _subtext.concat('R$', _fl.price);
            }
            const buttons = { text: 'Quero', data: _data, event: 'ORDER_FLAVOR' };

            if (i >= _rangeIni && i < _rangeEnd)
                _options.push({ text: _fl.flavor, subtext: _subtext, buttons });
            else
                _options.push({ text: _fl.flavor, subtext: _subtext, buttons, hidden: true });
        }
    }


    if (flavorsArray.length > _rangeEnd) {
        const buttons = { text: 'Voltar', data: currentSplit, event: 'ORDER_ASK_CATEGORY' };
        _options.push({ text: 'Ver outra categoria', subtext: 'Ver outra categoria', buttons, hidden: true });

        multiple++;
        const buttonsOpt = {
            text: '+ Opções',
            data: { option: 'flavors_more', multiple: multiple }, event: 'ORDER_FLAVOR',
        };
        _options.push({
            text: 'Ver + sabores', subtext: '+ sabores do cardápio',
            buttons: buttonsOpt, isOnlyButtons: true,
        });
    } else {
        const buttons = { text: 'Voltar', data: currentSplit, event: 'ORDER_ASK_CATEGORY' };
        _options.push({ text: 'Ver outra categoria', subtext: 'Ver outra categoria', buttons });
    }

    updateOrder({
        pageId, userId, waitingFor: 'flavor',
        currentItemSplit: currentSplit,
        currentItem: po.order.currentItem,
        split: _splitForTheItem,
    });

    return {
        type: 'fulllist',
        text: _txt,
        options: _options,
    };
}

export const showFlavor = async (pageId, userId, data) => {
    const po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: false });
    let currentSplit;
    let itemId;
    let origSplit = po.order.originalSplit;
    let orderId = po.order.id;
    if (origSplit > 1 && po.order.currentItemSplit <= origSplit) {
        if (po.order.currentItemSplit === 1)
            itemId = po.order.currentItem ? po.order.currentItem + 1 : 1;
        else
            itemId = po.order.currentItem;

        currentSplit = po.order.currentItemSplit + 1;
    } else {
        itemId = po.order.currentItem ? po.order.currentItem + 1 : 1;
    }

    let _complete = false;
    if (origSplit > 1 && currentSplit > origSplit)
        _complete = true;
    else if (!po.order.originalSplit || origSplit === 1)
        _complete = true;


    console.info('showFlavor _complete:', _complete,
        ' originalSplit:', po.order.originalSplit,
        'currentSplit: ', currentSplit,
        ' price: ', data.price);

    await updateOrder({
        pageId, userId, flavorId: data.id,
        price: data.price,
        completeItem: _complete,
        waitingFor: 'nothing',
        currentItemSplit: currentSplit,
        currentItem: itemId,
        categoryId: po.order.currentItemCategory,
        calcTotal: true,
    });

    if (_complete) {
        // without await, so, it can run later
        updateItemStatus(pageId, orderId, itemId);
    }

    if (currentSplit) {
        const showSplit = currentSplit - 1;
        return {
            type: 'text',
            text: '✅ ' + showSplit + 'o. Sabor: ' + data.flavor,
        };
    } else {
        return {
            type: 'text',
            text: '✅ ' + ' Sabor: ' + data.flavor,
        };
    }
}

export const showOrderOrNextItem = async (pageId, userId) => {
    const po = await getOrderPending({ pageId, userId, isComplete: true });

    if (po.order.originalSplit > 1 && po.order.currentItemSplit <= po.order.originalSplit) {
        return await askForCategory(pageId, userId, po.order.currentItemSplit);
        // return await askForFlavor(pageId, userId, 1, po);
    } else {
        return await showPartialOrder(pageId, userId, po);
        // await updateOrder({ pageId, userId, waitingFor: 'partial_confirmation', eraseSplit: true });

        // let total_price = 0;
        // _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼:' + po.order.id + '\n';
        // let _txt = 'Seguem os detalhes do seu pedido:\n';
        // for (let i = 0; i < po.items.length; i++) {
        //     const _item = po.items[i];
        //     if (_item.flavorId) {
        //         let _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;

        //         let _txtSize = '';
        //         if (_item.sizeId)
        //             _txtSize = _item.size;

        //         _txt = _txt + `${_item.category}: ${_txtQty} ${_item.flavor} ${_txtSize} \n`;
        //     }
        //     total_price += _item.price;
        // }
        // _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + formatAsCurrency(total_price) + '\n\n';

        // _txt = _txt + 'Deseja incluir mais itens?';

        // const _options = [];
        // _options.push({
        //     text: 'Sim, mostre-me as opções',
        //     data: {
        //         type: 'confirmation_yes',
        //         backTo: 'partial_confirmation',
        //     },
        //     event: 'ORDER_ASK_CATEGORY',
        // });
        // _options.push({
        //     text: 'Não, confirmar o pedido',
        //     data: {
        //         type: 'confirmation_yes',
        //         backTo: 'partial_confirmation',
        //     },
        //     event: 'ORDER_PIZZA_CONFIRMATION',
        // });

        // return {
        //     type: 'replies',
        //     text: _txt,
        //     options: _options,
        // };
    }
}

export const cancelPendingShowPartialOrder = async (pageId, userId) => {
    // TODO: delete items with status 0;
    const po = await getOrderPending({ pageId, userId, isComplete: true });

    if (po.items && po.items.length > 0) {
        await deletePendingItem(pageId, po.order.id);

        for (let i = 0; i < po.items.length; i++) {
            if (po.items[i].status === 0) {
                po.items.splice(i, 1);
            }
        }
    }
    return await showPartialOrder(pageId, userId, po);
}

export const showPartialOrder = async (pageId, userId, po) => {
    if (!po)
        po = await getOrderPending({ pageId, userId, isComplete: true });

    await updateOrder({ pageId, userId, waitingFor: 'partial_confirmation', eraseSplit: true, undo: '' });

    let total_price = 0;
    let _txt = '𝗣𝗲𝗱𝗶𝗱𝗼:' + po.order.id + '\n';

    if (po.items && po.items.length > 0) {
        _txt = _txt + 'Seguem os detalhes do seu pedido:\n\n';
        for (const item of po.items) {
            if (item.flavorId) {
                let _txtQty = item.split > 1 ? item.qty + '/' + item.split : item.qty;

                let _txtSize = '';
                if (item.sizeId)
                    _txtSize = item.size;

                // _txt = _txt + `${item.category}: ${_txtQty} ${item.flavor} ${_txtSize} - ${formatAsCurrency(item.price)} \n`;
                _txt = _txt + `${_txtQty} ${item.flavor} ${_txtSize} - ${formatAsCurrency(item.price)} \n`;
            }
            if (item.price)
                total_price += item.price;
        }
        if (po.order.deliver_type && po.order.deliver_type === 'delivery') {
            if (po.order.delivery_fee > 0) {
                _txt += `*Taxa de Entrega:* ${formatAsCurrency(po.order.delivery_fee)}\n`
                total_price += po.order.delivery_fee;
            }
        }
        _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + formatAsCurrency(total_price) + '\n\n';

    } else {
        _txt = _txt + 'Ainda não foram incluídos itens no seu pedido.\n\n';
    }

    _txt = _txt + 'O que deseja fazer?';

    const _options = [];
    _options.push({
        text: `Incluir ${po.items && po.items.length > 0 ? 'mais' : ''} itens no pedido`,
        event: 'ORDER_ASK_CATEGORY',
    });
    if (po.items && po.items.length > 0) {
        _options.push({
            text: '*Confirmar o pedido*',
            data: {
                type: 'confirmation_yes',
                backTo: 'partial_confirmation',
            },
            event: 'ORDER_PIZZA_CONFIRMATION',
        });
        _options.push({
            text: 'Remover algum item',
            data: {
                backTo: 'partial_confirmation',
                option: 'remove_item',
            },
            event: 'ORDER_WANT_CHANGE',
        });
        _options.push({
            text: 'Observações em algum item',
            data: {
                backTo: 'partial_confirmation',
                option: 'change_item',
            },
            event: 'ORDER_WANT_CHANGE',
        });
    }
    _options.push({
        text: 'Voltar p/ Início',
        data: 'stoporder_init',
        event: 'STOP_ORDER_OPTIONS',
    });

    return {
        type: 'replies',
        text: _txt,
        options: _options,
    };
}


// export const showOrderOrNextItem = async (pageId, userId) => {
//     const po = await getOrderPending({ pageId, userId, isComplete: true });

//     if (po.order.originalSplit > 1 && po.order.currentItemSplit <= po.order.originalSplit) {
//         return await askForFlavor(pageId, userId, 1, po);
//     } else if (po.order.qty > 1 && po.order.currentItem < po.order.qty) {
//         const nextItem = po.order.currentItem + 1;
//         await updateOrder({ pageId, userId, waitingFor: 'size', currentItem: nextItem });
//         return await askForSize(pageId, userId);
//     } else {
//         await updateOrder({ pageId, userId, waitingFor: 'partial_confirmation', backToConfirmation: null });

//         let total_price = 0;
//         let _txt = 'Seguem os detalhes do seu pedido:\n';
//         _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼:' + po.order.id + '\n';
//         for (let i = 0; i < po.items.length; i++) {
//             const _item = po.items[i];
//             if (_item.flavorId && _item.sizeId) {
//                 let _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;
//                 _txt = _txt + `${_txtQty} pizza ${_item.size} de ${_item.flavor}\n`;
//             } else if (_item.beverageId && _item.beverage) {
//                 _txt = _txt + `1 ${_item.beverage}\n`;
//             }
//             total_price += _item.price;
//         }
//         if (po.order.deliver_type && po.order.deliver_type === 'pickup')
//             _txt += 'Cliente vem retirar.'
//         else
//             _txt = _txt + '𝗘𝗻𝗱𝗲𝗿𝗲𝗰̧𝗼 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ' + po.order.address + '\n';
//         _txt = _txt + '𝗧𝗲𝗹𝗲𝗳𝗼𝗻𝗲: ' + po.order.phone + '\n';
//         _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + formatAsCurrency(total_price) + '\n';
//         _txt = _txt + 'O pedido está correto?';

//         const _options = [];
//         _options.push({
//             text: 'Sim',
//             data: {
//                 type: 'confirmation_yes',
//                 backTo: 'partial_confirmation',
//             },
//             event: 'ORDER_PIZZA_CONFIRMATION',
//         });
//         _options.push({
//             text: 'Não',
//             data: {
//                 type: 'confirmation_no',
//                 backTo: 'partial_confirmation',
//             },
//             event: 'ORDER_PIZZA_CONFIRMATION',
//         });

//         return {
//             type: 'replies',
//             text: _txt,
//             options: _options,
//         };
//     }
// }


/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showFlavorCheckItem = async (pageId, userId, data) => {
    const prevAnswer = await showFlavor(pageId, userId, data);
    const nextQuestion = await showOrderOrNextItem(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


export const askForPaymentType = async (pageId, userId) => {
    const _options = [];

    const storeData = await getStoreData(pageId);
    if (storeData.payment_types && storeData.payment_types.length > 0) {
        for (let paymentType of storeData.payment_types) {
            let _txt = paymentType.payment_type;
            if (paymentType.surcharge_percent > 0) {
                _txt += ` (Cobramos + ${paymentType.surcharge_percent}% no valor do pedido)`;
            } else if (paymentType.surcharge_amount > 0) {
                _txt += ` (Cobramos + ${formatAsCurrency(paymentType.surcharge_amount)} no valor do pedido)`;
            }

            _options.push({
                text: _txt, data: {
                    payment_type: paymentType.payment_type,
                    surcharge_percent: paymentType.surcharge_percent,
                    surcharge_amount: paymentType.surcharge_amount,
                }, event: 'ORDER_PAYMENT_TYPE',
            });
        }
    } else {
        _options.push({
            text: 'Dinheiro', data: {
                payment_type: 'Dinheiro', surcharge_percent: 0, surcharge_amonut: 0,
            }, event: 'ORDER_PAYMENT_TYPE',
        });
        _options.push({
            text: 'Cartão', data: {
                payment_type: 'Cartão', surcharge_percent: 0, surcharge_amount: 0,
            }, event: 'ORDER_PAYMENT_TYPE',
        });
    }


    await updateOrder({ pageId, userId, waitingFor: 'payment_type' });

    return {
        type: 'replies',
        text: 'Qual a forma de pagamento?',
        options: _options,
    };
}

export const showPaymentType = async (pageId, userId, data) => {
    await updateOrder({
        pageId, userId, paymentType: data.payment_type,
        surcharge_percent: data.surcharge_percent, surcharge_amount: data.surcharge_amount,
    });

    let _txtPaymentType = data.payment_type;

    return {
        type: 'text',
        text: '✅ ' + ' Forma de pagamento: ' + _txtPaymentType,
    };
}

export const askForPaymentChange = async (pageId, userId) => {
    const _options = [];
    _options.push({ text: 'Sim', data: 'payment_change_yes', event: 'ORDER_PAYMENT_CHANGE' });
    _options.push({ text: 'Não', data: 'payment_change_no', event: 'ORDER_PAYMENT_CHANGE' });

    await updateOrder({ pageId, userId, waitingFor: 'payment_change' });

    return {
        type: 'replies',
        text: 'Precisa de troco?',
        options: _options,
    };
}


/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showPaymentTypeAskForPaymentChange = async (pageId, userId, data) => {
    const prevAnswer = await showPaymentType(pageId, userId, data);
    const nextQuestion = await askForPaymentChange(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

export const showPaymentChange = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, paymentChange: data });

    let _txtPaymentChange = data === 'payment_change_yes'
        ? 'Levaremos trocado'
        : 'Não precisa de troco';

    return {
        type: 'text',
        text: '✅ ' + _txtPaymentChange,
    };
}

export const askForComments = async (pageId, userId) => {
    const _options = [];
    _options.push({ text: 'Sim', data: 'comments_yes', event: 'ORDER_COMMENTS' });
    _options.push({ text: 'Não', data: 'comments_no', event: 'ORDER_COMMENTS' });

    await updateOrder({ pageId, userId, waitingFor: 'comments' });

    return {
        type: 'replies',
        text: 'Quer enviar alguma observação sobre o pedido ou entrega?',
        options: _options,
    };
}

export const showPaymentChangeAskForComments = async (pageId, userId, data) => {
    const prevAnswer = await showPaymentChange(pageId, userId, data);
    const nextQuestion = await askForComments(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


export const askToTypeComments = async (pageID, userID, item) => {
    let _txt;
    if (item) {
        await updateOrder({ pageId: pageID, userId: userID, waitingFor: 'typed_comments_item', waitingForData: item.id });
        _txt = 'Diga o que gostaria de pedir: por ex. sem cebola ou ovos. Pode digitar:';
    } else {
        await updateOrder({ pageId: pageID, userId: userID, waitingFor: 'typed_comments' });
        _txt = 'Digite as observações que você tem para a entrega ou pedido. Pode digitar!';
    }
    return {
        type: 'text',
        text: _txt,
    }
}


export const showComments = async (pageId, userId, text) => {
    await updateOrder({ pageId, userId, comments: text });

    let _txtComments = 'Observações para o pedido/entrega:\n';
    _txtComments += text;

    return {
        type: 'text',
        text: '✅ ' + _txtComments,
    };
}

export const showFullOrder = async (pageId, userId) => {
    // await updateOrder({ pageId, userId, waitingFor: 'full_confirmation', backToConfirmation: null });

    const po = await getOrderPending({ pageId, userId, isComplete: true });

    let total_price = 0;
    let _txt = 'Seguem os detalhes do seu pedido:\n\n';

    _txt = _txt + '𝗣𝗲𝗱𝗶𝗱𝗼: ' + po.order.id + '\n';
    for (const item of po.items) {
        if (item.flavorId) {
            let _txtQty = item.split > 1 ? item.qty + '/' + item.split : item.qty;
            let _txtSize = item.sizeId ? item.size : '';
            // _txt = _txt + `_${item.category}_: ${_txtQty} ${item.flavor}  ${_txtSize}\n`;
            _txt = _txt + `${_txtQty} ${item.flavor}  ${_txtSize}\n`;
            total_price += item.price;
        }
    }

    if (po.order.deliver_type && po.order.deliver_type === 'pickup') {
        _txt += 'Cliente retira.\n'
        if (po.order.store_address)
            _txt += '📌 Nosso endereço: ' + po.order.store_address + '\n';
    } else {
        _txt += '𝗘𝗻𝗱𝗲𝗿𝗲𝗰̧𝗼 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ' + po.order.address + '\n';

        if (po.order.delivery_fee > 0) {
            _txt += `𝗧𝗮𝘅𝗮 𝗱𝗲 𝗘𝗻𝘁𝗿𝗲𝗴𝗮: ${formatAsCurrency(po.order.delivery_fee)}\n`
            total_price += po.order.delivery_fee;
        }
    }

    _txt = _txt + '𝗧𝗲𝗹𝗲𝗳𝗼𝗻𝗲: ' + po.order.phone + '\n';
    _txt = _txt + '𝗙𝗼𝗿𝗺𝗮 𝗱𝗲 𝗣𝗮𝗴𝗮𝗺𝗲𝗻𝘁𝗼: ' + po.order.payment_type + '\n';

    if (po.payment_change === 'payment_change_yes') {
        _txt = _txt + '𝗟𝗲𝘃𝗮𝗿 𝗧𝗿𝗼𝗰𝗼? Sim \n';
    }

    if (po.order.surcharge_percent > 0) {
        _txt += `𝗧𝗮𝘅𝗮 𝗱𝗲 ${po.order.payment_type}: ${po.order.surcharge_percent * 100}%\n`
        total_price += total_price * po.order.surcharge_percent;
    }

    if (po.order.surcharge_amount > 0) {
        _txt += `𝗧𝗮𝘅𝗮 𝗱𝗲 ${po.order.payment_type}: ${formatAsCurrency(po.order.surcharge_amount)}\n`
        total_price += po.order.surcharge_amount;
    }

    _txt = _txt + '𝗧𝗼𝘁𝗮𝗹: ' + formatAsCurrency(total_price) + '\n';

    let _txtComments = po.order.comments || 'Sem observações';
    _txt = _txt + '𝗢𝗯𝘀𝗲𝗿𝘃𝗮𝗰̧𝗼̃𝗲𝘀: ' + _txtComments + '\n';

    return {
        type: 'text',
        text: _txt,
    }

    // the code below was used to ask for a final confirmation.
    // _txt = _txt + 'Posso confirmar o pedido?';

    // const _options = [];
    // _options.push({
    //     text: 'Sim',
    //     data: {
    //         type: 'confirmation_yes',
    //         backTo: 'full_confirmation',
    //     },
    //     event: 'ORDER_CONFIRMATION',
    // });
    // _options.push({
    //     text: 'Não',
    //     data: {
    //         type: 'confirmation_no',
    //         backTo: 'full_confirmation',
    //     },
    //     event: 'ORDER_CONFIRMATION',
    // });

    // return {
    //     type: 'replies',
    //     text: _txt,
    //     options: _options,
    // };
}

/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showPaymentTypeAskForComments = async (pageId, userId, data) => {
    const prevAnswer = await showPaymentType(pageId, userId, data);
    const nextQuestion = await askForComments(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showFullOrderConfirmOrder = async (pageId, userId, data) => {
    if (data && data !== 'comments_no')
        await showComments(pageId, userId, data);
    // const nextQuestion = await showFullOrder(pageId, userId);

    const prevAnswer = await showFullOrder(pageId, userId);
    const nextAnswer = await confirmOrder(pageId, userId);

    nextAnswer.text = prevAnswer.text + '\n\n' + nextAnswer.text;
    return nextAnswer;
}

export const confirmOrder = async (pageId, userId) => {
    await updateOrder({ pageId, userId, confirmOrder: true, calcTotal: true });

    return {
        type: 'text',
        text: '✅ Pedido Confirmado!',
    };
}

export const askForChangeOrder = async (pageId, userId, data) => {
    let confirmStep;
    if (data && data.hasOwnProperty('backTo')) {
        confirmStep = data.backTo;
    }

    if (confirmStep) {
        await updateOrder({ pageId, userId, waitingFor: 'change_order', backToConfirmation: confirmStep });
    } else {
        await updateOrder({ pageId, userId, waitingFor: 'change_order' });
    }

    let _txt = 'O que você gostaria de fazer com o seu pedido?';

    const _options = [];
    _options.push({ text: 'Mudar pedido', data: 'changeOrder', event: 'ORDER_WANT_CHANGE' });
    _options.push({ text: 'Mudar endereço', data: 'change_address', event: 'ORDER_CHANGE' });

    if (confirmStep) {
        // confirmStep can be 'partial_confirmation' or 'full_confirmation'
        const _evt = confirmStep === 'partial_confirmation'
            ? 'ORDER_PIZZA_CONFIRMATION'
            : 'ORDER_CONFIRMATION';

        _options.push({
            text: 'Confirmar.',
            data: { type: 'confirmation_yes', backTo: confirmStep },
            event: _evt,
        });
    }

    return {
        type: 'replies',
        text: _txt,
        options: _options,
    };
}

export const askForOptionsToChange = async (pageId, userId, item) => {
    try {
        let _txt = 'Ok, o que você gostaria de fazer?';

        const _options = [];
        _options.push({ text: 'Mandar observação para esse item', data: item, event: 'ORDER_CHANGE_ITEM' });
        _options.push({ text: 'Cancelar/Remover', data: item, event: 'ORDER_CANCEL_ITEM' });

        return {
            type: 'replies',
            text: _txt,
            options: _options,
        };
    } catch (askForOptionsToChangeErr) {
        console.error({ askForOptionsToChangeErr });
        throw askForOptionsToChangeErr;
    }
}

export const askForSpecificItem = async (pageId, userId, data) => {
    const pendingOrder = await getOrderPending({ pageId, userId, isComplete: true });
    if (pendingOrder.items && pendingOrder.items.length > 1) {

        const _options = [];
        let _itemId = 0;
        for (let item of pendingOrder.items) {
            if (item.itemId !== _itemId) {
                let _txt;
                if (item.size && item.flavor) {
                    let _sizeSplit = `${item.size}`;
                    if (item.split && item.split > 1) {
                        if (item.category.toUpperCase().indexOf('PIZZA') > -1)
                            _sizeSplit = 'Pizza ' + _sizeSplit;
                        _sizeSplit = _sizeSplit + ` ${item.split} Sabores`;
                    } else
                        _sizeSplit = item.flavor + ' ' + _sizeSplit;

                    _txt = `${_sizeSplit}`;
                } else {
                    _txt = item.flavor;
                }

                if (_txt) {
                    if (data && data.option === 'change_item') {
                        _options.push({ text: _txt, data: item, event: 'ORDER_CHANGE_ITEM' });
                    } else {
                        _options.push({ text: _txt, data: item, event: 'ORDER_CANCEL_ITEM' });
                    }
                }

                _itemId = item.itemId;
            }
        }

        let _txtHead = 'Escolha qual dos itens deseja ';
        if (data && data.option === 'change_item')
            _txtHead = _txtHead + 'alterar:';
        else
            _txtHead = _txtHead + 'remover:';


        return {
            type: 'replies',
            text: _txtHead,
            options: _options,
        };
    } else {
        await updateOrder({ pageId, userId, completeItem: false });
        return await askForOptionsToChange(pageId, userId, pendingOrder.items[0]);
    }
}

/**
 *
 * @param {*} pageId
 * @param {*} userId
 */
export const askForWantBeverage = async (pageId, userId) => {
    updateOrder({ pageId, userId, waitingFor: 'want_beverage' });

    const pendingOrder = await getOrderPending({ pageId, userId, isComplete: false });

    const noBeverage = pendingOrder.order.no_beverage;

    if (typeof noBeverage === 'undefined') {

        let _txt = 'Gostaria de algo para beber?';

        const _options = [];
        _options.push({ text: 'Sim', data: 'beverage_yes', event: 'ORDER_CONFIRM_BEVERAGE' });
        _options.push({ text: 'Não', data: 'beverage_no', event: 'ORDER_CONFIRM_BEVERAGE' });
        return {
            type: 'replies',
            text: _txt,
            options: _options,
        };
    } else {
        return showFullOrder(pageId, userId);
    }
}
/**
 *
 * @param {*} pageId
 * @param {*} userId
 * @param {*} multiple
 */
export const askForBeverages = async (pageId, userId, multiple) => {
    await updateOrder({ pageId, userId, waitingFor: 'beverage', noBeverage: false });

    const beveragesArr = await getBeverages(pageId);
    let _rangeIni = (multiple - 1) * 4;
    let _rangeEnd = multiple * 4;

    const _options = [];
    for (let i = _rangeIni; i < _rangeEnd; i++) {
        if (beveragesArr[i]) {
            const _bev = beveragesArr[i];
            const _data = { id: _bev.id, beverage: _bev.name, price: _bev.price }
            const buttons = { text: 'Quero', data: _data, event: 'ORDER_BEVERAGE' };

            let _subtext = _bev.kind;
            if (_bev.price) {
                _subtext = _subtext.concat('\n R$', _bev.price);
            }
            _options.push({ text: _bev.name, subtext: _subtext, buttons });
        }
    }
    if ((beveragesArr.length + 1) > _rangeEnd) {
        multiple++;
        const buttonsOpt = {
            text: '+ Opções',
            data: { option: 'beverages_more', multiple: multiple },
            event: 'ORDER_BEVERAGE',
        };
        _options.push({
            text: 'Clique aqui p/ ver + opções',
            buttons: buttonsOpt,
            isOnlyButtons: true,
        });
    } else {
        const _data = { option: 'beverages_cancel' }
        const buttons = { text: 'Sem bebida', data: _data, event: 'ORDER_BEVERAGE' };
        let _subtext = 'Se não encontrou, selecione "Sem bebida"';
        _options.push({ text: 'Sem bebida', subtext: _subtext, buttons });
    }

    return {
        type: 'fulllist',
        text: 'Selecione uma bebida:',
        options: _options,
    };
}

/**
 * Show that user did not want beverage and update order with this info.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showNoBeverage = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, noBeverage: true, waitingFor: 'confirm' });

    return { type: 'text', text: '❌ ' + ' Sem bebida para o seu pedido. ' };
}

/**
 * Show the chosen beverage.
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showBeverage = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, beverageId: data.id, beveragePrice: data.price, completeItem: true, noBeverage: false, waitingFor: 'full_confirmation', calcTotal: true });

    return {
        type: 'text',
        text: '✅ ' + '1 Bebida: ' + data.beverage,
    }
}

/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showBeverageAskForPaymentType = async (pageId, userId, data) => {
    const prevAnswer = await showBeverage(pageId, userId, data);
    const nextQuestion = await askForPaymentType(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

/**
 * Used on Whatsapp
 * @param {*} pageId
 * @param {*} userId
 * @param {*} data
 */
export const showNoBeverageAskForPaymentType = async (pageId, userId, data) => {
    const prevAnswer = await showNoBeverage(pageId, userId, data);
    const nextQuestion = await askForPaymentType(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

/**
 * Cancel the selected item, reorder the itemIds and askForSize
 * @param {*} pageId
 * @param {*} userId
 * @param {*} itemId
 */
export const changeItem = async (pageId, userId, item) => {
    return askToTypeComments(pageId, userId, item);
}

export const showCommentsItem = async (pageId, userId, data) => {
    const po = await getOrderPending({ pageId, userId, isComplete: false });

    if (po && po.order && po.order.waitingFor === 'typed_comments_item') {
        // without await to run later.
        updateItemDirect(pageId, po.order.id, po.order.waitingForData, data);
    }

    return await showPartialOrder(pageId, userId);
}


export const cancelItem = async (pageId, userId, item) => {
    const po = await getOrderPending({ pageId, userId, isComplete: false });
    const result1 = await deleteItem(pageId, po.order.id, item.itemId);
    console.info('cancelItem:', result1);
    // if (result1) {
    if (po.order.backToConfirmation === 'full_confirmation') {
        return await showFullOrder(pageId, userId);
    } else
        return await showPartialOrder(pageId, userId);
    // }
}


export const updateItemAskOptions = async (pageId, userId, item) => {
    // const item = await updateStatusSpecificItem(objectId, 0);
    return await askForOptionsToChange(pageId, userId, item);
}

export const sendShippingNotification = async (pageId, userId, orderId) => {
    const { accessToken } = await getOnePageToken(pageId);

    const _txt = 'O seu pedido número ' + orderId + ' acabou de sair para entrega. Bom apetite!';

    const out = new Elements();
    out.add({ text: _txt });
    await Bot.send_message_tag(accessToken, userId, out);
}

export const sendRejectionNotification = async (pageId, userId, orderId, rejectionExplanation) => {
    const { accessToken } = await getOnePageToken(pageId);

    const _txt = 'Infelizmente não poderemos atender o seu pedido número '
        + orderId
        + '. Segue o motivo: '
        + rejectionExplanation;

    const out = new Elements();
    out.add({ text: _txt });
    await Bot.send_message_tag(accessToken, userId, out);
}

/**
 * Delete the pending order and shows the Main Menu.
 * @param {*} pageId
 * @param {*} userId
 */
export const cancelPendingOrder = async (pageId, userId) => {
    await cancelOrder({ pageId, userId });

    const out = await sendMainMenu();
    out.text = '❌ Pedido Cancelado!' + '\n\n' + out.text;

    return out;
}

export const showDeliverAskForCategory = async (pageId, userId, data, user, source) => {
    const prevAnswer = await showDeliver(pageId, userId, data, user, source);
    const nextQuestion = await askForCategory(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}


export const showAddressAskForCategory = async (pageId, userId, addrData, source) => {
    const prevAnswer = await showAddress(pageId, userId, addrData, source);
    const nextQuestion = await askForCategory(pageId, userId);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

/**
 * 
 * @param {*} pageId
 * @param {*} userId
 * @param {*} split: if true, only show categories that are marked 'is_pizza'.
 * Show only categories with split to allow user mix categories in same pizza.
 */
export const askForCategory = async (pageId, userId, split) => {
    await updateOrder({ pageId, userId, waitingFor: 'category', waitingForData: split });

    const categories = await getCategories(pageId);

    let _txt = '';
    if (split) {
        _txt = `Para escolher o ${split}o. sabor, escolha a categoria:\n`
    } else {
        _txt = 'Selecione uma categoria:';
    }

    const _options = [];
    for (let item of categories) {
        if (split && !item.is_pizza)
            continue;

        const _data = { id: item.id, name: item.name }
        const buttons = { text: 'Quero', data: _data, event: 'ORDER_CATEGORY' };

        _options.push({ text: item.name, subtext: item.name, buttons });
    }

    const buttons = { text: 'Voltar', data: 'partial_confirmation', event: 'ORDER_PARTIAL_CONFIRMATION' };
    _options.push({ text: 'Voltar para o pedido', subtext: 'Voltar para o pedido', buttons });

    return {
        type: 'list',
        text: _txt,
        options: _options,
    }
}

export const showCategory = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, categoryId: data.id, eraseSize: true });

    return {
        type: 'text',
        text: '✅ ' + 'Categoria: ' + data.name,
    }
}


export const showCategoryAskForSize = async (pageId, userId, data) => {
    const prevAnswer = await showCategory(pageId, userId, data);
    const nextQuestion = await askForSizeCat(pageId, userId, data.id);

    nextQuestion.text = prevAnswer.text + '\n\n' + nextQuestion.text;
    return nextQuestion;
}

export const askForSizeCat = async (pageId, userId, categoryId) => {
    const po = await getOrderPending({ pageId, userId, isComplete: false });

    if (!categoryId)
        categoryId = po.order.currentItemCategory;

    // User is spliting the pizza into more than one category
    if (po.order.originalSplit > 1 && po.order.currentItemSplit <= po.order.originalSplit) {
        return askForFlavor(pageId, userId, 1, po);
    } else {

        const category = await getCategory(pageId, categoryId);

        if (category.price_by_size) {
            const sizesWithPricing = await getPricingSizing(pageId, categoryId); // only sizes with pricing

            // only 1 size priced, bot IS NOT ASKS FOR THAT.
            if (sizesWithPricing.length === 1) {
                const size = await getSize(pageId, sizesWithPricing[0]);
                const sizeData = {
                    id: size.id,
                    size: size.size,
                }
                // Update the order with the unique size and checkSplit
                return showSizeCheckSplit(pageId, userId, sizeData);
            } else {
                // Without await, to run later
                updateOrder({ pageId, userId, waitingFor: 'size' });

                const _text = 'Selecione o tamanho:';

                const _options = [];
                const sizes = await getSizes(pageId, sizesWithPricing);

                for (let i = 0; i < sizes.length; i++) {
                    const _data = { id: sizes[i].id, size: sizes[i].size, split: sizes[i].split };
                    _options.push({ text: sizes[i].size, data: _data, event: 'ORDER_SIZE' });
                }

                return {
                    type: 'replies',
                    text: _text,
                    options: _options,
                }
            }
        } else {
            return await askForFlavor(pageId, userId, 1);
        }
    }
}
