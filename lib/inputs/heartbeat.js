/**
 * heartbeat.js
 *
 * Input adapter for emitting heartbeat messages.
 */
'use strict';

module.exports = function(emitter, argv) {
  emitter.once('ready', function() {
    setInterval(function(){
      emitter.emit('message', {
        routingKey: argv['input-routing-key'],
        message: {
          ts: +new Date(),
          rand: Math.random()
        }
      });
    }, argv['input-delay']);
  });
};
