import React, { useState, useCallback, useRef, useEffect } from "react";
import { Unsubscribe } from "redux";
import { CallbacksFor, Methods, StateFor, QueryCallbacksFor, QueryMethods } from "./createReduxMethods";
import { SubscriberAndCallbacksFor } from "./createReduxMethods";
import {isEqualWith} from "lodash";

// console.log(1001, shallowequal({}, {}));
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
  collect: (state: StateFor<M>, query: Q) => C, 
  onChange: (collected: useCollector<M, Q, C>, finalize: React.Dispatch<React.SetStateAction<useCollector<M,Q,C>>>) => void): 
  useCollector<M, Q, C>;

export function useCollector<M extends Methods, Q extends QueryMethods, C>
  (
    store: SubscriberAndCallbacksFor<M, Q>,
    collect?: any, 
    onChange?: any
  ) {
  const {subscribe, getState, actions, query } = store;
  const collected = useRef<C>(collect ? collect(getState().current, query) : {});

  const onCollect = useCallback((collected): useCollector<M, Q, C> => {
    return { ...collected, actions, query }
  }, [collected.current]);

  const [renderCollected, setRenderCollected] = useState(onCollect(collected.current));

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: Unsubscribe;
    if (collect && typeof onChange === 'function') {
      unsubscribe = subscribe(() => {
        const { current } = getState();
        const recollect = collect(current, query);
        
        if (!isEqualWith(recollect, collected.current) && !cancelled) {
          collected.current = recollect;
          (window as any).state = current;
          onChange(onCollect(collected.current), setRenderCollected);
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
