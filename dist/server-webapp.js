"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _https = _interopRequireDefault(require("https"));

var _http = _interopRequireDefault(require("http"));

var _fs = _interopRequireDefault(require("fs"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _socket = _interopRequireDefault(require("socket.io"));

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

var _items = _interopRequireDefault(require("./api/routes/items"));

var _customers = _interopRequireDefault(require("./api/routes/customers"));

var _accounts = _interopRequireDefault(require("./api/routes/accounts"));

var _categories = _interopRequireDefault(require("./api/routes/categories"));

var _webForms = _interopRequireDefault(require("./api/routes/webForms"));

var _ordersController = require("./api/controllers/ordersController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = (0, _express.default)(); // Beggining - That is all to log in the local timezone
// https://medium.com/front-end-hacking/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
// [Node.js] Logs in Local Timezone on Morgan

_morgan.default.token('date', function (req, res, tz) {
  return (0, _momentTimezone.default)().tz(tz).format();
});

_morgan.default.format('myformat', '[:date[America/Sao_Paulo]] ":method :url" :status :res[content-length] - :response-time ms');

app.use((0, _morgan.default)('myformat')); // End - That is all to log in the right timezone

app.set('json spaces', 2);
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());

_dotenv.default.config();

var env = process.env.NODE_ENV || 'production';
var allowedOrigins = process.env.DEV_ALLOWED_ORIGIN.split(' ');
if (env === 'production') allowedOrigins = process.env.PRD_ALLOWED_ORIGIN.split(' ');
app.use(function (req, res, next) {
  var origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
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
var RETRY_TIMEOUT = 3000;
var options = {
  useNewUrlParser: true,
  autoReconnect: true,
  keepAlive: 30000,
  reconnectInterval: RETRY_TIMEOUT,
  reconnectTries: 10000
};
var isConnectedBefore = false;
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

app.use('/users', _users.default);
app.use('/flavors', _flavors.default);
app.use('/toppings', _toppings.default);
app.use('/pricings', _pricings.default);
app.use('/beverages', _beverages.default);
app.use('/stores', _stores.default);
app.use('/openingtimes', _openingtimes.default);
app.use('/pages', _pages.default);
app.use('/sizes', _sizes.default);
app.use('/extras', _extras.default);
app.use('/orders', _orders.default);
app.use('/customers', _customers.default);
app.use('/accounts', _accounts.default);
app.use('/categories', _categories.default);
app.use('/reportOrders', _orders.default);
app.use('/reportFlavors', _items.default);
app.use('/webforms', _webForms.default); // const env = process.env.NODE_ENV || 'production';

var server;

if (env === 'production') {
  // app.listen(8080, () => console.log(env + 'env. Server listening on port 8080'));
  server = _http.default.createServer(app).listen(8080, function () {
    return console.log(env + ' Server listening on port 8080');
  });
} else {
  // dev server
  // Lift the https server
  server = _https.default.createServer({
    key: _fs.default.readFileSync('/Users/aldo/.localhost-ssl/localhost.key'),
    cert: _fs.default.readFileSync('/Users/aldo/.localhost-ssl/localhost.crt')
  }, app).listen(8080, function () {
    return console.log(env + ' Server listening on port 8080');
  });
}

var io = (0, _socket.default)(server, {
  origins: allowedOrigins
});
var interval;
io.on('connection', function (socket) {
  console.info('New client connected');

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(function () {
    return getApiAndEmit(socket);
  }, 30000);
  socket.on('disconnect', function () {
    console.info('Client disconnected');
  });
});

var getApiAndEmit =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(socket) {
    var pageID, lastOrders;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            pageID = socket.handshake.query.pageID; // const lastOrderID = await getLastOrder(pageID);

            _context.next = 4;
            return (0, _ordersController.getLastPendingOrders)(pageID);

          case 4:
            lastOrders = _context.sent;
            socket.emit('LastOrders', lastOrders);
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.error("Error: ".concat(_context.t0.code));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function getApiAndEmit(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=server-webapp.js.map