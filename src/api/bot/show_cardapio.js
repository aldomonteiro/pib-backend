import {
    getFlavorsAndToppings,
    inputCardapioReplyMsg,
} from "./actionsController";

const MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico';

const getCardapio = async (pageID) => {
    const flavorArray = await getFlavorsAndToppings(pageID);
    var replyText = new String();
    if (flavorArray) {
        replyText = 'Seguem as pizzas do nosso cardápio:\n' + inputCardapioReplyMsg(flavorArray);
    } else {
        replyText = MSG_GENERAL_ERROR;
    }
    return replyText;
}

export default getCardapio;
