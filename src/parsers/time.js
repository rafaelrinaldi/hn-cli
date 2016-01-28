'use strict';

// Convert Unix epoch time format to JavaScript date format
module.exports = time => new Date(0).setUTCSeconds(time);
