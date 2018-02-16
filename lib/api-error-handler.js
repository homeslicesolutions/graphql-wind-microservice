'use strict';

const logger = require('./gateway-logger');
const url    = require('url');

module.exports = config => (err, req, res, next) => {
  if (err) {
    const statusCode = err.res && err.res.status || 500;
    const errMsg  = err.res && err.res.status || '';
    const errResp = err.res && err.res.responseText || null;

    logger.error(`${statusCode} ${req.url}`, errMsg, errResp);
    logger.error('Error: ', err);

    return res.status(statusCode).json({message: errMsg || err, body: errResp});
  } else {
    logger.error('Error: ', err);
  }

  next(err);
};