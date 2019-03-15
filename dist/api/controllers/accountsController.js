"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accounts_update = exports.accounts_get_one = void 0;

var _accounts = _interopRequireDefault(require("../models/accounts"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var configureCielo = function configureCielo() {
  _dotenv.default.config();

  var env = process.env.NODE_ENV || 'production';
  var merchant_id;
  var merchant_key;

  if (env === 'production') {
    merchant_id = process.env.CIELO_MERCHANT_ID;
    merchant_key = process.env.CIELO_MERCHANT_KEY;
  } else {
    merchant_id = process.env.SANDBOX_CIELO_MERCHANT_ID;
    merchant_key = process.env.SANDBOX_CIELO_MERCHANT_KEY;
  }

  var paramsCielo = {
    MerchantId: merchant_id,
    MerchantKey: merchant_key,
    sandbox: true,
    // Opcional - Ambiente de Testes
    debug: true // Opcional - Exibe os dados enviados na requisição para a Cielo

  };

  var cielo = require('cielo')(paramsCielo);

  return cielo;
}; // List one record by filtering by ID


var accounts_get_one = function accounts_get_one(req, res) {
  if (req.params && req.params.id) {
    User.findOne({
      userID: req.params.id
    }, function (err, doc) {
      if (err) {
        res.status(500).json({
          message: err.errMsg
        });
      } else {
        res.status(200).json(doc);
      }
    });
  }
}; // UPDATE


exports.accounts_get_one = accounts_get_one;

var accounts_update =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, id, name, number, expiry, cvc, issuer, pageId;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              console.info(req.body);
              _req$body = req.body, id = _req$body.id, name = _req$body.name, number = _req$body.number, expiry = _req$body.expiry, cvc = _req$body.cvc, issuer = _req$body.issuer; // const returnCielo = await createCieloRecurrency({ id, name, number, expiry, cvc, issuer });
              // console.log(returnCielo);

              pageId = req.currentUser.activePage;

              _accounts.default.findOne({
                pageId: pageId,
                id: id
              }, function (err, doc) {
                if (!err) {
                  doc.id = id;
                  doc.pageId = pageId;
                  doc.name = name;
                  doc.number = number;
                  doc.expiry = expiry;
                  doc.cvc = cvc;
                  doc.issuer = issuer;
                  doc.save(function (err, result) {
                    if (err) {
                      res.status(500).json({
                        message: err.errmsg
                      });
                    } else {
                      res.status(200).json(result);
                    }
                  });
                } else {
                  res.status(500).json({
                    message: err.errmsg
                  });
                }
              });
            } catch (accountsUpdateErr) {
              console.error({
                accountsUpdateErr: accountsUpdateErr
              });
              res.status(500).json({
                message: accountsUpdateErr.errmsg
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function accounts_update(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.accounts_update = accounts_update;

var createCieloRecurrency =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(params) {
    var recurrencyParams, cielo;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            recurrencyParams = {
              MerchantOrderId: '2014113245231706',
              Customer: {
                Name: params.name
              },
              Payment: {
                Type: 'CreditCard',
                Amount: 19700,
                Installments: 1,
                SoftDescriptor: 'PizzaiBot',
                RecurrentPayment: {
                  AuthorizeNow: 'true',
                  EndDate: '2020-12-01',
                  Interval: 'Monthly'
                },
                CreditCard: {
                  CardNumber: params.number,
                  Holder: params.name,
                  ExpirationDate: params.expiry,
                  SecurityCode: params.cvc,
                  SaveCard: 'false',
                  Brand: params.issuer
                }
              }
            };
            cielo = configureCielo();
            _context2.next = 4;
            return cielo.recurrentPayments.firstScheduledRecurrence(recurrencyParams);

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createCieloRecurrency(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=accountsController.js.map