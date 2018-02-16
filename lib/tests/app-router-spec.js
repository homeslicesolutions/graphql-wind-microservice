const supertest = require('supertest');
const rewire = require('rewire');

describe('Application: Router', () => {
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

  it('should return 200 when pinged "isAlive"', done => {
    supertest(server)
      .get('/discoveryanalytics/isAlive')
      .expect(200, done)
  });

});