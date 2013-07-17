/**
 * index.js
 *
 * Available output adapters.
 */
'use strict';

module.exports = {
  '-': require('./stdout.js'),
  'amqp': require('./amqp.js'),
  'REST': require('./rest.js'),
  'redis': require('./redis.js'),
  'sse': require('./sse.js')
};
