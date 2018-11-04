import util from 'util';
import fs from 'fs';
import { Elements, Buttons, QuickReplies } from 'facebook-messenger-bot';
import { getOnePage, getAllPages, getOnePageData } from '../controllers/pagesController';
import { getPricingSizing } from '../controllers/pricingsController';
import getCardapio from './show_cardapio';
import {
    getFlavorsAndToppings,
    inputCardapioReplyMsg,
    getOpenAndClose,
    inputHorarioReplyMsg,
    validateBotOrder,
} from "./actionsController";
import { getSizes } from '../controllers/sizesController';
import { updateOrder, showOrderPending } from '../controllers/ordersController';

// TODO: create a debugger with json format
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

const MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico';

// create a custom timestamp format for log statements
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'logs/bot.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);

export const sendErrorMsg = async () => {
    await sender.fetch('first_name');
    const out = new Elements();
    out.add({ text: 'Ops, tivemos um probleminha técnico.' });
    return out;
}


/**
 * 
 * @param {*} sender 
 * @param {*} pageID 
 */
export const sendWelcomeMessage = async (sender, pageID) => {
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

export const sendCardapio = async (pageID) => {
    const replyMsg = await getCardapio(pageID);
    const out = new Elements();
    out.add({ text: replyMsg });

    return out;
}

export const askForLocation = async () => {
    const out = new Elements();
    out.add({ text: 'Para começar, preciso saber aonde você está. Clique no botão abaixo que receberei a sua localização.' });

    const replies = new QuickReplies();
    replies.add({ text: 'Localização', isLocation: true, data: 'location_location', event: 'LOCATION' });
    // replies.add({ text: 'Informar o CEP', data: 'location_cep', event: 'LOCATION' });
    out.setQuickReplies(replies);
    return out;
}

export const showLocation = async (pageId, userId, location) => {

    // TODO: check if the location is in the neighborhood.

    await updateOrder({ pageId, userId, location });

    const out = new Elements();
    out.add({ text: 'Ok, verifiquei que o seu endereço está dentro da nossa área de entrega.' });
    return out;
}

export const askForPhone = async () => {
    const out = new Elements();
    out.add({ text: 'Pode nos enviar o seu telefone? Para que possamos fazer a confirmação do pedido.' });

    const replies = new QuickReplies();
    replies.add({ text: 'Telefone', isPhoneNumber: true, data: 'phone_number', event: 'PHONE_NUMBER' });
    out.setQuickReplies(replies);
    return out;
}

export const showPhone = async (pageId, userId, phone) => {

    // TODO: check if the location is in the neighborhood.

    await updateOrder({ pageId, userId, phone });

    const out = new Elements();
    out.add({ text: 'Ok, telefone recebido. Agora vamos ao que interessa, informações do pedido.' });
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

export const askForQuantity = async () => {
    const out = new Elements();
    out.add({ text: 'Quantas pizzas você quer?' });

    const replies = new QuickReplies();
    replies.add({ text: '1', data: 'qty_1', event: 'ORDER_QTY' });
    replies.add({ text: '2', data: 'qty_2', event: 'ORDER_QTY' });
    replies.add({ text: '3', data: 'qty_3', event: 'ORDER_QTY' });
    replies.add({ text: '+ de 3', data: 'qty_more', event: 'ORDER_QTY_MORE' });
    out.setQuickReplies(replies);
    return out;
}

export const askForQuantityMore = async () => {
    const out = new Elements();
    out.add({ text: 'Por favor informe a quantidade de pizzas:' });

    const replies = new QuickReplies();
    replies.add({ text: '4', data: 'qty_4', event: 'ORDER_QTY' });
    replies.add({ text: '5', data: 'qty_5', event: 'ORDER_QTY' });
    replies.add({ text: '6', data: 'qty_6', event: 'ORDER_QTY' });
    replies.add({ text: '+ de 6', data: 'qty_more_more', event: 'ORDER_QTY_MORE' });
    out.setQuickReplies(replies);
    return out;
}

export const showQuantity = async (pageId, userId, data) => {
    const qty = new String(data).substr(data.length - 1, 1);

    await updateOrder({ pageId, userId, qty });

    const out = new Elements();
    if (qty == 1) {
        out.add({ text: '✅ ' + ' 1 pizza.' });
    } else {
        out.add({ text: '✅ ' + qty + ' pizzas.' });
    }
    return out;
}

export const askForSize = async (pageID) => {
    const out = new Elements();
    out.add({ text: 'Qual o tamanho da pizza?' });

    const replies = new QuickReplies();
    const sizesWithPricing = await getPricingSizing(pageID); // only sizes with pricing
    const sizes = await getSizes(pageID, sizesWithPricing);
    for (var i = 0; i < sizes.length; i++) {
        const _data = { id: sizes[i].id, size: sizes[i].size };
        replies.add({ text: sizes[i].size, data: _data, event: 'ORDER_SIZE' });
    }
    out.setQuickReplies(replies);
    return out;
}

export const showSize = async (pageId, userId, data) => {
    await updateOrder({ pageId, userId, sizeId: data.id });

    const out = new Elements();
    out.add({ text: '✅ ' + ' Tamanho: ' + data.size });
    return out;
}

export const askForFlavor = async (pageID) => {
    const out = new Elements();
    out.setListStyle('compact'); // or 'large'

    const flavorsArray = await getFlavorsAndToppings(pageID);
    for (let i = 0; i < 4; i++) {
        if (flavorsArray[i]) {
            const _fl = flavorsArray[i];
            const _data = { id: _fl.id, flavor: _fl.flavor }
            const buttons = new Buttons();
            buttons.add({ text: 'Quero', data: _data, event: 'ORDER_FLAVOR' });

            let _tn = _fl.toppingsNames;
            let _subtext = new String();
            for (let j = 0; j < _tn.length; j++) {
                _subtext = _subtext.concat(_tn[j].topping, ", ");
            }
            out.add({ text: _fl.flavor, subtext: _subtext, buttons });
        }
    }
    const buttonsOpt = new Buttons();
    buttonsOpt.add({ text: '+ Opções', data: "flavors_more", event: 'ORDER_FLAVOR' });
    out.add({ buttons: buttonsOpt, isOnlyButtons: true });

    return out;
}

export const showFlavor = async (pageId, userId, data) => {
    await updateOrder({ pageId: pageId, userId: userId, flavorId: data.id });

    const out = new Elements();
    out.add({ text: '✅ ' + ' Sabor: ' + data.flavor });
    return out;
}

export const showOrder = async (pageId, userId) => {
    const order = await showOrderPending({ pageId: pageId, userId: userId });

    const out = new Elements();

    let _txt = 'Seguem os detalhes do seu pedido:\n';
    for (let i = 0; i < order.items.length; i++) {
        _txt = _txt + `${order.items[i].qty} pizza ${order.items[i].size} de ${order.items[i].flavor}\n`;
    }
    _txt = _txt + 'Podemos confirmar o pedido?';

    out.add({ text: _txt });

    const replies = new QuickReplies();
    replies.add({ text: "Sim", data: "confirmation_yes", event: 'ORDER_CONFIRMATION' });
    replies.add({ text: "Não", data: "confirmation_no", event: 'ORDER_CONFIRMATION' });
    out.setQuickReplies(replies);

    return out;
}

// const updateFlavor = async (pageId, userId, flavorId) => {
//     const orderData = {
//         userId: userId,
//         pageId: pageId,
//         orderId: null,
//         qty: null,
//         sizeId: null,
//         flavorId: flavorId,
//     }
//     await updateOrder(orderData);
// }



// export const askForFlavor = async (pageID) => {
//     const flavorsArray = await getFlavorsAndToppings(pageID);
//     const buttons = new Buttons();
//     for (let i = 0; i < 2; i++) {
//         if (flavorsArray[i]) {
//             const _data = { id: flavorsArray[i].id, flavor: flavorsArray[i].flavor }
//             buttons.add({ text: flavorsArray[i].flavor, data: _data, event: 'ORDER_FLAVOR' });
//         }
//     }
//     buttons.add({ text: '+ Opções', data: 'flavors_more', event: 'ORDER_FLAVOR' });

//     const out = new Elements();
//     out.setListStyle('compact'); // or 'large'
//     out.add({ text: 'Por favor escolha uma das opções', buttons });

//     return out;
// }