import React, { useContext} from "react";
import { ManagerState, Options } from "../interfaces";
import { QueryMethods } from "./query";
import { useCollector } from "@shared/useCollector";
import { MethodRecordBase, ActionByType, ActionUnion } from "@shared/createReduxMethods";
import { RootContext } from "../root/RootContext";
import Actions from "./actions";

export type useInternalManager<C = null> = (C extends null ? useCollector<typeof Actions, typeof QueryMethods> : useCollector<typeof Actions, typeof QueryMethods, C>) & {_inContext: boolean};
export function useInternalManager(): useInternalManager
export function useInternalManager<C>(collector: (state: ManagerState) => C): useInternalManager<C>
export function useInternalManager<C>(collector?: any): useInternalManager<C> {
  const manager = useContext(RootContext);
  const collected = manager ? useCollector(manager, collector, (collected, finalize) => finalize(collected)) : {actions: {}};

  // const queryFactory: QueryMethods = QueryMethods;
  // const query = (Object.keys(queryFactory()) as Array<keyof QueryCallbacksFor<typeof queryFactory>>).reduce((accum: Partial<QueryCallbacksFor<typeof queryFactory>>, key) => {
  //   return {
  //     ...accum,
  //     [key]: (...args: any) => queryFactory(manager.getState().current, options)[key](...args)
  //   };
  // }, {});


  return {
    ...collected as any,
    _inContext: !!manager
  }
}
