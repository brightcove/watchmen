var
  level = require('level'),
  express = require('express'),
  cors = require('cors');

module.exports = function(emitter) {
  var db = level('./persistence');

  emitter.on('message', function(data) {
    var date = (new Date()).toISOString();
    db.put(date, JSON.stringify(data), function(err) {
      if (err) {
        console.error(error);
      }
    });
  });

  var app = express();

  app.use(cors);
  app.get('/', function(req, res) {
    res.end(404);
  });
  app.get('/:date', function(req, res) {
    var d = [];
    db.createReadStream({start: req.params.date})
      .on('data', function(data) {
        d.push(JSON.parse(data.value));
      })
      .on('end', function() {
        res.send(d);
      });
  });
  app.listen('5555');
}
