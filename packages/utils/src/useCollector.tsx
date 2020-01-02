import { useState, useCallback, useRef, useEffect } from "react";
import { Unsubscribe } from "redux";
import {
  CallbacksFor,
  Methods,
  StateFor,
  QueryCallbacksFor,
  QueryMethods,
  SubscriberAndCallbacksFor
} from "./useReduxMethods";
import isEqualWith from "lodash.isequalwith";

type Actions<M extends Methods, Q extends QueryMethods> = {
  actions: CallbacksFor<M>;
  query: QueryCallbacksFor<Q>;
};

export type useCollector<
  M extends Methods,
  Q extends QueryMethods | null,
  C = null
> = C extends null ? Actions<M, Q> : C & Actions<M, Q>;

export function useCollector<M extends Methods, Q extends QueryMethods | null>(
  store: SubscriberAndCallbacksFor<M, Q>
): useCollector<M, Q>;

export function useCollector<
  M extends Methods,
  Q extends QueryMethods | null,
  C
>(
  store: SubscriberAndCallbacksFor<M, Q>,
  collector: (state: StateFor<M>, query: Q) => C
): useCollector<M, Q, C>;

export function useCollector<
  M extends Methods,
  Q extends QueryMethods | null,
  C
>(store: SubscriberAndCallbacksFor<M, Q>, collector?: any) {
  const { subscribe, getState, actions, query } = store;
  const collectorFn = useRef(collector);
  collectorFn.current = collector;

  const initial = useRef(true);
  const collected = useRef<C | null>(null);

  if (initial.current && collectorFn.current) {
    collected.current = collectorFn.current(getState().current, query);
    initial.current = false;
  }

  const onCollect = useCallback(
    (collected): useCollector<M, Q, C> => {
      return { ...collected, actions, query };
    },
    [actions, query]
  );

  const [renderCollected, setRenderCollected] = useState(
    onCollect(collected.current)
  );

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: Unsubscribe;
    if (collectorFn.current) {
      unsubscribe = subscribe(() => {
        try {
          if (cancelled) return;
          const { current } = getState();
          const recollect = collectorFn.current(current, query);
          if (!isEqualWith(recollect, collected.current)) {
            collected.current = recollect;
            (window as any).state = current;
            setRenderCollected(onCollect(collected.current));
          }
        } catch (err) {
          console.warn(err);
        }
      });
    }
    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [getState, onCollect, query, subscribe]);

  return renderCollected;
}
