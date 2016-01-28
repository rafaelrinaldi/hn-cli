'use strict';

const moment = require('moment');
const time = require('./time');

module.exports = data => {
  return [[
    'Title',
    'By',
    'When'
  ]].concat(
      data.map(item => {
        const when = time(item.time);

        return [
          String(item.title),
          String(item.by),
          moment(when).fromNow()
        ];
      })
    );
};
