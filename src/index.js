'use strict';

var Promise = require('pinkie-promise');
var openUrl = require('openurl').open;
var spinner = require('./spinner');
var Renderer = require('./renderer');
var parseTableData = require('./parsers/table');
var fetchOptions = require('./options/fetch');
var api = require('./api')(fetchOptions);
var cache = {};

function createRenderer(options) {
  return new Renderer({
    shouldCloseOnSelect: !options['keep-open'],
    onTableSelect: onTableSelect
  });
}

function limitResults(results, limit) {
  return results.slice(0, limit);
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

function refresh(options) {
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
      });
    })
    .then(function(response) {
      // Finally loaded
      spinner.stop();

      // Store data to the cache so it can be used later
      cache = response;

      return cache;
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

function render(renderer, data) {
  renderer.render(data);
}

module.exports = function(options) {
  var renderer = createRenderer(options);

  refresh(options)
    .then(function(response) {
      render(renderer, response);
    });
};
