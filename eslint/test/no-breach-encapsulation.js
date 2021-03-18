'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require('eslint');

const tester = new RuleTester();

// eslint-disable-next-line @typescript-eslint/no-var-requires
tester.run('no-breach-encapsulation', require('../rule/no-breach-encapsulation'), {
  valid: [],
  invalid: [],
});
