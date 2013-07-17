/**
 * flowstream.js
 *
 * Rips JSON blobs out of a stream as they flow through and emits them as message events.
 * Note that flowstream will not automatically call resume() on the passed in stream.
 * If you build a flowstream based on process.stdin, you'll need to call resume() on it when ready.
 */
'use strict';

module.exports = function(stream, emitter) {
  var buffer = "";
  stream.on('data', function(data) {
    buffer += data;
    var boundary = buffer.indexOf("\n");
    while (boundary != -1) {
      var input = buffer.substr(0, boundary);
      buffer = buffer.substr(boundary + 1);
      try {
        emitter.emit('message', JSON.parse(input));
      } catch (err) {
        buffer = input + buffer;
      }
      boundary = buffer.indexOf("\n");
    }
  });
};

