const fetch = require('isomorphic-fetch');
const logger = require('./gateway-logger');

module.exports = (url, options) => {
  const startTime = new Date().getTime();
  const method = (typeof options != 'undefined' && options.method || 'get').toUpperCase();
  const body = options.body || '';

  return fetch(url, options)

  // Log results
    .then(res => {
      const statusCode = res && res.status ? parseInt(res.status, 10) : 500;
      const contentLength = res && res.headers && res.headers['content-length'] || 0;

      logger.response(method, url, statusCode, (options.httpVersion || '1.1'), contentLength, new Date().getTime() - startTime, body);

      return res;
    })

    // Throw error if statusCode is 400 and above
    .then(res => {
      if (res && res.status >= 400) {
        const err = new Error("Service Response Error", res.status);
        err.res = res;
        throw err;
      }
      return res;
    })

    // Catching error and log it
    .catch(e => {
      let errMsg = e;

      if (e.res && (e.res.statusText || e.res.headers && e.res.headers.get && e.res.headers.get('domainerror'))) {
        errMsg = new Error(`${e.res.status || ''} ${e.res.headers.get('domainerror') || ''} ${e.res.statusText || ''}`);
        errMsg.res = e.res;
      }

      if (!options.silentError) logger.error(method, url, errMsg);

      throw errMsg;
    })
};