"use strict";

var redis = require('redis');

var client = redis.createClient(); // this creates a new client

client.on('connect', function () {
  console.log('Redis client connected');
});
client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});
//# sourceMappingURL=redis-client.js.map