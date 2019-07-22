const proxy  = require('http-proxy-middleware');
const logger = require('./gateway-logger');

module.exports = (config) => (req, res, next) => {
  const target          = config['Application.Wind.Server'];
  const { originalUrl } = req;

  logger.log('<> Proxying  ', target + originalUrl);

  const middleware = proxy({
    target:       config['Application.Wind.Server'],
    changeOrigin: true,
    ws:           true,
  });

  return middleware(req, res, next);
};