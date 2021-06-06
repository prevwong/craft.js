import { useState, useEffect, useMemo } from 'react';

import { Store, StateForStore } from './Store';

export type useCollectorReturnType<C = null> = C extends null ? {} : C;

export function useCollector<S extends Store, C>(
  store: S,
  collector?: (state: StateForStore<S>) => C
): useCollectorReturnType<C> {
  const [collected, setCollected] = useState<any>(
    collector ? collector(store.getState()) : ({} as C)
  );

  const unsubscribe = useMemo(
    () =>
      collector
        ? store.subscribe(
            (state) => collector(state),
            (collected) => {
              setCollected(collected);
            }
          )
        : null,
    [collector, store]
  );

  // Collect state on state change
  useEffect(() => {
    return () => {
      if (!unsubscribe) {
        return;
      }

      unsubscribe();
    };
  }, [store, unsubscribe]);

  return collected;
}
