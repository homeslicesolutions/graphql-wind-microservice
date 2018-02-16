const logger = require('./gateway-logger');

module.exports = serverInstance => err => {
  var request, error;

  // Analyze Error
  if (err instanceof Error) {
    logger.error(err.stack);
    error = err;
    request = {};
  } else if (err.headers) {
    error = {};
    request = err;
  }

  // don't log the error if we get the 'permission denied' error while trying to open the file
  if (err.code === 'EACCES') return;

  // Shut down server
  serverInstance.close();

  // TODO: Log with Confirmit
  //ConfirmitLogger.logError(config, __filename, request, error);

  // Barf error stack
  process.stderr.write(err.stack + '\n');
};