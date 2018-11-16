import "@babel/polyfill";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { Bot, Elements, Buttons, QuickReplies } from 'facebook-messenger-bot';
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
  confirmTypedAddress,
  sendHorario,
  basicReply,
  askForChangeOrder,
  askForOptionsToChange,
  askForFlavorOrConfirm,
  askForSpecificItem,
  updateItemAskOptions,
  showOrderOrAskForPhone
} from './api/bot/botController';

const
  ORDER_STATE_QUANTITY = 1,
  ORDER_STATE_SIZE = 2,
  ORDER_STATE_FLAVOR = 3;

dotenv.config();

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

global.pagesKeyID = new Array();

const app = express();

const bot = new Bot(process.env.FB_VERIFY_TOKEN, true);

getAllPages().then(async (pageArray) => {
  for (let i = 0; i < pageArray.length; i++) {
    const page = pageArray[i];
    const fields = ['greeting', 'get_started', 'persistent_menu'];
    bot._token = page.accessToken;
    const response = await bot.getFields(fields);
    global.pagesKeyID[page.pageID] = page.accessToken;

    console.info(`GET fields for ${page.pageID}-${page.name}:`)
    console.info(response);
  }
});


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
  if (req.body && req.body.object === 'page') {
    if (req.body.entry.length > 0) {
      try {
        // Iterates over each entry - there may be multiple if batched
        // for (let i = 0; i < req.body.entry.length; i++) {
        let pageID = req.body.entry[0].id;

        console.info(`Message from ${pageID}`);

        if (global.pagesKeyID[pageID] && global.pagesKeyID[pageID] !== '') {
          req.token = global.pagesKeyID[pageID];
        }
        else {
          const _accessToken = await getOnePageToken(pageID);
          req.token = _accessToken;
          global.pagesKeyID[pageID] = _accessToken;
          console.info(`Got token from ${pageID}`);
        }
      } catch (expressAppUseGetTokenError) {
        console.error({ expressAppUseGetTokenError });
      }
    }
  }
  else {
    console.log('Something came, not a page...');
  }
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
    await bot.startTyping(sender.id);
    const out1 = await sendWelcomeMessage(sender, message.recipient.id)
    await Bot.wait(1000);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out1);

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
    await bot.startTyping(sender.id);
    if (data === 'CARDAPIO_PAYLOAD') {
      const out = await sendCardapio(message.recipient.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);

    } else if (data === 'PEDIDO_PAYLOAD') {
      // Show saved address or ask for location
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const user = await bot.fetchUser(sender.id);
      const answer = await confirmAddressOrAskLocation(recipient.id, sender.id, user);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    } else if (data === 'HORARIO_PAYLOAD') {
      const out = await sendHorario(message.recipient.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (error) {
    console.error('MAIN_MENU error:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});


/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */
bot.on('message', async (message) => {
  try {
    console.info({ message });

    const { sender, recipient, location } = message;

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
      const answer = await confirmTypedAddress(recipient.id, sender.id, message);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    }
  } catch (error) {
    console.error('on message error:', error.message);
    const outError = await sendErrorMsg(error.message);
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
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const answer = await showPhone(recipient.id, sender.id, payload);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);

      // next question
      const out = await askForQuantity(recipient.id, sender.id);
      await Bot.wait(1000);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (error) {
    console.error('quick-reply error:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('CORRECT_SAVED_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;
  try {
    // show what the user chose
    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const answer = await showAddress(recipient.id, sender.id, data);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, answer);

    // next question
    const out = await askForPhone();
    await Bot.wait(1000);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
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
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const answer = await askToTypeAddress(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    }
    else {
      // show what the user chose
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const answer = await showAddress(recipient.id, sender.id, data);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);

      // next question
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await showOrderOrAskForPhone(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
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
    const out = await askForLocation();
    await Bot.wait(1000);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  } catch (error) {
    console.error('WRONG_SAVED_ADDRESS:', error.message);
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
    await Bot.wait(2000);
    const answer = await showSize(recipient.id, sender.id, data);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, answer);

    // next question
    await bot.startTyping(sender.id);
    await Bot.wait(2000);
    const out = await askForFlavorOrConfirm(message.recipient.id, sender.id, 1);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  } catch (error) {
    console.error('ORDER_SIZE:', error.message);
    const outError = await sendErrorMsg(error.message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, outError);
  }
});

/**
 * answered ORDER_FLAVOR
 * gonna ask for confirmation
 */
bot.on('ORDER_FLAVOR', async (message, data) => {
  const { sender, recipient } = message;
  try {
    if (data && data.option && data.option === 'flavors_more') {
      // next question
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await askForFlavor(message.recipient.id, sender.id, data.multiple);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
    else {
      // show what the user chose
      await bot.startTyping(sender.id);
      await Bot.wait(2000);
      const answer = await showFlavor(recipient.id, sender.id, data);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);


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
 * answered ORDER_CONFIRMATION
 */
bot.on('ORDER_CONFIRMATION', async (message, data) => {
  const { sender, recipient } = message;

  try {
    if (data === 'confirmation_yes') {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await confirmOrder(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
    else if (data === 'confirmation_no') {
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const out = await askForChangeOrder(recipient.id, sender.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);
    }
  } catch (error) {
    console.error('ORDER_CONFIRMATION:', error.message);
    const outError = await sendErrorMsg(error.message);
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
    await Bot.wait(1000);
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


