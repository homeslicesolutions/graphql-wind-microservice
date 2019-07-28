const merge = require('lodash/merge');

module.exports = (...files) => {
  const importedFiles = files.map(file => {
    return require(file);
  });

  return merge(importedFiles);
}
