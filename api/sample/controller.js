const {getSamples,getSample} = require('./services');

// API
const sampleController = (apiRouter) => {
  apiRouter.get('/sample', (req, res, next) => {
    getSamples(req, req.query)
      .then((payload) => res.json(payload))
      .catch((e) => next(e));
  });

  apiRouter.get('/sample/:id', (req, res, next) => {
    getSample(req, req.params.id)
      .then((payload) => res.json(payload))
      .catch((e) => next(e));
  });
};

// EXPORT
module.exports = sampleController;
