import Page from "../models/pages";
// import Botkit from 'botkit';
// import dialogflow from 'botkit-middleware-dialogflow';


export const getAllPages = async () => {
    let pageArray = {};
    await Page.find({}, (err, result) => {
        pageArray = result.map(doc => { return { 'pageID': doc.id, 'accessToken': doc.accessToken } });
    });
    return pageArray;
}

export const populatePagesController = async (controllers, webserver) => {

    const dialogflow = require('botkit-middleware-dialogflow')({
        keyFilename: process.env.dialogflow,  // service account private key file from Google Cloud Console
    });
    const DEBUG = process.env.DEBUG === 'false' ? false : true;
    const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
    const FB_APP_SECRET = process.env.FACEBOOK_SECRET_KEY

    getAllPages().then((pages) => {
        for (let i = 0; i < pages.length; i++) {
            let fbPage = pages[i];
            let pageToken = fbPage.accessToken;
            let pageID = fbPage.pageID;

            const Botkit = require('botkit');
            controllers[pageID] = Botkit.facebookbot({
                debug: DEBUG,
                access_token: pageToken,
                verify_token: FB_VERIFY_TOKEN,
            });

            controllers[pageID].middleware.receive.use(dialogflow.receive);
            controllers[pageID].webserver = webserver;

            controllers[pageID].hears(['hello'], 'message_received', function (bot, message) {
                console.log("I am hearing..");
                bot.reply(message, 'Hey there. I\'m ' + bot.identity.name);
            });

            controllers[pageID].hears(['Default-WelcomeIntent'], 'message_received,facebook_postback', dialogflow.hears, function (
                bot,
                message
            ) {
                const replyText = message.fulfillment.text;
                bot.reply(message, replyText);
            });

            controllers[pageID].hears(['Default-WelcomeAgain'], 'message_received,facebook_postback', dialogflow.hears, function (
                bot,
                message
            ) {
                const replyText = message.fulfillment.text;
                bot.reply(message, replyText);
            });

            controllers[pageID].hears(['Default-Horario'], 'message_received,facebook_postback', dialogflow.hears, function (
                bot,
                message
            ) {
                const replyText = message.fulfillment.text;
                bot.reply(message, replyText);
            });

            controllers[pageID].hears(['Geral-Horario-aberto-agora'], 'message_received,facebook_postback', dialogflow.hears, function (
                bot,
                message
            ) {
                bot.reply(message, 'Sim, estamos abertos agora!');
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}
