const isSiteSSL = require('../lib/is-site-ssl');

describe('Is Site SSL', () => {

  it('isSiteSSL(config) => should parse string even with mixed cases (True)', done => {

    // ARRANGE
    const config = {
      'Confirmit.Site.SSLEnabled': "TrUe"
    };

    // ACT
    const result = isSiteSSL(config);

    // ASSERT
    expect(result).toEqual(true);

    done();
  });

  it('isSiteSSL(config) => should parse regular boolean (true)', done => {

    // ARRANGE
    const config = {
      'Confirmit.Site.SSLEnabled': true
    };

    // ACT
    const result = isSiteSSL(config);

    // ASSERT
    expect(result).toEqual(true);

    done();
  });

  it('isSiteSSL(config) => should return false with (false)', done => {

    // ARRANGE
    const config = {
      'Confirmit.Site.SSLEnabled': "false"
    };

    // ACT
    const result = isSiteSSL(config);

    // ASSERT
    expect(result).toEqual(false);

    done();
  });

  it('isSiteSSL(config) => should return false with (undefined)', done => {

    // ARRANGE
    const config = {};

    // ACT
    const result = isSiteSSL(config);

    // ASSERT
    expect(result).toEqual(false);

    done();
  });

});