/**
 * stdout.js
 *
 * Output adapter for writeable streams.
 */
'use strict';

const events = require('events');

module.exports = function(emitter, argv) {
  
  var outputStream = argv['output-stream'];
  
  if (!(outputStream instanceof events.EventEmitter)) {
    outputStream = process.stdout;
  }
  
  emitter.on('message', function(message) {
    outputStream.write(JSON.stringify(message) + '\n');
  });
  
  process.nextTick(function(){
    emitter.emit('ready');
  });
  
};
