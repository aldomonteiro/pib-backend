"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitEventBotWhats = exports.emitEventBotWebapp = void 0;

var _messenger = _interopRequireDefault(require("../../messenger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var emitEventBotWebapp = function emitEventBotWebapp(pageID, eventName, data) {
  var msgStr = JSON.stringify({
    pageID: pageID,
    eventName: eventName,
    data: data
  });

  _messenger["default"].publish('bot-to-webapp', msgStr);
};

exports.emitEventBotWebapp = emitEventBotWebapp;

var emitEventBotWhats = function emitEventBotWhats(whatsAppId, userId, message) {
  var msgStr = JSON.stringify({
    whatsAppId: whatsAppId,
    userId: userId,
    message: message
  });

  _messenger["default"].publish('bot-to-whats', msgStr);
};

exports.emitEventBotWhats = emitEventBotWhats;
//# sourceMappingURL=redisController.js.map