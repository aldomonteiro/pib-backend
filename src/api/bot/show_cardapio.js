import {
    getFlavorsAndToppings,
    inputCardapioReplyMsg,
} from "./actionsController";
import { getPricingsWithSize } from "../controllers/pricingsController";
import { choices_kinds } from '../util/util'


const MSG_GENERAL_ERROR = 'Ops, estamos com um probleminha técnico';

const getCardapio = async (pageID) => {
    const pricingArray = await getPricingsWithSize(pageID);
    const flavorArray = await getFlavorsAndToppings(pageID);
    const kinds = choices_kinds();
    var replyText = new String();
    if (flavorArray) {
        replyText = 'Segue o nosso cardápio:\n';
        let currentKind = '';
        for (const pricing of pricingArray) {
            if (currentKind !== pricing.kind) {
                if (currentKind !== '') {
                    let flavorByKind = flavorArray.filter(value => value.kind === currentKind);
                    replyText = replyText + '\n' + inputCardapioReplyMsg(flavorByKind);
                }
                currentKind = pricing.kind;

                const kindName = kinds.filter(e => e.id === currentKind)[0].name;
                replyText = replyText + '\n𝐓𝐢𝐩𝐨: ' + kindName + '\n';
            }
            replyText = replyText + pricing.size + ' - R$ ' + pricing.price + '\n';
        }
        // the last kind
        if (currentKind !== '') {
            let flavorByKind = flavorArray.filter(value => value.kind === currentKind);
            replyText = replyText + '\n' + inputCardapioReplyMsg(flavorByKind);
        }
    } else {
        replyText = MSG_GENERAL_ERROR;
    }
    return replyText;
}

export default getCardapio;
