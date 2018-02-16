'use strict';
const fetch       = require('./fetch-with-error-handling');
const logger      = require('./gateway-logger');
const querystring = require('querystring');

// API
const backend = {

  get: (req = {}, url, queryObj, silentError) => {
    let headers = req && filterHeaders(req.headers);

    url = appendQueryString(url, queryObj);

    return fetch(url, {
      method : 'get',
      headers: headers,
      silentError
    })
  },

  post: (req = {}, url, body, queryObj) => {
    body             = body || {};
    let bodyAsString = JSON.stringify(body);

    let headers = filterHeaders(req && req.headers) ;
    headers     = correctContentLengthAndType(headers, bodyAsString);

    url = appendQueryString(url, queryObj);

    return fetch(url, {
      method : 'post',
      headers: headers,
      body   : bodyAsString
    })
  },

  put: (req = {}, url, body, queryObj) => {
    body             = body || {};
    let bodyAsString = JSON.stringify(body);

    let headers = filterHeaders(req && req.headers);
    headers     = correctContentLengthAndType(headers, bodyAsString);

    url = appendQueryString(url, queryObj);

    return fetch(url, {
      method : 'put',
      headers: headers,
      body   : bodyAsString
    })
  },

  patch: (req = {}, url, body, queryObj) => {
    body             = body || {};
    let bodyAsString = JSON.stringify(body);

    let headers = filterHeaders(req && req.headers);
    headers     = correctContentLengthAndType(headers, bodyAsString);

    url = appendQueryString(url, queryObj);

    return fetch(url, {
      method : 'patch',
      headers: headers,
      body   : bodyAsString
    })
  },

  delete: (req = {}, url, queryObj) => {
    let headers = filterHeaders(req && req.headers);

    url = appendQueryString(url, queryObj);

    return fetch(url, {
      method : 'delete',
      headers: headers
    })
  },

  fetch: fetch

};

// Function
function appendQueryString(url, queryObj) {
  if (!queryObj || !Object.keys(queryObj).length) return url;
  url += ~url.indexOf('?') ? '&' : '?';
  url += querystring.stringify(queryObj);
  return url;
}

// another function
function correctContentLengthAndType(headers, bodyAsString) {
  let newHeaders = Object.assign({}, headers);
  if (!(newHeaders['Content-Type'] || newHeaders['content-type'])) {
    newHeaders['Content-Type'] = 'application/json; charset=utf-8';
  }
  if (newHeaders['content-length']) {
    newHeaders['content-length'] = bodyAsString.length;
  } else {
    newHeaders['Content-Length'] = bodyAsString.length;
  }
  return newHeaders;
}

function filterHeaders(headers) {
  let newHeaders = Object.assign({}, headers);
  delete newHeaders.host;
  delete newHeaders.origin;
  delete newHeaders.headers;
  return newHeaders;
}

// Export
module.exports = backend;