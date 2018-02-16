'use strict';
const assert    = require('assert');
const mocks     = require('node-mocks-http');
const supertest = require('supertest');
const rewire    = require('rewire');
const nock      = require('nock');
const url       = require('url');

const corsMiddleware = rewire('../cors.js');

describe('Cors middleware', () => {

  const validateOrigin      = corsMiddleware.__get__('validateOrigin');
  const filterOutEmpty      = corsMiddleware.__get__('filterOutEmpty');
  const filterOutDuplicates = corsMiddleware.__get__('filterOutDuplicates');
  let config;

  it('validateOrigin => should NOT allow cross-origin (production)', done => {
    assert(!validateOrigin(config, 'http://google.com', 'yahoo.com'));
    done();
  });

  it('validateOrigin => should allow same domain (i.e. something.something.firmglobal.net)', done => {
    assert(validateOrigin(config, 'http://something.firmglobal.net', 'reportal.testlab.firmglobal.net'));
    done();
  });

  it('validateOrigin => should ignore port numbers in domain checking', done => {
    assert(validateOrigin(config, 'http://something.firmglobal.net:9090', 'reportal.testlab.firmglobal.net'));
    done();
  });

  it('filterOutEmpty => should filter out all blank entries in array', done => {
    let headers = ['content-type', '', 'x-authentication', '', 'cookie'];
    let filteredHeaders = filterOutEmpty(headers);
    assert(filteredHeaders.length == 3);
    assert(filteredHeaders[0] == 'content-type');
    assert(filteredHeaders[1] == 'x-authentication');
    assert(filteredHeaders[2] == 'cookie');
    done();
  });

  it('filterOutDuplicates => should filter out all duplicate entries in array', done => {
    let headers = ['content-type', 'content-type', 'cookie', 'x-authentication', 'content-type', 'cookie'];
    let filteredHeaders = filterOutDuplicates(headers);
    assert(filteredHeaders.length == 3);
    assert(filteredHeaders[0] == 'content-type');
    assert(filteredHeaders[1] == 'cookie');
    assert(filteredHeaders[2] == 'x-authentication');
    done();
  });

  it('should place the appropriate headers if crossed origin and valid', done => {
    const req  = mocks.createRequest();
    const res  = mocks.createResponse();
    const next = () => {
    };

    req.headers.origin = 'http://ad.firmglobal.net';
    req.headers.host   = 'http://reportal.firmglobal.net';

    corsMiddleware(config)(req, res, next);

    assert(res.getHeader('Access-Control-Allow-Origin') === 'http://ad.firmglobal.net');
    assert(res.getHeader('Access-Control-Allow-Methods') != undefined);
    assert(res.getHeader('Access-Control-Allow-Headers') != undefined);
    assert(res.getHeader('Access-Control-Expose-Headers') != undefined);
    assert(res.getHeader('Access-Control-Allow-Credentials') == 'true');

    done();
  });

  it('should pass through headers if in request object and passes origin check', done => {
    const req  = mocks.createRequest();
    const res  = mocks.createResponse();
    const next = () => {
    };

    req.headers.origin = 'http://ad.firmglobal.net';
    req.headers.host   = 'http://reportal.firmglobal.net';
    req.headers['Access-Control-Allow-Headers'] = 'content-type,domain-error,x-auth,x-confirmit-header';
    req.headers['Access-Control-Request-Headers'] = 'content-type,,x-auth,x-request-type,another-header';

    corsMiddleware(config)(req, res, next);

    assert(res.getHeader('Access-Control-Allow-Headers') == 'domainerror,content-type,domain-error,x-auth,x-confirmit-header,x-request-type,another-header');
    assert(res.getHeader('Access-Control-Expose-Headers') == 'domainerror,content-type,domain-error,x-auth,x-confirmit-header,x-request-type,another-header');

    done();
  });

  it('should not place headers if the origin is invalid', done => {
    const req  = mocks.createRequest();
    const res  = mocks.createResponse();
    const next = () => {
    };

    req.headers.origin = 'http://malicious.net';
    req.headers.host   = 'http://reportal.firmglobal.net';

    corsMiddleware(config)(req, res, next);

    assert(res.getHeader('Access-Control-Allow-Origin') == undefined);
    assert(res.getHeader('Access-Control-Allow-Methods') == undefined);
    assert(res.getHeader('Access-Control-Allow-Headers') == undefined);
    assert(res.getHeader('Access-Control-Expose-Headers') == undefined);
    assert(res.getHeader('Access-Control-Allow-Credentials') == undefined);

    done();
  });
});