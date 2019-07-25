const { 
  getCars,
  getCar,
} = require('../../services/cars/get');

const { 
  getLinkItem,
} = require('../../services/links/get');

module.exports = {
  Query: {
    cars: (root, args, ctx) => {
      return getCars(ctx);
    },
    
    car: (_, { id }, ctx) => {
      return getCar(ctx, id);
    },
  },
  Car: {
    region: ({ region }, args, ctx) => {
      return getLinkItem(ctx, region.links.related);
    },
  },
}