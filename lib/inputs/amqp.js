/**
 * amqp.js
 *
 * Input adapter for RabbitMQ.
 */
'use strict';

var amqp = require('amqp');

module.exports = function(emitter, argv) {
  
  emitter.on('ready', function(){
    var
      options = {},
      connection;
    
    argv['input-host'] && (options.host = argv['input-host']);
    argv['input-port'] && (options.port = argv['input-port']);
    argv['input-vhost'] && (options.vhost = argv['input-vhost']);
    
    connection = amqp.createConnection(options);
    connection.once('ready', function () {
      connection.queue('', {exclusive: true}, function(queue) {
        queue.bind(argv['input-exchange'], argv['input-routing-key']);
        queue.subscribe(function(message, headers, deliveryInfo){
          if (message.data instanceof Buffer) {
            message = message.data.toString();
            if (!deliveryInfo.contentType) {
              try {
                // no contentType supplied, let's see if it's actually JSON
                message = JSON.parse(message);
              } catch (err) {
                // ignore parse error
              }
            }
          }
          emitter.emit('message', {
            routingKey: deliveryInfo.routingKey,
            message: message
          });
        });
      });
    });
    
  });
  
};
