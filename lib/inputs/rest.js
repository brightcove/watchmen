/**
 * rest.js
 *
 * Input adapter for polling a REST endpoint with HEAD requests.
 */
'use strict';

var poller = require('../poller.js');

module.exports = function(emitter, argv) {
  emitter.on('ready', function(){
    poller({
      delay: argv['input-delay'],
      url: argv['input-url']
    }).start().on('changed', function(details) {
      emitter.emit('message', {
        routingKey: argv['input-routing-key'],
        message: details
      });
    });
  });
};
