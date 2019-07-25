const DataLoader = require('dataloader');
const backend = require('../../lib/backend');
const { parseAttributes } = require('../../utils/json-api-helpers');

// ASYNC METHODS (PROMISES)
const listRegions = () => {
  return backend.get('http://localhost:3001/wind/v1/regions')
    .then((r) => r.json())
    .then(regions => regions.data.map(parseAttributes));
};

const listRegionsByIds = async (ids) => {
  return Promise.all(ids.map(id => fetchRegion(id)));
}

const fetchRegion = (id) => {
  return backend.get(`http://localhost:3001/wind/v1/regions/${id}`)
    .then(r => r.json())
    .then(region => parseAttributes(region.data));
};

const getRegionByLabel = async (label) => {
  const regions = await listRegions();
  return regions.find(region => region.label === label);
};

// LOADER
const regionLoader = new DataLoader(listRegionsByIds);

const getRegion = (id) => { 
  return regionLoader.load(id);
}

// EXPORT
module.exports = {
  listRegions,
  listRegionsByIds,
  fetchRegion,
  getRegion,
  getRegionByLabel,
};
