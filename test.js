'use strict';

var hnCli = require('./');
var test = require('tape');

test('hn-cli test suite', function(t) {
  t.equal(hnCli('foo'), true, '');
  t.end();
});
