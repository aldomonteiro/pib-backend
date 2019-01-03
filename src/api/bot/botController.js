import util from 'util';
import fs from 'fs';
import { Bot, Elements, Buttons, QuickReplies } from 'facebook-messenger-bot';
import { getOnePageToken, getOnePageData } from '../controllers/pagesController';
import { getPricingSizing } from '../controllers/pricingsController';
import getCardapio from './show_cardapio';
import {
    getFlavorsAndToppings,
    inputCardapioReplyMsg,
    getOpenAndClose,
    inputHorarioReplyMsg,
} from "./actionsController";
import { getSizes, getSize } from '../controllers/sizesController';
import { getBeverages } from '../controllers/beveragesController';
import { getTodayOpeningTime } from '../controllers/storesController';
import { updateOrder, getOrderPending } from '../controllers/ordersController';
import { getAddressLocation, getCustomerAddress, formatAddrData } from '../controllers/customersController';
import { updateStatusSpecificItem } from '../controllers/itemsController';

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
    let _showErrorMsg = _errorMsg ? _errorMsg : 'ERRO DESCONHECIDO';
    out.add({ text: MSG_GENERAL_ERROR + _showErrorMsg });
    return out;
}

// export const updateOrderFlow = async (pageID, userID) => {

// }

export const basicReply = async (replyText) => {
    const out = new Elements();
    if (!replyText) {
        replyText = 'Hi, how are you doing?';
    }
    out.add({ text: replyText });
    return out;
}

/**
 * 
 * @param {*} sender 
 * @param {*} pageID 
 */
export const sendWelcomeMessage = async (pageID, sender) => {
    await sender.fetch('first_name');
    const page = await getOnePageData(pageID);
    const replyMsg = new String(page.firstResponseText).replace('$NAME', sender.first_name);
    const out = new Elements();
    out.add({ text: replyMsg });
    return out;
}

export const sendMainMenu = async () => {
    const buttons = new Buttons();
    buttons.add({ text: 'Cardápio', data: 'CARDAPIO_PAYLOAD', event: 'MAIN-MENU' });
    buttons.add({ text: 'Horários', data: 'HORARIO_PAYLOAD', event: 'MAIN-MENU' });
    buttons.add({ text: 'Fazer Pedido', data: 'PEDIDO_PAYLOAD', event: 'MAIN-MENU' });

    const out = new Elements();
    out.add({ text: 'Por favor escolha uma das opções', buttons });

    return out;
}

export const sendHorario = async (pageID) => {
    const { todayIsOpen, todayOpenAt, todayCloseAt } = await getTodayOpeningTime(pageID);

    let replyMsg = '';
    if (todayIsOpen === true) {
        replyMsg = 'Estamos abertos hoje, a partir das ' + todayOpenAt + ' horas, até às ' + todayCloseAt + ' horas.';
    } else {
        replyMsg = 'Infelizmente hoje não estamos abertos, mas você pode consultar nosso cardápio no menu principal.';
    }
    const out = new Elements();
    out.add({ text: replyMsg });
    return out;
}

export const sendCardapio = async (pageID) => {
    const replyMsg = await getCardapio(pageID);
    const out = new Elements();
    out.add({ text: replyMsg });

    return out;
}

/**
 * Send Yes or No to the user asking if he wants to place an order right now.
 * @param {*} pageId 
 * @param {*} userId 
 */
export const askForWantOrder = async (pageId, userId) => {
    const out = new Elements();
    let _txt = 'Agora que você viu nosso cardápio, você está pronto para fazer o pedido?';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });
    replies.add({ text: "Sim", data: "wantorder_yes", event: 'ORDER_WANT_ORDER' });
    replies.add({ text: "Não", data: "wantorder_no", event: 'ORDER_WANT_ORDER' });
    out.setQuickReplies(replies);
    return out;
}


/**
 * Question No.01
 * If the user doesnt have an address in the database, this will be the first question.
 */
export const askForLocation = async () => {
    const out = new Elements();
    out.add({ text: 'Para começar, preciso saber aonde você está. Clique no botão abaixo que receberei a sua localização.' });

    const replies = new QuickReplies();
    replies.add({ text: 'Localização', isLocation: true, data: 'location_location', event: 'LOCATION' });
    // replies.add({ text: 'Informar o CEP', data: 'location_cep', event: 'LOCATION' });
    out.setQuickReplies(replies);
    return out;
}

