'use strict';

var Promise = require('pinkie-promise');
var got = require('got');
var openUrl = require('openurl');
var format = require('util').format;
var blessed = require('blessed');
var Renderer = require('./src/renderer');
var renderer = new Renderer();
var cache = {};
var options = {
  limit: 5,
  fetch: {
    json: true,
    headers: {
      'user-agent': 'https://github.com/rafaelrinaldi/hn-cli'
    }
  }
};
var api = {
  url: 'https://hacker-news.firebaseio.com/%s',
  version: 'v0',
  fetch: function(url) {
    console.log('fetch', url);
    return got(url, options.fetch);
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
};

function limitResults(results, limit) {
  console.log('limit results to', limit);
  return results.slice(0, limit || 30);
}

function fetchTopStories() {
  console.log('fetching top stories...');
  return api.fetch(api.stories());
}

function parseTopStories(stories) {
  return Promise.all(
      stories.map(function(id) {
        return fetchStory(id);
      })
    );
}

function fetchStory(id) {
  console.log('fetchind story', id);
  return api.fetch(api.story(id));
}

function parseStory(story) {
  return story.title;
}

function refresh() {
  return fetchTopStories()
    .then(function(response) {
      return limitResults(response.body, options.limit);
    })
    .then(function(response) {
      return parseTopStories(response);
    })
    .then(function(response) {
      return response.map(function(item) {
        return item.body;
      })
    })
    .then(function(response) {
      // Store data to the cache
      cache = response;

      return [[
        'Title',
        'Score',
        'Comments',
        'Author'
      ]].concat(
        response.map(function(item) {
          return [
            item.title,
            item.score,
            item.descendants,
            item.by
          ];
        })
      );
    });
}

function render(data) {
  renderer.render(data);
}

refresh().then(render);
