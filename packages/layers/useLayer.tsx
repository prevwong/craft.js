import { useCollector } from "~packages/shared/useCollector";
import { useContext } from "react";
import { LayerContext } from "./LayerContext";
import { LayerState } from "./interfaces";
import { LayerMethods } from "./LayerMethods";

export function useLayer(): useCollector<typeof LayerMethods>;
export function useLayer<C>(collector?: (state: LayerState) => C): useCollector<typeof LayerMethods, C>;
export function useLayer<C>(collector?: (state: LayerState) => C): useCollector<typeof LayerMethods> {
  const {store} = useContext(LayerContext);
  return collector ? useCollector(store, collector, (collected, finalize) => finalize(collected)) : useCollector(store);
}

