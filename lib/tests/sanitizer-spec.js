const assert = require('assert');
const mocks = require('node-mocks-http');
const supertest = require('supertest');
const rewire = require('rewire');
const nock = require('nock');
const _ = require('lodash');
const url = require('url');

const santizierMiddleware = rewire('../sanitizer.js');

describe('Sanitizer middleware', () => {

  const sanitizeString = santizierMiddleware.__get__('sanitizeString');
  const sanitizeObject = santizierMiddleware.__get__('sanitizeObject');

  it('sanitizeString => should clean out any html elements', done => {
    assert(sanitizeString('<div>hello</div>') == 'hello');
    done();
  });

  it('sanitizeString => should take out all <script> tags', done => {
    assert(sanitizeString('<script>alert("haha")</script>') == '');
    done();
  });

  it('sanitizeString => should take out all sneaky encoded tags i.e. &lt;script&gt;', done => {
    assert(sanitizeString('&lt;script&gt; alert(&quot;haha&quot;) &lt;/script&gt;') == "");
    done();
  });

  it('sanitizeObject => should sanitize object', done => {
    // Arrange
    var inputObj = {
      string: "string",
      malicious: "<div>hello</div>"
    };

    var expectedObj = {
      string: "string",
      malicious: "hello"
    };

    // Act
    sanitizeObject(inputObj);

    // Assert
    assert(_.isEqual(inputObj, expectedObj));
    done();
  });

  it('sanitizeObject => should sanitize deep object', done => {
    var inputObj = {
      malicious: "<div>hello</div>",
      child: {
        grandchild: "<script>alert('yo')</script>"
      }
    };

    var expectedObj = {
      malicious: 'hello',
      child: {
        grandchild: ''
      }
    };

    sanitizeObject(inputObj);

    assert(_.isEqual(inputObj, expectedObj));
    done();
  });

  it('should apply sanitization if there is a body from a POST or PUT', done => {
    // Arrange
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    const next = () => {};

    req.body = {
      malicious: "<div>hello</div>",
      child: {
        grandchild: "<script>alert('yo')</script>"
      }
    };

    var expectedObj = {
      malicious: 'hello',
      child: {
        grandchild: ''
      }
    };

    // Act
    santizierMiddleware()(req,res,next);

    // Assert
    assert(_.isEqual(req.body, expectedObj));
    done();
  });

  it('should set Content Security Policy settings in response header', done => {
    // Arrange
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    const next = () => {};

    // Act
    santizierMiddleware()(req,res,next);

    // Assert
    assert(res.getHeader('Content-Security-Policy').length);
    done();
  });


});