export const confirmLocationAddress = async (pageId, userId, location) => {

    await updateOrder({ pageId, userId, location });

    const addresses = await getAddressLocation(location);

    if (addresses && addresses.length && addresses.length > 0) {

        const out = new Elements();
        out.setListStyle('compact');

        let foundAnyCompleteAddress = false;
        for (let i = 0; i < 4; i++) {
            const element = addresses[i];
            if (element.address_components && element.address_components.length >= 6) {
                foundAnyCompleteAddress = true;
                const _data = { formatted_address: element.formatted_address, address_components: element.address_components };
                const buttons = new Buttons();
                buttons.add({ text: 'Esse!', data: _data, event: 'LOCATION_ADDRESS' });
                let addressNumber = i + 1;
                out.add({ text: 'Endereço ' + addressNumber, subtext: element.formatted_address, buttons });
            }
        }

        if (foundAnyCompleteAddress) {
            const buttonsOpt = new Buttons();
            buttonsOpt.add({ text: 'Não é meu endereço..', data: "incorrect_address", event: 'LOCATION_ADDRESS' });
            out.add({ buttons: buttonsOpt, isOnlyButtons: true });
            return out;
        } else {
            return await askToTypeAddress(pageId, userId);
        }
    }
    else {
        return await askToTypeAddress(pageId, userId);
    }
}

export const confirmAddressOrAskLocation = async (pageId, userId, user) => {

    await updateOrder({ pageId, userId, user });

    // TODO: check if the location is in the neighborhood.
    // TODO: check if the location is the same as stored in db.
    const addrData = await getCustomerAddress(pageId, userId);

    if (addrData) {
        const out = new Elements();

        let _replyText = 'A entrega será para esse endereço?\n';
        _replyText = _replyText + addrData.formattedAddress;

        out.add({ text: _replyText });

        const replies = new QuickReplies();
        replies.add({ text: 'Sim', data: addrData, event: 'CORRECT_SAVED_ADDRESS' });
        replies.add({ text: 'Não', data: addrData, event: 'WRONG_SAVED_ADDRESS' });
        out.setQuickReplies(replies);

        return out;
    } else {
        return await askForLocation();
    }
}

export const askToTypeAddress = async (pageID, userID) => {
    await updateOrder({ pageId: pageID, userId: userID, waitingForAddress: true, waitingFor: 'typed_address' });

    const out = new Elements();
    out.add({ text: 'Não foi possível localizar um endereço válido. Digite o seu endereço completo por favor.' });
    return out;
}

export const confirmTypedText = async (pageId, userId, message) => {
    try {
        const pendingOrder = await getOrderPending({ pageId, userId });

        //console.info({ pendingOrder });

        let out = new Elements();

        if (pendingOrder && pendingOrder.order) {
            if (typeof pendingOrder.order.waitingForAddress === 'boolean' &&
                pendingOrder.order.waitingForAddress === true) {

                await updateOrder({ pageId, userId, waitingForAddress: false, waitingFor: 'address' });

                let _replyText = 'A entrega será para esse endereço?\n';
                _replyText = _replyText + message.text;
                out.add({ text: _replyText });

                const addrData = {
                    manual_addres: true,
                    formattedAddress: message.text,
                }

                const replies = new QuickReplies();
                replies.add({ text: 'Sim', data: addrData, event: 'CORRECT_SAVED_ADDRESS' });
                replies.add({ text: 'Não', data: addrData, event: 'WRONG_SAVED_ADDRESS' });
                out.setQuickReplies(replies);

                return out;
            }
            else {
                if (pendingOrder.order.waitingFor === 'phone')
                    return await confirmTypedPhone(pageId, userId, message.text);
                else if (pendingOrder.order.waitingFor === 'size')
                    return await askForSize(pageId, userId)
                else if (pendingOrder.order.waitingFor === 'quantity')
                    return await askForQuantity(pageId, userId);
                else if (pendingOrder.order.waitingFor === 'flavor')
                    return await askForFlavor(pageId, userId, 1);
                else if (pendingOrder.order.waitingFor === 'beverage')
                    return await askForBeverages(pageId, userId, 1);
                else if (pendingOrder.order.waitingFor === 'nothing')
                    return await showOrderOrNextItem(pageId, userId);
                else
                    return await sendMainMenu();
            }
        }
        else {
            out = await sendMainMenu();
        }

        return out;
    } catch (confirmTypedTextError) {
        console.error({ confirmTypedTextError });
        throw confirmTypedTextError;
    }
}

