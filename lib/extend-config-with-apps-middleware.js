'use strict';

const fetch = require('isomorphic-fetch');
const logger = require('./gateway-logger');
const {get} = require('lodash');

const configOverrideMappings = {
  actionmanagement     : 'Confirmit.Client.Url.ActionManagement',
  strategyplanning     : 'Confirmit.Client.Url.StrategyPlanning',
  activedashboards     : 'Confirmit.Client.Url.ActiveDashboards',
  discoveryanalytics   : 'Confirmit.Client.Url.DiscoveryAnalytics',
  endusermanagement    : 'Confirmit.Client.Url.EndUserManagement',
  hierarchymanagement  : 'Confirmit.Client.Url.HierarchyManagement',
  professionalauthoring: 'Confirmit.Client.Url.ProfessionalAuthoring',
  reportal             : 'Confirmit.Client.Url.Reportal',
  smarthub             : 'Confirmit.Client.Url.SmartHub'
};

const removeSlash = (url) => url.replace(/\/$/, '');

module.exports = (config) => {
  let configAppsExtended = false;

  return (req, res, next) => {

    // MUST BE AUTH TO USE APPS
    if (!req.headers.Authorization && !req.accessToken) {
      return next();
    }

    // HEADERSs
    const headers = {
      Authorization: req.headers.Authorization || `Bearer ${req.accessToken}`,
      cookie       : req.headers.cookie,
      accept       : 'application/json, text/javascript, *!/!*;q=0.01'
    };

    if (!configAppsExtended) {

      // FETCH
      fetch(req.apis.applications, {headers})
        .then((r) => r.json())
        .then((json) => {

          // LOOP THROUGH APP ITEMS
          get(json, ['items'], []).forEach((app) => {

            // GRAB CONFIG KEY i.e. Confirmit.Client.Url.StrategyPlanning
            const configKey = configOverrideMappings[app.id];

            // If key exist and not set in config
            if (configKey && !config[configKey]) {

              // Get link value
              const link = removeSlash(get(app, ['links', 'self'], ''));

              // Fill in config
              config[configKey] = link;

              // Log
              logger.info('From /apps ', `${configKey}: `, link);

            }
          });

          // Log new configuration with urls
          const configClients = Object.keys(config).reduce((apps, app) => {
            if (app.startsWith('Confirmit.Client')){
              apps[app] = config[app];
            }
            return apps;
          }, {});
          logger.info('\n', configClients);

          // Set Flag
          configAppsExtended = true;

          // NEXT
          next();
        })
        .catch((e) => {
          logger.error(e);
          next(e);
        });

    } else {
      next();
    }
  };

};