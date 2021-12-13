import {
  createDraft,
  finishDraft,
  Patch,
  enableMapSet,
  enablePatches,
} from 'immer';
import isEqual from 'lodash/isEqual';

enableMapSet();
enablePatches();

// A Generic Store class to hold stateful values
export class Store<S = any> {
  private subscribers: Set<(state: S) => void> = new Set();
  private state: S;

  constructor(initialState: S) {
    this.state = initialState;
  }

  subscribe<C>(
    collector: (state: S) => C,
    onChange: (collected: C) => void,
    init: boolean = false
  ) {
    let current = collector(this.getState());
    let isInvalidated = false;

    const subscriber = (state: S) => {
      if (isInvalidated) {
        return;
      }

      /**
       * In an event where a Node gets deleted -
       * Before React is able to fully unmount all components/hooks within that deleted Node's context
       * There may be subscribers that is attempting to access properties of the deleted Node
       * In that case, these subscribers will be notified and thus an error will be thrown (attempting to access property of undefined)
       *
       * Although this can be avoided by using useNode over useEditor when accessing Node properties under the current NodeContext
       * Nevertheless, since there may be users who are still using the legacy useNode/useEditor (without NodeQuery/EditorQuery),
       * we'll wrap this within a try-catch block for the time being.
       */

      try {
        const newCollectedValues = collector(state);
        if (isEqual(newCollectedValues, current)) {
          return;
        }

        current = newCollectedValues;
        onChange(current);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    };

    if (init) {
      subscriber(this.getState());
    }

    this.subscribers.add(subscriber);

    return () => {
      isInvalidated = true;
      this.subscribers.delete(subscriber);
    };
  }

  getState() {
    return this.state;
  }

  setState(
    setter: (state: S) => void,
    opts: Partial<{
      onPatch: (patches: Patch[], inversePatches: Patch[]) => void;
    }> = {}
  ) {
    const { onPatch } = {
      onPatch: null,
      ...opts,
    };

    const draft = createDraft(this.state);
    setter(draft as S);

    this.state = finishDraft(draft, onPatch) as S;

    this.notify();
  }

  protected notify() {
    this.subscribers.forEach((subscriber) => subscriber(this.getState()));
  }
}

export type StateForStore<S extends Store> = S extends Store<infer I>
  ? I
  : never;
