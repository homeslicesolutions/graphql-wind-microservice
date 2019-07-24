const { 
  listCars,
  getCar
} = require('../../services/cars/listing');

module.exports = {
  Query: {
    async cars() {
      return await listCars();
    },

    async car(_, { id }) {
      return await getCar(id);
    },
  },
}