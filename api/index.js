module.exports = (apiRouter, config) => {
  require('./countries/controller')(apiRouter, config);
};
