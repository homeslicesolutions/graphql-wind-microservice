const express = require('express');
const path = require('path');
const logger = require('./gateway-logger');
const siteRouter = require('./site-router');

const server = express();

// GATEWAY APP SERVER (Context: http://{host}/{siteRoot}/ )
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

  // APP ROUTER (i.e.  http://{host}/{siteRoot}))
  server.use(config['Application.SiteRoot'], siteRouter(config));

  return server;
};