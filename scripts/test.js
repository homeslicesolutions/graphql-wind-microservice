'use strict';

process.env.NODE_ENV = 'test';

const jest = require('jest');
const argv = process.argv.slice(2);

argv.push('--testPathPattern=gateway\\\\(?!scripts)');
argv.push('--coverage');

jest.run(argv);
