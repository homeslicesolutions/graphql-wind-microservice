const co = require('co');
const backend = require('../../lib/backend');

const {
  queryUnescape,
  querySelectedIds,
  querySortBy,
  querySearch
} = require('./helpers');

// ASYNC METHODS (PROMISES)
const getSamples = (req, query) => {
  const oDataQuery = queryUnescape(querySelectedIds(querySortBy(querySearch(query))));
  const url = `${req.apis.smartHub}hubs?${oDataQuery}`;
  return backend.get(req, url)
    .then((r) => r.json());
};

const getSample = (req, hubId) => {
  const url = `${req.apis.smartHub}hubs/${hubId}`;
  return backend.get(req, url)
    .then((r) => r.json());
};

// EXPORT
module.exports = {
  getSamples,
  getSample
};
