const logger = require('./gateway-logger');

const pad = action => String('       '+action).slice(-7);

module.exports = config => (req, res, next)=> {
  const method = (req.method || 'get').toUpperCase();
  const { url } = req;

  logger.log('<- Client', pad(method)+' '+url);

  const send = res.send;
  res.send = function() {
    res.send = send;
    logger.log('-> Client', pad(res.statusCode)+' '+url);
    return send.apply(res, arguments);
  };

  next();
};