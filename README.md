# @super-formal/chain-reaction

A class that aggregates a group of callbacks that can be invoked with a single function call.

## Index

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Motivation](#motivation)
- [The `ChainReaction` class](#the-chainreaction-class)
  - [`ChainReaction.fromList()`](#chainreaction-fromlist)
  - [`ChainReaction.resolve()`](#chainreaction-resolve)
  - [`callbacks`](#chainreaction-callbacks)
  - [`pushCallback(callback)`](#chainreaction-pushcallback)
  - [`appendCallbacks(callbacks)`](#chainreaction-appendcallbacks)
  - [`copy()`](#chainreaction-copy)
  - [`join(otherChainRx)`](#chainreaction-join)
  - [`toFunction()`](#chainreaction-tofunction)
- [Helper `joinReactions(inputA, inputB)`](#helper-joinreactions)
- [Helper `result(_continue)`](#helper-result)


## Installation

Using npm:

```
npm i -g npm
npm i --save @super-formal/chain-reaction
```

Using yarn:

```
yarn add @super-formal/chain-reaction
```

## Basic Usage

After installing the package you can use it as follows:

```
import ChainReaction from '@super-formal/chain-reaction';

function actionA(input) {
  console.log(`performing action A with input: "${input}"`);
}

function actionB(input) {
  console.log(`performing action B with input: "${input}"`);
}

let reaction = ChainReaction.fromList([actionA, actionB]);
let reactionCb = reaction.toFunction();
reactionCb("some input");

// prints:
// >> performing action A with input: "some input"
// >> performing action B with input: "some input"
```

## The `ChainReaction` class

### <a id="chainreaction-fromlist"></a> `ChainReaction.fromList()`

- @param `callbacks` - `{Array<Function>}` - A list of functions to include in the chain reaction.

- @returns `{ChainReaction}` - A `ChainReaction` that includes all the callbacks provided in the input.

### <a id="chainreaction-resolve"></a> `ChainReaction.resolve()`

- @param `input` - `{Function|Array<Function>|ChainReaction}` - Either a function, a list of functions, or an instance of a `ChainReaction`.

- @returns `{ChainReaction}` - Evaluates the input based on type and converts it into a `ChainReaction`. If the input is a `Function` then the returned object will include that function as a callback. If the input is an array of functions then those functions are included into the `ChainReaction`'s list of functions. If the input is a `ChainReaction` then a copy of the input is returned.

### <a id="chainreaction-callbacks"></a> `callbacks`

- @returns `{Array<Function>}` a copy of the internal callbacks.

### <a id="chainreaction-pushcallback"></a> `pushCallback(callback)`

- @param `callback` - `{Function}` - The function to add to the chain reaction.

Adds the provided function to the end of the list of callbacks within the chain reaction.

### <a id="chainreaction-appendcallbacks"></a> `appendCallbacks(callbacks)`

- @param `callbacks` - `{Array<Function>}` - The functions to add to the chain reaction.

Adds the provided list of functions to the end of the list of callbacks within the chain reaction.

### <a id="chainreaction-copy"></a> `copy()`

- @returns `{ChainReaction}` - a copy of the `ChainReaction` with the same list of callbacks.

### <a id="chainreaction-join"></a> `join(otherChainRx)`

- @param `otherChainRx` - `{ChainReaction}` - The other chain reaction to join with this chain reaction.

- @returns `{ChainReaction}` - A reference to the same instance of the `ChainReaction` being called.

Appends the callbacks from `otherChainRx` to the end of the list of callbacks in this chain reaction.

### <a id="chainreaction-tofunction"></a> `toFunction()`

- @returns `Function` - a function that invokes all the callbacks within the chain reaction.

The argument provided to the returned function will be passed on to each of the internal callbacks. If a callback returns nothing when invoked (`undefined` or `null`) then the next callback will get invoked and so on. The list of callbacks will be invoked in the order in which they are listed in the chain reaction. If a callback returns an `Object` with a `continue` property with a value `false` then none of the following callbacks will get called. To demonstrate:

```
function a() {
  console.log(`invoking a...`);
}

function b() {
  console.log(`invoking b...`);
  return {continue: false};
}

function c() {
  console.log(`invoking c...`);
}

let reaction = ChainReaction.fromList([a, b, c]);
reaction.toFunction()();

// prints:
// >> invoking a...
// >> invoking b...
```

## <a id="helper-joinreactions"></a> Helper `joinReactions(inputA, inputB)`

- @param `inputA` - `{Function | Array<Function> | ChainReaction}`

- @param `inputB` - `{Function | Array<Function> | ChainReaction}`

- @returns `ChainReaction` - A reaction that includes both the callbacks from inputA and inputB.

This method resolves each input into a `ChainREaction`, if they aren't a `ChainReaction` already. Modifying either of inputA or inputB doesn't affect the returned `ChainReaction`.

## <a id="helper-result"></a> Helper `result(_continue)`

- @param `_continue` - `{Boolean}` - whether the callback invokations should continue after this point.

- @returns `{Object}` - this object can be returned by any of the internal callbacks in `ChainReaction` and can be used to inform the callbacks to stop invoking.
