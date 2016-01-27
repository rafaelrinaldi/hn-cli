'use strict';

var Promise = require('pinkie-promise');
var objectAssign = require('object-assign');
var openUrl = require('openurl').open;
var blessed = require('blessed');
var spinner = require('./spinner');
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
var api = require('./api')(options.fetch);

function limitResults(results, limit) {
  return results.slice(0, limit || 30);
}

function fetchTopStories() {
  spinner.start('Fetching top stories');
  return api.fetch(api.stories());
}

function parseTopStories(stories) {
  spinner.start('Loading top stories details');

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

      spinner.stop();

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

function onTableSelect(index) {
  var selected = cache[index - 1];
  openUrl(selected.url);
}

function render(data) {
  renderer.render(data);
}

refresh().then(render);
