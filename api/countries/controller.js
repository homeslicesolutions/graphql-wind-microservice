const {
  getCountriesWithPopulation
} = require('./services');

// API
const countriesController = (apiRouter) => {
  apiRouter.get('/countries', (req, res, next) => {
    getCountriesWithPopulation(req)
      .then((payload) => res.json(payload))
      .catch((e) => next(e));
  });

  apiRouter.get('/countries/:id', (req, res, next) => {
    getSample(req, req.params.id)
      .then((payload) => res.json(payload))
      .catch((e) => next(e));
  });
};

// EXPORT
module.exports = countriesController;
