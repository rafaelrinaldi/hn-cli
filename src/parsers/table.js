var moment = require('moment');
var time = require('./time');

module.exports = function(data) {
  return [[
    'Title',
    'By',
    'When'
  ]].concat(
      data.map(function(item) {
        var when = time(item.time);

        return [
          String(item.title),
          String(item.by),
          moment(when).fromNow()
        ];
      })
    );
};
