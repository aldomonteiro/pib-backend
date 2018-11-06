import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { Bot, Elements, Buttons, QuickReplies } from 'facebook-messenger-bot';
import { getOnePage, getAllPages, getOnePageData } from './api/controllers/pagesController';
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
  confirmTypedAddress
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

const app = express();

const bot = new Bot('verify_my_bot', true);
getAllPages().then(async (pageArray) => {
  for (let i = 0; i < pageArray.length; i++) {
    const page = pageArray[i];
    const accessToken = page.accessToken;
    const fields = ['greeting', 'get_started', 'persistent_menu'];
    const response = await bot.getFields(fields);
    global.pagesKeyID[page.pageID] = accessToken;

    console.log(`GET fields for ${page.pageID}-${page.name}:`, response);
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
app.use('/buckets/facebook', (req, res, next) => {
  if (req.body.object === 'page') {
    if (req.body.entry.length > 0) {
      // Iterates over each entry - there may be multiple if batched
      // for (let i = 0; i < req.body.entry.length; i++) {
      let pageID = req.body.entry[0].id;

      console.log(`Message from ${pageID}`);

      if (global.pagesKeyID[pageID]) {
        req.token = global.pagesKeyID[pageID];
      }
      else {
        getOnePage(pageID).then((accessToken) => {
          req.token = accessToken;
          global.pagesKeyID[pageID] = accessToken;
          console.log(`Got token from ${pageID}`);
        });
      }

      next();
    }
  }
});
app.use('/buckets/facebook', bot.router());
app.listen(process.env.FB_WEBHOOK_PORT, () => console.log(`Bot server listening on port ${process.env.FB_WEBHOOK_PORT}`));

global.pagesKeyID = new Array();
global.orderState = new Array();


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
    console.log('GET_STARTED error:', error.response);

    const out3 = await sendErrorMsg();
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out3);
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
  const keyState = sender.id + recipient.id;

  try {
    await bot.startTyping(sender.id);
    if (data === 'CARDAPIO_PAYLOAD') {
      const out = await sendCardapio(message.recipient.id);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, out);

    } else if (data === 'PEDIDO_PAYLOAD') {
      global.orderState[keyState] = ORDER_STATE_QUANTITY;

      // Show saved address or ask for location
      await bot.startTyping(sender.id);
      await Bot.wait(1000);
      const user = await bot.fetchUser(sender.id);
      const answer = await confirmAddressOrAskLocation(recipient.id, sender.id, user);
      await bot.stopTyping(sender.id);
      await bot.send(sender.id, answer);
    }
  } catch (err) {
    await bot.stopTyping(sender.id);

    if (err.response) console.log(err.response);
    else console.log(err);
  }
});



/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */
bot.on('message', async (message) => {
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
  } else {

    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const answer = await confirmTypedAddress(recipient.id, sender.id, message);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, answer);
  }
});

/**
 * clicked "Fazer Pedido"
 * gonna ask for QUANTITY
 */
bot.on('quick-reply', async (message, quick_reply) => {
  console.info({ message });

  const { sender, recipient } = message;
  const { payload } = quick_reply;

  if (payload) {
    console.info({ payload });

    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const answer = await showPhone(recipient.id, sender.id, payload);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, answer);

    // next question
    const out = await askForQuantity();
    await Bot.wait(1000);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  }
});

/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('CORRECT_SAVED_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;

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
});

/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('LOCATION_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;

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
    const out = await askForPhone();
    await Bot.wait(1000);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  }
});


/**
 * answered CORRECT_SAVED_ADDRESS
 * gonna ask for phone
 */
bot.on('WRONG_SAVED_ADDRESS', async (message, data) => {
  const { sender, recipient } = message;

  const out = await askForLocation();
  await Bot.wait(1000);
  await bot.stopTyping(sender.id);
  await bot.send(sender.id, out);
});


/**
 * answered ORDER_QTY
 * gonna ask for SIZE
 */
bot.on('ORDER_QTY', async (message, data) => {
  const { sender, recipient } = message;
  const keyState = sender.id + recipient.id;

  global.orderState[keyState] = ORDER_STATE_FLAVOR;

  if (data && data === 'qty_more') {
    global.orderState[keyState] = ORDER_STATE_QUANTITY;

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
});

/**
 * answered ORDER_SIZE
 * gonna ask for FLAVOR
 */
bot.on('ORDER_SIZE', async (message, data) => {
  const { sender, recipient } = message;
  const keyState = sender.id + recipient.id;

  global.orderState[keyState] = ORDER_STATE_SIZE;

  // show what the user chose
  await bot.startTyping(sender.id);
  await Bot.wait(2000);
  const answer = await showSize(recipient.id, sender.id, data);
  await bot.stopTyping(sender.id);
  await bot.send(sender.id, answer);

  // next question
  await bot.startTyping(sender.id);
  await Bot.wait(2000);
  const out = await askForFlavor(message.recipient.id);
  await bot.stopTyping(sender.id);
  await bot.send(sender.id, out);

});

/**
 * answered ORDER_FLAVOR
 * gonna ask for confirmation
 */
bot.on('ORDER_FLAVOR', async (message, data) => {
  const { sender, recipient } = message;
  const keyState = sender.id + recipient.id;

  global.orderState[keyState] = ORDER_STATE_FLAVOR;

  if (data === 'flavor_more') {
    // TODO: show more flavors
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
});


/**
 * answered ORDER_CONFIRMATION
 */
bot.on('ORDER_CONFIRMATION', async (message, data) => {
  const { sender, recipient } = message;
  const keyState = sender.id + recipient.id;

  global.orderState[keyState] = ORDER_STATE_FLAVOR;

  if (data === 'confirmation_yes') {
    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const out = await confirmOrder(recipient.id, sender.id);
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, out);
  }
  else {
    await bot.startTyping(sender.id);
    await Bot.wait(1000);
    const answer = new Elements();
    answer.add({ text: "Perguntar se precisa corrigir algo..." });
    await bot.stopTyping(sender.id);
    await bot.send(sender.id, answer);
  }
});
