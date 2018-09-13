import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Promise from "bluebird";

// import users from "./app/api/routes/users";
import flavors from "./app/api/routes/flavors";
import toppings from "./app/api/routes/toppings";

const app = express();

app.use(logger("dev"));
app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Content-Range');
  res.header("Access-Control-Expose-Headers", 'Content-Range');
  next();
});

// Connect to mongodb
dotenv.config();
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true }
);
mongoose.Promise = Promise;

// Setup the routes
// app.use("/api/users", users);
app.use("/flavors", flavors);
app.use("/toppings", toppings);

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

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
