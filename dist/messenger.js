"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redisMessagingManager = require("redis-messaging-manager");

var messenger = new _redisMessagingManager.PubsubManager({
  host: 'localhost'
});
var _default = messenger;
exports["default"] = _default;
//# sourceMappingURL=messenger.js.map