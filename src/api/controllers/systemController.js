import Flavor from '../models/flavors';
import Size from '../models/sizes';
import Beverage from '../models/beverages';
import Topping from '../models/toppings';
import Store from '../models/stores';
import Pricing from '../models/pricings';
import { getFlavors } from './flavorsController';
import { getSizes } from './sizesController';
import { getBeverages } from './beveragesController';
import dotenv from "dotenv";
import { getToppingsFull } from './toppingsController';
import { getPricings } from './pricingsController';
import { getStores } from './storesController';
import { getOnePageData } from './pagesController';

export const initialSetup = async pageID => {
    try {
        dotenv.config();

        const env = process.env.NODE_ENV || 'production';
        let basePageID = process.env.DEV_PAGE_BASE_ID; // Página do Aldo
        if (env === 'production')
            basePageID = process.env.PRD_PAGE_BASE_ID; // Pizzaibot        

        const page = await getOnePageData(pageID);

        console.info(`env:${env}, basePageID:${basePageID}`);

        if (basePageID !== pageID) { // only updates when the page is not the basePage

            let haveToUpdate = false;
            if (page) {
                if (!page.initialSetupFlavors) {
                    page.initialSetupFlavors = await insertFlavors(pageID, basePageID);
                    haveToUpdate = true;
                }
                if (!page.initialSetupStores) {
                    page.initialSetupStores = await insertStores(pageID, page.name, basePageID);
                    haveToUpdate = true;
                }
                if (!page.initialSetupSizes) {
                    page.initialSetupSizes = await insertSizes(pageID, basePageID);
                    haveToUpdate = true;
                }
                if (!page.initialSetupPricings) {
                    page.initialSetupPricings = await insertPricings(pageID, basePageID);
                    haveToUpdate = true;
                }
                if (!page.initialSetupBeverages) {
                    page.initialSetupBeverages = await insertBeverages(pageID, basePageID);
                    haveToUpdate = true;
                }
                if (!page.initialSetupToppings) {
                    page.initialSetupToppings = await insertToppings(pageID, basePageID)
                    haveToUpdate = true;
                }
                if (!page.greetingText || !page.firstResponseText) {
                    const basePage = await getOnePageData(basePageID);
                    page.greetingText = basePage.greetingText;
                    page.firstResponseText = basePage.firstResponseText;
                    haveToUpdate = true;
                }
                if (haveToUpdate)
                    await page.save();

            }
        }
        return page;
    } catch (error) {
        console.error("Error on initial setup", error);
    }
}

const insertFlavors = async (pageID, basePageID) => {
    let _newRecords = 0;

    try {

        const _flavors = await getFlavors(basePageID);

        const docs = new Array();

        for (const element of _flavors) {
            const newRec = new Flavor({
                id: element.id,
                flavor: element.flavor,
                kind: element.kind,
                toppings: element.toppings,
                pageId: pageID
            });
            docs.push(newRec);
        }

        if (docs.length > 0) {
            const flavorInsertMany = await Flavor.insertMany(docs); //=> {
            console.info({ flavorInsertMany });
            _newRecords = docs.length;
        }
    } catch (insertFlavorsErr) {
        // ignoring err..
        console.error({ insertFlavorsErr });
    }

    return _newRecords;
}

const insertSizes = async (pageID, basePageID) => {
    let _newRecords = 0;
    try {
        const _sizes = await getSizes(basePageID);

        const docs = new Array();
        for (const element of _sizes) {
            const newRec = new Size({
                id: element.id,
                size: element.size,
                slices: element.slices,
                split: element.split,
                pageId: pageID
            });
            docs.push(newRec);
        }

        if (docs.length > 0) {
            const result = await Size.insertMany(docs);
            _newRecords = docs.length;
        }
    } catch (insertSizesErr) {
        // ignoring err..
        console.error({ insertSizesErr });
    }

    return _newRecords;
}

const insertBeverages = async (pageID, basePageID) => {
    let _newRecords = 0;
    try {
        const _docs = await getBeverages(basePageID);

        const docs = new Array();
        for (const element of _docs) {
            const newRec = new Beverage({
                id: element.id,
                kind: element.kind,
                name: element.name,
                price: element.price,
                pageId: pageID
            });
            docs.push(newRec);
        }

        if (docs.length > 0) {
            const result = await Beverage.insertMany(docs);
            _newRecords = docs.length;
        }
    } catch (insertBeveragesErr) {
        // ignoring err..
        console.error({ insertBeveragesErr });
    }

    return _newRecords;
}

const insertToppings = async (pageID, basePageID) => {
    let _newRecords = 0;

    try {
        const _docs = await getToppingsFull(basePageID);

        const docs = new Array();
        for (const element of _docs) {
            const newRec = new Topping({
                id: element.id,
                topping: element.topping,
                pageId: pageID
            });
            docs.push(newRec);
        }

        if (docs.length > 0) {
            const result = await Topping.insertMany(docs);
            _newRecords = docs.length;
        }
    } catch (insertToppingsErr) {
        // ignoring err..
        console.error({ insertToppingsErr });
    }

    return _newRecords;
}

const insertPricings = async (pageID, basePageID) => {
    let _newRecords = 0;

    try {
        const _pricings = await getPricings(basePageID);

        const docs = new Array();
        for (const element of _pricings) {
            const newRec = new Pricing({
                id: element.id,
                kind: element.kind,
                sizeId: element.sizeId,
                price: element.price,
                pageId: pageID
            });
            docs.push(newRec);
        }

        if (docs.length > 0) {
            const result = await Pricing.insertMany(docs);
            _newRecords = docs.length;
        }
    } catch (insertPricingsErr) {
        // ignoring err..
        console.error({ insertPricingsErr });
    }
    return _newRecords;
}

const insertStores = async (pageID, pageName, basePageID) => {
    let _newRecords = 0;
    try {
        const _stores = await getStores(basePageID);

        const docs = new Array();
        for (const element of _stores) {
            const newRec = new Store({
                pageId: pageID,
                name: pageName,
                id: element.id,
                hol_is_open: element.hol_is_open,
                hol_open: element.hol_open,
                hol_close: element.hol_close,
                sun_is_open: element.sun_is_open,
                mon_is_open: element.mon_is_open,
                tue_is_open: element.tue_is_open,
                wed_is_open: element.wed_is_open,
                thu_is_open: element.thu_is_open,
                fri_is_open: element.fri_is_open,
                sat_is_open: element.sat_is_open,
                sun_open: element.sun_open,
                mon_open: element.mon_open,
                tue_open: element.tue_open,
                wed_open: element.wed_open,
                thu_open: element.thu_open,
                fri_open: element.fri_open,
                sat_open: element.sat_open,
                sun_close: element.sun_close,
                mon_close: element.mon_close,
                tue_close: element.tue_close,
                wed_close: element.wed_close,
                thu_close: element.thu_close,
                fri_close: element.fri_close,
                sat_close: element.sat_close,
            });
            docs.push(newRec);
        }

        if (docs.length > 0) {
            const result = await Store.insertMany(docs);
            _newRecords = docs.length;
        }
    } catch (insertStoresErr) {
        // ignoring err..
        console.error({ insertStoresErr });
    }

    return _newRecords;
}