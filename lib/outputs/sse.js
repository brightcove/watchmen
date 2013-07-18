/**
 * sse.js
 *
 * Output adapter for pushing messages through Server-Sent Events.
 * @see http://www.html5rocks.com/en/tutorials/eventsource/basics/
 * @see https://en.wikipedia.org/wiki/Server-sent_events
 */
'use strict';

const
  
  http = require('http'),
  express = require('express');

module.exports = function(emitter, argv) {
  
  var
    
    port = argv['output-port'],
    
    // collection of open connections (ES6 Set would be preferable if available)
    id = 0,
    connections = {},
    
    app = express();
  
  // all CORS all the time
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    (req.method === 'OPTIONS') ? res.send(200) : next();
  });
  
  // post all server sent events to parent
  // not all browsers support CORS headers for SSEs
  app.get('/iframe/:filter?', function(req, res) {
    res.send(200, '<script>(' + function(window){
      var source = new EventSource(window.location.pathname.replace(/\/iframe\//, '/events/'));
      source.onmessage = function(e) {
        window.parent.postMessage(e.data, '*');
      };
    } + ')(window);</script>');
  });
  
  // events implements SSE
  app.get('/events/:filter?', function(req, res) {
    
    var filter;
    
    if (req.params.filter) {
      filter = new RegExp(
        '^' +
          req.params.filter
            .replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&")
            .replace(/\*/g, '.*') +
        '$');
    }
    
    req.socket.setTimeout(Infinity);
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    
    id += 1;
    res.id = id;
    connections[id] = {
      filter: filter,
      res: res
    };
    
    res.on('close', function(){
      delete connections[res.id];
    });
    
  });
  
  // send messages forward to all connected clients
  emitter.on('message', function(obj) {
    var conn, k;
    for (k in connections) {
      conn = connections[k];
      if (!conn.filter || conn.filter.test(obj.routingKey)) {
        conn.res.write('data: ' + JSON.stringify(obj) + '\n\n')
      }
    }
  });
  
  // kick off express app
  http.createServer(app).listen(port, function(){
    process.nextTick(function(){
      emitter.emit('ready');
    });
  });
  
};

