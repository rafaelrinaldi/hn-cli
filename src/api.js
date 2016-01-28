const got = require('got');
const api = options => {
  return {
    url: 'https://hacker-news.firebaseio.com',
    hnUrl: 'https://news.ycombinator.com',
    version: 'v0',

    fetch: url => got(url, options),

    base() {
      return `${this.url}/${this.version}`;
    },

    stories() {
      return `${this.base()}/topstories.json`;
    },

    // Return URL of story data
    story(id, shouldPrettyPrint) {
      return `${this.base()}/item/${id}.json${shouldPrettyPrint ? '?print=pretty' : ''}`;
    },

    // Return URL of story on HN
    storyUrl(id) {
      return `${this.hnUrl}/item?id=${id}`;
    }
  };
};

module.exports = api;
