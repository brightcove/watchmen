'use strict';

const

  fs = require('fs'),
  optimist = require('optimist'),

  inputs = require('./inputs/index.js'),
  outputs = require('./outputs/index.js'),

  usage = fs.readFileSync(__dirname + '/../doc/usage.md', 'utf-8').split(/```(?:sh)?\n?/)[1];

module.exports = function(args) {
  var
    hostDefault = 'localhost',
    portDefault = '5672',
    vhostDefault = '/',
    exchangeDefault = 'watchmen';
  return optimist(args)
    .usage(usage + "\nSee more info in the man pages:\n\tman watchmen\n")
    .alias({
      'i': 'input',
      'ih': 'input-host',
      'ip': 'input-port',
      'iv': 'input-vhost',
      'iu': 'input-url',
      'id': 'input-delay',
      'ik': 'input-routing-key',
      'ie': 'input-exchange',
      'o': 'output',
      'oh': 'output-host',
      'op': 'output-port',
      'ov': 'output-vhost',
      'ou': 'output-url',
      'oe': 'output-exchange',
      'h': 'help'
    })
    .describe({
      'i': 'source of incoming messages, defaults to standard input.',
      'o': 'destination for outgoing messages, defaults standard output.',
      'ik': 'routing key to filter input or add to generated messages.',
      'ih': 'hostname of message source.',
      'ip': 'port number of the service.',
      'iv': 'virtual host for exchange/queue namespacing (amqp only).',
      'ie': 'the exchange to bind to for receiving messages (amqp only).',
      'iu': 'the URL to poll for changes (REST only).',
      'id': 'time in milliseconds to delay for polling attempts/heartbeats.',
      'oh': 'hostname of message destination.',
      'op': 'port number of the service.',
      'ov': 'virtual host for exchange/queue namespacing (amqp only).',
      'oe': 'the exchange to publish messages to (amqp only).',
      'ou': 'the url to POST messages to (REST only).',
      'h': 'print this help'
    })
    .default({
      'i': '-',
      'ih': hostDefault,
      'ip': portDefault,
      'iv': vhostDefault,
      'id': 10000,
      'ik': '#',
      'ie': exchangeDefault,
      'o': '-',
      'oh': hostDefault,
      'op': portDefault,
      'ov': vhostDefault,
      'oe': exchangeDefault
    })
    .check(function(argv){
      if (!(argv.input in inputs)) {
        throw Error('Unrecognized input type: ' + argv.input);
      }
      if (!(argv.output in outputs)) {
        throw Error('Unrecognized output type: ' + argv.output);
      }
    });
};
