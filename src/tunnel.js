'use strict';

const tunnel = require('tunnel');

module.exports = tunnel.httpsOverHttp({
  proxy: {
    host: 'localhost'
  }
});
