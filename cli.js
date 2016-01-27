'use strict';

var hnCli = require('./src/');
var minimist = require('minimist');
var multiline = require('multiline');
var defaults = {
  boolean: [
    'help',
    'version'
  ],
  alias: {
    h: 'help',
    v: 'version'
  }
};
var version = require('./package.json').version;
var help = multiline(function() {/*

Usage: hn-cli [PATH] [OPTIONS]

  CLI app to browse HN

Example:
  hn-cli . --foo=bar

Options:
  -v --version              Display current software version.
  -h --help                 Display help and usage details.
  -f --foo                  Some custom option.


*/});

function run(argv) {
  console.log('hn-cli is alive!');
}

exports.exitCode = 0;

exports.stdout = process.stdout;
exports.stderr = process.stderr;

exports.parse = function(options) {
  return minimist(options, defaults);
};

exports.run = function(argv) {
  exports.exitCode = 0;

  if(argv.help) {
    exports.stderr.write(help);
    return;
  }

  if(argv.version) {
    exports.stderr.write('hn-cli v' + version + '\n');
    return;
  }

  run(argv);
};
