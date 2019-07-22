import React, { useContext, useState, useCallback, useLayoutEffect, useRef } from "react";
import { Unsubscribe } from "redux";
import { CallbacksFor, Methods, StateFor } from "./createReduxMethods";
import { SubscriberAndCallbacksFor } from "~packages/shared/createReduxMethods";
const shallowequal = require('shallowequal');


type Actions<M extends Methods> = {
  actions: CallbacksFor<M>
};

export type useCollector<M extends Methods, C = null> = C extends null ? Actions<M> : C & Actions<M>;

export function useCollector<M extends Methods>(
  store: SubscriberAndCallbacksFor<M>
): useCollector<M>;

export function useCollector<M extends Methods, C>(
  store: SubscriberAndCallbacksFor<M>,
  collect: (state: StateFor<M>) => C, 
  onChange: (collected: useCollector<M, C>, finalize: React.Dispatch<React.SetStateAction<useCollector<M,C>>>) => void): 
  useCollector<M,C>;

export function useCollector<M extends Methods, C>
  (
    store: SubscriberAndCallbacksFor<M>,
    collect?: any, 
    onChange?: any
  ) {
  const {subscribe, getState, actions} = store;
  const collected = useRef<C>(collect ? collect(getState().current) : {});

  const onCollect = useCallback((collected): useCollector<M, C> => {
    return { ...collected, actions }
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
