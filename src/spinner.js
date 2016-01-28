'use strict';

const logUpdate = require('log-update');
const frames = ['-', '\\', '|', '/'];

let frame = 0;
let interval;

const start = text => {
  stop();

  interval = setInterval(() => {
    logUpdate(frames[frame = ++frame % frames.length] + ' ' + (text || ''));
  }, 100);
}

const stop = () => {
  logUpdate.clear();
  clearInterval(interval);
}

module.exports = {
  start,
  stop
};
