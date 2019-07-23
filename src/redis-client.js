import redis from 'redis';

const client = redis.createClient(); // this creates a new client

client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});
