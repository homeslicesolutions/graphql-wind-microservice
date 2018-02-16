const url = require('url');
const {get} = require('lodash');
const logger = require('./gateway-logger');
const isSiteSSL = require('./is-site-ssl');

module.exports = (config, req, key) => {
  let baseUrl = config[key];

  const protocol = isSiteSSL(config) ? 'https:' : 'http:';

  if (baseUrl.startsWith('//')) {
    baseUrl = protocol + baseUrl;
  }

  if (!baseUrl.startsWith('http')) {
    const host = get(req, ['headers', 'host'], '');

    if (host === '') {
      const msg = 'No Host in the header... cannot assume host';
      logger.error(msg);
      throw msg;
    }

    baseUrl = url.format({
      protocol,
      host    : get(req, ['headers', 'host'], ''),
      pathname: baseUrl
    });
  }

  return baseUrl;
};