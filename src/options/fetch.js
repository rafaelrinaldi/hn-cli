'use strict';

module.exports = () => {
  return {
    json: true,
    timeout: 8000,
    headers: {
      'user-agent': 'https://github.com/rafaelrinaldi/hn-cli'
    }
  }
};
