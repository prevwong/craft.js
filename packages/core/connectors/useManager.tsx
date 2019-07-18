import { useCollector } from "../shared/useCollector";
import { ManagerState } from "../interfaces";

export function useManager<S>(collect?: (state: ManagerState) => S) {
  const collected = collect ? useCollector((state) => collect(state), (collected, finalize) => {
    finalize(collected);
  }) : useCollector();

  return collected;
}