import Flavor from '../models/flavors';
import Size from '../models/sizes';
import Store from '../models/stores';
import Pricing from '../models/pricings';
import { getFlavors } from './flavorsController';
import { getSizes } from './sizesController';
import { getPricings } from './pricingsController';
import { getStores } from './storesController';
import { getOnePageData } from './pagesController';


const basePageID = "237290183773790"; // Página do Aldo

export const initialSetup = async pageID => {
    try {
        const updatedPage = await getOnePageData(pageID);

        let haveToUpdate = false;

        if (!updatedPage.initialSetupFlavors) {
            updatedPage.initialSetupFlavors = await insertFlavors(pageID);
            haveToUpdate = true;
        }
        if (!updatedPage.initialSetupStores) {
            updatedPage.initialSetupStores = await insertStores(pageID, updatedPage.name)
            haveToUpdate = true;
        }
        if (!updatedPage.initialSetupSizes) {
            updatedPage.initialSetupSizes = await insertSizes(pageID)
            haveToUpdate = true;
        }
        if (!updatedPage.initialSetupPricings) {
            updatedPage.initialSetupPricings = await insertPricings(pageID)
            haveToUpdate = true;
        }
        if (!updatedPage.greetingText || !updatedPage.firstResponseText) {
            const basePage = await getOnePageData(basePageID);
            updatedPage.greetingText = basePage.greetingText;
            updatedPage.firstResponseText = basePage.firstResponseText;
            haveToUpdate = true;
        }
        if (haveToUpdate)
            await updatedPage.save();

        return updatedPage;
    } catch (error) {
        console.error("Error on initial setup", error);
    }
}

const insertFlavors = async pageID => {
    let _newRecords = 0;

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

    await Flavor.insertMany(docs, (err, result) => {
        if (err) {
            console.error('Error while inserting flavors', err);
            throw err;
        }
        else {
            _newRecords = result.length;
            console.info(`${pageID}: ${_newRecords} flavors inserted`);
        }
    });
    return _newRecords;
}

const insertSizes = async pageID => {
    let _newRecords = 0;

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

    await Size.insertMany(docs, (err, result) => {
        if (err) {
            console.error('Error while inserting sizes', err);
            throw err;
        }
        else {
            _newRecords = result.length;
            console.info(`${pageID}: ${_newRecords} sizes inserted`);
        }
    });

    return _newRecords;
}

const insertPricings = async pageID => {
    let _newRecords = 0;

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

    await Pricing.insertMany(docs, (err, result) => {
        if (err) {
            console.error('Error while inserting pricings', err);
            throw err;
        }
        else {
            _newRecords = result.length;
            console.info(`${pageID}: ${_newRecords} pricings inserted`);
        }
    });
    return _newRecords;
}

const insertStores = async (pageID, pageName) => {
    let _newRecords = 0;

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

    await Store.insertMany(docs, (err, result) => {
        if (err) {
            console.error('Error while inserting stores', err);
            throw err;
        }
        else {
            _newRecords = result.length;
            console.info(`${_newRecords} stores inserted`);
        }
    });

    return _newRecords;
}