export const showAddress = async (pageId, userId, addrData) => {
    if (addrData && addrData.address_components) {
        const formattedAddrData = await formatAddrData(addrData);
        await updateOrder({ pageId, userId, addrData: formattedAddrData });
    }
    else {
        await updateOrder({ pageId, userId, addrData });
    }

    const out = new Elements();
    out.add({ text: 'Ok, entregaremos nesse endereço.' });
    return out;
}

export const showOrderOrAskForPhone = async (pageId, userId) => {
    const po = await getOrderPending({ pageId, userId, isComplete: false });

    if (po.order && po.order.waitingFor === 'confirmation')
        return await showOrderOrNextItem(pageId, userId);
    else
        return await askForPhone(pageId, userId);
}

export const askForPhone = async (pageId, userId) => {

    await updateOrder({ pageId, userId, waitingFor: 'phone' });

    const out = new Elements();
    out.add({ text: 'Pode nos enviar o seu telefone para confirmar o seu pedido? Se não aparecer o seu telefone (ou estiver errado), use a opção digitar.' });

    const replies = new QuickReplies();
    replies.add({ text: 'Telefone', isPhoneNumber: true, data: 'phone_number', event: 'PHONE_NUMBER' });
    replies.add({ text: 'Digitar o telefone', data: 'change_phone', event: 'PHONE_CONFIRMED' });
    out.setQuickReplies(replies);
    return out;
}

export const askToTypePhone = async (pageId, userId) => {

    await updateOrder({ pageId, userId, waitingFor: 'phone' });

    const out = new Elements();
    out.add({ text: 'Por favor, digite o número do telefone válido para que possamos confirmar o pedido. Pode digitar:' });
    return out;
}

export const confirmTypedPhone = async (pageId, userId, phone) => {
    const out = new Elements();

    await updateOrder({ pageId, userId, waitingFor: 'phone' });

    let _txt = 'O telefone ' + phone + ' está coreto?';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Sim", data: phone, event: 'PHONE_CONFIRMED' });
    replies.add({ text: "Não, usar outro", data: "change_phone", event: 'PHONE_CONFIRMED' });
    out.setQuickReplies(replies);

    return out;
}


export const showPhone = async (pageId, userId, phone) => {
    await updateOrder({ pageId, userId, phone, waitingFor: 'nothing' });

    const out = new Elements();
    out.add({ text: 'Usaremos o número ' + phone + ' para confirmar o pedido. Agora vou pegar as informações do pedido.' });
    return out;
}


// export const askForEmail = async () => {
//     const out = new Elements();
//     out.add({ text: 'Pode também nos enviar o seu e-mail?' });

//     const replies = new QuickReplies();
//     replies.add({ text: 'E-mail', isPhoneNumber: true, data: 'phone_number', event: 'PHONE_NUMBER' });
//     out.setQuickReplies(replies);
//     return out;
// }

export const askForQuantity = async (pageId, userId) => {
    const out = new Elements();
    out.add({ text: 'Quantas pizzas você quer?' });

    const replies = new QuickReplies();
    replies.add({ text: '1', data: 'qty_1', event: 'ORDER_QTY' });
    replies.add({ text: '2', data: 'qty_2', event: 'ORDER_QTY' });
    replies.add({ text: '3', data: 'qty_3', event: 'ORDER_QTY' });
    replies.add({ text: '+ de 3', data: 'qty_more', event: 'ORDER_QTY' });
    out.setQuickReplies(replies);

    await updateOrder({ pageId, userId, waitingFor: 'quantity' });

    return out;
}

