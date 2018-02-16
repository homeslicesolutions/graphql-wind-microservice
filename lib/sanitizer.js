'From http://kroltech.com/2014/05/30/sanitizing-xss-and-html-with-express-middleware/'
'use strict';
var sanitizer = require('sanitize-html'),
  _ = require('lodash');

var sanitizeString = function(str) {
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/&lt;/gi, '<');
    str = str.replace(/&quot;/gi, '"');
    str = str.replace(/&amp;/gi, '&');
    //str = str.replace(/(&copy;|&quot;|&amp;)/gi, '');

    return sanitizer(str, {
      allowedTags: []
    });
  },
  sanitizeObject = function(object) {
    _.each(object, function(value, key) {
      if(typeof value === 'object') {
        return sanitizeObject(value);
      }
      if (typeof value === 'string' || value instanceof String) {
        object[key] = sanitizeString(value);
      }
    });
  };

module.exports = function(config, errors) {
  return function(req, res, next) {

    // Sanitize data coming into DA
    if (req.body) {
      sanitizeObject(req.body);
    }

    // TODO: Sanitize data coming out?

    // Apply content security policy for modern browsers
    res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';");

    return next();
  };
};