import { useInternalManager } from "../manager/useInternalManager";
import { ManagerState } from "../interfaces";

export type useManager<S = null> = useInternalManager<S> & {
  handlers: useInternalManager['handlers']['dnd'] // only expose the dnd handlers to useManager
}

export function useManager(): useManager;
export function useManager<S>(collect: (state: ManagerState) => S): useManager<S>;

export function useManager<S>(collect?: any): useManager<S> {
  const {handlers: {dnd}, ...collected} = collect ? useInternalManager(collect) : useInternalManager();
  return {
    handlers: dnd,
    ...collected as any
  }
}