export const askForQuantityMore = async (pageId, userId) => {
    const out = new Elements();
    out.add({ text: 'Por favor informe a quantidade de pizzas:' });

    const replies = new QuickReplies();
    replies.add({ text: '- de 4', data: 'qty_less', event: 'ORDER_QTY' });
    replies.add({ text: '4', data: 'qty_4', event: 'ORDER_QTY' });
    replies.add({ text: '5', data: 'qty_5', event: 'ORDER_QTY' });
    replies.add({ text: '6', data: 'qty_6', event: 'ORDER_QTY' });
    // replies.add({ text: '+ de 6', data: 'qty_more_more', event: 'ORDER_QTY' });
    out.setQuickReplies(replies);

    await updateOrder({ pageId, userId, waitingFor: 'quantity' });

    return out;
}

export const showQuantity = async (pageId, userId, data) => {
    // data is 'qty_1', 'qty_2', 'qty_3'...
    const qty = new String(data).substr(data.length - 1, 1);

    await updateOrder({ pageId, userId, qty, waitingFor: 'size', currentItem: 1 });

    const out = new Elements();
    if (qty == 1) {
        out.add({ text: '✅ ' + ' 1 pizza.' });
    } else {
        out.add({ text: '✅ ' + qty + ' pizzas.' });
    }
    return out;
}

export const askForSize = async (pageId, userId) => {

    const out = new Elements();
    const po = await getOrderPending({ pageId, userId, isComplete: false });

    if (po.order) {
        let _text = '';
        if (po.order.qty_total === 1) {
            _text = 'Qual o tamanho da pizza?';
        } else {
            _text = 'Agora vou pegar os detalhes da ' + po.order.currentItem + 'a. pizza.\n';
            _text = _text + 'Qual o tamanho dela?';
        }
        out.add({ text: _text });

        const replies = new QuickReplies();
        const sizesWithPricing = await getPricingSizing(pageId); // only sizes with pricing
        const sizes = await getSizes(pageId, sizesWithPricing);
        for (let i = 0; i < sizes.length; i++) {
            const _data = { id: sizes[i].id, size: sizes[i].size };
            replies.add({ text: sizes[i].size, data: _data, event: 'ORDER_SIZE' });
        }
        out.setQuickReplies(replies);

        if (po.order.qty_total === 1)
            await updateOrder({ pageId, userId, waitingFor: 'size' });
        else
            await updateOrder({ pageId, userId, waitingFor: 'size', qty: po.order.qty_total, eraseSplit: true });
    }
    else {
        out.add({ text: MSG_GENERAL_ERROR });
    }

    return out;
}

export const showSize = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, sizeId: data.id, waitingFor: 'flavor' });

    const out = new Elements();
    out.add({ text: '✅ ' + ' Tamanho: ' + data.size });
    return out;
}

export const askForSplitFlavorOrConfirm = async (pageId, userId, multiple) => {
    const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId, isComplete: true });
    if (pendingOrder.order) {
        const currentSize = await getSize(pageId, pendingOrder.order.currentItemSize);
        // if split is gt than 1, ask user if he wants to split in more than one flavor.
        if (currentSize.split && currentSize.split > 1) {
            let _txt = 'A pizza ' + currentSize.size + ' pode ser dividida em ' + currentSize.split + ' sabores.\n';
            _txt = _txt + 'Escolha quantos sabores você quer:';

            const out = new Elements();
            out.add({ text: _txt });

            const replies = new QuickReplies();
            for (let i = 1; i <= currentSize.split; i++) {
                let _replyText = i === 1 ? i + ' Sabor' : i + ' Sabores';
                replies.add({ text: _replyText, data: i, event: 'ORDER_SPLIT' });
            }
            out.setQuickReplies(replies);

            return out;
        } else {
            return await askForFlavorOrConfirm(pageId, userId, multiple);
        }
    }
}

/**
 * After user answer if he wants to split the pizza, show the chosen option.
 * @param {*} pageId 
 * @param {*} userId 
 * @param {*} data 
 */
export const showSplit = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, sizeId: data.id, waitingFor: 'flavor', originalSplit: data });

    let _txtFlavor = data === 1 ? 'Sabor' : 'Sabores';

    const out = new Elements();
    out.add({ text: '✅ ' + data + ' ' + _txtFlavor });
    return out;
}


