import { ApolloServer, gql } from 'apollo-server';
import dotenv from 'dotenv';
import schema from './api/resolvers';
import { connectDB } from './mongo';

dotenv.config();
const env = process.env.NODE_ENV || 'production';
let mongo_url = process.env.DEV_MONGODB_URL;
if (env === 'production')
  mongo_url = process.env.PRD_MONGODB_URL;

// Connect to MongoDB
connectDB('SERVER-GRAPHQL', env, mongo_url);


const server = new ApolloServer(schema);

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀  SERVER-GRAPHQL ready at ${url}`);
});