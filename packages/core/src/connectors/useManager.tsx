import { useInternalManager, ManagerCollector } from "../manager/useInternalManager";
import { ManagerState } from "../interfaces";
import { QueryMethods } from "../manager/query";
import { QueryCallbacksFor } from "craftjs-utils";

export type useManager<S = null> = useInternalManager<S> & {
  handlers: useInternalManager['handlers']['dnd'] // only expose the dnd handlers to useManager
}

export function useManager(): useManager;
export function useManager<S>(collect: ManagerCollector<S>): useManager<S>;

export function useManager<S>(collect?: any): useManager<S> {
  const {handlers, ...collected} = collect ? useInternalManager(collect) : useInternalManager();

  return {
    handlers: handlers && handlers.dnd,
    ...collected as any
  }
}
