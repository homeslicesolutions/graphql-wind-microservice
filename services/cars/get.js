const backend = require('../../lib/backend');
const { parseAttributes } = require('../../utils/json-api-helpers');

// FETCH METHODS
const getCars = (ctx) => {
  const { baseUrl, req } = ctx;

  return backend.get(req, `${baseUrl}/wind/v1/cars`, {
      limit:    20,
      offset:   0,
      statuses: ['inventory', 'ready'],
      period:   1
    })
    .then(r => r.json())
    .then(cars => cars.data.map(parseAttributes));
};

const getCarsByRegionLabel = (ctx, regionLabel) => {
  const { baseUrl, req } = ctx;

  return backend.get(req, `${baseUrl}/wind/v1/cars`, {
      limit:    20,
      offset:   0,
      region:   regionLabel,
    })
    .then(r => r.json())
    .then(cars => cars.data.map(parseAttributes));
}

const getCar = (ctx, id) => {
  const { baseUrl, req } = ctx;

  return backend.get(req, `${baseUrl}/wind/v1/cars/${id}`)
    .then(r => r.json())
    .then(car => parseAttributes(car.data));
};

// EXPORT
module.exports = { 
  getCars,
  getCarsByRegionLabel,
  getCar,
};
