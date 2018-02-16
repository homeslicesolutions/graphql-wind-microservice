const assert = require('assert');
const fs = require('fs');
const mocks = require('node-mocks-http');
const supertest = require('supertest');
const rewire = require('rewire');
const nock = require('nock');
const url = require('url');
const path = require('path');

describe('Download handler middleware', () => {
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
        { id: 'reporting', links: { self: mockHost + '/reporting' }},
        { id: 'discoveryBoards', links: { self: mockHost + '/discoveryBoards' }}
      ]});
  });

  it('should hit download handler on "/download" with appropriate mime-type headers with "report" type', done => {
    nock(mockHost)
      .post('/reporting/reports/123/export')
      .replyWithFile(200, path.join(__dirname, 'mock.xlsx'));

    supertest(server)
      .get('/discoveryanalytics/download?report=123')
      .expect(200, function(a, res) {
        // check headers
        assert(res.header['content-type'].match('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'));
        assert(res.header['content-disposition'].match('attachment; filename=Export.xlsx'));
        done();
      });
  });

  it('should hit download handler on "/download" with appropriate mime-type headers with "projects" type', done => {
    nock(mockHost)
      .post('/reporting/projects/123/export')
      .replyWithFile(200, path.join(__dirname, 'mock.xlsx'));

    supertest(server)
      .get('/discoveryanalytics/download?project=123')
      .expect(200, function(a, res) {
        // check headers
        assert(res.header['content-type'].match('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'));
        assert(res.header['content-disposition'].match('attachment; filename=Export.xlsx'));
        done();
      });
  });

  it('should handle errors if no report ID is specified', done => {
    supertest(server)
      .get('/discoveryanalytics/download?report')
      .expect(404, done);
  });

});