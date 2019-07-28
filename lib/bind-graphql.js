const { ApolloServer } = require('apollo-server-express');
const importSchema = require('./import-schema');
const importResolvers = require('./import-resolvers');
const path = require('path');
const logger = require('./gateway-logger');
const findAllSpecificFiles = require('../utils/find-all-specific-files');

const typeDefs = importSchema(
  ...findAllSpecificFiles('schema.gql', path.join(__dirname, '../graphql'))
);

const resolvers = importResolvers(
  ...findAllSpecificFiles('resolver.js', path.join(__dirname, '../graphql'))
);

module.exports = (path, app, config) => {
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,

    context: ({ req }) => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      return {
        baseUrl,
        config,
        req,
      }
    }
  });

  graphqlServer.applyMiddleware({ app, path });

  logger.info('GraphQL Server bound to: ', graphqlServer.graphqlPath );
};
