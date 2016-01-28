'use strict';

const Promise = require('pinkie-promise');
const openUrl = require('openurl').open;
const spinner = require('./spinner');
const Renderer = require('./renderer');
const parseTableData = require('./parsers/table');
const fetchOptions = require('./options/fetch');
const api = require('./api')(fetchOptions);

let cache = {};

const limitResults = (results, limit) => results.slice(0, limit);

const fetchTopStories = () => {
  spinner.start('Fetching top stories');
  return api.fetch(api.stories());
};

const fetchTopStoriesDetails = (stories, limit) => {
  spinner.start(`Loading details of the latest ${limit} top stories`);

  return Promise.all(
      stories.map(id => {
        return api.fetch(api.story(id));
      })
    );
};

const refresh = options => {
  return fetchTopStories()
    // Limit results before requests are fired
    .then(response => {
      return limitResults(response.body, options.limit);
    })
    // Fires all requests to top stories
    .then(response => {
      return fetchTopStoriesDetails(response, options.limit);
    })
    // Returns a formatted array with the request response
    .then(response => {
      return response.map(item => item.body);
    })
    .then(response => {
      // Finally loaded
      spinner.stop();

      // Store data to the cache so it can be used later
      cache = response;

      return cache;
    })
    // Format the result to a data format compatible with the table widget
    .then(response => {
      return parseTableData(response);
    });
};

const onTableSelect = index => {
  const selected = cache[index - 1];
  openUrl(selected.url);
};

const render = (renderer, data) => renderer.render(data);

const createRenderer = options => {
  return new Renderer({
    shouldCloseOnSelect: !options['keep-open'],
    onTableSelect
  });
};

module.exports = options => {
  const renderer = createRenderer(options);

  refresh(options)
    .then(response => {
      render(renderer, response);
    })
    .catch(error => {
      if (error.code === 'ENOTFOUND') {
        spinner.stop();
        console.log('Looks like you have some kind of internet connection issue ☹');
      }
    });
};
