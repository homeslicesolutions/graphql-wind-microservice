'use strict';

const tokenAuth = require('confirmit-token-authentication-middleware');
const logger    = require('./gateway-logger');

module.exports = (appRouter, config) => {

  // Bind Identity service
  appRouter.use(tokenAuth(`${config['Confirmit.Site.Url.DictionaryRestApi']}/configuration`));

  // Apply token to header "authorization"
  appRouter.use((req, res, next) => {
    if (!req.useOdic && req.accessToken && !req.headers.Authorization) {
      req.headers.Authorization = `Bearer ${req.accessToken}`;
    }

    if (req.headers.Authorization || req.headers.authorization) {
      logger.log('Access Token: ', req.headers.Authorization || req.headers.authorization);
    } else {
      logger.warn('Access Token is not found!');
    }

    return next();
  });

};