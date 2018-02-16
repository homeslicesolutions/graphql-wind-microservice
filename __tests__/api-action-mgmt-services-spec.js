'use strict';

const assert = require('assert');
const mocks  = require('node-mocks-http');
const rewire = require('rewire');
const nock   = require('nock');

const {
  BindActionMgmtServiceMiddleware,
  getActionMgmtPrograms,
  getActionMgmtProgramByHubIdWithRegister,
  getActionMgmtProgramEndUserList,
  putActionMgmtProgram,
  getActionMgmtPrimaryNav
} = require('../api/action-mgmt/services.js');

describe('API: Service: Action Management', () => {
  const mockHost   = 'http://localhost:9819';
  let req, result;

  afterEach(() => {
    nock.cleanAll();
  });

  it('BindActionMgmtServiceMiddleware => should use CSRF token if "authorization" does not exist', done => {

    // ARRANGE => Mock middleware call
    const scope = nock(mockHost)
      .get('/actionManagement/security/csrftoken')
      .reply(200, {
        antiForgeryToken: '1234abc'
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      actionManagement: `${mockHost}/actionManagement/`
    };

    // ACT
    BindActionMgmtServiceMiddleware(req)
      .then(() => {

        // ARRANGE
        expect(scope.isDone()).toBe(true);

        done();
      })
  });

  it('BindActionMgmtServiceMiddleware => should NOT use CSRF token if "authorization" does not exist', done => {

    // ARRANGE => Mock middleware call
    const scope = nock(mockHost)
      .get('/actionManagement/security/csrftoken')
      .reply(200, {
        antiForgeryToken: '1234abc'
      });

    // ARRANGE => Mock request object
    req      = mocks.createRequest();
    req.apis = {
      actionManagement: `${mockHost}/actionManagement/`
    };
    req.headers['Authorization'] = '123455auth';

    // ACT
    BindActionMgmtServiceMiddleware(req)
      .then(() => {

        // ARRANGE
        expect(scope.isDone()).toBe(false);

        done();
      })
  });

});