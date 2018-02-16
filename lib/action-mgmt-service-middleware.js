'use strict';

const fetch = require('./fetch-with-error-handling');
const logger = require('./gateway-logger');

const applyRequiredHeaders = (headers = {}) => Object.assign({}, headers, {
  "Api-Version"     : "Internal",
  "X-Requested-With": "XMLHttpRequest"
});

module.exports = (options = {}) => (req, res, next) => {

  if (options.csrf) {
    const url = `${req.apis.actionManagement}security/csrftoken`;
    fetch(url, {
        method : 'GET',
        headers: applyRequiredHeaders(req.headers)
      })
      .then((r) => r.json())
      .then((json) => {

        logger.log(`Applying CSRF token: ${json.antiForgeryToken}`);

        req.headers.RequestVerificationToken = json.antiForgeryToken;
        req.headers = applyRequiredHeaders(req.headers);
        next();
      })
      .catch((e) => next(e));

  } else {
    req.headers = applyRequiredHeaders(req.headers);
    next();
  }
};