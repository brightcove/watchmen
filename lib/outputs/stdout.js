/**
 * stdout.js
 *
 * Output adapter for writeable streams.
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

module.exports = function(emitter, argv) {
  
  var outputStream = argv['output-stream'];
  
  if (!(outputStream instanceof EventEmitter)) {
    outputStream = process.stdout;
  }
  
  emitter.on('message', function(message) {
    outputStream.write(JSON.stringify(message) + '\n');
  });
  
  process.nextTick(function(){
    emitter.emit('ready');
  });
  
};
