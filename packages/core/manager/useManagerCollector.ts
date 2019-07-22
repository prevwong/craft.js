import React, { useContext} from "react";
import { RootContext } from "../RootContext";
import { ManagerState, Options } from "../interfaces";
import { QueryMethods } from "./query";
import ManagerMethods from "./methods";
import { useCollector } from "~packages/shared/useCollector";
import { MethodRecordBase, ActionByType, ActionUnion } from "~packages/shared/createReduxMethods";


export type QueryMethods<S = any, O=any, R extends MethodRecordBase<S> = any> = (state?: S, options?: O) => R;
export type QueryCallbacksFor<M extends QueryMethods> = M extends QueryMethods<any, any, infer R>
  ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => ReturnType<R[T]>
  }
  : never;


type query = { query: QueryCallbacksFor<typeof QueryMethods>, options: Options }
export type useManagerCollector<C = null> = C extends null ? query & useCollector<typeof ManagerMethods> : query & useCollector<typeof ManagerMethods, C>;
export function useManagerCollector(): useManagerCollector
export function useManagerCollector<C>(collector: (state: ManagerState) => C): useManagerCollector<C>
export function useManagerCollector<C>(collector?: any): useManagerCollector<C> {
  const { manager, options } = useContext(RootContext);

  const collected = useCollector(manager, collector, (collected, finalize) => finalize(collected));
  
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
    options
  }
}
