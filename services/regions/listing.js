const backend = require('../../lib/backend');

// ASYNC METHODS (PROMISES)
const listRegions = (req) => {
  return backend.get(req, 'http://localhost:3001/wind/v1/regions')
    .then((r) => r.json())
    .then(regions => regions.data.map(region => ({
      id: region.id,
      ...region.attributes
    }))
  );
};

const getRegion = (id) => {
  return backend.get(req, `http://localhost:3001/wind/v1/regions/${id}`)
    .then(r => r.json())
    .then(region => ({
      id: region.id,
      ...region.data.attributes,
    })
  );
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
