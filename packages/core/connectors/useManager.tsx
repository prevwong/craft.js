import { useManagerCollector } from "../shared/useCollector";
import { ManagerState } from "../interfaces";

export function useManager(): useManagerCollector;
export function useManager<S>(collect: (state: ManagerState) => S): useManagerCollector<S>;

export function useManager<S>(collect?: any): useManagerCollector<S> {
  let collected = collect ? useManagerCollector(collect) : useManagerCollector();
  return collected as any;
}