export const askForFlavorOrConfirm = async (pageId, userId, multiple, split) => {
    const pendingOrder = await getOrderPending({ pageId: pageId, userId: userId, isComplete: true });

    if (pendingOrder.order) {
        if (split && split > 1) {
            return await askForFlavor(pageId, userId, multiple, split, pendingOrder);
        } else {
            const currentSize = await getSize(pageId, pendingOrder.order.currentItemSize);

            if (pendingOrder.items && pendingOrder.items.length) {
                for (let i = 0; i < pendingOrder.items.length; i++) {
                    if (pendingOrder.items[i].status === 0 && pendingOrder.items[i].flavorId > 0) {
                        await updateStatusSpecificItem(pendingOrder.items[i]._id, 1);
                        return await showOrderOrNextItem(pageId, userId);
                    }
                }
                return await askForFlavor(pageId, userId, multiple);
            }
        }
    }
}

/**
 * 
 * @param {*} pageId 
 * @param {*} userId 
 * @param {*} multiple: if are the first 4 flavors, multiple=1, if are the next, multiple=2 and so on. 
 */
export const askForFlavor = async (pageId, userId, multiple, split, pendingOrder) => {
    const out = new Elements();

    out.setListStyle('compact'); // or 'large'

    let po = null;
    if (pendingOrder)
        po = pendingOrder;
    else po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: false });

    const flavorsArray = await getFlavorsAndToppings(pageId, po.order.currentItemSize);

    let _rangeIni = (multiple - 1) * 4;
    let _rangeEnd = multiple * 4;

    for (let i = _rangeIni; i < _rangeEnd; i++) {
        if (flavorsArray[i]) {
            const _fl = flavorsArray[i];
            const _data = { id: _fl.id, flavor: _fl.flavor }
            const buttons = new Buttons();
            buttons.add({ text: 'Quero', data: _data, event: 'ORDER_FLAVOR' });

            let _subtext = _fl.toppingsNames.join();
            if (_fl.price) {
                _subtext = _subtext.concat('\n R$', _fl.price);
            }
            out.add({ text: _fl.flavor, subtext: _subtext, buttons });
        }
    }


    if (flavorsArray.length > _rangeEnd) {
        multiple++;
        const buttonsOpt = new Buttons();
        buttonsOpt.add({ text: '+ Opções', data: { option: "flavors_more", multiple: multiple }, event: 'ORDER_FLAVOR' });
        out.add({ buttons: buttonsOpt, isOnlyButtons: true });
    }


    await updateOrder({ pageId, userId, waitingFor: 'flavor', split: split });

    return out;
}

export const showFlavor = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, flavorId: data.id, completeItem: true, waitingFor: 'nothing', calcTotal: true });

    const out = new Elements();
    out.add({ text: '✅ ' + ' Sabor: ' + data.flavor });
    return out;
}

export const showOrderOrNextItem = async (pageId, userId) => {
    const po = await getOrderPending({ pageId, userId, isComplete: true });

    if (po.order.currentItemSplit > 1) {
        const split = po.order.currentItemSplit - 1;
        return await askForFlavor(pageId, userId, 1, split, po);
    }
    else if (po.order.qty_total > 1 && po.order.item_complete < po.order.qty_total) {
        const nextItem = po.order.currentItem + 1;
        await updateOrder({ pageId, userId, waitingFor: 'size', currentItem: nextItem });
        return await askForSize(pageId, userId);
    }
    else {
        const out = new Elements();
        let total_price = 0;
        let _txt = 'Seguem os detalhes do seu pedido:\n';
        _txt = _txt + '*Pedido:* ' + po.order.id + '\n';
        for (let i = 0; i < po.items.length; i++) {
            const _item = po.items[i];
            if (_item.flavorId && _item.sizeId) {
                let _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;
                _txt = _txt + `${_txtQty} pizza ${_item.size} de ${_item.flavor}\n`;
            } else if (_item.beverageId && _item.beverage) {
                _txt = _txt + `1 ${_item.beverage}\n`;
            }
            total_price += _item.price;
        }
        _txt = _txt + '*Endereço de entrega:* ' + po.order.address + '\n';
        _txt = _txt + '*Telefone:* ' + po.order.phone + '\n';
        _txt = _txt + '*Total:* R$ ' + total_price + '\n';
        _txt = _txt + 'O pedido está correto?';

        out.add({ text: _txt });

        const replies = new QuickReplies();
        replies.add({ text: "Sim", data: "confirmation_yes", event: 'ORDER_PIZZA_CONFIRMATION' });
        replies.add({ text: "Não", data: "confirmation_no", event: 'ORDER_PIZZA_CONFIRMATION' });
        out.setQuickReplies(replies);

        return out;
    }
}

