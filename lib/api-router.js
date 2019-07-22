const apiRouter       = require('express').Router();
const bodyParser      = require('body-parser');
const bindApiIndex    = require('../api');
const sanitizer       = require('./sanitizer');
// const cors            = require('./cors');
const apiErrorHandler = require('./api-error-handler');

// API ROUTER (Context: http://{host}/{siteRoot}/api/ )
module.exports = (config) => {

  // CORS ENABLING
  // apiRouter.use(cors(config));

  // HTML SANITIZER
  apiRouter.use(sanitizer(config));

  // BODY PARSER
  apiRouter.use(bodyParser.urlencoded({extended : true}));
  apiRouter.use(bodyParser.json());

  // BIND ALL API CONTROLLERS
  bindApiIndex(apiRouter, config);

  // WHATEVER ROUTES DON'T MATCH THROW 404
  apiRouter.use('/*', (req, res, next) => {
    const error = new Error('Resource not found');
    error.statusCode = 404;
    error.status = 404;
    return next(error);
  });

  // API ERROR HANDLING
  apiRouter.use(apiErrorHandler(config));

  return apiRouter;
};
