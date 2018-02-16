const assert = require('assert');
const mocks = require('node-mocks-http');
const supertest = require('supertest');
const rewire = require('rewire');
const nock = require('nock');
const url = require('url');

const bindCSRFMiddlewares = require('../csrf-middleware');

const express = require('express');
const server = express();

describe('CSRF middleware', () => {

  it('should place the CSRF token as a cookie', done => {

    // Arrange
    var config = { 'Confirmit.Site.SSLEnabled': true };
    bindCSRFMiddlewares(server, config);
    server.get('/', (req,res) => res.sendStatus(200));  // creating one route

    // Act
    supertest(server)
      .get('/')
      .expect(res => {

        // Assert
        var csrfCookie = res.headers['set-cookie'].filter( cookie => ~cookie.indexOf('_csrf') );
        assert(csrfCookie.length == 1);
        assert(csrfCookie[0].indexOf('Secure') > -1)

      })
      .expect(200, done);
  });

});