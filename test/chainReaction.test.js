import ChainReaction from '../src/chainReaction';

describe('ChainReaction', () => {
  let callbackA;
  let callbackB;
  let callbackC;
  let callbacks;

  beforeEach(() => {
    callbackA = jest.fn(() => {});
    callbackB = jest.fn(() => {});
    callbackC = jest.fn(() => {});
    callbacks = [callbackA, callbackB, callbackC];
  });

  it('constructs an instance without errors', () => {
    expect(() => new ChainReaction()).not.toThrow();
  });

  describe('fromList()', () => {
    it('instantiates a ChainReaction with as many callbacks as are in the list', () => {
      let reaction = ChainReaction.fromList(callbacks);
      expect(reaction.callbacks.length).toBe(callbacks.length);
    });

    it('internalizes the same instances of the callbacks that are provided', () => {
      let reaction = ChainReaction.fromList(callbacks);
      expect(reaction.callbacks[0]).toBe(callbacks[0]);
    });
  });

  describe('pushCallback()', () => {
    it('adds the provided callback at the end of the list of internal callbacks', () => {
      let reaction = ChainReaction.fromList([callbackA]);
      reaction.pushCallback(callbackB);
      expect(reaction.callbacks.length).toBe(2);
      expect(reaction.callbacks[1]).toBe(callbackB);
    });
  });

  describe('appendCallbacks()', () => {
    it('adds each callback in the provided list to the end of the internal list of callbacks', () => {
      let reaction = ChainReaction.fromList([callbackA]);
      reaction.appendCallbacks([callbackB, callbackC]);
      expect(reaction.callbacks.length).toBe(3);
      expect(reaction.callbacks[2]).toBe(callbackC);
    });
  });

  describe('copy()', () => {
    it('returns an instance of ChainReaction', () => {
      let reaction = new ChainReaction();
      let reactionCopy = reaction.copy();
      expect(reactionCopy instanceof ChainReaction).toBe(true);
    });

    it('returns a different instance of the ChainReaction', () => {
      let reaction = new ChainReaction();
      let reactionCopy = reaction.copy();
      expect(reaction).not.toBe(reactionCopy)
    });

    it('returns a copy that has the same callbacks as the original', () => {
      let reaction = ChainReaction.fromList(callbacks);
      let reactionCopy = reaction.copy();
      expect(reaction.callbacks.length).toBe(reactionCopy.callbacks.length);
      expect(reaction.callbacks[0]).toBe(reactionCopy.callbacks[0]);
    });
  });

  describe('join()', () => {
    let callbacksA;
    let callbacksB;
    let reactionA;
    let reactionB;

    beforeEach(() => {
      callbacksA = [callbackA, callbackB];
      callbacksB = [callbackC];
      reactionA = ChainReaction.fromList(callbacksA);
      reactionB = ChainReaction.fromList(callbacksB);
    });

    it('appends the callbacks from the other ChainReaction to the current reaction', () => {
      reactionA.join(reactionB);
      expect(reactionA.callbacks.length).toBe(callbacksA.length + callbacksB.length);
    });

    it('doesn\'t append the callbacks to the ChainReaction in the argument', () => {
      reactionA.join(reactionB);
      expect(reactionB.callbacks.length).toBe(callbacksB.length);
    });
  });

  describe('toFunction()', () => {
    it('returns a function', () => {
      let reaction = ChainReaction.fromList(callbacks);
      expect(reaction.toFunction() instanceof Function).toBe(true);
    });

    it('doesn\'t trigger the callbacks', () => {
      let reaction = ChainReaction.fromList(callbacks);
      reaction.toFunction();
      expect(callbackA.mock.calls.length).toBe(0);
      expect(callbackB.mock.calls.length).toBe(0);
      expect(callbackC.mock.calls.length).toBe(0);
    });

    it('triggers the internal callbacks if the returned function is called', () => {
      let reaction = ChainReaction.fromList(callbacks);
      let reactionFn = reaction.toFunction();
      reactionFn();
      expect(callbackA.mock.calls.length).toBe(1);
      expect(callbackB.mock.calls.length).toBe(1);
      expect(callbackC.mock.calls.length).toBe(1);
    });
  });
});
