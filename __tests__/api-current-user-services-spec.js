'use strict';

const assert = require('assert');
const mocks  = require('node-mocks-http');
const rewire = require('rewire');
const nock   = require('nock');

const {
  fetchCurrentUser,
  hasFeatureToggle,
  getAddonFromCompanyId,
  hasAddonFromUser,
  getAccesses
} = require('../api/current-user/services.js');

describe('API: Service: Current User', () => {
  const mockHost   = 'http://localhost:9819';
  let req, result;

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetchCurrentUser => should get current user', done => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/authentication/connect/userinfo')
      .reply(200, {
        sub: 'cf|administrator',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'administrator',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'firstName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'LastName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'email@address.com',
        CompanyId: 1,
        CompanyName: 'Confirmit',
        UserLanguage: 9,
        UserId: 1
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      authentication : `${mockHost}/authentication/`
    };

    // ACT => Run service method
    fetchCurrentUser(req)
      .then((user) => {

        // ASSERT => Compare results
        expect(user.UserId).toBe(1);
        expect(user.CompanyId).toBe(1);
        expect(user.sub).toBe('cf|administrator');
        expect(user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']).toBe('firstName');
        expect(user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']).toBe('LastName');
        expect(user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']).toBe('email@address.com');
        done();

      });
  });

  it('hasFeatureToggle => should get feature toggle', done => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/metaData/featuretoggles/Actions_StrategyPlanning')
      .reply(200, {
        hasAccess: false
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      metaData : `${mockHost}/metaData/`
    };

    // ACT => Run service method
    hasFeatureToggle(req, 'Actions', 'StrategyPlanning')
      .then((result) => {

        // ASSERT => Compare results
        expect(result).toBe(false);
        done();

      });
  });

  it('getAddonFromCompanyId -> should get addon given company ID', (done) => {

      // ARRANGE => Mock backend call
      nock(mockHost)
        .get('/metaData/companies/1/addons/ActionManagement')
        .reply(200, {
          id: 52,
          name: 'Action Management'
        });

      // ARRANGE => Mock request object
      req      = mocks.createRequest();
      req.apis = {
        metaData : `${mockHost}/metaData/`
      };

      // ACT => Run service method
      getAddonFromCompanyId(req, 1, 'ActionManagement')
        .then((result) => {

          // ASSERT => Compare results
          expect(result).toEqual({
            id: 52,
            name: 'Action Management'
          });

          done();

        });

  });

  it('getAddonFromCompanyId -> should give false if addon doesnt exist given company ID', (done) => {

      // ARRANGE => Mock backend call
      nock(mockHost)
        .get('/metaData/companies/1/addons/ActionManagement')
        .reply(400, new Error('null'));

      // ARRANGE => Mock request object
      req      = mocks.createRequest();
      req.apis = {
        metaData : `${mockHost}/metaData/`
      };

      // ACT => Run service method
      getAddonFromCompanyId(req, 1, 'ActionManagement')
        .then((result) => {

          // ASSERT => Compare results
          expect(result).toBe(false);
          done();

        });

  });

  it('hasAddonFromUser -> should boolean to see if the user has addon', (done) => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/metaData/companies/23/addons/ActionManagement')
      .reply(200, {
        id: 52,
        name: 'Action Management'
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      authentication: `${mockHost}/authentication/`,
      metaData      : `${mockHost}/metaData/`
    };

    // ARRANGE => Mock user
    const user = {
      sub: 'cf|administrator',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'administrator',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'firstName',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'LastName',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'email@address.com',
      CompanyId: 23,
      CompanyName: 'Confirmit',
      UserLanguage: 9,
      UserId: 1
    };

    // ACT => Run service method
    hasAddonFromUser(req, user, 'ActionManagement')
      .then((result) => {

        // ASSERT => Compare results
        expect(result).toBe(true);
        done();

      });

  });

  it('getAccesses -> should boolean to see if the user has addons and featuretoggles', (done) => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/authentication/connect/userinfo')
      .reply(200, {
        sub: 'cf|administrator',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'administrator',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'firstName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'LastName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'email@address.com',
        CompanyId: 23,
        CompanyName: 'Confirmit',
        UserLanguage: 9,
        UserId: 1
      });

    nock(mockHost)
      .get('/metaData/companies/23/addons/ActionManagement')
      .reply(200, {
        id: 52,
        name: 'Action Management'
      });

    nock(mockHost)
      .get('/metaData/featuretoggles/Actions_StrategyPlanning')
      .reply(200, {
        hasAccess: true
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      authentication: `${mockHost}/authentication/`,
      metaData      : `${mockHost}/metaData/`
    };

    // ACT => Run service method
    getAccesses(req)
      .then((result) => {

        // ASSERT => Compare results
        expect(result).toEqual({
          hasActionMgmt: true,
          hasStrategyPlanning: true
        });

        done();

      });

  });

  it('getAccesses -> should boolean to see if end user have access (EU should not have any access to SP...for now)', (done) => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/authentication/connect/userinfo')
      .reply(200, {
        sub: 'eu|enduser|1',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'enduser',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'firstName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'LastName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'email@address.com',
        CompanyId: 23,
        CompanyName: 'Confirmit',
        UserLanguage: 9,
        UserId: 2
      });

    nock(mockHost)
      .get('/am/Programs')
      .reply(200, [
        {
          programId: 123,
          hubId: 1,
          hubName: 'Hub 1'
        }
      ]);

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      authentication  : `${mockHost}/authentication/`,
      metaData        : `${mockHost}/metaData/`,
      actionManagement: `${mockHost}/am/`,
    };
    req.headers['Authorization'] = 'Bearer 123';

    // ACT => Run service method
    getAccesses(req)
      .then((result) => {

        // ASSERT => Compare results
        expect(result).toEqual({
          hasActionMgmt: true,
          hasStrategyPlanning: false
        });

        done();

      });

  });


  it('getAccesses -> should have a way to override by configuration variables', (done) => {

    // ARRANGE => Mock backend call
    nock(mockHost)
      .get('/authentication/connect/userinfo')
      .reply(200, {
        sub: 'cf|administrator',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'administrator',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'firstName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'LastName',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'email@address.com',
        CompanyId: 23,
        CompanyName: 'Confirmit',
        UserLanguage: 9,
        UserId: 1
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      authentication: `${mockHost}/authentication/`,
    };

    // ARRANGE => Mock backend call
    const config = {
      'Confirmit.Client.Disable.ActionManagement': true,
      'Confirmit.Client.Disable.StrategyPlanning': true
    };

    // ACT => Run service method
    getAccesses(req, config)
      .then((result) => {

        // ASSERT => Compare results
        expect(result).toEqual({
          hasActionMgmt: false,
          hasStrategyPlanning: false
        });

        done();

      });

  });

});