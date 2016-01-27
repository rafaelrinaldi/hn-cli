var format = require('util').format;
var got = require('got');

function api(options) {
  return {
    url: 'https://hacker-news.firebaseio.com/%s',
    version: 'v0',

    fetch: function(url) {
      return got(url, options);
    },

    base: function() {
      return format(this.url, this.version);
    },

    stories: function() {
      return this.base() + '/topstories.json';
    },

    story: function(id, shouldPrettyPrint) {
      return this.base() + '/item/' + id + '.json' + (shouldPrettyPrint ? '?print=pretty' : '');
    }
  }
}

module.exports = api;
