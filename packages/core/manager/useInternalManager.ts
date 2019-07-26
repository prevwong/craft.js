import React, { useContext} from "react";
import { ManagerState, Options } from "../interfaces";
import { QueryMethods } from "./query";
import { useCollector } from "~packages/shared/useCollector";
import { MethodRecordBase, ActionByType, ActionUnion } from "~packages/shared/createReduxMethods";
import { RootContext } from "../root/RootContext";
import Actions from "./actions";


export type QueryMethods<S = any, O=any, R extends MethodRecordBase<S> = any> = (state?: S, options?: O) => R;
export type QueryCallbacksFor<M extends QueryMethods> = M extends QueryMethods<any, any, infer R>
  ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => ReturnType<R[T]>
  }
  : never;


type query = { query: QueryCallbacksFor<typeof QueryMethods>, options: Options, _inContext: boolean }
export type useInternalManager<C = null> = C extends null ? query & useCollector<typeof Actions> : query & useCollector<typeof Actions, C>;
export function useInternalManager(): useInternalManager
export function useInternalManager<C>(collector: (state: ManagerState) => C): useInternalManager<C>
export function useInternalManager<C>(collector?: any): useInternalManager<C> {
  const { manager, options } = useContext(RootContext);
  const collected = manager ? useCollector(manager, collector, (collected, finalize) => finalize(collected)) : {actions: {}};

  const queryFactory: QueryMethods = QueryMethods;
  const query = (Object.keys(queryFactory()) as Array<keyof QueryCallbacksFor<typeof queryFactory>>).reduce((accum: Partial<QueryCallbacksFor<typeof queryFactory>>, key) => {
    return {
      ...accum,
      [key]: (...args: any) => queryFactory(manager.getState().current, options)[key](...args)
    };
  }, {});


  return {
    ...collected as any,
    query,
    options,
    _inContext: !!manager
  }
}
