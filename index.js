const gatewayServer       = require('./lib/gateway-server');
const logger              = require('./lib/gateway-logger');
const processErrorHandler = require('./lib/process-error-handler');
const getConfiguration    = require('./lib/get-configuration');

// START
logger.info('START!');

// CONFIGURATION
const confIndex = process.argv.indexOf('-c');
const confFile  = confIndex >= 0 ? process.argv[confIndex + 1] : null;
const config    = getConfiguration(confFile);
if (!config) {
  logger.error('Cannot continue without configuration...Exiting...');
  process.exit(0);
}
logger.info('\n', config);

// PORT
if (!process.env.PORT && config['Application.ServerPort']) {
  process.env.PORT = config['Application.ServerPort'];
}

// GATEWAY APP SERVER
const server = gatewayServer(config);

// GO!
const serverInstance = server.listen(process.env.PORT, () => {
  logger.info(`${config['Application.ServiceName']} gateway listening on port ${process.env.PORT}`);
});

// NODE PROCESS ERROR HANDLING
process.on('uncaughtException', processErrorHandler(serverInstance));