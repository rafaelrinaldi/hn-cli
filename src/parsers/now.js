'use strict';

const moment = require('moment');

module.exports = () => {
  return moment().format(`ddd H:mm A`);
};
