#!/usr/bin/env node --harmony
/**
 * watchmen.js
 *
 * Main entry point for command-line invocations of the watchmen program.
 */

var
  optimist = require('../lib/options.js')(process.argv),
  argv = optimist.argv,
  main = require('../lib/main.js');

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
} else {
  main(argv);
}

