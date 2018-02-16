const resolveAbsoluteUrl = require('../lib/resolve-absolute-url');

describe('Resolve Absolute Url for App Configs', () => {

  it('resolveAbsoluteUrl(config, req, "SomeApp") => should just return the url if already absolute "http"', (done) => {

    // ARRANGE
    const req = {};
    const config = {
      'Confirmit.SomeApp.Url': 'http://someapp/yes'
    };

    // ACT
    const result = resolveAbsoluteUrl(config, req, 'Confirmit.SomeApp.Url');

    // ASSERT
    expect(result).toEqual('http://someapp/yes');

    done();
  });

  it('resolveAbsoluteUrl(config, req, "SomeApp") => should just return absolute url with just a path i.e. /something', (done) => {

    // ARRANGE
    const req = { headers: { host: 'somehost' } };
    const config = {
      'Confirmit.Site.SSLEnabled': 'True',
      'Confirmit.SomeApp.Url': '/something'
    };

    // ACT
    const result = resolveAbsoluteUrl(config, req, 'Confirmit.SomeApp.Url');

    // ASSERT
    expect(result).toEqual('https://somehost/something');

    done();
  });

  it('resolveAbsoluteUrl(config, req, "SomeApp") => should just return absolute url with just // starting i.e. //something', (done) => {

    // ARRANGE
    const req = { headers: { host: 'somehost' } };
    const config = {
      'Confirmit.Site.SSLEnabled': 'False',
      'Confirmit.SomeApp.Url': '//something.com'
    };

    // ACT
    const result = resolveAbsoluteUrl(config, req, 'Confirmit.SomeApp.Url');

    // ASSERT
    expect(result).toEqual('http://something.com');

    done();
  });

});