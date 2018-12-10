import "@babel/polyfill";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { Bot } from 'facebook-messenger-bot';
import { getOnePageToken, getAllPages, getOnePageData } from './api/controllers/pagesController';
import { getPricingSizing } from './api/controllers/pricingsController';
import getCardapio from './api/bot/show_cardapio';
import { choices_sizes } from './api/util/util';
import {
  sendWelcomeMessage,
  sendErrorMsg,
  sendMainMenu,
  sendCardapio,
  askForPhone,
  showPhone,
  askToTypePhone,
  askForQuantity,
  askForQuantityMore,
  showQuantity,
  askForSize,
  showSize,
  askForFlavor,
  showFlavor,
  showOrderOrNextItem,
  askForLocation,
  confirmAddressOrAskLocation,
  confirmLocationAddress,
  showAddress,
  confirmOrder,
  askToTypeAddress,
  confirmTypedText,
  sendHorario,
  basicReply,
  askForChangeOrder,
  askForSplitFlavorOrConfirm,
  askForFlavorOrConfirm,
  askForSpecificItem,
  updateItemAskOptions,
  showOrderOrAskForPhone,
  showSplit
} from './api/bot/botController';

import { sendActions } from './api/bot/actionsController';

dotenv.config();

// mongoose.connect(
//   process.env.MONGODB_URL,
//   { useNewUrlParser: true }
// );

const RETRY_TIMEOUT = 3000

const options = {
  useNewUrlParser: true,
  autoReconnect: true,
  keepAlive: 30000,
  reconnectInterval: RETRY_TIMEOUT,
  reconnectTries: 10000
}

let isConnectedBefore = false

const connect = () => {
  return mongoose.connect(process.env.MONGODB_URL, options)
    .catch(err => console.error('Mongoose connect(...) failed with err: ', err))
}

connect();

mongoose.set('useCreateIndex', true);
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

global.pagesKeyID = new Object();

const app = express();

const bot = new Bot(process.env.FB_VERIFY_TOKEN, true);

// getAllPages().then(async (pageArray) => {
//   for (let i = 0; i < pageArray.length; i++) {
//     const page = pageArray[i];
//     const fields = ['greeting', 'get_started', 'persistent_menu'];
//     bot._token = page.accessToken;
//     const response = await bot.getFields(fields);
//     global.pagesKeyID[page.pageID] = page.accessToken;

//     console.info(`GET fields for ${page.pageID}-${page.name}:`)
//     console.info(response);
//   }
// });


// Beggining - That is all to log in the local timezone
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan
logger.token('date', (req, res, tz) => {
  return moment().tz(tz).format();
})
logger.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use(logger("myformat"));
// End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
        }
        else {
          let timerIdentifier = "getOnePageToken" + Math.random();
          console.time(timerIdentifier);
          const { accessToken, name } = await getOnePageToken(pageID);
          req.token = accessToken;
          console.timeEnd(timerIdentifier);
          global.pagesKeyID[pageID] = accessToken;
        }

        // const _time = req.body.entry[0].time;
        // const messageTime = new Date(_time).toLocaleTimeString('pt-BR');
        // console.info(`${messageTime} From ${pageID} memory tokens:${Object.keys(global.pagesKeyID).length}`);

      } catch (expressAppUseGetTokenError) {
        console.error({ expressAppUseGetTokenError });
      }
    }
  }
  else {
    console.log('Something came, not a page...');
  }
  if (doNext)
    next();
});

app.use('/buckets/facebook', bot.router());
app.listen(process.env.FB_WEBHOOK_PORT, () => console.log(`Bot server listening on port ${process.env.FB_WEBHOOK_PORT}`));

/**
 * Event triggered when the button "GET_STARTED" is pressed.
 */
