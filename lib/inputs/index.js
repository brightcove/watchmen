/**
 * index.js
 *
 * Available input adapters.
 */
'use strict';

module.exports = {
  '-': require('./stdin.js'),
  'heartbeat': require('./heartbeat.js'),
  'amqp': require('./amqp.js'),
  'REST': require('./rest.js'),
  'redis': require('./redis.js')
};
