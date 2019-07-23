module.exports = {
  Query: {
    cars: () => {
      return [
        {
          id: 123,
          make: 'Ford',
          model: 'Focus',
          modelYear: 2015,
        },
        {
          id: 456,
          make: 'Toyota',
          model: 'Prius',
          modelYear: 2010,
        }
      ]
    },
  },
}