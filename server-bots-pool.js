import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Promise from "bluebird";
import { populatePagesController } from "./app/api/bot/pagesController";
import botController from './app/api/bot/botController';

dotenv.config();

const POOL_PORT = process.env.POOL_PORT || 3000;
const webserver = express();

mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

let controllers = {};

populatePagesController(controllers, webserver);

webserver.use(bodyParser.json());
webserver.use(bodyParser.urlencoded({ extended: true }));

webserver.post('/facebook/receive', (req, res) => {
    // botController(req, res, controllers);
    const pageId = req.body.pageid;
    const bot = controllers[pageId].spawn({});
    controllers[pageId].handleWebhookPayload(req, res, bot);

    res.end();
});

webserver.listen(POOL_PORT, null, function () {
    console.log(`Listening at 127.0.0.1:${POOL_PORT} from ${process.pid}`);
});


// import express from 'express';
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import Botkit from "botkit";
// import dialogflow from 'botkit-middleware-dialogflow';
// import mongoose from "mongoose";
// import Promise from "bluebird";
// import { getAllPages } from "./app/api/bot/pages";

// dotenv.config();

// const DEBUG = process.env.DEBUG === 'false' ? false : true;
// const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
// const POOL_PORT = process.env.POOL_PORT || 3000;
// const webserver = express();

// mongoose.connect(
//     process.env.MONGODB_URL,
//     { useNewUrlParser: true }
// );
// mongoose.set('useCreateIndex', true);
// mongoose.Promise = Promise;

// const _pages = getAllPages();
// console.log(_pages.length);

// // const dialogflow = require('botkit-middleware-dialogflow')({
// //     keyFilename: process.env.dialogflow,  // service account private key file from Google Cloud Console
// // });
// dialogflow.keyFilename = process.env.dialogfloe;

// const pages = [
//     { // First page
//         pageID: '938611509676235', // Page ID here (Echobot)
//         pageToken: 'EAADzUvY8AyABAKzwuhxSvE2g4cHqqiZAOMbo7YSdf5mDikNOjZCNHvaEY8wNBLeCnoLzu4sGhRtk1JKBmZAFiC01XGQZBNZBbj5UOoB3ZAxyTKZBiIa7NV3NXHNsG2o3KVqQcaxZA90ZBZAOcjUsFUVSftytVtaZBODH1r2EBo8k1LsHPjxWmPmbsOI' // Page token here
//     },
//     { // Second page
//         pageID: '269303613154082', // Another page ID here (Koraline)
//         pageToken: 'EAADzUvY8AyABAAEWzgvLzxZBqiQqh1SHk0wNZAWVHGT8QExnIJG2wUBXnx8Kpeu6VEbaZCa4pnZBOwrXkEPs5jZAHdG6zZAZCC5ZBYrrP9cwAkg8RUCdiXOBRg2Qw9TWEpOWUZAkO4foCMyPZAPiQv0LF1jnpTcelLmCtw7KpkZC8ZAUmFbdEOdi8Gaf' // Another page token here
//     },
//     // more pages here...
// ];

// webserver.use(bodyParser.json());
// webserver.use(bodyParser.urlencoded({ extended: true }));

// let controllers = {};

// for (let i = 0; i < pages.length; i++) {

//     let fbPage = pages[i];
//     let pageToken = fbPage.pageToken;
//     let pageID = fbPage.pageID;

//     controllers[pageID] = Botkit.facebookbot({
//         debug: DEBUG,
//         verify_token: FB_VERIFY_TOKEN,
//         access_token: pageToken
//     });

//     webserver.post('/facebook/' + pageID + '/receive', function (req, res) {
//         let pid = req.url.split("/")[2],
//             bot = controllers[pid].spawn({});
//         controllers[pid].handleWebhookPayload(req, res, bot);
//         res.end();
//     });

//     controllers[pageID].middleware.receive.use(dialogflow.receive);
//     controllers[pageID].webserver = webserver;

//     controllers[pageID].hears(['hello'], 'message_received', function (bot, message) {
//         bot.reply(message, 'Hey there. I\'m ' + bot.identity.name);
//     });

//     controllers[pageID].hears(['Default-WelcomeIntent'], 'message_received,facebook_postback', dialogflow.hears, function (
//         bot,
//         message
//     ) {
//         const replyText = message.fulfillment.text;
//         bot.reply(message, replyText);
//     });

//     controllers[pageID].hears(['Default-WelcomeAgain'], 'message_received,facebook_postback', dialogflow.hears, function (
//         bot,
//         message
//     ) {
//         const replyText = message.fulfillment.text;
//         bot.reply(message, replyText);
//     });

//     controllers[pageID].hears(['Default-Horario'], 'message_received,facebook_postback', dialogflow.hears, function (
//         bot,
//         message
//     ) {
//         const replyText = message.fulfillment.text;
//         bot.reply(message, replyText);
//     });

//     controllers[pageID].hears(['Geral-Horario-aberto-agora'], 'message_received,facebook_postback', dialogflow.hears, function (
//         bot,
//         message
//     ) {
//         bot.reply(message, 'Sim, estamos abertos agora!');
//     });

// }

// webserver.listen(POOL_PORT, null, function () {
//     console.log(`Listening at 127.0.0.1:${POOL_PORT} from ${process.pid}`);
// });