export const showFullOrder = async (pageId, userId) => {
    const po = await getOrderPending({ pageId, userId, isComplete: true });

    const out = new Elements();
    let total_price = 0;
    let _txt = 'Seguem os detalhes do seu pedido:\n';
    _txt = _txt + '*Pedido:* ' + po.order.id + '\n';
    for (let i = 0; i < po.items.length; i++) {
        const _item = po.items[i];
        if (_item.flavorId && _item.sizeId) {
            let _txtQty = _item.split > 1 ? _item.qty + '/' + _item.split : _item.qty;
            _txt = _txt + `${_txtQty} pizza ${_item.size} de ${_item.flavor}\n`;
        } else if (_item.beverageId && _item.beverage) {
            _txt = _txt + `1 ${_item.beverage}\n`;
        }
        total_price += _item.price;
    }
    _txt = _txt + '*Endereço de entrega:* ' + po.order.address + '\n';
    _txt = _txt + '*Telefone:* ' + po.order.phone + '\n';
    _txt = _txt + '*Total:* R$ ' + total_price + '\n';
    _txt = _txt + 'Posso confirmar o pedido?';

    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Sim", data: "confirmation_yes", event: 'ORDER_CONFIRMATION' });
    replies.add({ text: "Não", data: "confirmation_no", event: 'ORDER_CONFIRMATION' });
    out.setQuickReplies(replies);

    return out;
}


export const confirmOrder = async (pageId, userId) => {
    await updateOrder({ pageId, userId, confirmOrder: true, calcTotal: true });

    const out = new Elements();
    out.add({ text: "Pedido Confirmado!" });
    return out;
}

export const askForChangeOrder = async (pageId, userId) => {
    const out = new Elements();

    await updateOrder({ pageId, userId, waitingFor: 'confirmation' });

    let _txt = 'O que você gostaria de fazer com o seu pedido?';
    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Mudar pedido", data: "changeOrder", event: 'ORDER_WANT_CHANGE' });
    replies.add({ text: "Mudar endereço", data: "change_address", event: 'ORDER_CHANGE' });
    replies.add({ text: "Confirmar.", data: "confirmation_yes", event: 'ORDER_CONFIRMATION' });
    out.setQuickReplies(replies);

    return out;
}

export const askForOptionsToChange = async (pageId, userId, item) => {
    try {
        if (item && item.beverageId) {
            return await askForBeverages(pageId, userId, 1);
        } else {
            const out = new Elements();

            let _txt = 'Ok, qual das informações que você gostaria de alterar?';
            out.add({ text: _txt });

            const replies = new QuickReplies();
            // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });
            replies.add({ text: "Tamanho", data: "change_size", event: 'ORDER_CHANGE' });
            replies.add({ text: "Sabor", data: "change_flavor", event: 'ORDER_CHANGE' });
            out.setQuickReplies(replies);
            return out;
        }
    } catch (askForOptionsToChangeErr) {
        console.error({ askForOptionsToChangeErr });
        throw askForOptionsToChangeErr;
    }
}

export const askForSpecificItem = async (pageId, userId) => {
    const pendingOrder = await getOrderPending({ pageId, userId, isComplete: true });
    if (pendingOrder.items && pendingOrder.items.length > 1) {
        const out = new Elements();
        out.add({ text: 'Primeiro, escolha qual os itens deseja mudar:' });

        const replies = new QuickReplies();
        let i = 1;
        pendingOrder.items.forEach(item => {
            let _txt = item.flavor ? item.flavor : item.beverage;
            replies.add({ text: i + "a. " + _txt, data: item._id, event: 'ORDER_CHANGE_SELECT_ITEM' });
            i++;
        });
        out.setQuickReplies(replies);
        return out;
    } else {
        await updateOrder({ pageId, userId, completeItem: false });
        return await askForOptionsToChange(pageId, userId);
    }
}

/**
 * 
 * @param {*} pageId 
 * @param {*} userId 
 */
