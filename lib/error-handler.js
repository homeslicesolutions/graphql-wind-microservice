'use strict';
const logger = require('./gateway-logger');
const url    = require('url');

module.exports = config => (err, req, res, next) => {

  if (err) {
    let errorMessage = '';
    if (err.message) errorMessage = err.message;
    try { errorMessage += JSON.stringify(err) } catch(e) { errorMessage = err; }
    logger.error('Server error...', errorMessage);
    return res.send(errorMessage);
  }

  next(err);
};