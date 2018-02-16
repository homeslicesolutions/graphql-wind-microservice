'use strict';
const logger = require('./gateway-logger');

const validateOrigin = (config, origin, currentHost) => {
  let originHost = origin.replace(/^([^:]+:|)[\/]+/, ''); // Removing "http://"

  let originDomain = originHost.match(/[^\.]+\.[^\.]+$/) && originHost.match(/[^\.]+\.[^\.]+$/)[0] || originHost; // Grabbing the last 2 name spaces i.e. (firmglobal.net)
  originDomain = originDomain.replace(/:[0-9]+$/g, ''); // Removing port number

  let currentDomain = currentHost.match(/[^\.]+\.[^\.]+$/) && currentHost.match(/[^\.]+\.[^\.]+$/)[0] || currentHost; // Grabbing the last 2 name spaces i.e. (firmglobal.net)
  currentDomain = currentDomain.replace(/:[0-9]+$/g, ''); // Removing port number

  const pass = (originDomain === currentDomain);

  logger.log('CORS Origin to Current:', originDomain, currentDomain, `; Is passing? ${pass}`);

  return pass; // Assert
};

const filterOutEmpty = (headers) => headers.filter(header => header && header.length);

const filterOutDuplicates = (headers) => (
    headers.reduce((arr, item) => (
            arr.find(other => other == item)
                ? arr
                : arr.concat(item)
        ), []
    )
);

let allowedMethods = ['POST, GET, PUT, DELETE, OPTIONS'];
let allowedHeaders = ['domainerror'];

module.exports = config => (req,res,next) => {
  // const isAllowed = req.headers.origin && validateOrigin(config, req.headers.origin, req.headers.host);
  const isAllowed = true;
  if (isAllowed) {
    allowedHeaders = allowedHeaders.concat((req.headers['Access-Control-Allow-Headers'] || req.headers['access-control-allow-headers'] || '').split(','));
    allowedHeaders = allowedHeaders.concat((req.headers['Access-Control-Request-Headers'] || req.headers['access-control-request-headers'] || '').split(','));
    allowedHeaders = filterOutEmpty(allowedHeaders);
    allowedHeaders = filterOutDuplicates(allowedHeaders);

    logger.log('<- Cross-Origin:', `[${req.url} <- ${req.headers.origin}]`);

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', allowedMethods.join(','));
    res.header('Access-Control-Allow-Headers', '*,' + allowedHeaders.join(','));
    res.header('Access-Control-Expose-Headers', allowedHeaders.join(','));
    res.header('Access-Control-Allow-Credentials', 'true');

    // If preflight, respond with OK
    if (req.method.toLowerCase() == 'options') {
      logger.log('-> Cross-Origin:', 200, `Pre-flight access granted!`);
      return res.status(200).send('{ "message": "OK" }'); // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

    logger.log('-> Cross-Origin:',' Continue...');
  }

  next();
};