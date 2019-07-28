import React, { useContext, useState, useCallback, useLayoutEffect, useRef } from "react";
import { Unsubscribe } from "redux";
import { CallbacksFor, Methods, StateFor, QueryCallbacksFor, QueryMethods } from "./createReduxMethods";
import { SubscriberAndCallbacksFor } from "~packages/shared/createReduxMethods";
const shallowequal = require('shallowequal');


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
  collect: (state: StateFor<M>) => C, 
  onChange: (collected: useCollector<M, Q, C>, finalize: React.Dispatch<React.SetStateAction<useCollector<M,Q,C>>>) => void): 
  useCollector<M, Q, C>;

export function useCollector<M extends Methods, Q extends QueryMethods, C>
  (
    store: SubscriberAndCallbacksFor<M, Q>,
    collect?: any, 
    onChange?: any
  ) {
  const {subscribe, getState, actions, query } = store;
  const collected = useRef<C>(collect ? collect(getState().current) : {});

  const onCollect = useCallback((collected): useCollector<M, Q, C> => {
    return { ...collected, actions, query }
  }, [collected.current]);

  const [renderCollected, setRenderCollected] = useState(onCollect(collected.current));

  useLayoutEffect(() => {
    let unsubscribe: Unsubscribe;
    if (collect && typeof onChange === 'function') {
      unsubscribe = subscribe(() => {

        const { current } = getState();
        // window.nodes = current;
        const recollect = collect(current);
        (window as any).nodes = current
        if (shallowequal(recollect, collected.current) == false) {
          collected.current = recollect;
          
          onChange(onCollect(collected.current), setRenderCollected);
        }
      });
    }
    return (() => {
      if (unsubscribe) unsubscribe();

    })
  }, [collected.current]);

  return renderCollected;
}