bot.on('GET_STARTED', async (message) => {
  const { sender } = message;
  try {
    // Send Welcome Message
    // await bot.startTyping(sender.id);
    // const out1 = await sendWelcomeMessage(sender, message.recipient.id)
    // await Bot.wait(1000);
    // await bot.stopTyping(sender.id);
    // await bot.send(sender.id, out1);

    await sendActions({ action: 'SEND_WELCOME', bot, sender, pageID: message.recipient.id });

    // Send Main Menu
    await bot.startTyping(sender.id);
    const out2 = await sendMainMenu();
    await Bot.wait(1000);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out2);

  } catch (error) {
    console.error('GET_STARTED error:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

// all postbacks are emitted via 'postback'
bot.on('postback', async (event, message, data) => {
  console.info(`postback from ${data}, you need to take care of this thing!`);
  console.info(message);
});

// all postbacks are emitted via 'postback'
bot.on('MAIN-MENU', async (message, data) => {
  const { sender, recipient } = message;
  try {
    if (data === 'CARDAPIO_PAYLOAD') {
      // const out = await sendCardapio(message.recipient.id);
      // await bot.stopTyping(sender.id);
      // await bot.send(sender.id, out);
      await sendActions({ action: 'SEND_CARDAPIO', bot, sender, pageID: message.recipient.id });

    } else if (data === 'PEDIDO_PAYLOAD') {
      // Show saved address or ask for location
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const user = await bot.fetchUser(sender.id);
      const answer = await confirmAddressOrAskLocation(recipient.id, sender.id, user);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    } else if (data === 'HORARIO_PAYLOAD') {
      await bot.startTyping(sender.id);
      const out = await sendHorario(message.recipient.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (mainMenuError) {
    console.error({ mainMenuError });
    const outError = await sendErrorMsg(mainMenuError.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});


/**
 * Question No.02 (location)
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */
bot.on('message', async (message) => {
  const { sender, recipient, location } = message;

  try {
    if (location) {
      console.info({ location });

      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const user = await bot.fetchUser(sender.id);
      const answer = await confirmLocationAddress(recipient.id, sender.id, location, user);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    }
    else if (message.text === 'hello' || message.text === 'hi') {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const answer = await basicReply();
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    }
    else {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const answer = await confirmTypedText(recipient.id, sender.id, message);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
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
 */
bot.on('quick-reply', async (message, quick_reply) => {

  const { sender, recipient } = message;
  const { payload } = quick_reply;
  try {
    if (payload) {
      await sendActions({ action: 'SHOW_PHONE', bot, sender, pageID: recipient.id, payload: payload });

      await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID: recipient.id });
    }
  } catch (quickReplyError) {
    console.error({ quickReplyError });
    const outError = await sendErrorMsg(quickReplyError.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * Answer No.01
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('CORRECT_SAVED_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;
  try {
    await sendActions({ action: 'SHOW_ADDRESS', bot, sender, pageID: recipient.id, data: data });

    await sendActions({ action: 'ASK_FOR_PHONE', bot, sender, pageID: recipient.id });

  } catch (error) {
    console.error('CORRECT_SAVED_ADDRESS:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }

});

/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('LOCATION_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;

  try {
    if (data === 'incorrect_address') {
      await sendActions({ action: 'ASK_TO_TYPE_ADDRESS', bot, sender, pageID: recipient.id });
    }
    else {
      await sendActions({ action: 'SHOW_ADDRESS', bot, sender, pageID: recipient.id, data: data });

      await sendActions({ action: 'SHOW_ORDER_OR_ASK_FOR_PHONE', bot, sender, pageID: recipient.id });
    }
  } catch (error) {
    console.error('LOCATION_ADDRESS:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});


/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('WRONG_SAVED_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;
  try {

    await sendActions({ action: 'ASK_FOR_LOCATION', bot, sender, pageID: recipient.id });

  } catch (error) {
    console.error('WRONG_SAVED_ADDRESS:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

bot.on('PHONE_CONFIRMED', async (message, data) => {
  const { sender, recipient } = message;
  try {
    if (data === 'change_phone') {
      await sendActions({ action: 'ASK_TO_TYPE_PHONE', bot, sender, pageID: recipient.id });
    }
    else {
      await sendActions({ action: 'SHOW_PHONE', bot, sender, pageID: recipient.id, data: data });

      await sendActions({ action: 'ASK_FOR_QUANTITY', bot, sender, pageID: recipient.id });
    }
  } catch (error) {
    console.error('PHONE_CONFIRMED:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }

});


/**
 * answered ORDER_QTY
 * gonna ask for SIZE
 */
bot.on('ORDER_QTY', async (message, data) => {
  const { sender, recipient } = message;
  try {
    if (data && data === 'qty_more') {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await askForQuantityMore();
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
    else {
      // show what the user chose
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const answer = await showQuantity(recipient.id, sender.id, data);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
      // next question
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await askForSize(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (error) {
    console.error('ORDER_QTY:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */
bot.on('ORDER_SIZE', async (message, data) => {
  const { sender, recipient } = message;

  try {
    // show what the user chose
    await bot.startTyping(sender.id);
    await Bot.wait(900);
    const answer = await showSize(recipient.id, sender.id, data);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, answer);

    // check if the size is splitable.
    await bot.startTyping(sender.id);
    await Bot.wait(900);
    const out = await askForSplitFlavorOrConfirm(message.recipient.id, sender.id, 1);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);

  } catch (error) {
    console.error('ORDER_SIZE:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});


bot.on('ORDER_SPLIT', async (message, data) => {
  const { sender, recipient } = message;

  await bot.startTyping(sender.id);
  await Bot.wait(900);
  const answer = await showSplit(recipient.id, sender.id, data);
  await bot.stopTyping(sender.id);
  await bot.send(sender.id, answer);

  const split = Number(data);

  // next question
  await bot.startTyping(sender.id);
  await Bot.wait(250);
  const out = await askForFlavorOrConfirm(message.recipient.id, sender.id, 1, split);
  await bot.stopTyping(sender.id);
  await bot.send(sender.id, out);
});

/**
 * answered ORDER_FLAVOR
 * gonna ask for confirmation
 */
bot.on('ORDER_FLAVOR', async (message, data) => {
  const { sender, recipient } = message;
  try {
    if (data && data.option && data.option === 'flavors_more') {
      await sendActions({ action: 'ASK_FOR_FLAVOR', bot, sender, pageID: recipient.id, multiple: data.multiple })
    }
    else {
      await sendActions({ action: 'SHOW_FLAVOR', bot, sender, pageID: recipient.id, data })

      // show summary
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const summary = await showOrderOrNextItem(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, summary);
    }
  } catch (error) {
    console.error('ORDER_FLAVOR:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */
bot.on('ORDER_CONFIRM_BEVERAGE', async (message, data) => {
  const { sender, recipient } = message;

  try {
    if (data === 'beverage_yes')
      await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID: recipient.id, multiple: 1 })
    else {
      await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID: recipient.id })
      await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID: recipient.id })
    }

  } catch (orderConfirmBeverageErr) {
    console.error({ orderConfirmBeverageErr });
    const outError = await sendErrorMsg(orderConfirmBeverageErr.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * answered ORDER_BEVERAGE
 * gonna ask for confirmation
 */
bot.on('ORDER_BEVERAGE', async (message, data) => {
  const { sender, recipient } = message;
  try {
    if (data && data.option && data.option === 'beverages_more') {
      // more beverages
      await sendActions({ action: 'ASK_FOR_BEVERAGE_OPTIONS', bot, sender, pageID: recipient.id, multiple: data.multiple })
    }
    else if (data && data.option && data.option === 'beverages_cancel') {
      await sendActions({ action: 'SHOW_NO_BEVERAGE', bot, sender, pageID: recipient.id })
      await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID: recipient.id })
    }
    else {
      await sendActions({ action: 'SHOW_BEVERAGE', bot, sender, pageID: recipient.id, data: data })

      await sendActions({ action: 'SHOW_FULL_ORDER', bot, sender, pageID: recipient.id })
    }
  } catch (orderBeverageErr) {
    console.error({ orderBeverageErr });
    const outError = await sendErrorMsg(orderBeverageErr.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * answered ORDER_CONFIRMATION
 */
bot.on('ORDER_PIZZA_CONFIRMATION', async (message, data) => {
  const { sender, recipient } = message;

  try {
    if (data === 'confirmation_yes') {
      await sendActions({ action: 'ASK_FOR_WANT_BEVERAGE', bot, sender, pageID: recipient.id });
    }
    else if (data === 'confirmation_no') {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await askForChangeOrder(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (orderConfirmationError) {
    console.error({ orderConfirmationError });
    const outError = await sendErrorMsg(orderConfirmationError.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }

});


/**
 * answered ORDER_CONFIRMATION
 */
bot.on('ORDER_CONFIRMATION', async (message, data) => {
  const { sender, recipient } = message;

  try {
    if (data === 'confirmation_yes') {
      await sendActions({ action: 'CONFIRM_ORDER', bot, sender, pageID: recipient.id });
    }
    else if (data === 'confirmation_no') {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await askForChangeOrder(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (orderConfirmationErr) {
    console.error({ orderConfirmationErr });
    const outError = await sendErrorMsg(orderConfirmationErr.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }

});

/**
 * answered wants change something in the order
 */
bot.on('ORDER_WANT_CHANGE', async (message, data) => {
  const { sender, recipient } = message;

  try {
    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const out = await askForSpecificItem(recipient.id, sender.id);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  } catch (error) {
    console.error('ORDER_WANT_CHANGE:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }

});

bot.on('ORDER_CHANGE', async (message, data) => {
  const { sender, recipient } = message;

  try {
    await bot.startTyping(sender.id);
    await Bot.wait(500);
    let out;
    if (data === 'change_quantity') {
      out = await askForQuantity(recipient.id, sender.id);
    }
    else if (data === 'change_size') {
      out = await askForSize(recipient.id, sender.id);
    }
    else if (data === 'change_flavor') {
      out = await askForFlavor(message.recipient.id, sender.id, 1);
    }
    else if (data === 'change_address') {
      out = await askForLocation();
    }
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  } catch (error) {
    console.error('ORDER_CHANGE:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

bot.on('ORDER_CHANGE_SELECT_ITEM', async (message, data) => {
  const { sender, recipient } = message;
  try {
    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const out = await updateItemAskOptions(recipient.id, sender.id, data);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  } catch (error) {
    console.error('ORDER_CHANGE_SELECT_ITEM:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});


