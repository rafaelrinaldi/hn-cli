'use strict';

var Promise = require('pinkie-promise');
var objectAssign = require('object-assign');
var openUrl = require('openurl').open;
var blessed = require('blessed');
var spinner = require('./spinner');
var Renderer = require('./renderer');
var parseTableData = require('./parsers/table');
var options = {
  limit: 15,
  fetch: {
    json: true,
    headers: {
      'user-agent': 'https://github.com/rafaelrinaldi/hn-cli'
    }
  }
};
var api = require('./api')(options.fetch);
var renderer = new Renderer({
  shouldCloseOnSelect: true,
  onTableSelect: onTableSelect
});
var cache = {};

function limitResults(results, limit) {
  return results.slice(0, limit || 30);
}

function fetchTopStories() {
  spinner.start('Fetching top stories');
  return api.fetch(api.stories());
}

function fetchTopStoriesDetails(stories) {
  spinner.start('Loading top stories details');

  return Promise.all(
      stories.map(function(id) {
        return api.fetch(api.story(id));
      })
    );
}

function refresh() {
  return fetchTopStories()
    // Limit results before requests are fired
    .then(function(response) {
      return limitResults(response.body, options.limit);
    })
    // Fires all requests to top stories
    .then(function(response) {
      return fetchTopStoriesDetails(response);
    })
    // Returns a formatted array with the request response
    .then(function(response) {
      return response.map(function(item) {
        return item.body;
      })
    })
    .then(function(response) {
      // Finally loaded
      spinner.stop();

      // Store data to the cache so it can be used later
      return cache = response;
    })
    // Format the result to a data format compatible with the table widget
    .then(function(response) {
      return parseTableData(response);
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
