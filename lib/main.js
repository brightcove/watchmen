/**
 * main.js
 *
 * Main module to implement functionality for the watchmen command line program.
 * @see inputs/ and outputs/ dirs for information on how adapters work.
 */
'use strict';

var
  EventEmitter = require('events').EventEmitter,
  inputs = require('./inputs/index.js'),
  outputs = require('./outputs/index.js'),
  levelwrapper = require('./level.js');

/**
 * Main function.
 *
 * @param {object} argv An arguments object, the output of Optimist as described in options.js.
 */
module.exports = function(argv) {
  
  var emitter = new EventEmitter();

  if (argv.persist) {
    levelwrapper(emitter);
  }
  
  inputs[argv.input](emitter, argv);
  outputs[argv.output](emitter, argv);
  
};

