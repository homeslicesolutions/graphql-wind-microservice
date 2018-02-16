'use strict';

const logger = require('./gateway-logger');
/*
const url    = require('url');

function redirectToLogin(config, req, res) {
  const returnUrl = url.format({
    protocol: req.protocol,
    host    : req.get('host'),
    pathname: req.originalUrl
  });
  return res.redirect(config['Application.Url.Login'].replace('{url}', returnUrl));
}
*/

module.exports = config => (err, req, res, next) => {

/*  // MIDDLEWARE ISSUES DUE TO AUTH
  if (err && err.message && err.message.match(/(unable to connect|cookie not found|error exchanging refresh token)/gi)) {
    logger.warn(`${req.url} ${err.message}`, 'Forbidden Access...Leaving App...Forwarding to Login Screen...');
    return redirectToLogin(config, req, res);
  }

  // STATUS CODES MATCHING 401
  const statusCode = err && (err.status || err.statusCode);
  if (err && statusCode === 401) {
    logger.warn(`${statusCode} ${req.url}`, 'Unauthorized...Leaving App...Forwarding to Login Screen...');
    return redirectToLogin(config, req, res);
  }*/

  if (err) logger.error(err);

  return next(err);
};