const cors = require('../lib/cors');
const rewire = require('rewire');
const path = require('path');

const middleware = rewire(path.resolve(__dirname, '../lib/cors.js'));

describe('CORs', () => {

  it('validateOrigin(config, origin, host) => should match the domains (True)', done => {

    // ARRANGE => Get private function
    const validateOrigin = middleware.__get__('validateOrigin');

    // ACT
    const result = validateOrigin(null, 'http://mob.testlab.firmglobal.net', 'mob.testlab.firmglobal.net:8888');

    // ASSERT
    expect(result).toEqual(true);

    done();
  });

  it('validateOrigin(config, origin, host) => should deny if the domains dont match (False)', done => {

    // ARRANGE => Get private function
    const validateOrigin = middleware.__get__('validateOrigin');

    // ACT
    const result = validateOrigin(null, 'http://dude.testlab.firmglobal.com', 'mob.testlab.firmglobal.net:8888');

    // ASSERT
    expect(result).toEqual(false);

    done();
  });

});