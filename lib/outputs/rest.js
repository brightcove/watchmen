/**
 * rest.js
 *
 * Output adapter for POSTing messages to a REST endpoint.
 */
'use strict';

const request = require('request');

module.exports = function(emitter, argv) {
  emitter.on('message', function(obj) {
    request.post(argv['output-url'], {
      json: true,
      body: obj
    });
  });
  process.nextTick(function(){
    emitter.emit('ready');
  });
};
