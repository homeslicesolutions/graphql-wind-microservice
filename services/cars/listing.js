const backend = require('../../lib/backend');

// ASYNC METHODS (PROMISES)
const listCars = () => {
  return backend.get('http://localhost:3001/wind/v1/cars', {
      limit:    20,
      offset:   0,
      statuses: ['inventory', 'ready'],
      period:   1
    })
    .then(r => r.json())
    .then(cars => cars.data.map(car => ({
      id: car.id,
      ...car.attributes
    }))
  );
};

const listCarsByRegionLabel = (regionLabel) => {
  return backend.get('http://localhost:3001/wind/v1/cars', {
      limit:    20,
      offset:   0,
      region:   regionLabel,
    })
    .then(r => r.json())
    .then(cars => cars.data.map(car => ({
      id: car.id,
      ...car.attributes
    }))
  );
}

const getCar = (id) => {
  return backend.get(`http://localhost:3001/wind/v1/cars/${id}`)
    .then(r => r.json())
    .then(car => ({
      id: car.id,
      ...car.data.attributes,
    })
  );
};

// EXPORT
module.exports = { 
  listCars,
  listCarsByRegionLabel,
  getCar
};
