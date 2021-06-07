import { useState, useEffect, useMemo, useRef } from 'react';

import { Store, StateForStore } from './Store';

export type useCollectorReturnType<C = null> = C extends null ? {} : C;

export function useCollector<S extends Store, C>(
  store: S,
  collector?: (state: StateForStore<S>) => C
): useCollectorReturnType<C> {
  const [collected, setCollected] = useState<any>(
    collector ? collector(store.getState()) : ({} as C)
  );

  const collectorRef = useRef(collector);
  collectorRef.current = collector;

  const unsubscribe = useMemo(() => {
    const { current: collector } = collectorRef;

    if (!collector) {
      return;
    }

    return store.subscribe(collectorRef.current, (collected) =>
      setCollected(collected)
    );
  }, [store]);

  // Collect state on state change
  useEffect(() => {
    return () => {
      if (!unsubscribe) {
        return;
      }

      unsubscribe();
    };
  }, [unsubscribe]);

  return collected;
}
