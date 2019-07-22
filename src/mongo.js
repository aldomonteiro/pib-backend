import mongoose from 'mongoose';

export const connectDB = (server, env, mongoDB_URL) => {

  const RETRY_TIMEOUT = 3000

  const options = {
    useNewUrlParser: true,
    autoReconnect: true,
    keepAlive: 30000,
    reconnectInterval: RETRY_TIMEOUT,
    reconnectTries: 10000,
  }

  let isConnectedBefore = false

  const connect = () => {
    return mongoose.connect(mongoDB_URL, options)
      .catch(err => console.error(`${server} - Mongoose connect(...) failed with err: `, err))
  }

  connect();

  mongoose.set('useCreateIndex', true);

  if (env !== 'production') { // dev
    mongoose.set('debug', true);
  }

  mongoose.connection.on('error', () => {
    console.error(`${server} - Could not connect to MongoDB`)
  });

  mongoose.connection.on('disconnected', () => {
    console.error(`${server} - Lost MongoDB connection...`)
    if (!isConnectedBefore) {
      setTimeout(() => connect(), RETRY_TIMEOUT)
    }
  });

  mongoose.connection.on('connected', () => {
    isConnectedBefore = true
    console.info(`${server} - Connection established to MongoDB`)
  });

  mongoose.connection.on('reconnected', () => {
    console.info(`${server} - Reconnected to MongoDB`)
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', () => {
    mongoose.connection.close(function () {
      console.warn(`${server} - Force to close the MongoDB connection after SIGINT`)
      process.exit(0)
    })
  });

}


