const co = require('co');
const get = require('lodash/get');
const set = require('lodash/set');
const backend = require('../../lib/backend');
const {serializeToJSONAPIFormat, grabFirst} = require('./helper');

// ASYNC METHODS (PROMISES)
const getCountries = (req) => {
  const url = 'http://countryapi.gear.host/v1/Country/getCountries';
  return backend.get(req, url)
    .then((r) => r.json())
    .then(serializeToJSONAPIFormat)
    .then(grabFirst(10))
};

const getPopulationForCountryToday = (req, country) => {
  const url = `http://api.population.io:80/1.0/population/${country}/today-and-tomorrow/?format=json`;
  return backend.get(req, url)
    .then((r) => r.json())
    .then((json) => get(json, 'total_population.0.population'))
    .catch((e) => (0))
};

const getCountriesWithPopulation = (req) => co(function* () {

  // Get Countries First
  let countriesData = yield getCountries(req);

  // Loop through (generators only yield on root... lames)
  for (let i=0; i < countriesData.data.length; i++) {
    const countryId = get(countriesData, `data.${i}.id`);
    if (countryId) {

      // Get Population
      const population = yield getPopulationForCountryToday(req, countryId);

      // Add the population
      set(countriesData, `data.${i}.attrs.Population`, population);
    }
  }

  return countriesData;
});

// EXPORT
module.exports = {
  getCountries,
  getPopulationForCountryToday,
  getCountriesWithPopulation
};
