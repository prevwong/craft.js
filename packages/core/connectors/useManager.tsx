import { useCollector } from "../shared/useCollector";
import { ManagerState } from "../interfaces";

export function useManager(): useCollector;
export function useManager<S>(collect: (state: ManagerState) => S): useCollector<S>;

export function useManager<S>(collect?: any): useCollector<S> {
  let collected = collect ? useCollector((state) => collect(state), (collected, finalize) => {
    finalize(collected);
  }) : useCollector();
  return collected
}