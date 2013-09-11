/**
 * amqp.js
 *
 * Input adapter for RabbitMQ.
 */
'use strict';

var amqp = require('amqp');

module.exports = function(emitter, argv) {
  
  var
    
    options = {},
    
    connection,
    exchange,
    queue,
    consumerTag,
    
    handleMessage,
    setup,
    teardown,
    cycle,
    timer;
  
  argv['input-host'] && (options.host = argv['input-host']);
  argv['input-port'] && (options.port = argv['input-port']);
  argv['input-vhost'] && (options.vhost = argv['input-vhost']);
  
  /**
   * when a message arrives, send it up through the provided emitter.
   */
  handleMessage = function(message, headers, deliveryInfo){
    
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
    
  };
  
  /**
   * establish a connection, create a queue, bind it and subscribe
   */
  setup = function(){
    
    clearTimeout(timer);
    timer = null;
    
    connection = amqp.createConnection(options, {reconnect: false});
    
    // although there could be many errors, there'll be only one close event
    connection.on('close', cycle);
    
    // prevent error events from bubbling up as thrown exceptions
    connection.on('error', function(err){
      // design choice: don't cycle from here, only on 'close'
      // rationale: testing shows that many error events happen for each close event
      // alternative: call cycle and let the if(!timer) handle scheduling
    });
    
    connection.on('ready', function(){
      
      // design choice: create the exchange if it doesn't exist.
      // rationale: won't miss messages from publisher during poll delay
      // alternative: wait for exchange to exist (may miss more messages)
      connection.exchange(argv['input-exchange'], {}, function (ex) {
        exchange = ex;
        connection.queue('', {exclusive: true}, function(q) {
          queue = q;
          queue.bind(exchange, argv['input-routing-key']);
          queue
            .subscribe(handleMessage)
            .addCallback(function(ok){
              consumerTag = ok.consumerTag;
            }); 
        });
      });
      
    });
    
  };
  
  /**
   * clean up after a closed/failed connection
   */
  teardown = function() {
    if (queue && consumerTag) {
      queue.unsubscribe(consumerTag);
      queue = consumerTag = null;
    }
    if (exchange) {
      exchange = null;
    }
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
      setTimeout(setup, argv['input-backoff']);
    }
  };
  
  // make first connection attempt once the output is ready
  emitter.once('ready', setup);
  
};
