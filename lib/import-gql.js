const fs = require('fs');
const { gql } = require('apollo-server-express');

module.exports = (...fileNames) => {
  const shitTonOfGql = fileNames.map(fileName => {
    return fs.readFileSync(fileName, { encoding: 'utf-8' });
  });

  return gql(shitTonOfGql.join(''));
};
