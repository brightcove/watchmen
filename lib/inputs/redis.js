/**
 * redis.js
 *
 * Input adapter for pulling messages from a Redis LIST.
 */
'use strict';

var redis = require('redis');

module.exports = function(emitter, argv) {
  emitter.on('ready', function(){
    var
      client = redis.createClient(argv['input-port'], argv['input-host'], {}),
      routingKey = argv['input-routing-key'];
    client.lrange(routingKey, 0, -1, function (err, replies) {
      replies.forEach(function(message) {
        process.nextTick(function(){
          emitter.emit('message', {
            routingKey: routingKey,
            message: JSON.parse(message)
          });
        });
      });
    });
  });
};
