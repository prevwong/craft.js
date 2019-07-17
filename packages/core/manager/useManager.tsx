import { useCollector } from "../shared/useCollector";
import { ManagerState } from "../interfaces";

export function useManager<S>(collect?: (state: ManagerState) => S) {
  const collected = useCollector((state) => collect && collect(state), (collected, finalize) => {
    finalize(collected);
  });


  return collected;
}