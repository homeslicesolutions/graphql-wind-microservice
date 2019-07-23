const { ApolloServer } = require('apollo-server-express');
const importGql = require('./import-gql');
const path = require('path');
const logger = require('./gateway-logger');

const typeDefs = importGql(
  path.join(__dirname, '../graphql/type-defs/query.gql'),
  path.join(__dirname, '../graphql/type-defs/car.gql'),
);

const resolvers = {
  Query: {
    ...require('../graphql/resolvers/query').Query,
    ...require('../graphql/resolvers/car').Query,
  },
};

module.exports = (path, app, config) => {
  const graphqlServer = new ApolloServer({ typeDefs, resolvers });

  graphqlServer.applyMiddleware({ app, path });

  logger.info('GraphQL Server bound to: ', graphqlServer.graphqlPath );
};
