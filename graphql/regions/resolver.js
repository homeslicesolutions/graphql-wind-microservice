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
    region: (root, { id, label }, ctx) => {
      if (id) {
        return getRegion(ctx, id);
      }
      if (label) {
        return getRegionByLabel(ctx, label);
      }
    }
  },
  Region: {
    cars: ({ label }, args, ctx) => {
      return getCarsByRegionLabel(ctx, label);
    }
  },
}