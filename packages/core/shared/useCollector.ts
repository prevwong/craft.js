import React, { useContext, useState, useCallback, useLayoutEffect, useRef } from "react";
import { RootContext } from "../RootContext";
import { Unsubscribe } from "redux";
import { ManagerState } from "../interfaces";
import { ManagerMethods } from "../manager/methods";
import { QueryMethods } from "../manager/query";
import { QueryCallbacksFor, CallbacksFor } from "./createReduxMethods";
const shallowequal = require('shallowequal');

type Methods = { actions: ManagerMethods, query: QueryCallbacksFor<typeof QueryMethods>};

type Collected<S = null> =  S extends null | void ? Methods : Methods & S

export type useCollector<S = null> = Collected<S>;

export function useCollector(): useCollector
export function useCollector<S>(collect: (state: ManagerState) => S, onChange: (collected: Collected<S>, finalize: React.Dispatch<React.SetStateAction<Collected<S>>>) => void): useCollector<S>;
export function useCollector<S>
  (collect?: any, onChange?: (collected: any, finalize: React.Dispatch<React.SetStateAction<Collected<S>>>) => void): useCollector<S> {
  const { manager: [subscribe, getManagerState, queryFactory, actions], options } = useContext(RootContext);
  const collected = useRef<S>(collect ? collect(getManagerState().current) : null);
  const query = (Object.keys(queryFactory()) as Array<keyof CallbacksFor<typeof queryFactory>>).reduce((accum: Partial<CallbacksFor<typeof queryFactory>>, key) => {
    return {
      ...accum,
      [key]: (...args: any) => queryFactory(getManagerState().current, options)[key](...args)
    };
  }, {});

  const onCollect = useCallback((collected): Collected<S> => {
    return { ...collected, actions, query }
  }, [collected.current]);

  const [renderCollected, setRenderCollected] = useState(onCollect(collected.current));

  useLayoutEffect(() => {
    let unsubscribe: Unsubscribe;
    if (collect && typeof onChange === 'function') {
      unsubscribe = subscribe(() => {

        const { current } = getManagerState();
        // window.nodes = current;
        const recollect = collect(current);
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
