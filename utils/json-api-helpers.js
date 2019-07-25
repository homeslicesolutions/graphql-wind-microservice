const camelize = require('./camelize');


function camelizeKeys(obj) {
  return Object.keys(obj).reduce((newObj, key) => ({
    ...newObj,
    [camelize(key)]: obj[key],
  }), {});
}

function parseAttributes(model) {
  return {
    id: model.id,
    ...camelizeKeys(model.attributes),
    ...camelizeKeys(model.relationships || {}),
  }
}

module.exports = {
  parseAttributes,
  camelizeKeys,
};
