'use strict';

const hn = require('./src/');
const minimist = require('minimist');
const version = require('./package.json').version;
const defaults = {
  boolean: [
    'help',
    'version'
  ],
  alias: {
    h: 'help',
    v: 'version',
    l: 'limit',
    k: 'keep-open'
  },
  default: {
    'limit': 150,
    'keep-open': false,
    'latest': false
  }
};

const help = `
Usage: hn [OPTIONS]

  CLI to browse Hacker News

Example:
  $ hn --limit 10 --keep-open

Options:
  -v --version              Display current software version.
  -h --help                 Display help and usage details.
  -l --limit                Limit the number of items to display (defaults to 15).
  -k --keep-open            Wether or not to keep the table open after selecting an item (defaults to false).
  --latest                  Sort the listing by the lastest entries
`;

const run = argv => hn(argv);

// Must be ≠ 0 if any errors occur during execution
exports.exitCode = 0;

// Allow mocking the stdout/stderr
exports.stdout = process.stdout;
exports.stderr = process.stderr;

exports.parse = options => minimist(options, defaults);

exports.run = argv => {
  // Reset status code at each run
  exports.exitCode = 0;

  if (argv.help) {
    exports.stderr.write(help);
    return;
  }

  if (argv.version) {
    exports.stderr.write(`hn-cli v${version}\n`);
    return;
  }

  run(argv);
};
