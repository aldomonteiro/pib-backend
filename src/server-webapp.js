import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import https from 'https';
import http from 'http';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Promise from 'bluebird';
import moment from 'moment-timezone';

import users from './api/routes/users';
import flavors from './api/routes/flavors';
import toppings from './api/routes/toppings';
import pricings from './api/routes/pricings';
import beverages from './api/routes/beverages';
import stores from './api/routes/stores';
import openingtimes from './api/routes/openingtimes';
import pages from './api/routes/pages';
import extras from './api/routes/extras';
import sizes from './api/routes/sizes';
import orders from './api/routes/orders';
import items from './api/routes/items';
import customers from './api/routes/customers';
import accounts from './api/routes/accounts';
import categories from './api/routes/categories';
import webForms from './api/routes/webForms';
import { setupSocketIo } from './api/controllers/socketController';
import { connectDB } from './mongo';

const app = express();

// Beggining - That is all to log in the local timezone
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan
logger.token('date', (req, res, tz) => {
  return moment().tz(tz).format();
})
logger.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use(logger('myformat'));
// End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config();
const env = process.env.NODE_ENV || 'production';

let mongo_url = process.env.DEV_MONGODB_URL;
let allowedOrigins = process.env.DEV_ALLOWED_ORIGIN.split(' ');
if (env === 'production') {
  mongo_url = process.env.PRD_MONGODB_URL;
  allowedOrigins = process.env.PRD_ALLOWED_ORIGIN.split(' ');
}

// Connect MongoDB
connectDB('SERVER-WEBAPP', env, mongo_url);

app.use(function (req, res, next) {
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization,Origin,X-Requested-With,Content-Type,Accept,application/json,Content-Range');
  res.header('Access-Control-Expose-Headers', 'Content-Range');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Setup the routes
app.use('/users', users);
app.use('/flavors', flavors);
app.use('/toppings', toppings);
app.use('/pricings', pricings);
app.use('/beverages', beverages);
app.use('/stores', stores);
app.use('/openingtimes', openingtimes);
app.use('/pages', pages);
app.use('/sizes', sizes);
app.use('/extras', extras);
app.use('/orders', orders);
app.use('/customers', customers);
app.use('/accounts', accounts);
app.use('/categories', categories);
app.use('/reportOrders', orders);
app.use('/reportFlavors', items);
app.use('/webforms', webForms);

let server;

if (env === 'production') {
  // app.listen(8080, () => console.log(env + 'env. Server listening on port 8080'));
  server = http
    .createServer(app)
    .listen(8080, () => console.log(env + ' Server listening on port 8080'));
} else {
  // dev server
  // Lift the https server
  server = https
    .createServer(
      {
        key: fs.readFileSync('/Users/aldo/.localhost-ssl/localhost.key'),
        cert: fs.readFileSync('/Users/aldo/.localhost-ssl/localhost.crt'),
      },
      app
    )
    .listen(8080, () => console.log(env + ' Server listening on port 8080'));
}

setupSocketIo(server, allowedOrigins);
