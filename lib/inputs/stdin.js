/**
 * stdin.js
 *
 * Input adapter for readable stream sources.
 */
'use strict';

const
  events = require('events'),
  flowstream = require('../flowstream.js');

module.exports = function(emitter, argv) {
  
  var inputStream = argv['input-stream'];
  
  if (!(inputStream instanceof events.EventEmitter)) {
    inputStream = process.stdin;
  }
  
  inputStream.pause();
  
  flowstream(inputStream, emitter);
  
  emitter.once('ready', function(){
    inputStream.resume();
  });
  
};
