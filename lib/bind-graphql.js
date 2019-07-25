const { ApolloServer } = require('apollo-server-express');
const importSchema = require('./import-schema');
const merge = require('lodash/merge');
const path = require('path');
const logger = require('./gateway-logger');

const typeDefs = importSchema(
  path.join(__dirname, '../graphql/query/schema.gql'),
  path.join(__dirname, '../graphql/regions/schema.gql'),
  path.join(__dirname, '../graphql/cars/schema.gql'),
);

const resolvers = merge(
  require('../graphql/query/resolver'),
  require('../graphql/regions/resolver'),
  require('../graphql/cars/resolver'),
);

module.exports = (path, app, config) => {
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      headers: req.headers,
    })
  });

  graphqlServer.applyMiddleware({ app, path });

  logger.info('GraphQL Server bound to: ', graphqlServer.graphqlPath );
};
