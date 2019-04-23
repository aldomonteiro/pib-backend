import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import Debug from 'debug';
import { Bot } from 'facebook-messenger-bot';
import { getOnePageToken } from './api/controllers/pagesController';
import {
    sendErrorMsg,
} from './api/bot/botController';

import {
    sendActions, mapEventsActions,
    checkTypedText,
} from './api/bot/actionsController';
import { getMktContact } from './api/controllers/mkt_contact_controller';
import { m_checkLastQuestion } from './api/bot/botMarkController';
import {
    w_sendMainMenu, waboxapp_sendMessage,
    w_controller,
} from './api/whatsapp/whatSimpleController';

dotenv.config();
const env = process.env.NODE_ENV || 'production';

const debug = Debug('server-bot');

// --- START MongoDB connection -----------------------------
let mongo_url = process.env.DEV_MONGODB_URL;
if (env === 'production')
    mongo_url = process.env.PRD_MONGODB_URL;


const RETRY_TIMEOUT = 3000

const options = {
    useNewUrlParser: true,
    autoReconnect: true,
    keepAlive: 30000,
    reconnectInterval: RETRY_TIMEOUT,
    reconnectTries: 10000,
}

let isConnectedBefore = false

const connect = () => {
    return mongoose.connect(mongo_url, options)
        .catch(err => console.error('Mongoose connect(...) failed with err: ', err))
}

connect();

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;

mongoose.connection.on('error', () => {
    console.error('Could not connect to MongoDB')
});

mongoose.connection.on('disconnected', () => {
    console.error('Lost MongoDB connection...')
    if (!isConnectedBefore) {
        setTimeout(() => connect(), RETRY_TIMEOUT)
    }
});

mongoose.connection.on('connected', () => {
    isConnectedBefore = true
    console.info('Connection established to MongoDB')
});

mongoose.connection.on('reconnected', () => {
    console.info('Reconnected to MongoDB')
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
    mongoose.connection.close(function () {
        console.warn('Force to close the MongoDB connection after SIGINT')
        process.exit(0)
    })
});
// --- END MongoDB connection -----------------------------


global.pagesKeyID = {};
global.pagesMarketing = {};

const app = express();

const bot = new Bot(process.env.FB_VERIFY_TOKEN, true);

// Beggining - That is all to log in the local timezone
// eslint-disable-next-line max-len
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan
logger.token('date', (req, res, tz) => {
    return moment().tz(tz).format();
})
// eslint-disable-next-line max-len
logger.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use(logger('myformat'));
// End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
        'Authorization,Origin,X-Requested-With,Content-Type,Accept,application/json,Content-Range');
    res.header('Access-Control-Expose-Headers', 'Content-Range');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


app.use('/buckets/facebook', async (req, res, next) => {
    let doNext = true;
    if (req.body && req.body.object === 'page') {
        if (req.body.entry.length > 0) {
            try {
                // Iterates over each entry - there may be multiple if batched
                // for (let i = 0; i < req.body.entry.length; i++) {
                let pageID = req.body.entry[0].id;
                if (global.pagesKeyID[pageID] && global.pagesKeyID[pageID] !== '') {
                    req.token = global.pagesKeyID[pageID];
                    req.marketing = global.pagesMarketing[pageID];
                } else {
                    let timerIdentifier = 'getOnePageToken' + Math.random();
                    console.time(timerIdentifier);
                    const { accessToken, name, marketing } = await getOnePageToken(pageID);
                    console.timeEnd(timerIdentifier);

                    req.token = accessToken;
                    req.marketing = marketing;
                    debug('server-bot use buckets req.marketing:', req.marketing);
                    console.info(`\x1b[45m /buckets/facebook \x1b[0m, pageID:\x1b[32m${pageID}\x1b[0m, page name:\x1b[32m${name}\x1b[0m, req.mkt:\x1b[32m${req.marketing}\x1b[0m`);

                    global.pagesKeyID[pageID] = accessToken;
                    global.pagesMarketing[pageID] = marketing;
                }

                // const _time = req.body.entry[0].time;
                // const messageTime = new Date(_time).toLocaleTimeString('pt-BR');
                // eslint-disable-next-line max-len
                // console.info(`${messageTime} From ${pageID} memory tokens:${Object.keys(global.pagesKeyID).length}`);

            } catch (expressAppUseGetTokenError) {
                console.error({ expressAppUseGetTokenError });
            }
        }
    } else {
        console.log('Something came, not a page...');
    }
    if (doNext)
        next();
});

