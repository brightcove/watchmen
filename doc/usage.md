watchmen(1)
===========

## Synopsis

```sh
watchmen [-h] [-i (-|amqp|heartbeat|REST|redis)] [-o (-|amqp|REST|redis)]  
         -i amqp [--ih host] [--ip port] [--iv vhost] [--ie exchange] [--ik routingKey] [--ib backoff]  
         -i heartbeat [--id delay] [--ik routingKey]  
         -i redis [--ih host] [--ip port] [--iv vhost] [--ik routingKey]  
         -i REST --iu url [--id delay]  
         -o amqp [--oh host] [--op port] [--ov vhost] [--oe exchange] [--ib backoff]  
         -o redis [--oh host] [--op port] [--ov vhost]  
         -o REST --ou url  
```

### Usage examples:

sends stdin to a rabbitmq endpoint  
`watchmen --output amqp --output-host dev.rabbitmq.com`

from rabbitmq to another rabbitmq  
`watchmen --input amqp --input-host jimbo --output amqp --output-host dev.rabbitmq.com`

from rabbitmq to redis  
`watchmen --input amqp --input-host jimbo --output redis --output-host jimbo --output-port 6379`

from stdin to a REST endpoint (couchdb in this example)  
`watchmen --output REST --output-url http://jimbo:5984/watchmen/`

Additional input and output options depend on the kind of input or output in use.

## Description

A Swiss Army Knife for message routing between systems.

## Options

Inputs:

`-` : standard input, a stream of line delimited JSON encoded messages (default)  

`heartbeat` : generates heartbeat messages at a steady interval  
	input-routing-key : the routingKey to use for generated messages  
	input-delay : frequency in milliseconds to send a heartbeat  

`amqp` : RabbitMQ, creates a queue and binds to an exchange  
	input-exchange : the RabbitMQ exchange to bind to  
	input-routing-key : used when binding the queue to the exchange, the topic filter  
	input-host : host name of the RabbitMQ server  
	input-port : port number of the RabbitMQ service  
	input-vhost : virtual host for exchange/queue namespacing  
	input-backoff : time in ms to wait before retrying a failed connection  

`redis` : reads messages from a LIST  
	input-routing-key : the key to the LIST containing messages  
	input-host : host name of the Redis server  
	input-port : port number of the Redis service  

`REST` : polls a REST endpoint for changes by sending HEAD requests at regular intervals  
	input-routing-key : the routingKey to use for generated messages  
	input-url : the REST URL to poll for changes  
	input-delay : frequency in milliseconds to poll the URL  

Outputs:

`-` : standard output, a stream of line delimited JSON encoded messages (default)  

`amqp` : RabbitMQ, publishes messages to an exchange  
	output-exchange : the RabbitMQ exchange to publish messages to  
	output-host : host name of the RabbitMQ server  
	output-port : port number of the RabbitMQ service  
	output-vhost : virtual host for exchange/queue namespacing  
	output-backoff : time in ms to wait before retrying a failed connection  

`redis` : appends each message to LIST based on its routingKey  
	output-host : host name of the Redis server  
	output-port : port number of the Redis service  

`REST` : POST the message body to a REST endpoint  
	output-url : the REST endpoint to POST messages to  

`sse` : Server-Sent Events, creates HTTP server  
	output-port : the port to bind for HTTP server  
	output-url : the REST endpoint to POST messages to  
