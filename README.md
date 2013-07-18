# Watchmen
[![NPM](https://nodei.co/npm/watchmen.png)](https://nodei.co/npm/watchmen/)

Lots of systems have state.
They store data, and sometimes that data changes.

We believe that whenever data changes, other systems have a right to know.
It should be easy to subscribe to change notifications from any system which stores mutable data.

The Watchmen project offers a platform for propagating change notifications.

## Installing Watchmen

Watchmen runs on Node.js and primarily uses RabbitMQ for publishing and dispatching messages.
If you already have Node.js installed and you have a RabbitMQ server ready to target, you can install watchmen through npm:

```sh
$ npm install -g watchmen  # to run the CLI
$ npm install watchmen     $ to run it programatically
```

This will make the `watchmen` command available via the command line.
You can confirm that watchmen is installed correctly by passing the `-h` parameter.

```sh
$ watchmen -h
Usage:
watchmen [-h] [-i (-|amqp|heartbeat|REST|redis)] [-o (-|amqp|REST|redis)]
	-i amqp [--ih host] [--ip port] [--iv vhost] [--ie exchange] [--ik routingKey]
	-i heartbeat [--id delay] [--ik routingKey]
	-i redis [--ih host] [--ip port] [--iv vhost] [--ik routingKey]
	-i REST --iu url [--id delay]
	-o amqp [--oh host] [--op port] [--ov vhost] [--oe exchange]
	-o redis [--oh host] [--op port] [--ov vhost]
	-o REST --ou url
```

If you don't already have the dependencies installed, follow the instructions in the Installing Dependencies section below.

## Watchmen Messages

Watchmen takes a stream of input messages from one source and sends them out to a single destination.
The default input source is standard input, and the default output source is standard output.

When receiving from standard input, watchmen expects a series of JSON encoded messages separated by newline characters.

Here's an example of message:
```json
{
  "routingKey": "example.accounts.123.test.1234",
  "message": {
    "action": "update",
    "id": "12345",
    "updated_at": "2013-07-12T16:13:41+0000",
    "url": "http://localhost:8080/v1a/accounts/123/test/1234"
  }
}
```

Watchmen expects incoming objects to have a _routingKey_ and a _message_ body.
The routingKey is a dot delimited string used for routing messages between exchanges and queues in RabbitMQ.
If you're not familiar with these concepts, see RabbitMQ Basics for Watchmen below.

Watchmen doesn't care what's in the message body; it can be anything, even a binary blob of bytes.
In the previous example, it's an object with properties that are meaningful to the catalog.

## Using Watchmen

Even though watchmen supports a number of input and output types, watchmen's messaging patterns are based on RabbitMQ.

### RabbitMQ Basics for Watchmen

RabbitMQ is a robust messaging system that implements the AMQP protocol.
Libraries are available for a wide variety of languages, making it easy to develop against.

If you'd really like to understand RabbitMQ, you should read the [RabbitMQ Tutorials](http://www.rabbitmq.com/getstarted.html).
Examples are provided for Python and Java.

To publish a message in RabbitMQ, you send it to an _exchange_.
Exchanges route messages to _queues_.
When a message comes into an exchange, RabbitMQ has to figure out which queues to send it to based on characteristics of the message and the type of exchange.

There are different types of exchanges, but watchmen uses the default type, a _topic_ exchange.
RabbitMQ uses each message's _routing key_—a dot delimited, hierarchical string—to determine which queues should receive the message.

Here's an example message, represented as JSON:

```json
{
  "routingKey": "your-app.<identifier>.property",
  "message": {
    "a nested": "json object"
  }
}
```

To subscribe to messages from RabbitMQ, you pull messages from a _queue_.
Watchmen subscribers typically create their own queue, then _bind_ it to an exchange using a _routing string_.
The routing string is like a routing key that allows wildcards.

For example, if you wanted to listen to messages like the one above, you'd subscribe using the routing string `your-app.*.property`.
The `*` matches exactly one dot delimited segment.

If you wanted to receive all messages from `your-app`, you'd use the routing string `your-app.#`.
The `#` wildcard matches any number of dot delimited segments.

### Specifying an Input Source

The watchmen command line program can receive messages from any of several source types.
You specify which source you want to use with the `--input` (or `-i`) flag.

For example, suppose RabbitMQ is running on a host called `jimbo`.
The following command will subscribe to all messages from this host and pipe them to standard output:

```sh
$ watchmen --input amqp --input-host jimbo
```

You can save this data off to a file using regular shell tools:

```sh
$ watchmen --input amqp --input-host jimbo > data/example-data.dat
```

If you don't specify an input type, watchmen will scan standard input for JSON encoded messages.
Run watchmen with the `-h` flag to see the list of all supported input types and what additonal options they require.

### Specifying an Output Destination

Watchmen supports a number of output types.
You specify which destination you want to send to with the `--output` (or `-o`) flag.

Suppose you wanted to send messages to RabbitMQ running on a host called `jimbo`.
The following command sends a simple hello world message to that host:

```sh
echo '{"routingKey":"hello","message":"world!"}' | watchmen --output amqp --output-host jimbo
```

The `data/` directory of this project contains sample data you can use to try out watchmen.
The following command will pump out example messages:

```sh
$ cat data/example-data.dat | watchmen --output amqp --output-host jimbo
```

Lots more information about specifyng inputs and outputs is available in the usage text.
To see it, run `watchmen -h` from the command line.

## Installing Dependencies

In case you're having trouble installing watchmen's dependencies, here are some instructions.

### Installing Node.js

Install Node.js if you don't already have it.
On Mac OSX you can do `brew install node`.
On Ubuntu, use `apt-get install nodejs`.

Otherwise, instructions are available on [Node's download page](http://nodejs.org/download/).

You can check if Node is installed properly with `node -v`:

```sh
$ node -v
v0.10.12
```

### Installing RabbitMQ

By default, watchmen will attempt to connect to RabbitMQ running on localhost port 5672 or 5673.
You can specify another host, or install RabbitMQ locally.

#### Installing RabbitMQ on Mac OSX

Installing RabbitMQ on Mac OSX is most easily accomplished with homebrew:

```sh
$ brew install rabbitmq
```

Once installed, you can start it from `/usr/local/sbin`:

```sh
$ /usr/local/sbin/rabbitmq-server

              RabbitMQ 3.1.1. Copyright (C) 2007-2013 VMware, Inc.
  ##  ##      Licensed under the MPL.  See http://www.rabbitmq.com/
  ##  ##
  ##########  Logs: /usr/local/var/log/rabbitmq/rabbit@localhost.log
  ######  ##        /usr/local/var/log/rabbitmq/rabbit@localhost-sasl.log
  ##########
              Starting broker... completed with 7 plugins.
```

You can confirm that it's running using the `rabbitmqctl` command:

```sh
$ /usr/local/sbin/rabbitmqctl status
Status of node rabbit@localhost ...
[{pid,95270},
 {running_applications,
     [{rabbitmq_management_visualiser,"RabbitMQ Visualiser","3.1.1"},
      {rabbitmq_management,"RabbitMQ Management Console","3.1.1"},
      {rabbitmq_management_agent,"RabbitMQ Management Agent","3.1.1"},
      {rabbit,"RabbitMQ","3.1.1"},
  ...
```

#### Installing RabbitMQ on Ubuntu

On Ubuntu server, install RabbitMQ using `apt-get`:

```sh
$ sudo apt-get install rabbitmq
```

You don't need to start the server in Ubuntu, it should start right up.

You can confirm that it's running using the `rabbitmqctl` command as root:

```sh
$ sudo rabbitmqctl status
Status of node rabbit@ubuntu ...
[{pid,11493},
 {running_applications,[{rabbit,"RabbitMQ","2.8.4"},
                        {os_mon,"CPO  CXC 138 46","2.2.9"},
                        {sasl,"SASL  CXC 138 11","2.2.1"},
  ...
```

You may want to change the TCP port that Ubuntu uses since it may choose 5673 instead of the more common 5672.
To do that, create `/etc/rabbitmq/rabbitmq.config` with the following settings:

```erlang
[
    {rabbit, [{tcp_listeners, [5672]}]}
].
```

A bunch of additional settings are described in [RabbitMQ's Configuration File Doc](http://www.rabbitmq.com/configure.html#configuration-file).