app.use('/buckets/whatsapp', async (req, res, next) => {
    if (req.body) {
        // ---------> Waboxapp <----------
        if (req.body.event === 'message') {
            try {
                const message = req.body;
                console.info('##### WHATSAPP req.body #####');
                console.info(message);
                console.info('#############################');

                const sender = message.contact.uid;
                if (message.message.type === 'chat' && message.message.dir === 'i') {
                    const text = await w_sendMainMenu();
                    const response = await waboxapp_sendMessage(sender, text);

                    console.info('##### WHATSAPP response #####');
                    console.info(response);
                    console.info('#############################');
                }

            } catch (err) {
                console.error({ err });
            }
        } else {
            // ---------> Receiving data from Whatsapp Web <----------
            const { args } = req.body;

            if (args) {
                const replyData = await w_controller(args);
                if (replyData)
                    res.json({ message: replyData });
            }
        }
    } else {
        console.info('***** No Body?? ****');
        console.info(req);
    }
});


app.use('/buckets/facebook', bot.router());
app.listen(process.env.FB_WEBHOOK_PORT, () => console.log(`Bot server listening on port ${process.env.FB_WEBHOOK_PORT}`));

/**
 * Event triggered when the button "GET_STARTED" is pressed.
 */
bot.on('GET_STARTED', async (message) => {
    const { sender, recipient } = message;
    console.info(`\x1b[43mGET_STARTED\x1b[0m, event:\x1b[32m${message.event}\x1b[0m, sender.id:\x1b[32m${sender.id}\x1b[0m, recipient.id:\x1b[32m${recipient.id}\x1b[0m, bot.mkt:\x1b[32m${bot.marketing}\x1b[0m`);

    try {
        await sendActions({ action: 'SEND_WELCOME', bot, sender, pageID: recipient.id, last_answer: message.event });
        if (bot.marketing) {
            await sendActions({ action: 'PIZZAIBOT_MARKETING', bot, sender, pageID: recipient.id, data: 'GET_STARTED' });
        } else {
            // Send Main Menu
            await sendActions({ action: 'SEND_MAIN_MENU', bot, sender, pageID: recipient.id, last_answer: message.event });
        }
    } catch (error) {
        console.error('GET_STARTED error:', error.message);
        const outError = await sendErrorMsg(error.message);
        await bot.stopTyping(sender.id);
        await bot.send(sender.id, outError);
    }
});

// all postbacks are emitted via 'postback'
bot.on('postback', async (event, message, data) => {
    const { sender, recipient } = message;
    console.info(`\x1b[43mPostback\x1b[0m, event:\x1b[32m${event}\x1b[0m, data:\x1b[32m${data}\x1b[0m, sender.id:\x1b[32m${sender.id}\x1b[0m, recipient.id:\x1b[32m${recipient.id}\x1b[0m, bot.mkt:\x1b[32m${bot.marketing}\x1b[0m`);

    if (event === 'PIZZAIBOT_MARKETING') {
        if (data === 'testtypecustomer_begin') {
            await sendActions({ action: 'SEND_MAIN_MENU', bot, sender, pageID: recipient.id, last_answer: message.event });
        } else {
            await sendActions({ action: 'PIZZAIBOT_MARKETING', bot, sender, pageID: recipient.id, data });
        }
    } else {
        await mapEventsActions({ event, data, bot, sender, pageID: recipient.id })
    }
});

