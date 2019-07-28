const {
  getRegion,
  getRegions,
  getRegionByLabel
} = require('../../services/regions/get');

const {
  getCarsByRegionLabel
} = require('../../services/cars/get');

module.exports = {
  Query: {
    regions: (root, args, ctx) => {
      return getRegions(ctx);
    },
    region: (root, args, ctx) => {
      const { id, label } = args;

      if (id) {
        return getRegion(ctx, id);
      }
      if (label) {
        return getRegionByLabel(ctx, label);
      }
    }
  },
  Region: {
    cars: (root, args, ctx) => {
      const { label } = root;
      return getCarsByRegionLabel(ctx, label);
    }
  },
}