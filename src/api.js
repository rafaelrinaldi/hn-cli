const got = require('got');
const api = options => {
  return {
    url: 'https://hacker-news.firebaseio.com',
    version: 'v0',

    fetch: url => got(url, options),

    base() {
      return `${this.url}/${this.version}`;
    },

    stories() {
      return this.base() + '/topstories.json';
    },

    story(id, shouldPrettyPrint) {
      return this.base() + `/item/${id}.json` + (shouldPrettyPrint ? '?print=pretty' : '');
    }
  }
}

module.exports = api;
