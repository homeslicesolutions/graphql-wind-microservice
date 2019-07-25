const backend = require('../../lib/backend');
const DataLoader = require('dataloader');
const { parseAttributes } = require('../../utils/json-api-helpers');

// ASYNC METHODS (PROMISES)
const getItemFromLink = async (link) => {
  return backend.get(`http://localhost:3001${link}`)
    .then(r => r.json())
    .then(region => parseAttributes(region.data));
};

const listItemsByLinks = async (links) => {
  return Promise.all(links.map(link => getItemFromLink(link)));
}

// LOADERS
const deepLinkLoader = new DataLoader(listItemsByLinks);

const getLinkItem = (link) => {  
  return deepLinkLoader.load(link);
}

// EXPORT
module.exports = { 
  getItemFromLink,
  listItemsByLinks,
  getLinkItem,
};
