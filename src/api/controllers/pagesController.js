
import Page from "../models/pages";
import User from "../models/users";
import axios from 'axios';
import util from 'util';
import { configSortQuery, configRangeQuery } from '../util/util';
import { initialSetup } from "./systemController";

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
    }

    Page.paginate(query, options, async (err, result) => {
        if (err) {
            res.status(500).json({ message: err.errmsg });
        } else {
            res.setHeader('Content-Range', util.format("pages %d-%d/%d", rangeObj['offset'], rangeObj['limit'], result.total));
            res.status(200).json(result.docs);
        }
    });
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

// DELETE
export const page_resources_delete = (req, res) => {
    Page.findOneAndRemove({ id: req.params.id })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ message: err.errmsg });
        });
};


// Update or create a new page
export const page_update = async (req, res) => {
    try {
        console.info("page_update");
        const pageId = req.body.id;
        let isNew = false;
        let page = await Page.findOne({ id: pageId }).exec();
        if (!page) {
            page = new Page({
                id: pageId,
                name: req.body.name,
                userID: req.currentUser.userID,
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
                user.activePage = pageId;
                await user.save();
            }
        }

        await page.save();

        const response = await subscribedApps(page.id, page.accessToken);

        if (isNew) {
            page = await initialSetup(pageId);
            req.body.greetingText = page.greetingText
        }

        if (page && page.greetingText && page.accessToken) {
            const response2 = await setFacebookFields(page.id, page.accessToken, page.greetingText);
        }
        res.status(200).json(page);
    } catch (pageUpdateError) {
        console.error({ pageUpdateError });
        res.status(500).json({ message: pageUpdateError.message });
    }
}

export const subscribedApps = async (pageId, accessToken) => {

    // https://graph.facebook.com/v3.1/{page-id}/subscribed_apps?access_token={}
    const facebookUrl = `https://graph.facebook.com/v3.1/${pageId}/subscribed_apps?access_token=${accessToken}`

    return await axios.post(facebookUrl);
}

export const debugToken = async accessToken => {
    const facebookUrl = `https://graph.facebook.com/v3.1/debug_token?input_token=${accessToken}`
    return await axios.get(facebookUrl);
}


// used in botController.js
export const getOnePageToken = async (pageID) => {
    const page = await Page.findOne({ id: pageID }).exec();
    if (page && page.accessToken)
        return Promise.resolve(page.accessToken);
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



