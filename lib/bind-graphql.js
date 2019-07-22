const GraphqlServer = require('../graphql');
const logger        = require('./gateway-logger');

module.exports = (path, app, config) => {
  const graphqlServer = GraphqlServer(config).applyMiddleware({ app, path });
  logger.info('GraphQL Server bound to: ', graphqlServer.graphqlPath );
}; 