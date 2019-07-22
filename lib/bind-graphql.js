const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const logger           = require('./gateway-logger');


const sample =importSchema('../graphql/type-defs/sample.gql');

console.log('sample', sample);


const typeDefs = importSchema('../graphql/type-defs/sample.gql');

const resolvers = {
  ...require('../graphql/resolvers/sample'),
};

module.exports = (path, app, config) => {
  const graphqlServer = new ApolloServer({ typeDefs, resolvers });

  graphqlServer.applyMiddleware({ app, path });

  logger.info('GraphQL Server bound to: ', graphqlServer.graphqlPath );
};
