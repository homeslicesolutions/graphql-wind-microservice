'use strict';

const path = require('path');
const fs   = require('fs');
// CONFIGURATION
module.exports = (filePath) => {
  const file = filePath || path.resolve(__dirname, '../configuration.json');

  let config;

  try {
    fs.accessSync(file, fs.F_OK);
    config = JSON.parse(fs.readFileSync(file));
  } catch (e) {
    console.error("Error: 'configuration.json' cannot be read or does not exist", e);
  }

  return config;
};
