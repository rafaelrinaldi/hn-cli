'use strict';

const now = require('moment');

module.exports = () => now().format(`dd H:mm A`);
