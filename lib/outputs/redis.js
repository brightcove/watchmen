/**
 * redis.js
 *
 * Output adapter for pushing messages onto Redis LISTs.
 */
'use strict';

var redis = require('redis');

module.exports = function(emitter, argv) {
  var
    client = redis.createClient(argv['output-port'], argv['output-host'], {});
  emitter.on('message', function(obj) {
    client.rpush(obj.routingKey, JSON.stringify(obj.message));
  });
  client.once('ready', function(){
    emitter.emit('ready');
  });
};
