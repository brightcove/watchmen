/**
 * index.js
 *
 * Programmatic entry point if you're trying to require('watchmen') from another module/program.
 */
'use strict';

module.exports = function(args) {
  var
    optimist = require('./lib/options.js')(args),
    main = require('./lib/main.js');

  main(optimist.argv);
}
