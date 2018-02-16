const assert = require('assert');
const mocks = require('node-mocks-http');
const supertest = require('supertest');
const rewire = require('rewire');
const nock = require('nock');
const url = require('url');

describe('API: Router', () => {
  process.env.PORT = 9818;
  var server, config, mockHost;

  before(() => {
    server = rewire('../../index');
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
        { id: 'reporting', links: { self: mockHost + '/reporting' }}
      ]});
    
    // -- Hubs & Project Count
    nock(mockHost)
      .get('/metaData/hubs')
      .query(() => true)
      .reply(200, []);

    nock(mockHost)
      .get('/reporting/projects/counts')
      .query(() => true)
      .reply(200, []);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should catch a bound URL and respond with 200', done => {
    supertest(server)
      .get('/discoveryanalytics/api/hubs')
      .expect(200, done)
  });

  it('should catch non-bound urls to 404', done => {
    supertest(server)
      .get('/discoveryanalytics/api/huddsdsddbs')
      .expect(404, done)
  });


});