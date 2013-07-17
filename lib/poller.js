/**
 * poller.js
 *
 * Simple library for polling a URL and emitting an event whenever certain headers or the response code changes.
 *
 * Usage Example:
 *
 *  const poller = requeire('poller.js');
 *  poller({
 *    delay: 5000,
 *    url: 'http://localhost/path/to/resource.txt'
 *  }).start().on('changed', function(details) {
 *    console.log(details);
 *  });
 *
 */
"use strict";

const
  
  events = require('events'),
  util = require('util'),
  
  request = require('request'),
  
  Poller = function(options) {
    events.EventEmitter.call(this);
    this.options = options;
  };

util.inherits(Poller, events.EventEmitter);

Poller.prototype.start = function(){
  
  this.stop();
  
  let
    
    self = this,
    
    makeRequest = function() {
      
      let url = self.options.url;
      
      request.head(url, function(error, response) {
        
        let
          oldLM = self.options['last-modified'] || undefined,
          oldET = self.options['etag'] || undefined,
          oldSC = self.options['statusCode'] || undefined,
          newLM = response.headers['last-modified'],
          newET = response.headers['etag'],
          newSC = response.statusCode;
        
        // deal with weak ETags
        // @see http://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation
        if (newET !== undefined) {
          newET = (newET || '').replace(/^\s*(?:W\/)?"|"\s*$/g, '');
        }
        
        if (oldLM !== undefined || oldET !== undefined || oldSC !== undefined) {
          if (oldLM !== newLM || oldET !== newET || oldSC !== newSC) {
            self.emit('changed', {
              url: url,
              statusCode: response.statusCode,
              headers: response.headers
            });
          }
        }
        
        self.options['last-modified'] = newLM;
        self.options['etag'] = newET;
        self.options['statusCode'] = newSC;
        
        self.timer = setTimeout(makeRequest, self.options.delay);
        
      });
    };
    
  makeRequest();
  
  return this;
  
};

Poller.prototype.stop = function(){
  if ('req' in this) {
    this.req.abort;
    delete this.req;
  }
  if ('timer' in this) {
    clearTimeout(this.timer);
    delete this.timer;
  }
  return this;
};

module.exports = function(options) {
  return new Poller(options);
};
module.exports.Poller = Poller;