/**
 * Question No.02 (location)
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */
bot.on('message', async (message) => {
    const { sender, recipient, location, text } = message;
    console.info(`\x1b[43m on message \x1b[0m, sender.id:\x1b[32m${sender.id}\x1b[0m, recipient.id:\x1b[32m${recipient.id}\x1b[0m, message.text:\x1b[32m${text && text.substr(0, 15)}\x1b[0m, bot.mkt:\x1b[32m${bot.marketing}\x1b[0m`);

    try {
        if (location) {
            await sendActions({ action: 'LOCATION_CONFIRM_ADDRESS', bot, sender, pageID: recipient.id, location });
        } else if (text === 'hello' || text === 'hi') {
            await sendActions({ action: 'BASIC_REPLY', bot, sender, pageID: recipient.id, data: 'Hello, how are you doing? Currently, I am working only in Portuguese, but, soon enough, your favorite restaurant will be with me.' });
        } else {
            let _orderFlow = true;
            if (bot.marketing) {
                _orderFlow = false; // if it is an action from the marketing, so, this assures the order flow isn't called.
                const mktContact = await getMktContact({ pageID: recipient.id, userID: sender.id });

                if (mktContact.last_answer === 'testtype_customer') {
                    _orderFlow = true; // this assures the order flow will continue and marketing won't be called.
                } else {
                    let _data = 'open_question';
                    let eAgradecimento = false;

                    if (mktContact.final === true) {
                        const agradecimentosFinais = ['obrigad', 'brigadu', 'thanks', 'tks', 'valeu', 'muito obrigado', 'show', 'muito bom', 'legal', 'ok'];
                        for (let i = 0; i < agradecimentosFinais.length; i++) {
                            if (text.includes(agradecimentosFinais[i])) {
                                eAgradecimento = true;
                                break;
                            }
                        }
                        if (!eAgradecimento)
                            _data = 'returned_customer';
                    } else if (mktContact.last_answer === 'finalquestion_mail')
                        _data = 'contact_mail';
                    else if (mktContact.last_answer === 'finalquestion_phone')
                        _data = 'contact_phone';
                    else if (mktContact.last_answer === 'type_phone' || mktContact.last_answer === 'retype_phone')
                        _data = 'contact_phone';
                    else if (mktContact.last_answer === 'orderConfirmation_question')
                        _data = 'open_question';
                    else _data = await m_checkLastQuestion(recipient.id, sender.id);

                    if (!eAgradecimento)
                        await sendActions({ action: 'PIZZAIBOT_MARKETING', bot, sender, pageID: message.recipient.id, data: _data, text });
                }
            }
            // only when it is from the order flow, not from the marketing.
            if (_orderFlow) {
                await checkTypedText({ bot, sender, pageID: recipient.id, text });
            }
        }
    } catch (onMessageError) {
        console.error({ onMessageError });
        const outError = await sendErrorMsg(onMessageError.message);
        await bot.stopTyping(sender.id);
        await bot.send(sender.id, outError);
    }
});

/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 * Dealing with marketing.
 */
bot.on('quick-reply', async (message, quick_reply) => {

    const { sender, recipient } = message;
    const { payload } = quick_reply;

    console.info(`\x1b[43m quick-reply \x1b[0m, sender.id:\x1b[32m${sender.id}\x1b[0m, recipient.id:\x1b[32m${recipient.id}\x1b[0m, payload:\x1b[32m${payload}\x1b[0m, bot.mkt:\x1b[32m${bot.marketing}\x1b[0m`);


    try {
        if (payload) {
            /**
       * Both marketing and Order flow use this quick_reply answer, so, I am
       * checking if marketing is in a state where an test order has been placed and, if so,
       * I redirect the flow to the order.
       */
            let _orderFlow = true;

            if (bot.marketing) {
                _orderFlow = false; // if it is an action from the marketing, so, this assures the order flow isn't called.

                const mktContact = await getMktContact({ pageID: recipient.id, userID: sender.id });

                if (mktContact.last_answer === 'testtype_customer') {
                    _orderFlow = true; // this assures the order flow will continue and marketing won't be called.
                } else {
                    await sendActions({ action: 'PIZZAIBOT_MARKETING', bot, sender, pageID: recipient.id, payload: payload, data: 'contact_phone' });
                }
            }
            // only when it is from the order flow, not from the marketing.
            if (_orderFlow) {
                await sendActions({ action: 'SHOW_PHONE', bot, sender, pageID: recipient.id, payload: payload });
                await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID: recipient.id });
            }
        }
    } catch (quickReplyError) {
        console.error({ quickReplyError });
        const outError = await sendErrorMsg(quickReplyError.message);
        await bot.stopTyping(sender.id);
        await bot.send(sender.id, outError);
    }
});

bot.on('read', async (message) => {
    // const { sender, recipient } = message;
    // console.info(`\x1b[43m read \x1b[0m, sender.id:\x1b[32m${sender.id}\x1b[0m, recipient.id:\x1b[32m${recipient.id}\x1b[0m bot.mkt:\x1b[32m${bot.marketing}\x1b[0m`);
});

bot.on('delivery', async (message) => {
    // const { sender, recipient } = message;
    // console.info(`\x1b[43m delivery \x1b[0m, sender.id:\x1b[32m${sender.id}\x1b[0m, recipient.id:\x1b[32m${recipient.id}\x1b[0m bot.mkt:\x1b[32m${bot.marketing}\x1b[0m`);
});
