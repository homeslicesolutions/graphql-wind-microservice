const assert = require('assert');
const mocks = require('node-mocks-http');

const microserviceHeadersMiddleware = require('../microservice-headers');

describe('Microservice middleware', () => {
  process.env.PORT = 9818;
  var config, req, res, mockHost = 'http://localhost:' + process.env.PORT;
  var next = () => {};

  beforeEach(() => {
    req = mocks.createRequest();
    res = mocks.createResponse();
    config = {};
  });

  it('should place "application/json" in the header to expect JSON when making requests on gateway', done => {
    microserviceHeadersMiddleware(config)(req,res,next);

    assert(!!req.headers.accept.match('application/json'));
    done();
  });

  it('should place default Discovery Analytics headers with Correlation Id', done => {
    microserviceHeadersMiddleware(config)(req,res,next);

    assert(req.headers['x-confirmit-correlation-id'].length > 1);
    assert(req.headers['x-confirmit-user-agent'] == 'Confirmit.Application.Client');
    assert(req.headers['x-confirmit-initiating-service'] == 'Confirmit.Application.Client');
    done();
  });

  it('should relay previous set values and fill in default values', done => {
    req.headers['x-confirmit-correlation-id'] = '12345abcdef';
    req.headers['x-confirmit-user-agent']     = 'Different App';

    microserviceHeadersMiddleware(config)(req,res,next);

    assert(req.headers['x-confirmit-correlation-id'] == '12345abcdef');
    assert(req.headers['x-confirmit-user-agent'] == 'Different App');
    assert(req.headers['x-confirmit-initiating-service'] == 'Confirmit.Application.Client');
    done();
  });

});