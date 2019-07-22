import React, { useContext, useState, useCallback, useLayoutEffect, useRef } from "react";
import { RootContext } from "../RootContext";
import { Unsubscribe } from "redux";
import { ManagerState, Options } from "../interfaces";
import { QueryMethods as QueryFactory } from "../manager/query";
import { QueryCallbacksFor, QueryMethods } from "./createReduxMethods";
import ManagerMethods from "../manager/methods";
import { any } from "prop-types";
import { useCollector } from "~packages/shared/useCollector";
const shallowequal = require('shallowequal');

// export type Methods = { options: Options, actions: CallbacksFor<typeof ManagerMethods>, query: QueryCallbacksFor<typeof QueryMethods>};

// type Collected<S = null> = S extends null ? Methods : Methods & S
// export type useCollector<S = null> = Collected<S>;

// export function useCollector(): useCollector
// export function useCollector<S>(collect: (state: ManagerState) => S, onChange: (collected: Collected<S>, finalize: React.Dispatch<React.SetStateAction<Collected<S>>>) => void): useCollector<S>;
// export function useCollector<S>
//   (collect?: any, onChange?: (collected: any, finalize: React.Dispatch<React.SetStateAction<Collected<S>>>) => void): useCollector<S> {
//   const { manager: [subscribe, getManagerState, queryFactory, actions], options } = useContext(RootContext);
//   const collected = useRef<S>(collect ? collect(getManagerState().current) : null);

//   const query = (Object.keys(queryFactory()) as Array<keyof CallbacksFor<typeof queryFactory>>).reduce((accum: Partial<CallbacksFor<typeof queryFactory>>, key) => {
//     return {
//       ...accum,
//       [key]: (...args: any) => queryFactory(getManagerState().current, options)[key](...args)
//     };
//   }, {});



//   const onCollect = useCallback((collected): Collected<S> => {
//     return { ...collected, actions, query, options }
//   }, [collected.current]);

//   const [renderCollected, setRenderCollected] = useState(onCollect(collected.current));

//   useLayoutEffect(() => {
//     let unsubscribe: Unsubscribe;
//     if (collect && typeof onChange === 'function') {
//       unsubscribe = subscribe(() => {

//         const { current } = getManagerState();
//         // window.nodes = current;
//         const recollect = collect(current);
//         (window as any).nodes = current
//         if (shallowequal(recollect, collected.current) == false) {
//           collected.current = recollect;
          
//           onChange(onCollect(collected.current), setRenderCollected);
//         }
//       });
//     }
//     return (() => {
//       if (unsubscribe) unsubscribe();

//     })
//   }, [collected.current]);

//   return renderCollected;
// }

type query = { query: QueryCallbacksFor<typeof QueryFactory>, options: Options }
export type useManagerCollector<C = null> = C extends null ? query & useCollector<typeof ManagerMethods> : query & useCollector<typeof ManagerMethods, C>;
export function useManagerCollector(): useManagerCollector
export function useManagerCollector<C>(collector: (state: ManagerState) => C): useManagerCollector<C>
export function useManagerCollector<C>(collector?: any): useManagerCollector<C> {
  const { manager, options } = useContext(RootContext);

  const collected = useCollector(manager, collector, (collected, finalize) => finalize(collected));
  
  const queryFactory: QueryMethods = QueryFactory;
  const query = (Object.keys(queryFactory()) as Array<keyof QueryCallbacksFor<typeof queryFactory>>).reduce((accum: Partial<QueryCallbacksFor<typeof queryFactory>>, key) => {
    return {
      ...accum,
      [key]: (...args: any) => queryFactory(manager.getState().current, options)[key](...args)
    };
  }, {});


  return {
    ...collected as any,
    query,
    options
  }
}
