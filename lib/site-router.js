const siteRouter                = require('express').Router();
const logIO                     = require('./log-io');
const apiRouter                 = require('./api-router');
const viewRouter                = require('./view-router');
const silentRenewMiddlware      = require('./silent-renew-middleware');

// APP ROUTER (Context: http://{host}/{siteRoot}/ )
module.exports = (config) => {

  // IS ALIVE test PAGEs
  siteRouter.get('/isAlive', (req, res) => res.send('alive'));

  // LOG IN/OUT REQUESTS FROM CLIENT
  siteRouter.use(logIO(config));

  // API
  siteRouter.use('/api', apiRouter(config));

  // SILENT RENEW
  siteRouter.use('/silentRenew', silentRenewMiddlware(config));

  // VIEW
  siteRouter.use('/*', viewRouter(config));

  return siteRouter;
};