/**
 * amqp.js
 *
 * Output adapter for RabbitMQ.
 */
'use strict';

var amqp = require('amqp');

module.exports = function(emitter, argv) {
  
  var
    options = {},
    connection;
    
  argv['output-host'] && (options.host = argv['output-host']);
  argv['output-port'] && (options.port = argv['output-port']);
  argv['output-vhost'] && (options.vhost = argv['output-vhost']);
  
  connection = amqp.createConnection(options);
  connection.once('ready', function () {
    connection.exchange(argv['output-exchange'], {}, function (exchange) {
      emitter.on('message', function(obj){
        exchange.publish(obj.routingKey, obj.message, {});
      });
      emitter.emit('ready');
    });
  });
  
};
