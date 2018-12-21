"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _users = _interopRequireDefault(require("./api/routes/users"));

var _flavors = _interopRequireDefault(require("./api/routes/flavors"));

var _toppings = _interopRequireDefault(require("./api/routes/toppings"));

var _pricings = _interopRequireDefault(require("./api/routes/pricings"));

var _beverages = _interopRequireDefault(require("./api/routes/beverages"));

var _stores = _interopRequireDefault(require("./api/routes/stores"));

var _openingtimes = _interopRequireDefault(require("./api/routes/openingtimes"));

var _pages = _interopRequireDefault(require("./api/routes/pages"));

var _extras = _interopRequireDefault(require("./api/routes/extras"));

var _sizes = _interopRequireDefault(require("./api/routes/sizes"));

var _orders = _interopRequireDefault(require("./api/routes/orders"));

var _customers = _interopRequireDefault(require("./api/routes/customers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)(); // Beggining - That is all to log in the local timezone
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan

_morgan.default.token('date', function (req, res, tz) {
  return (0, _momentTimezone.default)().tz(tz).format();
});

_morgan.default.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use((0, _morgan.default)("myformat")); // End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Authorization,Origin,X-Requested-With,Content-Type,Accept,application/json,Content-Range');
  res.header("Access-Control-Expose-Headers", 'Content-Range');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}); // Connect to mongodb

_dotenv.default.config(); // mongoose.connect(
//   process.env.MONGODB_URL,
//   { useNewUrlParser: true }
// );
// mongoose.set('useCreateIndex', true);
// mongoose.Promise = Promise;


var RETRY_TIMEOUT = 3000;
var options = {
  useNewUrlParser: true,
  autoReconnect: true,
  keepAlive: 30000,
  reconnectInterval: RETRY_TIMEOUT,
  reconnectTries: 10000
};
var isConnectedBefore = false;
var env = process.env.NODE_ENV || 'production';
var mongo_url = process.env.DEV_MONGODB_URL;
if (env === 'production') mongo_url = process.env.PRD_MONGODB_URL;

var connect = function connect() {
  return _mongoose.default.connect(mongo_url, options).catch(function (err) {
    return console.error('Mongoose connect(...) failed with err: ', err);
  });
};

connect();

_mongoose.default.set('useCreateIndex', true);

if (env !== 'production') {
  // dev
  _mongoose.default.set('debug', true);
}

_mongoose.default.Promise = _bluebird.default;

_mongoose.default.connection.on('error', function () {
  console.error('SERVER-WEBAPP - Could not connect to MongoDB');
});

_mongoose.default.connection.on('disconnected', function () {
  console.error('SERVER-WEBAPP - Lost MongoDB connection...');

  if (!isConnectedBefore) {
    setTimeout(function () {
      return connect();
    }, RETRY_TIMEOUT);
  }
});

_mongoose.default.connection.on('connected', function () {
  isConnectedBefore = true;
  console.info('SERVER-WEBAPP - Connection established to MongoDB');
});

_mongoose.default.connection.on('reconnected', function () {
  console.info('SERVER-WEBAPP - Reconnected to MongoDB');
}); // Close the Mongoose connection, when receiving SIGINT


process.on('SIGINT', function () {
  _mongoose.default.connection.close(function () {
    console.warn('SERVER-WEBAPP - Force to close the MongoDB connection after SIGINT');
    process.exit(0);
  });
}); // Setup the routes

app.use("/users", _users.default);
app.use("/flavors", _flavors.default);
app.use("/toppings", _toppings.default);
app.use("/pricings", _pricings.default);
app.use("/beverages", _beverages.default);
app.use("/stores", _stores.default);
app.use("/openingtimes", _openingtimes.default);
app.use("/pages", _pages.default);
app.use("/sizes", _sizes.default);
app.use("/extras", _extras.default);
app.use("/orders", _orders.default);
app.use("/customers", _customers.default); // const env = process.env.NODE_ENV || 'production';

if (env === 'production') app.listen(8080, function () {
  return console.log(env + "env. Server listening on port 8080");
});else {
  // dev server
  // Lift the https server
  _https.default.createServer({
    key: _fs.default.readFileSync("/Users/aldo/.localhost-ssl/localhost.key"),
    cert: _fs.default.readFileSync("/Users/aldo/.localhost-ssl/localhost.crt")
  }, app).listen(8080, function () {
    return console.log(env + " Server listening on port 8080");
  });
}
//# sourceMappingURL=server-webapp.js.map