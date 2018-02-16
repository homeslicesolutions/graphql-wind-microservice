'use strict';

const mocks  = require('node-mocks-http');
const rewire = require('rewire');
const nock   = require('nock');
const path   = require('path');

const middleware = rewire(path.resolve(__dirname, '../lib/extend-config-with-apps-middleware.js'));

describe('API: Hubs Controller', () => {
  const mockHost = 'http://localhost:9819';

  afterEach(() => {
    nock.cleanAll();
  });

  it('removeSlash => should remove slashes to any given url if it does have a slash', (done) => {

    // ARRANGE => Get private function
    const removeSlash = middleware.__get__('removeSlash');

    // ARRANGE => Define url
    const url = 'http://google.com/';

    // ACT => Run execute
    const newUrl = removeSlash(url);

    // ASSERT => Compare result
    expect(newUrl).toBe('http://google.com');

    done();
  });

  it('removeSlash => should not remove slash to any given url if it does have a slash', (done) => {

    // ARRANGE => Get private function
    const removeSlash = middleware.__get__('removeSlash');

    // ARRANGE => Define url
    const url = 'http://google.com';

    // ACT => Run execute
    const newUrl = removeSlash(url);

    // ASSERT => Compare result
    expect(newUrl).toBe('http://google.com');

    done();
  });

  it('configOverrideMappings => should have appropriate Octopus keys to apps API mappings', (done) => {

    // ARRANGE => Get private function
    const configOverrideMappings = middleware.__get__('configOverrideMappings');

    // ASSERT => Compare expected
    expect(configOverrideMappings).toEqual({
      actionmanagement     : 'Confirmit.Client.Url.ActionManagement',
      strategyplanning     : 'Confirmit.Client.Url.StrategyPlanning',
      activedashboards     : 'Confirmit.Client.Url.ActiveDashboards',
      discoveryanalytics   : 'Confirmit.Client.Url.DiscoveryAnalytics',
      endusermanagement    : 'Confirmit.Client.Url.EndUserManagement',
      hierarchymanagement  : 'Confirmit.Client.Url.HierarchyManagement',
      professionalauthoring: 'Confirmit.Client.Url.ProfessionalAuthoring',
      reportal             : 'Confirmit.Client.Url.Reportal',
      smarthub             : 'Confirmit.Client.Url.SmartHub'
    });

    done();
  });

  it('should get applications from API and apply to runtime configuration', (done) => {

    // ARRANGE => Runtime config
    const config = {};

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/apps/')
      .reply(200, {
        items: [
          {id: 'actionmanagement',   links: {self: 'http://am.com'}},
          {id: 'activedashboards',   links: {self: 'http://ad.com'}},
          {id: 'discoveryanalytics', links: {self: 'http://reportal.com/discoveryanalytics'}}
        ]
      });

    // ARRANGE => Mock "req" with credentials
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    req.headers.Authorization = 'Bearer 1234';
    req.headers.cookie = 'confirmitidp=info=1234';

    // ARRANGE => Define req.apis (requirement)
    req.apis = {
      applications : `${mockHost}/apps/`
    };

    // ACT => Run execute
    middleware(config)(req, res, () => {

      // ASSERT => Compare result
      expect(config).toMatchObject({
        'Confirmit.Client.Url.ActionManagement': 'http://am.com',
        'Confirmit.Client.Url.ActiveDashboards': 'http://ad.com',
        'Confirmit.Client.Url.DiscoveryAnalytics': 'http://reportal.com/discoveryanalytics'
      });

      done();
    });
  });

  it('should allow override/extention of API calls by runtime "config" (configuration.json)', (done) => {

    // ARRANGE => Runtime config
    const config = {
      'Confirmit.Client.Url.ActionManagement': 'http://localhost:8000',
      'Confirmit.Client.Url.StrategyPlanning': 'http://reporal.com/strategyplanning'
    };

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/apps/')
      .reply(200, {
        items: [
          {id: 'actionmanagement',   links: {self: 'http://am.com'}},
          {id: 'activedashboards',   links: {self: 'http://ad.com'}},
          {id: 'discoveryanalytics', links: {self: 'http://reportal.com/discoveryanalytics'}}
        ]
      });

    // ARRANGE => Mock "req" with credentials
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    req.headers.Authorization = 'Bearer 1234';
    req.headers.cookie = 'confirmitidp=info=1234';

    // ARRANGE => Define req.apis (requirement)
    req.apis = {
      applications : `${mockHost}/apps/`
    };

    // ACT => Run execute
    middleware(config)(req, res, () => {

      // ASSERT => Compare result
      expect(config).toMatchObject({
        'Confirmit.Client.Url.ActionManagement': 'http://localhost:8000',
        'Confirmit.Client.Url.ActiveDashboards': 'http://ad.com',
        'Confirmit.Client.Url.DiscoveryAnalytics': 'http://reportal.com/discoveryanalytics',
        'Confirmit.Client.Url.StrategyPlanning': 'http://reporal.com/strategyplanning'
      });

      done();
    });
  });

  it('should just skip if not authenticated and return the config object untouched', (done) => {

    // ARRANGE => Runtime config
    const config = {
      'Confirmit.Client.Url.ActionManagement': 'http://localhost:8000'
    };

    // ARRANGE => Mock "req" with credentials
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    req.headers.Authorization = 'Bearer 1234';
    req.headers.cookie = 'confirmitidp=info=1234';

    // ARRANGE => Define req.apis (requirement)
    req.apis = {
      applications : `${mockHost}/apps/`
    };

    // ACT => Run execute
    middleware(config)(req, res, () => {

      // ASSERT => Compare result
      expect(config).toEqual({
        'Confirmit.Client.Url.ActionManagement': 'http://localhost:8000'
      });

      done();
    });
  });


});