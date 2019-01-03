"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFlow = exports.deleteManyFlows = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _flow = _interopRequireDefault(require("../models/flow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Delete all records from a pageID
 * @param {*} pageID 
 */
var deleteManyFlows =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(pageID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _flow.default.deleteMany({
              pageId: pageID
            }).exec();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function deleteManyFlows(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.deleteManyFlows = deleteManyFlows;

var updateFlow =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(orderData) {
    var orderId, userId, pageId, step, resultLastId, itemId, record;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            orderId = orderData.orderId, userId = orderData.userId, pageId = orderData.pageId, step = orderData.step;
            _context2.next = 3;
            return _flow.default.find({
              pageId: pageId,
              orderId: orderId
            }).select('id').sort('-id').limit(1).exec();

          case 3:
            resultLastId = _context2.sent;
            itemId = 1;
            if (resultLastId && resultLastId.length) itemId = resultLastId[0].id + 1;
            record = new _flow.default({
              id: itemId,
              orderId: orderId,
              userId: userId,
              pageId: pageId,
              step: step
            });
            _context2.next = 9;
            return record.save();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateFlow(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateFlow = updateFlow;
//# sourceMappingURL=flowController.js.map