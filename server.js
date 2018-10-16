import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Promise from "bluebird";
import moment from 'moment-timezone';

import users from "./app/api/routes/users";
import flavors from "./app/api/routes/flavors";
import toppings from "./app/api/routes/toppings";
import pricings from "./app/api/routes/pricings";
import beverages from "./app/api/routes/beverages";
import stores from "./app/api/routes/stores";
import pages from "./app/api/routes/pages";

const app = express();

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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Authorization,Origin,X-Requested-With,Content-Type,Accept,application/json,Content-Range');
  res.header("Access-Control-Expose-Headers", 'Content-Range');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

// Connect to mongodb
dotenv.config();
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

// Setup the routes
app.use("/users", users);
app.use("/flavors", flavors);
app.use("/toppings", toppings);
app.use("/pricings", pricings);
app.use("/beverages", beverages);
app.use("/stores", stores);
app.use("/pages", pages);

// Lift the https server
https
  .createServer(
    {
      key: fs.readFileSync("certificates/server_key.pem"),
      cert: fs.readFileSync("certificates/server_crt.pem")
    },
    app
  )
  .listen(8080, () => console.log("Node server listening on port 8080"));
