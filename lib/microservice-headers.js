'use strict';
const uuidV4 = require('uuid/v4');
const logger = require('./gateway-logger');

function applyHeaderIfNeeded(req, key, value) {
  let lowercaseKey = key.toLowerCase();

  if (!req.headers[key] && !req.headers[lowercaseKey]) {
    req.headers[lowercaseKey] = value;
  }
}

module.exports = config => (req, res, next) => {
  const INITIATING_SERVICE = config['Application.ServiceName'];

  req.headers['accept']       = 'application/json, text/javascript, */*;q=0.01';
  req.headers['content-type'] = 'application/json';

  applyHeaderIfNeeded(req, 'X-Confirmit-Correlation-Id', ''+uuidV4());
  applyHeaderIfNeeded(req, 'X-Confirmit-User-Agent', INITIATING_SERVICE);
  applyHeaderIfNeeded(req, 'X-Confirmit-Initiating-Service', INITIATING_SERVICE);

  next();
};