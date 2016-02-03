'use strict';

const Promise = require('pinkie-promise');
const openUrl = require('opn');
const now = require('./parsers/now');
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
      stories.map(id => api.fetch(api.story(id)))
    );
};

const sortByTime = (newsest, oldest) => oldest.time - newsest.time;

const handlePingError = error => {
  spinner.stop();

  if (error.code === 'ENOTFOUND') {
    console.log(`Looks like you have internet connection issues ☹`);
  } else if (error.code === 'ETIMEDOUT') {
    console.log(`Tried ${fetchOptions.retries} times but the request has timed out. Sorry ☹`);
  } else {
    console.log(error);
  }

  return process.exit(1);
};

const ping = (options, shouldMute) => {
  const log = shouldMute ? noop : spinner.start;

  log(`Fetching top stories`);

  return fetchTopStories()
    // Limit results before requests are fired
    .then(response => {
      return limitResults(response.body, options.limit);
    })
    // Fires all requests
    .then(response => {
      log(`Loading details of the latest ${options.limit} top stories`);
      return fetchTopStoriesDetails(response);
    })
    // Returns a formatted array with the response request
    .then(response => {
      return response.map(item => item.body);
    })
    // Sort the response if options.latest requested
    .then(response => {
      return options.latest ? response.slice().sort(sortByTime) : response;
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

  if (!selected.url || key === 'c') {
    openUrl(api.storyUrl(selected.id));
  } else if (key === 't') {
    openUrl(`https://twitter.com/intent/tweet?url=${selected.url}&text=${selected.title}`);
  } else {
    openUrl(selected.url);
  }
};

const render = (renderer, data) => renderer.render(data);

const reportStatusUpdate = renderer => {
  renderer.status = `Last updated at ${now()}`;
};

const run = options => {
  const renderer = new Renderer({
    shouldCloseOnSelect: !options['keep-open']
  });

  renderer.onTableSelect = onTableSelect;

  // Fetch data then render
  ping(options).then(response => {
    render(renderer, response);
    reportStatusUpdate(renderer);
  });

  return renderer;
};

module.exports = options => {
  const renderer = run(options);
  const onRefreshRequest = () => {
    renderer.status = `Updating list, hold on...`;
    // Refresh data then render
    ping(options, true).then(response => {
      renderer.update(response);
      reportStatusUpdate(renderer);
    });
  };

  renderer.onRefreshRequest = onRefreshRequest;
};
