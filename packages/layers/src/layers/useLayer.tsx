import { useContext, useMemo } from "react";
import { LayerContext } from "./LayerContext";
import { useConnectorHooks, ConnectorElementWrapper } from "@craftjs/utils";
import { EventContext } from "../events";
import { useLayerManager } from "../manager";
import { useEditor } from "@craftjs/core";
import { Layer } from "../interfaces";



type internalActions = LayerContext & {
  children: string[],
  connectors: {
    drag: ConnectorElementWrapper;
    layer: ConnectorElementWrapper;
    layerHeader: ConnectorElementWrapper;
  },
  actions: {
    toggleLayer: () => void
  }
}

export type useLayer<S = null> = S extends null ? internalActions : S & internalActions;
export function useLayer(): useLayer
export function useLayer<S = null>(collect?: (node: Layer) => S): useLayer<S>
export function useLayer<S = null>(collect?: (layer: Layer) => S): useLayer <S> {
  
  const {id, depth } = useContext(LayerContext);
  const eventConnectors = useContext(EventContext);

  const { actions: managerActions, ...collected } = collect ? useLayerManager((state) => {
    return id && state.layers[id] && collect(state.layers[id]) 
  }) : useLayerManager();

  const { enabled, children } = useEditor((state, query) => ({
    children: state.nodes[id] && query.node(id).decendants(),
    enabled: state.options.enabled
  }));


  const connectors = useConnectorHooks({
    layer: (node) => eventConnectors.layer(node, id), 
    layerHeader: (node) => eventConnectors.layerHeader(node, id),
    drag: (node) => eventConnectors.drag(node, id), 
  }, enabled) as any;

  const actions = useMemo(() => {
    return {
      toggleLayer: () => managerActions.toggleLayer(id)
    }
  }, []);

  return {
    id,
    depth,
    children,
    actions,
    connectors,
    ...collected as any
  }
}