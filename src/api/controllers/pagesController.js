
import Page from "../models/pages";
import User from "../models/users";
import axios from 'axios';
import util from 'util';
import { configSortQuery, configRangeQuery } from '../util/util';
import { initialSetup } from "./systemController";
import { deleteManyFlavors } from './flavorsController';
import { deleteManyBeverages } from './beveragesController';
import { deleteManyCustomers } from './customersController';
import { deleteManyExtras } from './extrasController';
import { deleteManyItems } from './itemsController';
import { deleteManyOrders } from './ordersController';
import { deleteManyPricings } from './pricingsController';
import { deleteManySizes } from './sizesController';
import { deleteManyToppings } from './toppingsController';
import { deleteManyStores } from './storesController';
import { removeUserActivePage } from "./usersController";

// List all flavors
// TODO: use filters in the query req.query
export const page_resources_get_all = async (req, res) => {
    // Getting the sort from the requisition
    var sortObj = configSortQuery(req.query.sort);
    // Getting the range from the requisition
    var rangeObj = configRangeQuery(req.query.range);

    let options = {
        offset: rangeObj['offset'],
        limit: rangeObj['limit'],
        sort: sortObj,
        lean: true,
        leanWithId: false,
    };

    var query = {};

    if (req.currentUser.activePage) {
        query = Page.find({ id: req.currentUser.activePage });
        Page.paginate(query, options, async (err, result) => {
            if (err) {
                res.status(500).json({ message: err.errmsg });
            } else {
                res.setHeader('Content-Range', util.format("pages %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
                res.status(200).json(result.docs);
            }
        });
    }
    else {
        res.setHeader('Content-Range', util.format("pages %d-%d/%d", 0, 0, 0));
        res.status(200).json(new Array());
    }
};

// List one record by filtering by ID
export const page_resources_get_one = (req, res) => {
    if (req.params && req.params.id) {

        Page.findOne({ id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json({ message: err.errMsg });
            }
            else {
                res.status(200).json(doc);
            }
        });
    }
}

/**
 * Deactivate Bot and delete all related records
 * @param {*} req 
 * @param {*} res 
 */
export const page_resources_delete = async (req, res) => {
    let lastResult;
    try {
        console.info("page_resources_delete:", req.params);

        const pageID = req.params.id;
        const { accessToken } = await getOnePageToken(pageID);

        lastResult = await deleteFacebookFields(pageID, accessToken);

        lastResult = await deleteManyBeverages(pageID);
        lastResult = await deleteManyCustomers(pageID);
        lastResult = await deleteManyExtras(pageID);
        lastResult = await deleteManyFlavors(pageID);
        lastResult = await deleteManyItems(pageID);
        lastResult = await deleteManyOrders(pageID);
        lastResult = await deleteManyPricings(pageID);
        lastResult = await deleteManySizes(pageID);
        lastResult = await deleteManyStores(pageID);
        lastResult = await deleteManyToppings(pageID);

        lastResult = await unsubscribedApps(pageID, accessToken);
        lastResult = await removeUserActivePage(req.currentUser.userID);
        if (!lastResult) {
            console.error(`User ${userID} was not found and removeUserActivePage failed`);
        }
        lastResult = await Page.findOneAndDelete({ id: pageID }).exec();
        res.status(200).json(lastResult);
    } catch (pageDeleteErr) {
        console.info(lastResult);
        console.error(pageDeleteErr);
        res.status(500).json({ message: pageDeleteErr.message });
    }
}


// Update or create a new page
export const page_update = async (req, res) => {
    try {
        console.info("page_update: ", req.body.operation, req.body.id);
        const pageID = req.body.id;
        const operation = req.body.operation;
        let page = await Page.findOne({ id: pageID }).exec();

        if (page && operation === 'ACTIVATE') { // only deactivating the bot in the page
            await setFacebookFields(pageID, page.accessToken, page.greetingText);
            await subscribedApps(pageID, page.accessToken);
            page.activeBot = true;
            await page.save();
            res.status(200).json(page);
        }
        else if (page && operation === 'DEACTIVATE') { // only deactivating the bot in the page
            await deleteFacebookFields(pageID, page.accessToken);
            await unsubscribedApps(pageID, page.accessToken);
            page.activeBot = false;
            await page.save();
            res.status(200).json(page);
        } else {
            let isNew = false;
            if (!page) {
                page = new Page({
                    id: pageID,
                    name: req.body.name,
                    userID: req.currentUser.userID,
                    activeBot: false,
                });
                isNew = true;
            }
            if (req.body.access_token)
                page.accessToken = req.body.access_token;
            if (req.body.greetingText)
                page.greetingText = req.body.greetingText;
            if (req.body.firstResponseText)
                page.firstResponseText = req.body.firstResponseText;

            // update ActivePage for the current user
            if (req.currentUser) {
                page.userID = req.currentUser.userID;
                const user = await User.findOne({ userID: req.currentUser.userID }).exec();
                if (user) {
                    user.activePage = pageID;
                    await user.save();
                }
            }

            await page.save();

            // if (isNew) {
            page = await initialSetup(pageID);
            // }
            res.status(200).json(page);
        }
    } catch (pageUpdateError) {
        console.error({ pageUpdateError });
        res.status(500).json({ message: pageUpdateError.message });
    }
}

/**
 * Subscribe the app to the page
 * @param {*} pageId 
 * @param {*} accessToken 
 */
export const subscribedApps = async (pageId, accessToken) => {

    // https://graph.facebook.com/v3.1/{page-id}/subscribed_apps?access_token={}
    const facebookUrl = `https://graph.facebook.com/v3.1/${pageId}/subscribed_apps?access_token=${accessToken}`

    return await axios.post(facebookUrl);
}

/**
 * 
 * @param {*} pageId 
 * @param {*} accessToken 
 */
export const unsubscribedApps = async (pageId, accessToken) => {

    const facebookUrl = `https://graph.facebook.com/v3.1/${pageId}/subscribed_apps?access_token=${accessToken}`

    const result = await axios.get(facebookUrl);
    if (result.status === 200 && result.data && result.data.data && result.data.data.length > 0) {
        console.info('unsubscribedApps found app:', result);
        const result1 = await axios.delete(facebookUrl);
        console.info('unsubscribedApps deleted app:', result1);
        return result1;
    } else {
        return null;
    }
}


export const debugToken = async accessToken => {
    const facebookUrl = `https://graph.facebook.com/v3.1/debug_token?input_token=${accessToken}`
    return await axios.get(facebookUrl);
}


// used in botController.js
export const getOnePageToken = async (pageID) => {
    const page = await Page.findOne({ id: pageID }).exec();
    if (page && page.accessToken)
        return Promise.resolve({ accessToken: page.accessToken, name: page.name });
    else return Promise.reject();
}

/**
 * 
 * @param {*} pageID 
 * @return Page
 */
export const getOnePageData = async (pageID) => {
    return await Page.findOne({ id: pageID }).exec();
}


export const getAllPages = async () => {
    let pageArray = [];
    await Page.find({}, (err, result) => {
        pageArray = result.map(doc => { return { 'pageID': doc.id, 'accessToken': doc.accessToken, 'name': doc.name } });
    });
    console.log("into getAllPages: ", Object.keys(pageArray).length);
    return Promise.resolve(pageArray);
}

const setFacebookFields = async (pageId, accessToken, _greeting) => {
    const facebookUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${accessToken}`;
    return await axios.post(facebookUrl, {
        headers: { 'Content-Type': 'application/json' },
        get_started: { payload: 'GET_STARTED' },
        greeting: [
            { locale: 'default', text: _greeting },
            { locale: 'pt_BR', text: _greeting },
            { locale: 'en_US', text: _greeting },
        ],
        persistent_menu: [
            {
                locale: 'default',
                composer_input_disabled: false,
                call_to_actions: [
                    {
                        title: 'Cardápio',
                        type: 'postback',
                        payload: JSON.stringify({ data: 'CARDAPIO_PAYLOAD', event: 'MAIN-MENU' })
                    },
                    {
                        title: 'Horários',
                        type: 'postback',
                        payload: JSON.stringify({ data: 'HORARIO_PAYLOAD', event: 'MAIN-MENU' })
                    },
                    {
                        title: 'Fazer Pedido',
                        type: 'postback',
                        payload: JSON.stringify({ data: 'PEDIDO_PAYLOAD', event: 'MAIN-MENU' })
                    }
                ]
            }
        ]
    });
}

const deleteFacebookFields = async (pageId, accessToken) => {
    const facebookUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${accessToken}`;

    const result = await axios.get(facebookUrl, {
        headers: { 'Content-Type': 'application/json' },
        fields: ["get_started", "persistent_menu", "greeting"]
    });

    if (result.status === 200 && result.data && result.data.data && result.data.data.length > 0) {
        console.info('deleteFacebookFields found fields:', result);
        const result1 = await axios.delete(facebookUrl, {
            headers: { 'Content-Type': 'application/json' },
            params: {
                fields: ["get_started", "persistent_menu", "greeting"]
            }
        });
        console.info('deleteFacebookFields deleted fields:', result1);
        return result1;
    } else {
        console.info('deleteFacebookFields did not found fields:', result);
        return null;
    }
}

// export const page_update = async (req, res) => {

//     console.info("page_update");

//     const pageId = req.body.id;

//     const record = await Page.findOne({ id: pageId }).exec();
//     if (!record) {
//         record = new Page({
//             id: pageId,
//             name: req.body.name,
//             accessToken: req.body.access_token,
//             userID: req.currentUser.userID,
//         });
//         isNew = true;
//     }

//     // Find a page by id
//     await Page.findOne({ id: pageId }, async (err, doc) => {
//         if (err) { // err !== null
//             res.status(500).json({ message: err.errmsg });
//             return;
//         }
//         let record;
//         let isNew = false;

//         if (doc) {
//             record = doc;
//             if (req.body.greetingText)
//                 record.greetingText = req.body.greetingText;
//             if (req.body.firstResponseText)
//                 record.firstResponseText = req.body.firstResponseText;
//             if (req.body.access_token)
//                 record.accessToken = req.body.access_token;
//             record.userID = req.currentUser.userID;
//         } else {
//             record = new Page({
//                 id: pageId,
//                 name: req.body.name,
//                 accessToken: req.body.access_token,
//                 userID: req.currentUser.userID,
//             });
//             isNew = true;
//         }

//         await record.save();
//         const response = await subscribedApps(record.id, record.accessToken);

//         // await record.save((err, result) => {
//         //     if (err) {
//         //         res.status(500).json({ message: err.errmsg });
//         //     } else {
//         //         subscribedApps(result.id, result.accessToken)
//         //             .then(response => {
//         //                 res.status(200).json(result);
//         //             }).catch((err) => {
//         //                 var errorMessage;
//         //                 if (err.error) errorMessage = err.error;
//         //                 if (err.response.data)
//         //                     if (err.response.data.error)
//         //                         errorMessage = err.response.data.error.message;
//         //                 console.log(`subscribed_apps catch err: ${errorMessage}`);
//         //                 res.status(500).json({ message: errorMessage });
//         //             });

//         //     }
//     });

//     // update ActivePage for the current user
//     if (req.currentUser) {
//         await User.findOne({ userID: req.currentUser.userID }, (err, docFind) => {
//             if (err) {
//                 res.status(500).json({ message: err.errmsg });
//                 return;
//             }

//             if (docFind) {
//                 docFind.activePage = pageId;
//                 docFind.save((err, docSave) => {
//                     if (err) {
//                         res.status(500).json({ message: err.errmsg });
//                     }
//                 })
//             }
//         });
//     }

//     if (isNew) {
//         record = await initialSetup(pageId);
//         req.body.greetingText = record.greetingText
//     }

//     if (req.body.greetingText && record && record.accessToken) {
//         setFacebookFields(record.id, record.accessToken, req.body.greetingText).then(response => {
//             console.log('PagesController, response from set fields:', response.result);
//         }).catch(err => {
//             if (err.response && err.response.data && err.response.data.error)
//                 console.log(`PagesController, error from set fields: ${err.response.data.error.message}`);
//             else if (err.response)
//                 console.log(err.response);
//         });
//     }

//     const responseDebug = await debugToken(record.accessToken);
//     console.info('debugToken', responseDebug);
// });
// }



