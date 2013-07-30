var test = require('tape');

test("watchmen is available", function(t) {
  t.plan(1);

  var watchmen = require('../index.js');

  t.ok(watchmen, "We can require watchmen");
});