export const askForWantBeverage = async (pageId, userId) => {
    const pendingOrder = await getOrderPending({ pageId, userId, isComplete: false });

    const noBeverage = pendingOrder.order.no_beverage;

    if (typeof noBeverage === 'undefined') {

        const out = new Elements();
        let _txt = 'Gostaria de algo para beber?';
        out.add({ text: _txt });

        const replies = new QuickReplies();
        // replies.add({ text: "Quantidade", data: "change_quantity", event: 'ORDER_CHANGE' });
        replies.add({ text: "Sim", data: "beverage_yes", event: 'ORDER_CONFIRM_BEVERAGE' });
        replies.add({ text: "Não", data: "beverage_no", event: 'ORDER_CONFIRM_BEVERAGE' });
        out.setQuickReplies(replies);
        return out;
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
    const out = new Elements();
    out.setListStyle('compact'); // or 'large'

    // const po = await getOrderPending({ pageId: pageId, userId: userId, isComplete: false });

    const beveragesArr = await getBeverages(pageId);
    let _rangeIni = (multiple - 1) * 4;
    let _rangeEnd = multiple * 4;

    for (let i = _rangeIni; i < _rangeEnd; i++) {
        if (beveragesArr[i]) {
            const _bev = beveragesArr[i];
            const _data = { id: _bev.id, beverage: _bev.name, price: _bev.price }
            const buttons = new Buttons();
            buttons.add({ text: 'Quero', data: _data, event: 'ORDER_BEVERAGE' });

            let _subtext = _bev.kind;
            if (_bev.price) {
                _subtext = _subtext.concat('\n R$', _bev.price);
            }
            out.add({ text: _bev.name, subtext: _subtext, buttons });
        }
    }
    if ((beveragesArr.length + 1) > _rangeEnd) {
        multiple++;
        const buttonsOpt = new Buttons();
        buttonsOpt.add({ text: '+ Opções (clique aqui para ver + opções..)', data: { option: "beverages_more", multiple: multiple }, event: 'ORDER_BEVERAGE' });
        out.add({ buttons: buttonsOpt, isOnlyButtons: true });
    } else {
        // const lastButton = new Buttons();
        // lastButton.add({ text: 'Não tem, cancelar.', data: { option: "beverages_cancel" }, event: 'ORDER_BEVERAGE' });
        // out.add({ buttons: lastButton, isOnlyButtons: true });

        const _data = { option: 'beverages_cancel' }
        const buttons = new Buttons();
        buttons.add({ text: 'Sem bebida', data: _data, event: 'ORDER_BEVERAGE' });
        let _subtext = 'Se não encontrou, clique em "Sem bebida"';
        out.add({ text: 'Não encontrei', subtext: _subtext, buttons });
    }

    await updateOrder({ pageId, userId, waitingFor: 'beverage', noBeverage: false });
    return out;
}

/**
 * Show that user did not want beverage and update order with this info.
 * @param {*} pageId 
 * @param {*} userId 
 * @param {*} data 
 */
export const showNoBeverage = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, noBeverage: true, waitingFor: 'confirm' });

    const out = new Elements();
    out.add({ text: '❌ ' + ' Sem bebida para o seu pedido. ' });
    return out;
}

/**
 * Show the chosen beverage.
 * @param {*} pageId 
 * @param {*} userId 
 * @param {*} data 
 */
export const showBeverage = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, beverageId: data.id, beveragePrice: data.price, completeItem: true, noBeverage: false, waitingFor: 'confirmation', calcTotal: true });

    const out = new Elements();
    out.add({ text: '✅ ' + '1 Bebida: ' + data.beverage });
    return out;
}

export const updateItemAskOptions = async (pageId, userId, objectId) => {
    const item = await updateStatusSpecificItem(objectId, 0);
    return await askForOptionsToChange(pageId, userId, item);
}

export const sendShippingNotification = async (pageId, userId, orderId) => {
    const { accessToken } = await getOnePageToken(pageId);

    const _txt = 'O seu pedido número ' + orderId + ' acabou de sair para entrega. Bom apetite!';

    const out = new Elements();
    out.add({ text: _txt });
    await Bot.send_message_tag(accessToken, userId, out);
}



