const { 
  listCars,
  getCar,
  getFromDeepLink,
} = require('../../services/cars/get');

module.exports = {
  Query: {
    async cars() {
      return await listCars();
    },

    async car(_, { id }) {
      return await getCar(id);
    },
  },
  Car: {
    region: async ({ region }) => {
      return await getFromDeepLink(region);
    },
  },
}