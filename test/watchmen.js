var test = require('tape');

test("watchmen is available and is a function", function(t) {
  t.plan(2);

  var watchmen = require('../index.js');

  t.ok(watchmen, "We can require watchmen");
  t.equal(typeof watchmen, "function", "watchmen returns a function");
});

test("it has an inputs and outputs object", function(t) {
  t.plan(2);

  var watchmen = require('../index.js');

  t.ok(watchmen.inputs, "inputs is available");
  t.ok(watchmen.outputs, "outputs is available");
});

test("inputs object 5 input types of type function", function(t) {
  t.plan(10);

  var watchmen = require('../index.js'),
    i = watchmen.inputs;

  t.ok(i['-'], "has a stdin input");
  t.ok(i.heartbeat, "has a test heartbeat input");
  t.ok(i.amqp, "has an amqp input");
  t.ok(i.REST, "has a REST input");
  t.ok(i.redis, "has a redis input");
  t.equal(typeof i['-'], "function",  "stdin is a function");
  t.equal(typeof i.heartbeat, "function",  "test heardbeat is a function");
  t.equal(typeof i.amqp, "function",  "amqp is a function");
  t.equal(typeof i.REST, "function",  "REST is a function");
  t.equal(typeof i.redis, "function",  "redis is a function");
});

test("outputs object 5 output types of type function", function(t) {
  t.plan(10);

  var watchmen = require('../index.js'),
    o = watchmen.outputs;

  t.ok(o['-'], "has a stdout output");
  t.ok(o.amqp, "has an amqp output");
  t.ok(o.REST, "has a REST output");
  t.ok(o.redis, "has a redis output");
  t.ok(o.sse, "has a Server-Sent Events output");
  t.equal(typeof o['-'], "function",  "stdout is a function");
  t.equal(typeof o.amqp, "function",  "amqp is a function");
  t.equal(typeof o.REST, "function",  "REST is a function");
  t.equal(typeof o.redis, "function",  "redis is a function");
  t.equal(typeof o.sse, "function",  "SSE is a function");
});
