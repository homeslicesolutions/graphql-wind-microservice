const DataLoader = require('dataloader');
const backend = require('../../lib/backend');
const { parseAttributes } = require('../../utils/json-api-helpers');

// LOADER
const regionLoader = new DataLoader(keys => {
  const ids = keys.map(key => key.id);
  const { ctx } = keys[0];
  return fetchRegionsByIds(ctx, ids);
});

// FETCH METHODS
const fetchRegion = (ctx, id) => {
  const { baseUrl, req } = ctx;

  return backend.get(req, `${baseUrl}/wind/v1/regions/${id}`)
    .then(r => r.json())
    .then(region => parseAttributes(region.data));
};

const fetchRegions = (ctx) => {
  const { baseUrl, req } = ctx;

  return backend.get(req, `${baseUrl}/wind/v1/regions`)
    .then((r) => r.json())
    .then(regions => regions.data.map(parseAttributes));
};

const fetchRegionsByIds = (ctx, ids) => {
  return Promise.all(ids.map(id => fetchRegion(ctx, id)));
}

// GET METHODS
const getRegionByLabel = async (ctx, label) => {
  const regions = await getRegions(ctx);
  return regions.find(region => region.label === label);
};

const getRegion = (ctx, id) => { 
  return regionLoader.load({ ctx, id });
}

const getRegions = (ctx) => {
  return fetchRegions(ctx);
}

// EXPORT
module.exports = {
  getRegions,
  getRegion,
  getRegionByLabel,
};
