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
    
    car: (root, args, ctx) => {
      return args;
    },
  },
  Car: {
    id: (root, args, ctx) => {
      return root.id;
    },

    make: async (root, args, ctx) => {
      const { id } = root;
      const { make } = await getCar(ctx, id);
      return make;
    },

    model: async (root, args, ctx) => {
      const { id } = root;
      const { model } = await getCar(ctx, id);
      return model;
    },

    modelYear: async (root, args, ctx) => {
      const { id } = root;
      const { modelYear } = await getCar(ctx, id);
      return modelYear;
    },

    region: (root, args, ctx) => {
      const { region } = root;
      return getLinkItem(ctx, region.links.related);
    },
  },
}