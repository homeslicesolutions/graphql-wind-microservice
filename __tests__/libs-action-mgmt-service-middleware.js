'use strict';

const mocks  = require('node-mocks-http');
const rewire = require('rewire');
const nock   = require('nock');
const path   = require('path');

const middleware = rewire(path.resolve(__dirname, '../lib/action-mgmt-service-middleware.js'));

describe('API: Hubs Controller', () => {
  const mockHost = 'http://localhost:9819';

  afterEach(() => {
    nock.cleanAll();
  });

  it('applyRequiredHeaders => should apply headers including the required Api-Version and X-Requested-With', (done) => {

    // ARRANGE => Get private function
    const applyRequiredHeaders = middleware.__get__('applyRequiredHeaders');

    // ARRANGE => Define a set of headers
    const headers = {
      Authorization     : 'Bearer 1234',
      'X-Requested-With': 'Nope'
    };

    // ACT => Run execute
    const newHeaders = applyRequiredHeaders(headers);

    // ASSERT => Compare result
    expect(newHeaders).toEqual({
      Authorization     : 'Bearer 1234',
      'Api-Version'     : 'Internal',
      'X-Requested-With': 'XMLHttpRequest'
    });

    done();
  });

  it('should call to get CSRF token if specified', (done) => {

    // ARRANGE => Stub actionManagement URL
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    req.apis  = {
      actionManagement: `${mockHost}/am/`
    };

    // ARRANGE => Mock CSRF call
    nock(mockHost)
      .get('/am/security/csrftoken')
      .reply(200, {
        antiForgeryToken: 'secret1234'
      });

    // ACT => Run middleware
    middleware({csrf: true})(req, res, () => {

      // ASSERT => Compare result
      expect(req.headers.RequestVerificationToken).toBe('secret1234');
      expect(req.headers['Api-Version']).toBe('Internal');
      expect(req.headers['X-Requested-With']).toBe('XMLHttpRequest');

      done();
    });
  });

  it('should just attach the headers if CSRF is not required', (done) => {

    // ARRANGE => Stub actionManagement URL
    const req = mocks.createRequest();
    const res = mocks.createResponse();

    // ACT => Run middleware
    middleware()(req, res, () => {

      // ASSERT => Compare result
      expect(req.headers['Api-Version']).toBe('Internal');
      expect(req.headers['X-Requested-With']).toBe('XMLHttpRequest');

      done();
    });

  });

});
