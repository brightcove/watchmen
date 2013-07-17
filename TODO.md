
## TODO

 * Documentation
  * Describe code structure (lib/, bin/, index.js, watchmen.js, main.js, etc)

## Stretch goals

 * Amazing WebApp
 * Error Handling
  * Report errors to STDERR
  * Detect broken connections and reestablish for each input/output type
  * Test for that by forcibly killing the connection outside the watchmen process (or shut down Rabbit etc)
 * REDIS input
  * support fuzzy search of routingKeys
  * support size capping and/or exiry of messages (Redis isn't made to handle all messages for all time)
 * Additional Output Types
  * Persist notifications forever (ex: Cassandra, Mongo?)
  * Persist to search index (ex: SOLR)
  * Server-Sent Events / EventSource, plus iframe/postMessage for cross-origin requests
 * Additional Input Types
  * Connect to a persistent store (ex: Redis), query some fraction of old messages
 * Programmatic Interface
  * Instead of accessing process.stdin/out directly, allow a stream parameter and default to standards
 * Testing
  * We should probably do some

## Done Recently

 * Documentation
  * README - Update to match latest development
  * Update options help to match new options (and paste output in README)
 * Additional Input Types
  * Connect to a persistent store (ex: Redis), query some fraction of old messages
 * Additional Output Types
  * POST to a REST/JSON API (ex: CouchDB, ElasticSearch)
  * Persist notifications for a limited time (ex: Redis)
 * HTTP/REST adapter
  * Polling for changes
 * Command-Line options
  * expose input modes (stdin, rabbit, polling)
  * expose output modes (stdout, rabbit)
  * expose input options (host, port, delay, ping URL)
  * expose output options (host, port)
 * Input adapters
  * RabbitMQ -> MessageEmitter
 * Main program
  * Wire it all up

