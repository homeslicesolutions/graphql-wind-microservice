module.exports = (name, config) => {
  return require(`./${name}`)(config);
};
