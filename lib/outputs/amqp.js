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
    
    connection,
    exchange,
    timer,
    
    setup,
    teardown,
    cycle;
    
  argv['output-host'] && (options.host = argv['output-host']);
  argv['output-port'] && (options.port = argv['output-port']);
  argv['output-vhost'] && (options.vhost = argv['output-vhost']);
  
  /**
   * establish a connection, create an exchange
   */
  setup = function() {
    
    clearTimeout(timer);
    timer = null;
    
    connection = amqp.createConnection(options, {reconnect: false});
    
    // the connection may become ready many times
    // the amqp library has a built-in retry mechanism
    connection.on('ready', function () {
      connection.exchange(argv['output-exchange'], {}, function (ex) {
        exchange = ex;
        emitter.emit('ready');
      });
    });
    
    // when the connection closes, cycle everything
    connection.on('close', cycle);
    
    // prevent error events from bubbling up as thrown exceptions
    connection.on('error', function(err){
      // design choice: don't cycle from here, only on 'close'
      // rationale: testing shows that many error events happen for each close event
      // alternative: call cycle and let the if(!timer) handle scheduling
    });
  };
  
  /**
   * clean up after a closed/failed connection
   */
  teardown = function() {
    exchange = null;
    if (connection) {
      connection.removeAllListeners();
      connection.end();
      connection = null;
    }
  };
  
  /**
   * cycle the connection and try again
   */
  cycle = function() {
    if (!timer) {
      teardown();
      setTimeout(setup, argv['output-backoff']);
    }
  };
  
  // forward any messages to the exchange, if one is available
  emitter.on('message', function(obj){
    if (exchange) {
      exchange.publish(obj.routingKey, obj.message, {});
    }
  });
  
  // make first connection attempt
  setup();
  
};
