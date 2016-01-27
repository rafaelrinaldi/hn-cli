'use strict';

var Promise = require('pinkie-promise');
var got = require('got');
var objectAssign = require('object-assign');
var openUrl = require('openurl').open;
var format = require('util').format;
var blessed = require('blessed');
var logUpdate = require('log-update');
var frames = ['-', '\\', '|', '/'];
var loader;
var Renderer = require('./renderer');
var renderer = new Renderer({
  onTableSelect: onTableSelect
});
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
  return results.slice(0, limit || 30);
}

function fetchTopStories() {
  loading('Fetching top stories');
  return api.fetch(api.stories());
}

function parseTopStories(stories) {
  loading('Loading top stories details');
  return Promise.all(
      stories.map(function(id) {
        return fetchStory(id);
      })
    );
}

function fetchStory(id) {
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
      cache = objectAssign(cache, response);

      loaded();

      return [[
        'Title',
        'Score',
        'Comments',
        'Author'
      ]].concat(
        response.map(function(item) {
          return [
            String(item.title),
            String(item.score),
            String(item.descendants),
            String(item.by)
          ];
        })
      );
    });
}
function loading(text) {
  loaded();

  var frame = 0;

  loader = setInterval(function() {
    logUpdate(frames[frame = ++frame % frames.length] + ' ' + (text || ''));
  }, 100);
}

function loaded() {
  logUpdate.clear();
  clearInterval(loader);
}

function onTableSelect(index) {
  var selected = cache[index - 1];
  openUrl(selected.url);
}

function render(data) {
  renderer.render(data);
}

refresh().then(render);
