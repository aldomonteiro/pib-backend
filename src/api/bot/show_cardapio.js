import { getPricingsWithSize } from '../controllers/pricingsController';
import { getCategories, getCategory } from '../controllers/categoriesController';
import { getFlavors } from '../controllers/flavorsController';
import { getToppingsFull } from '../controllers/toppingsController';
import { getStoreData } from '../controllers/storesController';
import { sendMainMenu } from './botController';

export const getCardapio = async (pageID, categoryID) => {
    const category = await getCategory(pageID, categoryID);
    const flavorArray = await getFlavorsAndToppingsCardapio(pageID, categoryID);

    let pricingArray = []
    if (category && category.price_by_size)
        pricingArray = await getPricingsWithSize(pageID);

    let replyText;

    if (flavorArray && category) {
        replyText = `Seguem nossas opções de ${category.name}:\n`;
        if (category && category.price_by_size) {
            for (const pricing of pricingArray) {
                if (pricing.categoryId === category.id)
                    replyText = replyText + `${pricing.size} - R$ ${pricing.price}\n`;
            }
        }
        replyText = replyText + '\n' + await inputCardapioReplyMsg(flavorArray, category.price_by_size);
    }
    return replyText;
}

/**
 * If there is an image in the Store Customizing, send it.
 * @param {*} pageId
 */
export const askForCategoryCardapio = async (pageId) => {
    const storeData = await getStoreData(pageId);

    if (storeData.catalog_url1 || storeData.catalog_url2) {
        const _images = [];
        if (storeData.catalog_url1) {
            const img = { imageUrl: storeData.catalog_url1, imageCaption: 'Cardápio' };
            _images.push(img);
        }
        if (storeData.catalog_url2) {
            const img = { imageUrl: storeData.catalog_url2, imageCaption: 'Cardápio' };
            _images.push(img);
        }

        const reply = await sendMainMenu();
        reply.extraType = 'image';
        reply.images = _images;

        return reply;

    } else {
        const categories = await getCategories(pageId);

        let _txt = 'Selecione uma categoria:';

        const _options = [];
        for (let item of categories) {
            const _data = { id: item.id, name: item.name }
            const buttons = { text: 'Detalhes', data: _data, event: 'ORDER_CATEGORY_CARDAPIO' };
            _options.push({ text: item.name, subtext: item.name, buttons });
        }

        const buttons = { text: 'Voltar', data: 'main_menu', event: 'MAIN_MENU' };
        _options.push({ text: 'Voltar p/ Inicio', subtext: 'Voltar p/ Inicio', buttons });

        return {
            type: 'list',
            text: _txt,
            options: _options,
        }
    }
}

export const getFlavorsAndToppingsCardapio = async (pageID, categoryID) => {
    try {
        const flavorArray = await getFlavors(pageID);
        const allToppings = await getToppingsFull(pageID);
        const flavorsWithToppings = [];
        for (let flavor of flavorArray) {
            if (categoryID && flavor.categoryId === categoryID) {
                flavor.toppingsNames = [];
                if (flavor.toppings && flavor.toppings.length > 0) {
                    for (let tId of flavor.toppings) {
                        for (let topping of allToppings) {
                            if (topping.id === tId) {
                                flavor.toppingsNames.push(topping.topping);
                            }
                        }
                    }
                }
                flavorsWithToppings.push(flavor);
            }
        }
        return flavorsWithToppings;
    } catch (err) {
        console.error({ flavorsAndToppingsCardapioErr: err });
    }
}

export const inputCardapioReplyMsg = async (flavorArray, priceBySize) => {
    console.info(flavorArray);
    let replyMsg = '';
    if (flavorArray) {
        for (const flavor of flavorArray) {
            replyMsg = replyMsg + '*' + flavor.flavor + '*';
            if (!priceBySize)
                replyMsg = replyMsg + ' - RS ' + flavor.price;
            replyMsg = replyMsg + '\n';

            if (flavor.toppingsNames && flavor.toppingsNames.length > 0)
                replyMsg = replyMsg + flavor.toppingsNames.join(', ') + '\n';
        }
    }
    return replyMsg;
}
