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

_dotenv.default.config();

_mongoose.default.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true
});

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.Promise = _bluebird.default; // Setup the routes

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
var env = process.env.NODE_ENV || 'production';
if (env === 'production') app.listen(8080, function () {
  return console.log("Node server listening on port 8080");
});else {
  // dev server
  // Lift the https server
  _https.default.createServer({
    key: _fs.default.readFileSync("certificates/server_key.pem"),
    cert: _fs.default.readFileSync("certificates/server_crt.pem")
  }, app).listen(8080, function () {
    return console.log("Node server listening on port 8080");
  });
}
//# sourceMappingURL=server-webapp.js.map