const log = module.exports = require('caroline');

// Console Appender
log.response = function(method, url, status_code, http_version, content_length, timeMs, requestBody) {
  if (this.disabled) {
    return;
  }
  status_code = String(status_code);
  var statusColor = status_code.indexOf('2') === 0 ? 'green' : 'red';
  console.log(
    this.color[statusColor](method.toUpperCase()),
    this.logTimestamp(),
    this.color[statusColor](status_code),
    url,
    'HTTP/' + http_version,
    content_length + 'bytes',
    '(' + timeMs + 'ms)',
    requestBody
  );
};
