'use strict';

module.exports = (config) => (req, res, next) => {
  // Apply content security policy for modern browsers
  if (!config['Application.AssetsRoot']) {
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';");
  }
  return next();
};