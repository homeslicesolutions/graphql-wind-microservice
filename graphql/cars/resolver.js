const { 
  listCars,
  getCar,
} = require('../../services/cars/get');

const { 
  getLinkItem,
} = require('../../services/links/get');

module.exports = {
  Query: {
    cars: () => {
      return listCars();
    },
    
    car: (_, { id }) => {
      return getCar(id);
    },
  },
  Car: {
    region: ({ region }) => {
      return getLinkItem(region.links.related);
    },
  },
}