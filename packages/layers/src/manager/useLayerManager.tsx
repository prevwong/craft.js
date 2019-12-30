import { useCollector } from "@craftjs/utils";
import { useContext } from "react";
import { LayerManagerContext } from "./context";
import { LayerState } from "../interfaces";
import { LayerMethods } from "./actions";

export function useLayerManager(): useCollector<typeof LayerMethods, null>;
export function useLayerManager<C>(collector?: (state: LayerState) => C): useCollector<typeof LayerMethods, null, C>;
export function useLayerManager<C>(collector?: (state: LayerState) => C): useCollector<typeof LayerMethods, null> {
  const { store } = useContext(LayerManagerContext);
  return collector ? useCollector(store, collector) : useCollector(store);
}

