import React, { useState, useCallback, useRef, useEffect } from "react";
import { Unsubscribe } from "redux";
import { CallbacksFor, Methods, StateFor, QueryCallbacksFor, QueryMethods, SubscriberAndCallbacksFor } from "./useReduxMethods";
import {isEqualWith} from "lodash-es";

type Actions<M extends Methods, Q extends QueryMethods> = {
  actions: CallbacksFor<M>,
  query: QueryCallbacksFor<Q>
};

export type useCollector<M extends Methods, Q extends QueryMethods, C = null> = C extends null ? Actions<M, Q> : C & Actions<M, Q>;

export function useCollector<M extends Methods, Q extends QueryMethods>(
  store: SubscriberAndCallbacksFor<M, Q>
): useCollector<M, Q>;

export function useCollector<M extends Methods, Q extends QueryMethods, C>(
  store: SubscriberAndCallbacksFor<M, Q>,
  collector: (state: StateFor<M>, query: Q) => C, 
  onChange: (collected: useCollector<M, Q, C>, finalize: React.Dispatch<React.SetStateAction<useCollector<M,Q,C>>>) => void): 
  useCollector<M, Q, C>;

export function useCollector<M extends Methods, Q extends QueryMethods, C>
  (
    store: SubscriberAndCallbacksFor<M, Q>,
    collector?: any, 
    onChange?: any
  ) {
  const {subscribe, getState, actions, query } = store;
  const collectorFn = useRef(collector);
  collectorFn.current = collector;

  const initial = useRef(true);
  const collected = useRef<C>(null);

  if (initial.current && collectorFn.current) {
    collected.current = collectorFn.current(getState().current, query);
    initial.current = false;
  }

  const onCollect = useCallback((collected): useCollector<M, Q, C> => {
    return { ...collected, actions, query }
  }, [collected.current]);

  const [renderCollected, setRenderCollected] = useState(onCollect(collected.current));

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: Unsubscribe;
    if (collectorFn.current && typeof onChange === 'function') {
      unsubscribe = subscribe(() => {
        try {
          if (cancelled) return;
          const { current } = getState();
          const recollect = collectorFn.current(current, query);
          if (!isEqualWith(recollect, collected.current)) {
            collected.current = recollect;
            (window as any).state = current;
            onChange(onCollect(collected.current), setRenderCollected);
          }
        } catch (err){
          console.warn(err);
        }
      });
    }
    return (() => {
      cancelled = true;
      if (unsubscribe) unsubscribe();

    })
  }, []);

  return renderCollected;
}
