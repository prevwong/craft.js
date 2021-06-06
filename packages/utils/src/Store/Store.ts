import { produceWithPatches, Patch, enableMapSet, enablePatches } from 'immer';
import isEqualWith from 'lodash/isEqualWith';

enableMapSet();
enablePatches();

type Subscriber<S> = (state: S) => void;
// A Generic Store class to hold stateful values
export class Store<S = any> {
  private subscribers: Subscriber<S>[] = [];
  private state: S;

  constructor(initialState: S) {
    this.state = initialState;
  }

  subscribe<C>(
    collector: (state: S) => C,
    onChange: (collected: C) => void,
    init: boolean = false
  ) {
    let collected = collector(this.getState());

    const subscriber = (state: S) => {
      const newCollectedValues = collector(state);

      if (isEqualWith(collected, newCollectedValues)) {
        return;
      }

      collected = newCollectedValues;
      onChange(collected);
    };

    if (init) {
      subscriber(this.getState());
    }

    this.subscribers.push(subscriber);

    return () =>
      this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
  }

  getState() {
    return this.state;
  }

  setState(
    setter: (state: S) => void,
    onPatch?: (patches: Patch[], inversePatches: Patch[]) => void,
    silent?: boolean
  ) {
    const [newState, patches, inversePatches] = produceWithPatches(
      this.state,
      setter
    );
    this.state = newState;
    if (onPatch) {
      onPatch(patches, inversePatches);
    }

    if (silent) {
      return;
    }

    this.notify();
  }

  private notify() {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }
}

export type StateForStore<S extends Store> = S extends Store<infer I>
  ? I
  : never;
