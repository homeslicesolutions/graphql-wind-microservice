'use strict';
const assert = require('assert');
const mocks = require('node-mocks-http');
const supertest = require('supertest');
const rewire = require('rewire');
const nock = require('nock');
const url = require('url');

/*
describe('Error handler middleware', () => {

  describe('Testing specific unit details of all error scenarios', () => {

    const errorHandlerMiddleware = rewire('../error-handler.js');
    const redirectToLogin = errorHandlerMiddleware.__get__('redirectToLogin');

    let config, err, req, res, next;

    beforeEach(() => {
      config = {
        'Application.Url.Login': "/confirm/authoring/Login.aspx?ReturnUrl={url}",
        'Application.Url.Logout': "/confirm/authoring/Logoff.aspx?logoff=true&ReturnUrl={url}"
      };

      err = new Error();

      req = mocks.createRequest();
      req.protocol = 'https:';
      req.headers.host = 'reportal.firmglobal.net:9090';
      req.originalUrl = '/discoveryanalytics';

      res = mocks.createResponse();

      next = () => {};
    });

    it('redirectToLogin => should be able to redirect', done => {
      // -- Act
      redirectToLogin(config, req, res);

      // -- Assert
      assert(res._getRedirectUrl() == '/confirm/authoring/Login.aspx?ReturnUrl=https://reportal.firmglobal.net:9090/discoveryanalytics');
      done();
    });

    it('should force redirect to logout for forbidden access due to unauthorized to access to API dictionary', done => {
      // -- Arrange
      err.message = 'Unable to connect to API Dictionary';
      req.url = "http://google.com";

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res.statusCode == 302);
      assert(res._getRedirectUrl() == '/confirm/authoring/Login.aspx?ReturnUrl=https://reportal.firmglobal.net:9090/discoveryanalytics');
      done();
    });

    it('should force redirect to logout for forbidden access due to unauthorized to access to Token Middleware for missing cookie', done => {
      // -- Arrange
      err.message = 'IDP Cookie not found';
      req.url = "http://google.com";

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res.statusCode == 302);
      assert(res._getRedirectUrl() == '/confirm/authoring/Login.aspx?ReturnUrl=https://reportal.firmglobal.net:9090/discoveryanalytics');
      done();
    });

    it('should handle "domainerror" as a pass over and not a server error', done => {
      // -- Arrange
      err.status = 400;
      err.headers = new Map();
      err.headers.set('domainerror', 'EXAMPLE_DOMAIN_ERROR');

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res.getHeader('domainerror') == 'EXAMPLE_DOMAIN_ERROR');
      assert(res._getData().status == 400);
      assert(res._getData().headers.get('domainerror') == 'EXAMPLE_DOMAIN_ERROR');
      done();

    });

    it('should shoot a JSON back for error in API calls at "/api"', done => {
      // -- Arrange
      req.url = '/api/hubs';
      err = mocks.createResponse();
      err.json = () => ({ problem: 123 });

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res._getData().problem == 123);
      assert(res._isJSON() == true);
      done();
    });

    it('should shoot a JSON back for error in API calls if request "content-type" is "json"', done => {
      // -- Arrange
      req.url = '/no';
      req.headers['content-type'] = 'application/json';
      err = mocks.createResponse();
      err.json = () => ({ problem: 123 });

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res._getData().problem == 123);
      assert(res._isJSON() == true);
      done();
    });

    it('should force redirect to logout for forbidden access due to Status Code is 401', done => {
      // -- Arrange
      err.statusCode = 401;

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res.statusCode == 302);
      assert(res._getRedirectUrl() == '/confirm/authoring/Login.aspx?ReturnUrl=https://reportal.firmglobal.net:9090/discoveryanalytics');
      done();
    });

    it('should just send back client error if status code is 400 to before 500', done => {
      // -- Arrange
      err.statusCode = 405;
      err.message = 'Client is wrong';

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res.statusCode == 405);
      assert(res._getData().statusCode == 405);
      assert(res._getData().message == 'Client is wrong');
      done();
    });

    it('should shoot back the server error but in string if it is a Server error (i.e. >=500)', done => {
      // -- Arrange
      err.statusCode = 503;
      err.message = 'Server is wrong';

      // -- Act
      errorHandlerMiddleware(config)(err, req, res, next);

      // -- Assert
      assert(res.statusCode == 503);
      assert(res._getData() == 'Server is wrong{"statusCode":503,"message":"Server is wrong"}');
      done();
    });

    it('should shoot back error stack if not a formal set error', done => {
      // -- Arrange
      err.stack = "this is a stack";

      let caughtError;
      // -- Act
      try {
        errorHandlerMiddleware(config)(err, req, res, next);
      } catch (e) {
        caughtError = e;
      }

      // -- Assert
      assert(caughtError == "this is a stack");
      done();
    });

  });

  /!*describe('Testing integration with backend calls', () => {
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
   const dictApi = url.parse(config.dictionaryApiUrl);
   nock(dictApi.protocol+'//'+dictApi.host)
   .get(dictApi.pathname)
   .reply(200, {items: [
   { id: 'metaData', links: { self: mockHost + '/metaData' }},
   { id: 'reporting', links: { self: mockHost + '/reporting' }},
   { id: 'discoveryBoards', links: { self: mockHost + '/discoveryBoards' }}
   ]});
   });

   afterEach(() => {
   nock.cleanAll();
   });

   it('should return correct error status code for JSON API calls with error', done => {
   nock(mockHost)
   .get('/metaData/hubs')
   .query(() => true)
   .reply(500, "ERROR");

   supertest(server)
   .get('/discoveryanalytics/api/hubs')
   .expect(500, done)
   });

   it('should redirect to login if hit with 401 Unauthorized', done => {
   supertest(server)
   .get('/discoveryanalytics/hubs')
   .expect(res => {
   assert(res.headers.location.toLowerCase().indexOf('login') >= 0); // see if "login" is in the redirect url
   })
   .expect(302, done)
   });

   it('for APIs, it should just send the client the status code and not redirect', done => {
   nock(mockHost)
   .get('/metaData/hubs')
   .query(() => true)
   .reply(401, "Unauthorized");

   supertest(server)
   .get('/discoveryanalytics/api/hubs')
   .expect(401, done)
   });

   });*!/

});
*/

