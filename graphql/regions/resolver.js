const {
  listRegions,
  getRegion,
  getRegionByLabel
} = require('../../services/regions/listing');

const {
  listCarsByRegionLabel
} = require('../../services/cars/listing');

module.exports = {
  Query: {
    regions: async () => {
      return await listRegions();
    },
    region: async (_, { id, label }) => {
      if (id) {
        return await getRegion(id);
      }
      if (label) {
        return await getRegionByLabel(label);
      }
    }
  },
  Region: {
    cars: async ({ label }) => {
      return await listCarsByRegionLabel(label);
    }
  },
}