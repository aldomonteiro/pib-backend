"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webform_create = void 0;

var _webForms = _interopRequireDefault(require("../models/webForms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// CREATE A NEW RECORD
var webform_create =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var id, lastId, newRecord;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);

            if (!req.body) {
              _context.next = 11;
              break;
            }

            id = req.body.id;

            if (!(!id || id === 0)) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return _webForms.default.find().select('id').sort('-id').limit(1).exec();

          case 6:
            lastId = _context.sent;
            id = 1;
            if (lastId && lastId.length) id = lastId[0].id + 1;

          case 9:
            newRecord = new _webForms.default({
              id: id,
              name: req.body.nome,
              email: req.body.email,
              phone: req.body.whatsapp
            });
            newRecord.save().then(function (result) {
              res.status(200).json(result);
            }).catch(function (err) {
              res.status(500).json({
                message: err.errmsg
              });
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function webform_create(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.webform_create = webform_create;
//# sourceMappingURL=webFormsController.js.map