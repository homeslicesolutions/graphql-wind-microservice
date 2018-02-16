const querystring = require('querystring');

// HELPERS
const querySelectedIds = (query) => {
  let newQuery = Object.assign({}, query);
  const key = 'Id';
  let values = newQuery.ids;

  if (!values || !values.trim() === '') {
    return newQuery;
  }
  values = values.split(',');
  values = values.map((value) => (`${key} eq '${value}'`));

  newQuery = newQuery || {};
  newQuery.$filter = newQuery.$filter ? `${newQuery.$filter} and ${values.join(' or ')}` : `(${values.join(' or ')})`;
  delete newQuery.ids;

  return newQuery;
};

const querySortBy = (query) => {
  const newQuery = Object.assign({}, query);
  const sortDirection = newQuery.sortDirection || 'asc';
  let sortBy = newQuery.sortBy;

  if (!sortBy) return newQuery;

  if (sortBy.length > 0) {
    sortBy = sortBy.charAt(0).toUpperCase() + sortBy.slice(1).toLowerCase();
  }

  newQuery.$orderby = `${sortBy}+${sortDirection}`;
  delete newQuery.sortBy;
  delete newQuery.sortDirection;

  return newQuery;
};

const querySearch = (query) => {
  // Create clone
  const newQuery = Object.assign({}, query);

  // If Search is blank that delete and return
  if (!newQuery.search || !newQuery.search.length) {
    delete newQuery.search;
    return newQuery;
  }

  // Search Phrase
  const searchPhrase = newQuery.search.toLowerCase();

  // Attribute filtering
  const attributes = ['Name']; // Room to expand here...

  // If Any attribute filtering
  if (attributes.find((attr) => searchPhrase.startsWith(`${attr.toLowerCase()}:`))) {
    const attribute = attributes.find((attr) => searchPhrase.startsWith(`${attr.toLowerCase()}`));
    const value = searchPhrase.substring(searchPhrase.indexOf(':') + 1);

    // Filter and take out native search
    newQuery.$filter = `substringof(tolower('${value}'),tolower(${attribute}))`;
    delete newQuery.search;

    // Or by ID
  } else if (searchPhrase.startsWith('id:') || searchPhrase.startsWith('hubid:')) {
    const value = searchPhrase.substring(searchPhrase.indexOf(':') + 1);

    const valueArr = value.split(',');

    // Filter and take out native search
    newQuery.$filter = valueArr
      .map((id) => `(Id eq '${id}')`)
      .join(' or ');

    delete newQuery.search;
  }

  return newQuery;
};

const queryUnescape = (query) => {
  return querystring.stringify(query, null, null, {encodeURIComponent: querystring.unescape});
};


// EXPORT
module.exports = {
  querySearch,
  querySortBy,
  querySelectedIds,
  queryUnescape
};
