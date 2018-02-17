const get = require('lodash/get');

const serializeToJSONAPIFormat = (result) => {
  return {
    count: result.TotalCount || 0,
    data: get(result, `Response`, []).map((country) => {
      return {
        id: country.Name,
        attrs: country
      }
    })
  }
};

const grabFirst = (number) => (result) => ({
  count: number,
  data: get(result, `data`, []).slice(0, number)
});

module.exports = {
  serializeToJSONAPIFormat,
  grabFirst
};
