const backend = require('../../lib/backend');
const { parseAttributes, camelizeKeys } = require('../../utils/json-api-helpers');

// ASYNC METHODS (PROMISES)
const listRegions = () => {
  return backend.get('http://localhost:3001/wind/v1/regions')
    .then((r) => r.json())
    .then(regions => regions.data.map(parseAttributes));
};

const getRegion = (id) => {
  return backend.get(`http://localhost:3001/wind/v1/regions/${id}`)
    .then(r => r.json())
    .then(region => parseAttributes(region.data));
};

const getRegionByLabel = async (label) => {
  const regions = await listRegions();
  return regions.find(region => region.label === label);
};

// EXPORT
module.exports = {
  listRegions,
  getRegion,
  getRegionByLabel
};
