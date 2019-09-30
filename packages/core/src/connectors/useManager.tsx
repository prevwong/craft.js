import { useInternalManager } from "../manager/useInternalManager";
import { ManagerState } from "../interfaces";

export function useManager(): useInternalManager;
export function useManager<S>(collect: (state: ManagerState) => S): useInternalManager<S>;

export function useManager<S>(collect?: any): useInternalManager<S> {
  let collected = collect ? useInternalManager(collect) : useInternalManager();
  return collected as any;
}
