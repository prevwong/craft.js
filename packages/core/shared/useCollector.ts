import React, { useContext, useMemo, useState, useEffect } from "react";
import { ManagerState } from "../interfaces";
import { RootContext } from "../RootContext";
import { Unsubscribe } from "redux";
import { ManagerMethods } from "../manager/methods";
import { MonitorReducers } from "../monitor/MonitorReducers";
import { Methods, QueryCallback, QueryMethods, CallbacksFor } from "./redux-methods";

type Store<T extends MonitorReducers | ManagerMethods, Q extends QueryMethods> = T & {
  query: QueryCallback<Q>
}

export type CollectedStore<T extends MonitorReducers | ManagerMethods, Q extends QueryMethods, S = null> = S extends null ? Store<T, Q> : Store<T, Q> & S;
export function useCollector<T extends keyof RootContext, S>(store: T, collect: (state: ManagerState) => S): CollectedStore<RootContext[T][3], RootContext[T][2], S>
export function useCollector<T extends keyof RootContext>(store: T): CollectedStore<RootContext[T][3], RootContext[T][2]>;
export function useCollector(store: keyof RootContext, collect?: Function) {
  const rootContext = useContext(RootContext);
  const {manager, monitor} = rootContext;
  const getManagerState = manager[1];
  const getMonitorState = monitor[1];

  const [subscribe, _, query, actions] = rootContext[store];
  const [collected, setCollected] = useState(collect ? collect(getManagerState().current) : null);

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (collect) {
      unsubscribe = subscribe(() => {
        const { current } = getManagerState();
        const recollect = collect(current);
        if (recollect !== collected) {
          setCollected(recollect);
        }
      });
    }
    return (() => {
      if (unsubscribe) unsubscribe();
    })
  }, [collect]);


  const queries = Object.keys(query()).reduce((accum: QueryCallback<typeof query>, key: keyof QueryCallback<typeof query>) => {
    accum[key] = query(getManagerState().current, getMonitorState().current)[key];
    return accum;
  }, {});

  return useMemo(() => {
    return { ...collected, ...actions, query: queries }
  }, [collected]);
}