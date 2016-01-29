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
          `${item.title}`,
          `${item.by}`,
          moment(when).fromNow()
        ];
      })
    );
};
