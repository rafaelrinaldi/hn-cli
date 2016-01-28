'use strict';

const logUpdate = require('log-update');
const frames = ['-', '\\', '|', '/'];

let frame = 0;
let interval;

const stop = () => {
  logUpdate.clear();
  clearInterval(interval);
};

const start = text => {
  stop();

  interval = setInterval(() => {
    logUpdate(`${frames[frame = ++frame % frames.length]} ${text ? text : ''}`);
  }, 100);
};

module.exports = {
  start,
  stop
};
