import { useState, useCallback, useRef, useEffect } from 'react';

import { SubscriberAndCallbacksFor } from './useMethods';
import { ConditionallyMergeRecordTypes } from './utilityTypes';

type CollectorMethods<S extends SubscriberAndCallbacksFor<any, any>> = {
  actions: S['actions'];
  query: S['query'];
};

export type useCollectorReturnType<
  S extends SubscriberAndCallbacksFor<any, any>,
  C = null
> = ConditionallyMergeRecordTypes<C, CollectorMethods<S>>;
export function useCollector<S extends SubscriberAndCallbacksFor<any, any>, C>(
  store: S,
  collector?: (
    state: ReturnType<S['getState']>['current'],
    query: S['query']
  ) => C
): useCollectorReturnType<S, C> {
  const { subscribe, getState, actions, query } = store;

  const initial = useRef(true);
  const collected = useRef<any>(null);
  const collectorRef = useRef(collector);
  collectorRef.current = collector;

  const onCollect = useCallback(
    (collected) => {
      return { ...collected, actions, query };
    },
    [actions, query]
  );

  // Collect states for initial render
  if (initial.current && collector) {
    collected.current = collector(getState(), query);
    initial.current = false;
  }

  const [renderCollected, setRenderCollected] = useState(
    onCollect(collected.current)
  );

  // Collect states on state change
  useEffect(() => {
    let unsubscribe;
    if (collectorRef.current) {
      unsubscribe = subscribe(
        (current) => collectorRef.current(current, query),
        (collected) => {
          setRenderCollected(onCollect(collected));
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onCollect, query, subscribe]);

  return renderCollected;
}
