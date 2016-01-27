var logUpdate = require('log-update');
var frames = ['-', '\\', '|', '/'];
var frame = 0;
var interval;

function start(text) {
  stop();

  interval = setInterval(function() {
    logUpdate(frames[frame = ++frame % frames.length] + ' ' + (text || ''));
  }, 100);
}

function stop() {
  logUpdate.clear();
  clearInterval(interval);
}

module.exports = {
  start: start,
  stop: stop
};
