
## Input Adapters

Input adapters for watchmen implement mechanisms for receiving messages.

An input adapter should provide a method which takes an event emitter and an options object.

The adapter should listen for a `ready` event on the emitter to indicate that the output is ready to receive messages.

It should emit `message` events when a new message is received.
