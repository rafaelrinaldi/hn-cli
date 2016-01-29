'use strict';

const Promise = require('pinkie-promise');
const openUrl = require('openurl').open;
const spinner = require('./spinner');
const Renderer = require('./renderer');
const parseTableData = require('./parsers/table');
const fetchOptions = require('./options/fetch');
const api = require('./api')(fetchOptions);
const noop = require('./noop');

let cache = {};

const limitResults = (results, limit) => results.slice(0, limit);

const fetchTopStories = () => {
  return api.fetch(api.stories());
};

const fetchTopStoriesDetails = stories => {
  return Promise.all(
      stories.map(id => {
        return api.fetch(api.story(id));
      })
    );
};

const handlePingError = error => {
  spinner.stop();

  console.log(error);

  if (error.code === 'ENOTFOUND') {
    console.log('Looks like you have internet connection issues ☹');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('Request timeout ☹ Maybe try again?');
  } else {
    console.log(error);
  }
};

const ping = (options, shouldMute) => {
  const log = shouldMute ? noop : spinner.start;

  log('Fetching top stories');

  return fetchTopStories()
    // Limit results before requests are fired
    .then(response => {
      return limitResults(response.body, options.limit);
    })
    // Fires all requests
    .then(response => {
      log(`Loading details of the latest ${options.limit} top stories`);

      return fetchTopStoriesDetails(response, options.limit);
    })
    // Returns a formatted array with the response request
    .then(response => {
      return response.map(item => item.body);
    })
    .then(response => {
      // Finally loaded
      spinner.stop();

      // Store data on local cache so it can be used later
      cache = response;

      return cache;
    })
    // Format the result to a data format compatible with the table widget
    .then(response => {
      return parseTableData(response);
    })
    // Handle error messages
    .catch(error => {
      handlePingError(error);
    });
};

const onTableSelect = (index, key) => {
  const selected = cache[index - 1];

  if (key === 'c') {
    openUrl(api.storyUrl(selected.id));
  } else {
    openUrl(selected.url);
  }
};

const render = (renderer, data) => renderer.render(data);

const createRenderer = options => {
  return new Renderer({
    shouldCloseOnSelect: !options['keep-open']
  });
};

const run = options => {
  const renderer = createRenderer(options);

  renderer.onTableSelect = onTableSelect;

  // Fetch data then render
  ping(options).then(response => render(renderer, response));

  return renderer;
};

module.exports = options => {
  const renderer = run(options);
  const onRefreshRequest = () => {
    renderer.setStatus('Updating list, hold on...');
    // Refresh data then render
    ping(options, true).then(response => {
      renderer.setStatus('Done');
      renderer.update(response)
    });
  };

  renderer.onRefreshRequest = onRefreshRequest;
};
