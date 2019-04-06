"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitEvent = void 0;

var _messenger = _interopRequireDefault(require("../../messenger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var emitEvent = function emitEvent(pageID, eventName, data) {
  var msgStr = JSON.stringify({
    pageID: pageID,
    eventName: eventName,
    data: data
  });

  _messenger["default"].publish('redis', msgStr);
};

exports.emitEvent = emitEvent;
//# sourceMappingURL=redisController.js.map