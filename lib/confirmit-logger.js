const ConfirmitLogger = require('confirmit-logging');

module.exports = config => (req, res, next) => {
  if (!req.requestLogger) {
    req.requestLogger = ConfirmitLogger.requestLogger(config['Confirmit.Site.LogPath'], config['Application.ServiceName'], __filename, {
      enableLogToConsole : config['Confirmit.Site.LogPath'] || false,
      serviceVersion : config['Octopus.Action.Package.NuGetPackageVersion']
    });
  }
  
  if (!req.logError) {
    req.logError = new ConfirmitLogger.logger(config['Confirmit.Site.LogPath'], config['Application.ServiceName'], __filename, {
      enableLogToConsole : config['Application.EnableLogToConsole'] || false,
      serviceVersion : config['Octopus.Action.Package.NuGetPackageVersion']
    });
  }
  
  next();
};