/**
 * index.js
 *
 * Programmatic entry point if you're trying to require('watchmen') from another module/program.
 */
'use strict';

var
  options = require('./lib/options.js'),
  main = require('./lib/main.js');

module.exports = function(args) {
  return main(options(args).argv);
}

module.exports.inputs = require('./lib/inputs/index.js');
module.exports.outputs = require('./lib/outputs/index.js');

