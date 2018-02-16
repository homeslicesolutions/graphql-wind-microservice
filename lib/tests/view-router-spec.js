const assert = require('assert');
const fs = require('fs');
const mocks = require('node-mocks-http');
const supertest = require('supertest');
const rewire = require('rewire');
const nock = require('nock');
const url = require('url');
const path = require('path');

describe('View Router', () => {
  process.env.PORT = 9818;
  var server, config, mockHost;

  before(() => {
    server = rewire('../../server');
    config = server.__get__('config');
    mockHost = 'http://localhost:' + process.env.PORT;
  });

  after(() => {
    server.close();
  });

  beforeEach(() => {
    // -- Dictionary API
    const dictApi = url.parse(config['Confirmit.Site.Url.DictionaryRestApi']);
    nock(dictApi.protocol+'//'+dictApi.host)
      .get(dictApi.pathname)
      .reply(200, {items: [
        { id: 'metaData', links: { self: mockHost + '/metaData' }},
        { id: 'users', links: { self: mockHost + '/users' }}
      ]});
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should do the appropriate gateway checks: featuretoggle & user current', done => {
    nock(mockHost)
      .get('/metaData/featuretoggles/Reporting_AnalyticsWorkbench')
      .reply(200, { hasAccess: true });

    nock(mockHost)
      .get('/users/current')
      .reply(200, { UserId: 123, UserName: 'SomeDude' });

    supertest(server)
      .get('/discoveryanalytics/hubs/123/projects')
      .expect(res => {
        assert(res.text.indexOf('<title>Discovery Analytics</title>') >= 0);
      })
      .expect(200, done)
  });

  it('should not continue if feature toggle is not present or invalid and redirect to login page', done => {
    nock(mockHost)
      .get('/metaData/featuretoggles/Reporting_AnalyticsWorkbench')
      .reply(401, { hasAccess: false });

    nock(mockHost)
      .get('/users/current')
      .reply(200, { UserId: 123, UserName: 'SomeDude' });

    supertest(server)
      .get('/discoveryanalytics/hubs/123/projects')
      .expect(res => {
        assert(res.headers.location.toLowerCase().indexOf('login') >= 0);
      })
      .expect(302, done)
  });

  it('should not continue if user call is inaccessible and redirect to login page', done => {
    nock(mockHost)
      .get('/metaData/featuretoggles/Reporting_AnalyticsWorkbench')
      .reply(200, { hasAccess: true });

    nock(mockHost)
      .get('/users/current')
      .reply(401, "Unauthorized");

    supertest(server)
      .get('/discoveryanalytics/hubs/123/projects')
      .expect(res => {
        assert(res.headers.location.toLowerCase().indexOf('login') >= 0);
      })
      .expect(302, done)
  });
});