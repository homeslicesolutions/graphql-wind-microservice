const express               = require('express');
const logger                = require('./gateway-logger');
const logIO                 = require('./log-io');
const apiRouter             = require('./api-router');
const viewRouter            = require('./view-router');
const proxyMiddleware       = require('./proxy-middleware');
const bindGraphql           = require('./bind-graphql');

const server = express();

// GATEWAY APP SERVER (Context: http://{host}/ )
module.exports = (config) => {

  // LOGGER SETTINGS
  if (config['Application.DisableLogColors']) logger.disableColors();
  if (!config['Application.EnableLogToConsole']) {
    logger.info('Logging is disabled.');
    logger.disable();
    logger.disabled = true;
  }

  // SERVER PROPERTIES (Context: http://{host}/)
  server.enable('trust proxy');
  server.disable('x-powered-by');
  server.disable('etag');

  // LOG IN/OUT REQUESTS FROM CLIENT
  server.use(logIO(config));

  // WIND
  server.use('/wind', proxyMiddleware(config));

  // API
  server.use('/api', apiRouter(config));

  // GRAPHQL
  bindGraphql('/graphql', server, config);

  // VIEW
  server.use('/*', viewRouter(config));

  return server;
};