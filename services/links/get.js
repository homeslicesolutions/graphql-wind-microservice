const backend = require('../../lib/backend');
const DataLoader = require('dataloader');
const { parseAttributes } = require('../../utils/json-api-helpers');

// LOADERS
const deepLinkLoader = new DataLoader(keys => {
  const links = keys.map(key => key.link);
  const { ctx } = keys[0];
  return fetchLinkItems(ctx, links);
});

// FETCH
const fetchLinkItem = (ctx, link) => {
  const { baseUrl, req } = ctx;

  return backend.get(req, `${baseUrl}${link}`)
    .then(r => r.json())
    .then(region => parseAttributes(region.data));
};

const fetchLinkItems = (ctx, links) => {
  return Promise.all(links.map(link => fetchLinkItem(ctx, link)));
}

// GET METHODS
const getLinkItem = (ctx, link) => {  
  return deepLinkLoader.load({ ctx, link });
}

// EXPORT
module.exports = { 
  getLinkItem,
};
