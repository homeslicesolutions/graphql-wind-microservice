const viewRouter       = require('express').Router();
const url              = require('url');
const cspMiddleware    = require('./csp-middleware');
const htmlTemplate     = require('./html-template');
const logger           = require('./gateway-logger');
const viewErrorHandler = require('./view-error-handler');

// VIEW ROUTER (Context: http://{host}/{siteRoot}/* )
module.exports = (config) => {

  // CSP MIDDLEWARE
  viewRouter.use(cspMiddleware(config));

  // VIEW IF AUTHORIZED
  viewRouter.use((req, res, next) => {
    logger.info('Client view handler...');
    return res.send(htmlTemplate(Object.assign({}, config)));
  });

  // VIEW ERROR HANDLER (HAPPENS ONLY IF NOT AUTHORIZED TO VIEW)
  viewRouter.use(viewErrorHandler(config));

  return viewRouter;
};