
## Output Adapters

Output adapters for watchmen send messages out to a destination.

An output adapter should provide a method which takes an event emitter and an options object.

The adapter should emit a `ready` event on the emitter to indicate that the output is ready to send messages.

It should listen for `message` events and respond by sending messages out.
