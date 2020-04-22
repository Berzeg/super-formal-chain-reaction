export function joinReactions(inputA, inputB) {
  let reactionA = ChainReaction.resolve(inputA);
  let reactionB = ChainReaction.resolve(inputB);
  return reactionA.copy().join(reactionB);
}

export function result(_continue) {
  return {continue: _continue};
}

export default class ChainReaction {
  constructor() {
    this._callbacks = [];
  }

  static fromList(callbacks) {
    const reaction = new ChainReaction();
    reaction.appendCallbacks(callbacks);
    return reaction;
  }

  static resolve(input) {
    if (input instanceof ChainReaction) {
      return input.copy();
    } else if (input instanceof Function) {
      return ChainReaction.fromList([input]);
    } else if (input instanceof Array) {
      input.forEach(item => {
        if (!(item instanceof Function)) throw new Error(`ChainReaction.resolve() expected an array of functions`);
      });
      return ChainReaction.fromList(input);
    } else {
      throw new Error(`ChainReaction.resolve() expected input to be one of types: ChainReaction, Function, or Array<Function>`);
    }
  }

  get callbacks() {
    return this._callbacks.slice();
  }

  pushCallback(callback) {
    this._callbacks.push(callback);
  }

  appendCallbacks(callbacks) {
    this._callbacks = this._callbacks.concat(callbacks);
  }

  copy() {
    return ChainReaction.fromList(this._callbacks);
  }

  join(otherChainRx) {
    if (otherChainRx) {
      this.appendCallbacks(otherChainRx.callbacks);
    }
    return this;
  }

  toFunction() {
    return (...input) => {
      for (let i = 0; i < this._callbacks.length; i++) {
        let callback = this._callbacks[i];
        let result = callback(...input);
        if (result && !result.continue) break;
      }
    };
  }
}
